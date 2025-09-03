import { Product } from './product.types';
import React from 'react';

export interface CartItem extends Omit<Product, 'in_stock'> {
  quantity: number;
  in_stock?: boolean;
  original_price?: number; // Store original price for discount display
}

export interface CartState {
  items: CartItem[];
  total: number;
  loading: boolean;
}

export type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ITEMS'; payload: CartItem[] }
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'ADD_ITEM_GUEST'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' };
  
export interface CartContextType {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  syncCart: () => Promise<void>;
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const CartContext = React.createContext<CartContextType | null>(null);
