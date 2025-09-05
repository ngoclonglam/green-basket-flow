import { createContext, useContext } from 'react';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  unit: string;
  category_id: string;
  in_stock: boolean;
  stock_quantity?: number;
  is_featured?: boolean;
  is_bestseller?: boolean;
  discount_percentage?: number;
  category?: {
    name: string;
    description: string;
  };
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image_url: string;
}

export interface ProductsContextType {
  products: Product[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  getProductsByCategory: (categoryId: string) => Product[];
  refetch: () => Promise<void>;
}

export const ProductsContext = createContext<ProductsContextType | undefined>(undefined);