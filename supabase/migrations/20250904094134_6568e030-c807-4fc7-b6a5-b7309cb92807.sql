-- Create role enum
CREATE TYPE public.app_role AS ENUM ('owner', 'admin', 'staff', 'customer');

-- Add role column to profiles table
ALTER TABLE public.profiles ADD COLUMN role public.app_role DEFAULT 'customer';

-- Create security definer functions FIRST
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid uuid)
RETURNS public.app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE user_id = user_uuid;
$$;

CREATE OR REPLACE FUNCTION public.is_admin(user_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role IN ('owner', 'admin', 'staff') FROM public.profiles WHERE user_id = user_uuid;
$$;

-- Update products policies to use the functions
DROP POLICY IF EXISTS "Products are viewable by everyone" ON public.products;
CREATE POLICY "Products are viewable by everyone" 
ON public.products 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can insert products" 
ON public.products 
FOR INSERT 
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update products" 
ON public.products 
FOR UPDATE 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete products" 
ON public.products 
FOR DELETE 
USING (public.is_admin(auth.uid()));

-- Update categories policies to use the functions
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON public.categories;
CREATE POLICY "Categories are viewable by everyone" 
ON public.categories 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can insert categories" 
ON public.categories 
FOR INSERT 
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update categories" 
ON public.categories 
FOR UPDATE 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete categories" 
ON public.categories 
FOR DELETE 
USING (public.is_admin(auth.uid()));

-- Update profiles policies to use the functions
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

-- Keep existing insert/update policies for profiles
-- (Users should manage their own profiles, admins can view all)

-- Create orders table for admin analytics
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Orders policies using the functions
CREATE POLICY "Users can view their own orders" 
ON public.orders 
FOR SELECT 
USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE POLICY "Users can insert their own orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update orders" 
ON public.orders 
FOR UPDATE 
USING (public.is_admin(auth.uid()));

-- Create order_items table
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL,
  product_id UUID NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on order_items
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Order items policies using the functions
CREATE POLICY "Users can view order items for their orders" 
ON public.order_items 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND (orders.user_id = auth.uid() OR public.is_admin(auth.uid()))
  )
);

CREATE POLICY "Users can insert order items for their orders" 
ON public.order_items 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  )
);

-- Add trigger for orders updated_at
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();