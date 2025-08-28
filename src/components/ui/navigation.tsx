import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Phone, Home, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";

export const Navigation = () => {
  const location = useLocation();
  const { state } = useCart();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-primary">
          <Leaf className="w-8 h-8" />
          <span>FreshMarket</span>
        </Link>
        
        <div className="flex items-center space-x-6">
          <Link to="/">
            <Button 
              variant={isActive('/') ? 'default' : 'ghost'} 
              size="sm"
              className="flex items-center space-x-2"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Button>
          </Link>
          
          <Link to="/contact">
            <Button 
              variant={isActive('/contact') ? 'default' : 'ghost'} 
              size="sm"
              className="flex items-center space-x-2"
            >
              <Phone className="w-4 h-4" />
              <span>Contact</span>
            </Button>
          </Link>
          
          <Link to="/cart">
            <Button 
              variant={isActive('/cart') ? 'default' : 'ghost'} 
              size="sm"
              className="relative flex items-center space-x-2"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Cart</span>
              {state.items.length > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-accent text-accent-foreground min-w-[20px] h-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {state.items.reduce((sum, item) => sum + item.quantity, 0)}
                </Badge>
              )}
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};