import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { Product } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/useToast";
import { useState } from "react";
import heroImg from "@/assets/hero-vegetables.jpg";

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
    <Card className="group overflow-hidden transition-all duration-500 hover:shadow-lg hover:-translate-y-1 sm:hover:-translate-y-3">
      <div className="aspect-square overflow-hidden">
        <img 
          src={product.image_url} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = heroImg;
          }}
        />
      </div>
      
      <CardContent className="p-3 sm:p-4 flex-grow">
        <div className="flex items-start justify-between mb-2 gap-2">
          <h3 className="font-semibold text-base sm:text-lg leading-tight">{product.name}</h3>
          <Badge variant="secondary" className="text-xs whitespace-nowrap">{product.unit}</Badge>
        </div>
        <p className="text-muted-foreground text-xs sm:text-sm mb-3 leading-relaxed line-clamp-2 min-h-[2.5rem] sm:min-h-[2.5rem]">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xl sm:text-2xl font-bold text-primary">${product.price.toFixed(2)}</span>
        </div>
      </CardContent>
      
      <CardFooter className="p-3 sm:p-4 pt-0">
        <Button 
          onClick={handleAddToCart}
          className="w-full bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary transition-all duration-300 text-sm sm:text-base"
          size="default"
        >
          <ShoppingCart className={`w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 ${isAnimating ? 'animate-cart-jump' : ''}`} />
          <span className="hidden xs:inline">Add to Cart</span>
          <span className="xs:hidden">Add</span>
        </Button>
      </CardFooter>
    </Card>
  );
};