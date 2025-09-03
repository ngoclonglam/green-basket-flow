import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Phone, Home, Leaf, User, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useCart, useAuth } from "@/hooks";

export const Navigation = () => {
  const location = useLocation();
  const { state } = useCart();
  const { user, signOut } = useAuth();
  
  const isActive = (path: string) => location.pathname === path;
  
  const handleSignOut = async () => {
    await signOut();
  };
  
  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b sticky top-0 z-50">
      <div className="container mx-auto px-2 sm:px-4 h-14 sm:h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-1 sm:space-x-2 text-lg sm:text-xl font-bold text-primary">
          <Leaf className="w-6 h-6 sm:w-8 sm:h-8" />
          <span className="hidden xs:block">FreshMarket</span>
        </Link>
        
        <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6">
          <Link to="/" className="hidden sm:block">
            <Button 
              variant={isActive('/') ? 'default' : 'ghost'} 
              size="sm"
              className="flex items-center space-x-2"
            >
              <Home className="w-4 h-4" />
              <span className="hidden md:block">Home</span>
            </Button>
          </Link>
          
          <Link to="/contact" className="hidden sm:block">
            <Button 
              variant={isActive('/contact') ? 'default' : 'ghost'} 
              size="sm"
              className="flex items-center space-x-2"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden md:block">Contact</span>
            </Button>
          </Link>
          
          <Link to="/cart">
            <Button 
              variant={isActive('/cart') ? 'default' : 'ghost'} 
              size="sm"
              className="relative flex items-center space-x-1 sm:space-x-2"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:block">Cart</span>
              {state.items.length > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-accent text-accent-foreground min-w-[18px] h-4 sm:min-w-[20px] sm:h-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {state.items.reduce((sum, item) => sum + item.quantity, 0)}
                </Badge>
              )}
            </Button>
          </Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="flex items-center space-x-1 sm:space-x-2"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:block">Account</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium truncate">{user.email}</p>
                  <p className="text-xs text-muted-foreground">
                    Welcome back!
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth">
              <Button 
                variant="default" 
                size="sm"
                className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm px-2 sm:px-3"
              >
                <User className="w-4 h-4" />
                <span className="hidden xs:block">Sign In</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};