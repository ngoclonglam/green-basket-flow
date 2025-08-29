import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { Product } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/useToast";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [isAnimating, setIsAnimating] = useState(false);
  
  const handleAddToCart = async () => {
    // Trigger animation
    setIsAnimating(true);
    
    // Add to cart
    await addToCart(product);
    
    // Reset animation after it completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 400);
  };
  
  return (
    <Card className="group overflow-hidden transition-all duration-500 hover:shadow-lg hover:-translate-y-3">
      <div className="aspect-square overflow-hidden">
        <img 
          src={product.image_url} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = '/src/assets/hero-vegetables.jpg';
          }}
        />
      </div>
      
      <CardContent className="p-4 flex-grow">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg">{product.name}</h3>
          <Badge variant="secondary">{product.unit}</Badge>
        </div>
        <p className="text-muted-foreground text-sm mb-3 h-10">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</span>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={handleAddToCart}
          className="w-full bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary transition-all duration-300"
          size="lg"
        >
          <ShoppingCart className={`w-4 h-4 mr-2 ${isAnimating ? 'animate-cart-jump' : ''}`} />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};