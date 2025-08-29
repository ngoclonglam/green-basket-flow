-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  unit TEXT NOT NULL DEFAULT 'per lb',
  category_id UUID REFERENCES public.categories(id),
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cart_items table for persistent cart
CREATE TABLE public.cart_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for categories (public read)
CREATE POLICY "Categories are viewable by everyone" 
ON public.categories 
FOR SELECT 
USING (true);

-- RLS Policies for products (public read)
CREATE POLICY "Products are viewable by everyone" 
ON public.products 
FOR SELECT 
USING (true);

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for cart_items
CREATE POLICY "Users can view their own cart items" 
ON public.cart_items 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cart items" 
ON public.cart_items 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart items" 
ON public.cart_items 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cart items" 
ON public.cart_items 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at
  BEFORE UPDATE ON public.cart_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, first_name, last_name)
  VALUES (
    NEW.id, 
    NEW.email,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Insert sample categories
INSERT INTO public.categories (name, description, image_url) VALUES
  ('Fresh Vegetables', 'Farm-fresh vegetables harvested daily', '/lovable-uploads/270911d7-04c6-4e1e-9e9c-7fb36985089f.png'),
  ('Fruits', 'Sweet and juicy seasonal fruits', '/lovable-uploads/270911d7-04c6-4e1e-9e9c-7fb36985089f.png'),
  ('Herbs & Spices', 'Aromatic herbs and premium spices', '/lovable-uploads/270911d7-04c6-4e1e-9e9c-7fb36985089f.png'),
  ('Root Vegetables', 'Nutritious underground vegetables', '/lovable-uploads/270911d7-04c6-4e1e-9e9c-7fb36985089f.png'),
  ('Leafy Greens', 'Fresh salad greens and cooking greens', '/lovable-uploads/270911d7-04c6-4e1e-9e9c-7fb36985089f.png');

-- Insert sample products (we'll get the category IDs first)
WITH category_ids AS (
  SELECT name, id FROM public.categories
)
INSERT INTO public.products (name, description, price, image_url, unit, category_id) VALUES
  -- Fresh Vegetables
  ('Organic Tomatoes', 'Fresh, juicy organic tomatoes perfect for salads and cooking', 4.99, '/src/assets/tomatoes.jpg', 'per lb', (SELECT id FROM category_ids WHERE name = 'Fresh Vegetables')),
  ('Bell Peppers', 'Colorful mix of red and yellow bell peppers', 5.99, '/src/assets/peppers.jpg', 'per lb', (SELECT id FROM category_ids WHERE name = 'Fresh Vegetables')),
  ('Fresh Broccoli', 'Nutritious fresh broccoli crowns, steam or stir-fry', 4.49, '/src/assets/broccoli.jpg', 'per head', (SELECT id FROM category_ids WHERE name = 'Fresh Vegetables')),
  ('Sweet Corn', 'Fresh sweet corn on the cob, perfect for grilling', 3.99, '/src/assets/hero-vegetables.jpg', 'per dozen', (SELECT id FROM category_ids WHERE name = 'Fresh Vegetables')),
  ('Zucchini', 'Tender organic zucchini, great for baking and grilling', 3.49, '/src/assets/hero-vegetables.jpg', 'per lb', (SELECT id FROM category_ids WHERE name = 'Fresh Vegetables')),
  
  -- Root Vegetables  
  ('Fresh Carrots', 'Sweet and crispy organic carrots, great for snacking', 3.49, '/src/assets/carrots.jpg', 'per lb', (SELECT id FROM category_ids WHERE name = 'Root Vegetables')),
  ('Organic Potatoes', 'Versatile russet potatoes perfect for any meal', 2.99, '/src/assets/hero-vegetables.jpg', 'per 5lb bag', (SELECT id FROM category_ids WHERE name = 'Root Vegetables')),
  ('Sweet Potatoes', 'Orange-fleshed sweet potatoes rich in vitamins', 4.29, '/src/assets/hero-vegetables.jpg', 'per lb', (SELECT id FROM category_ids WHERE name = 'Root Vegetables')),
  ('Red Onions', 'Sharp and flavorful red onions for cooking', 2.79, '/src/assets/hero-vegetables.jpg', 'per lb', (SELECT id FROM category_ids WHERE name = 'Root Vegetables')),
  
  -- Leafy Greens
  ('Green Lettuce', 'Crisp romaine lettuce, perfect for fresh salads', 2.99, '/src/assets/lettuce.jpg', 'per head', (SELECT id FROM category_ids WHERE name = 'Leafy Greens')),
  ('Fresh Spinach', 'Baby spinach leaves, perfect for salads and smoothies', 4.99, '/src/assets/hero-vegetables.jpg', 'per bag', (SELECT id FROM category_ids WHERE name = 'Leafy Greens')),
  ('Kale', 'Nutrient-dense curly kale, superfood green', 3.99, '/src/assets/hero-vegetables.jpg', 'per bunch', (SELECT id FROM category_ids WHERE name = 'Leafy Greens')),
  ('Arugula', 'Peppery arugula leaves for gourmet salads', 5.49, '/src/assets/hero-vegetables.jpg', 'per bag', (SELECT id FROM category_ids WHERE name = 'Leafy Greens')),
  
  -- Herbs & Spices
  ('Fresh Basil', 'Aromatic basil leaves for Italian cuisine', 2.49, '/src/assets/hero-vegetables.jpg', 'per bunch', (SELECT id FROM category_ids WHERE name = 'Herbs & Spices')),
  ('Organic Cilantro', 'Fresh cilantro for Mexican and Asian dishes', 1.99, '/src/assets/hero-vegetables.jpg', 'per bunch', (SELECT id FROM category_ids WHERE name = 'Herbs & Spices')),
  ('Rosemary', 'Fresh rosemary sprigs for roasting and grilling', 2.99, '/src/assets/hero-vegetables.jpg', 'per bunch', (SELECT id FROM category_ids WHERE name = 'Herbs & Spices')),
  
  -- Fruits  
  ('Organic Apples', 'Crisp Honeycrisp apples, sweet and juicy', 5.99, '/src/assets/hero-vegetables.jpg', 'per 3lb bag', (SELECT id FROM category_ids WHERE name = 'Fruits')),
  ('Fresh Strawberries', 'Sweet, ripe strawberries perfect for desserts', 6.99, '/src/assets/hero-vegetables.jpg', 'per pint', (SELECT id FROM category_ids WHERE name = 'Fruits')),
  ('Organic Bananas', 'Yellow bananas perfect for snacking', 2.99, '/src/assets/hero-vegetables.jpg', 'per lb', (SELECT id FROM category_ids WHERE name = 'Fruits')),
  ('Avocados', 'Creamy Hass avocados, perfect for toast and salads', 7.99, '/src/assets/hero-vegetables.jpg', 'per 4-pack', (SELECT id FROM category_ids WHERE name = 'Fruits'));