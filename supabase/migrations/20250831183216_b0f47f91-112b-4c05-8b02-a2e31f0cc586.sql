-- Add new columns to products table for stock quantity and product variants
ALTER TABLE public.products 
ADD COLUMN stock_quantity integer DEFAULT 50,
ADD COLUMN is_featured boolean DEFAULT false,
ADD COLUMN is_bestseller boolean DEFAULT false,
ADD COLUMN discount_percentage integer DEFAULT 0;