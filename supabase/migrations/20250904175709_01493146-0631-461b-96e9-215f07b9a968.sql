-- Phase 1: Critical Role Security Fix
-- Update profiles RLS policy to prevent users from updating their own role
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create new policy that allows users to update profile fields except role
CREATE POLICY "Users can update their own profile (except role)" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id AND 
  -- Prevent role changes unless user is admin
  (
    role = (SELECT role FROM public.profiles WHERE user_id = auth.uid()) OR 
    is_admin(auth.uid())
  )
);

-- Create separate policy for admin role management
CREATE POLICY "Admins can update any profile" 
ON public.profiles 
FOR UPDATE 
USING (is_admin(auth.uid()));

-- Create audit table for role changes
CREATE TABLE public.role_audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  changed_user_id UUID NOT NULL,
  previous_role app_role,
  new_role app_role NOT NULL,
  changed_by UUID NOT NULL,
  changed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reason TEXT
);

-- Enable RLS on audit log
ALTER TABLE public.role_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view role audit logs" 
ON public.role_audit_log 
FOR SELECT 
USING (is_admin(auth.uid()));

-- Create function to log role changes
CREATE OR REPLACE FUNCTION public.log_role_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Only log if role actually changed
  IF OLD.role IS DISTINCT FROM NEW.role THEN
    INSERT INTO public.role_audit_log (
      changed_user_id, 
      previous_role, 
      new_role, 
      changed_by
    ) VALUES (
      NEW.user_id,
      OLD.role,
      NEW.role,
      auth.uid()
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for role change logging
CREATE TRIGGER role_change_audit_trigger
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.log_role_change();

-- Phase 2: Fix anonymous access policies
-- Update cart_items policies to require authentication
DROP POLICY IF EXISTS "Users can view their own cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Users can update their own cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Users can delete their own cart items" ON public.cart_items;

CREATE POLICY "Authenticated users can view their own cart items" 
ON public.cart_items 
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can update their own cart items" 
ON public.cart_items 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can delete their own cart items" 
ON public.cart_items 
FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);

-- Update order policies
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;

CREATE POLICY "Authenticated users can view their own orders" 
ON public.orders 
FOR SELECT 
TO authenticated 
USING ((auth.uid() = user_id) OR is_admin(auth.uid()));

-- Update order_items policies  
DROP POLICY IF EXISTS "Users can view order items for their orders" ON public.order_items;

CREATE POLICY "Authenticated users can view order items for their orders" 
ON public.order_items 
FOR SELECT 
TO authenticated 
USING (EXISTS ( 
  SELECT 1 FROM orders 
  WHERE orders.id = order_items.order_id 
  AND ((orders.user_id = auth.uid()) OR is_admin(auth.uid()))
));

-- Update profiles policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

CREATE POLICY "Authenticated users can view their own profile" 
ON public.profiles 
FOR SELECT 
TO authenticated 
USING ((auth.uid() = user_id) OR is_admin(auth.uid()));