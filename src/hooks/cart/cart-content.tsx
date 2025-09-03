import { useReducer, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth, useToast } from '@/hooks';
import { Product, CartContext, CartContextType, CartState, CartAction, CartItem } from '@/types';

// Session storage key for guest cart (will be cleared on page reload)
const GUEST_CART_KEY = 'guest_cart';

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
      
    case 'SET_ITEMS': {
      const total = action.payload.reduce((sum, item) => sum + item.price * item.quantity, 0);
      return { ...state, items: action.payload, total };
    }
    
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(item => item.id === action.payload.id);
      let newItems: CartItem[];
      
      if (existingItemIndex !== -1) {
        // Item exists, increment quantity
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // New item, add to cart
        newItems = [...state.items, { ...action.payload, quantity: 1 }];
      }
      
      return {
        ...state,
        items: newItems,
        total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      };
    }
    
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload);
      return {
        ...state,
        items: newItems,
        total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      };
    }
    
    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        const newItems = state.items.filter(item => item.id !== action.payload.id);
        return {
          ...state,
          items: newItems,
          total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
        };
      }
      
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      return {
        ...state,
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      };
    }
    
    case 'CLEAR_CART':
      return { ...state, items: [], total: 0 };
    
    default:
      return state;
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, { 
    items: [], 
    total: 0, 
    loading: false 
  });
  const { user } = useAuth();
  const { toast } = useToast();

  // Handle user state changes (login/logout)
  useEffect(() => {
    if (user) {
      // User logged in - sync with database and clear any session storage
      syncCart();
    } else {
      // No user - load guest cart from session storage
      loadGuestCart();
    }
  }, [user]);

  // Auto-save guest cart to sessionStorage
  useEffect(() => {
    const navEntries = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];

    if (navEntries.length > 0 && navEntries[0].type === "reload") {
      // Don't need dispatch CLEAR_CART here because already init state return to origin when render this file
      sessionStorage.removeItem(GUEST_CART_KEY);
      return;
    }

    if (!user && state.items.length > 0) {
      sessionStorage.setItem(GUEST_CART_KEY, JSON.stringify(state.items));
    }
  }, [state.items, user, dispatch]);

  const clearGuestCartStorage = () => {
    try {
      sessionStorage.removeItem(GUEST_CART_KEY);
    } catch (error) {
      console.error('Error clearing guest cart storage:', error);
    }
  };

  const loadGuestCart = () => {
    if (user) return; // Don't load guest cart if user is logged in
    
    try {
      const savedCart = sessionStorage.getItem(GUEST_CART_KEY);
      if (savedCart) {
        const items: CartItem[] = JSON.parse(savedCart);
        dispatch({ type: 'SET_ITEMS', payload: items });
      }
    } catch (error) {
      console.error('Error loading guest cart:', error);
      clearGuestCartStorage();
    }
  };

  const syncCart = async () => {
    if (!user) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      // Clear any existing guest cart data when syncing with database
      clearGuestCartStorage();

      // Fetch cart items from database
      const { data: cartItems, error } = await supabase
        .from('cart_items')
        .select(`
          quantity,
          product:products(
            id,
            name,
            description,
            price,
            image_url,
            unit,
            category_id,
            in_stock
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      // Transform data to match our CartItem interface
      const items: CartItem[] = cartItems
        ?.filter(item => item.product && item.product.in_stock)
        .map(item => ({
          ...item.product,
          quantity: item.quantity
        })) || [];

      dispatch({ type: 'SET_ITEMS', payload: items });
    } catch (error: unknown) {
      console.error('Error syncing cart:', error);
      toast({
        title: "Error",
        description: "Failed to sync cart data",
        variant: "destructive"
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const addToCart = async (product: Product) => {
    dispatch({ type: 'ADD_ITEM', payload: product });  
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
      variant: "success"
    });
    
    if (!user) return;

    // Sync with database
    try {
      const { error } = await supabase
        .from('cart_items')
        .upsert({
          user_id: user.id,
          product_id: product.id,
          quantity: (state.items.find(item => item.id === product.id)?.quantity || 0) + 1
        }, {
          onConflict: 'user_id,product_id'
        });

      if (error) throw error;
    } catch (error: unknown) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive"
      });
      // Revert local state on error
      syncCart();
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!user) {
      // Guest user - remove from local cart
      dispatch({ type: 'REMOVE_ITEM', payload: productId });
      return;
    }

    try {
      dispatch({ type: 'REMOVE_ITEM', payload: productId });

      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) throw error;
    } catch (error: unknown) {
      console.error('Error removing from cart:', error);
      toast({
        title: "Error", 
        description: "Failed to remove item from cart",
        variant: "destructive"
      });
      syncCart();
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    dispatch ({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });

    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) throw error;
    } catch (error: unknown) {
      console.error('Error updating quantity:', error);
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive"
      });
      syncCart();
    }
  };

  const clearCart = async () => {
    dispatch({ type: 'CLEAR_CART' });

    if (!user) {
      // Guest user - clear local cart
      clearGuestCartStorage();
      return;
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
    } catch (error: unknown) {
      console.error('Error clearing cart:', error);
      toast({
        title: "Error",
        description: "Failed to clear cart",
        variant: "destructive"
      });
      syncCart();
    }
  };

  const value: CartContextType = {
    state,
    dispatch,
    syncCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};