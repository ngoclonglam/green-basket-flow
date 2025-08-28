import { Navigation } from "@/components/ui/navigation";
import { ProductCard } from "@/components/ProductCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Truck, Shield, Leaf, Star } from "lucide-react";
import { products } from "@/data/products";
import heroImg from "@/assets/hero-vegetables.jpg";

const Index = () => {
  const features = [
    {
      icon: Leaf,
      title: "100% Organic",
      description: "All our vegetables are certified organic and locally sourced"
    },
    {
      icon: Truck,
      title: "Fast Delivery", 
      description: "Same-day delivery available for orders placed before 2 PM"
    },
    {
      icon: Shield,
      title: "Quality Guarantee",
      description: "100% satisfaction guaranteed or your money back"
    },
    {
      icon: Star,
      title: "Premium Quality",
      description: "Hand-picked fresh vegetables from local farms"
    }
  ];

  return (
    <>
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImg} 
            alt="Fresh organic vegetables"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-24 lg:py-32">
          <div className="max-w-2xl text-white">
            <Badge className="mb-4 bg-primary/20 text-white border-white/20">
              🌱 Farm Fresh
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Fresh Vegetables
              <span className="block text-accent">Delivered Daily</span>
            </h1>
            <p className="text-xl mb-8 text-white/90">
              Discover the finest selection of organic, locally-sourced vegetables 
              delivered straight to your doorstep. Fresh, healthy, and sustainable.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-gradient-to-r from-primary to-primary-glow text-white">
                Shop Now
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-0 shadow-none bg-transparent">
                <CardContent className="pt-6">
                  <feature.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Our Fresh Selection</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Hand-picked vegetables from local organic farms, delivered fresh to your table
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">FreshMarket</h3>
              <p className="text-primary-foreground/80">
                Your trusted source for fresh, organic vegetables delivered daily.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li>About Us</li>
                <li>Our Farms</li>
                <li>Delivery Info</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact Info</h4>
              <p className="text-primary-foreground/80">
                Phone: (555) 123-4567<br />
                Email: hello@freshmarket.com
              </p>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-primary-foreground/60">
            <p>&copy; 2024 FreshMarket. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Index;
