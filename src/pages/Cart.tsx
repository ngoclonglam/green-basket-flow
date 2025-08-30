import { Navigation } from "@/components/ui/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import heroImg from "@/assets/hero-vegetables.jpg";

const Cart = () => {
  const { state, updateQuantity, removeFromCart } = useCart();
  const { user } = useAuth();
  
  // Remove the redirect for non-logged-in users - they can now use cart as guests

  if (state.loading) {
    return (
      <>
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-6"></div>
            <h1 className="text-3xl font-bold mb-4">Loading your cart...</h1>
          </div>
        </div>
      </>
    );
  }

  if (state.items.length === 0) {
    return (
      <>
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <ShoppingBag className="w-24 h-24 mx-auto text-muted-foreground mb-6" />
            <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">Add some fresh vegetables to get started!</p>
            <Link to="/">
              <Button size="lg" className="bg-gradient-to-r from-primary to-primary-glow">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </>
    );
  }
  
  return (
    <>
      <Navigation />
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Shopping Cart</h1>
        
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            {state.items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <img 
                      src={item.image_url} 
                      alt={item.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg mx-auto sm:mx-0"
                      onError={(e) => {
                        e.currentTarget.src = heroImg;
                      }}
                    />
                    
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="font-semibold text-base sm:text-lg">{item.name}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                      <Badge variant="secondary" className="mt-1 text-xs">{item.unit}</Badge>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        
                        <span className="font-semibold w-8 text-center text-sm">{item.quantity}</span>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={!user} // Disable quantity increase for guest users
                          title={!user ? "Sign in to change quantities" : ""}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      
                      <div className="text-center sm:text-right">
                        <div className="font-bold text-base sm:text-lg">${(item.price * item.quantity).toFixed(2)}</div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="text-destructive hover:text-destructive mt-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!user && (
                  <div className="bg-muted p-3 rounded-lg text-sm text-muted-foreground">
                    Shopping as guest - Sign in to save your cart and access quantity controls
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${state.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>$5.99</span>
                </div>
                <hr />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${(state.total + 5.99).toFixed(2)}</span>
                </div>
                
                <Link to="/checkout">
                  <Button className="w-full bg-gradient-to-r from-accent to-accent-glow hover:from-accent-glow hover:to-accent" size="lg">
                    Proceed to Checkout
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;