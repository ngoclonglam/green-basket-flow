import { Navigation } from "@/components/ui/navigation";
import { ProductCard } from "@/components/ProductCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Truck, Shield, Leaf, Star, Filter } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import heroImg from "@/assets/hero-vegetables.jpg";

const Index = () => {
  const { products, categories, loading, error } = useProducts();
  const { user } = useAuth();
  
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
      <section className="relative overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0">
          {/* Video Background */}
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-cover opacity-60"
            poster={heroImg}
          >
            <source src="https://player.vimeo.com/external/406127989.sd.mp4?s=c4d39493c5d8bb83c3b1ce3e59ba0c05c94d8d7e" type="video/mp4" />
            {/* Fallback to static image if video fails */}
          </video>
          {/* Fallback background image */}
          <img 
            src={heroImg} 
            alt="Fresh organic vegetables"
            className="w-full h-full object-cover opacity-60"
            style={{ display: 'none' }}
            onError={(e) => { e.currentTarget.style.display = 'block'; }}
          />
          <div className="absolute inset-0 bg-black/30"></div>
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
              <Button size="lg" className="bg-gradient-to-r from-primary to-primary-glow text-white" asChild>
                <a href="#products">Shop Now</a>
              </Button>
              {!user && (
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary" asChild>
                  <Link to="/auth">Sign Up</Link>
                </Button>
              )}
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
      <section id="products" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Our Fresh Selection</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Hand-picked vegetables from local organic farms, delivered fresh to your table
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-4">Loading fresh products...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-destructive mb-4">Error loading products: {error}</p>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
            </div>
          ) : (
            <Tabs defaultValue="all" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="grid grid-cols-6 w-full max-w-3xl">
                  <TabsTrigger value="all" className="flex items-center gap-2">
                    <Leaf className="w-4 h-4" />
                    All
                  </TabsTrigger>
                  {categories.slice(0, 5).map((category) => (
                    <TabsTrigger key={category.id} value={category.id} className="text-sm">
                      {category.name.split(' ')[0]}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              <TabsContent value="all">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </TabsContent>

              {categories.map((category) => (
                <TabsContent key={category.id} value={category.id}>
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-semibold mb-2">{category.name}</h3>
                    <p className="text-muted-foreground">{category.description}</p>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products
                      .filter(product => product.category_id === category.id)
                      .map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          )}
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
