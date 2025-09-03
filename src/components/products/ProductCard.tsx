import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star, TrendingUp, Package } from "lucide-react";
import { Product } from '@/types';
import { useCart, useToast } from "@/hooks";
import { useState } from "react";
import { PUBLIC_ASSETS } from "@/constants/paths";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [isAnimating, setIsAnimating] = useState(false);
  const env = import.meta.env;
  const imageUrlPrefix = env.VITE_BASE_URL === '/' ? '' : `${env.VITE_BASE_URL}`;

  const handleAddToCart = async () => {
    // Check stock availability
    if (product.stock_quantity && product.stock_quantity <= 0) {
      toast({
        variant: "destructive",
        title: "Out of Stock",
        description: "This item is currently out of stock.",
      });
      return;
    }

    // Trigger animation
    setIsAnimating(true);
    
    // Create product with discounted price for cart
    const productForCart = {
      ...product,
      price: getDiscountedPrice(), // Use discounted price
      original_price: product.price // Store original price for display
    };
    
    // Add to cart
    await addToCart(productForCart);
    
    // Reset animation after it completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 400);
  };

  const getDiscountedPrice = () => {
    if (product.discount_percentage && product.discount_percentage > 0) {
      return product.price * (1 - product.discount_percentage / 100);
    }
    return product.price;
  };

  const getStockStatus = () => {
    const stock = product.stock_quantity || 0;
    if (stock === 0) return { text: "Out of Stock", color: "text-destructive" };
    if (stock <= 5) return { text: `Only ${stock} left`, color: "text-orange-600" };
    if (stock <= 20) return { text: `${stock} in stock`, color: "text-yellow-600" };
    return { text: "In stock", color: "text-green-600" };
  };
  
  const stockStatus = getStockStatus();
  
  return (
    <Card className="group overflow-hidden transition-all duration-500 hover:shadow-lg hover:-translate-y-1 sm:hover:-translate-y-3">
      <div className="aspect-square overflow-hidden relative">
        <img 
          src={`${imageUrlPrefix}${product.image_url}`}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = PUBLIC_ASSETS.HERO_IMAGE;
          }}
        />
        
        {/* Variant Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.is_featured && (
            <Badge variant="default" className="bg-primary/90 text-primary-foreground text-xs">
              <Star className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          )}
          {product.is_bestseller && (
            <Badge variant="secondary" className="bg-secondary/90 text-secondary-foreground text-xs">
              <TrendingUp className="w-3 h-3 mr-1" />
              Best Seller
            </Badge>
          )}
        </div>

        {/* Discount Badge */}
        {product.discount_percentage && product.discount_percentage > 0 && (
          <div className="absolute top-2 right-2">
            <Badge variant="destructive" className="bg-red-500 text-white text-xs font-bold">
              {product.discount_percentage}% OFF
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-3 sm:p-4 flex-grow">
        <div className="flex items-start justify-between mb-2 gap-2">
          <h3 className="font-semibold text-base sm:text-lg leading-tight">{product.name}</h3>
          <Badge variant="secondary" className="text-xs whitespace-nowrap">{product.unit}</Badge>
        </div>
        <p className="text-muted-foreground text-xs sm:text-sm mb-3 leading-relaxed line-clamp-2 min-h-[2.5rem] sm:min-h-[2.5rem]">{product.description}</p>
        
        {/* Price Section */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {product.discount_percentage && product.discount_percentage > 0 ? (
              <>
                <span className="text-xl sm:text-2xl font-bold text-primary">${getDiscountedPrice().toFixed(2)}</span>
                <span className="text-sm text-muted-foreground line-through">${product.price.toFixed(2)}</span>
              </>
            ) : (
              <span className="text-xl sm:text-2xl font-bold text-primary">${product.price.toFixed(2)}</span>
            )}
          </div>
        </div>

        {/* Stock Status */}
        <div className="flex items-center gap-1 mb-2">
          <Package className="w-3 h-3" />
          <span className={`text-xs ${stockStatus.color}`}>{stockStatus.text}</span>
        </div>
      </CardContent>
      
      <CardFooter className="p-3 sm:p-4 pt-0">
        <Button 
          onClick={handleAddToCart}
          disabled={!product.stock_quantity || product.stock_quantity <= 0}
          className="w-full bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary transition-all duration-300 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          size="default"
        >
          <ShoppingCart className={`w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 ${isAnimating ? 'animate-cart-jump' : ''}`} />
          <span className="hidden xs:inline">
            {!product.stock_quantity || product.stock_quantity <= 0 ? 'Out of Stock' : 'Add to Cart'}
          </span>
          <span className="xs:hidden">
            {!product.stock_quantity || product.stock_quantity <= 0 ? 'Out' : 'Add'}
          </span>
        </Button>
      </CardFooter>
    </Card>
  );
};