import { Navigation } from "@/components/ui/navigation";
import { ProductCard } from "@/components/products/ProductCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Truck, Shield, Leaf, Star } from "lucide-react";
import { useProducts, useAuth } from "@/hooks";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { PUBLIC_ASSETS } from "@/constants/paths";

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

  const [videoLoaded, setVideoLoaded] = useState(false);
  // Controlled Tabs state
  const [activeTab, setActiveTab] = useState<string>("all");
  const topCategories = categories.slice(0, categories.length);

  // Memorize products grouped by category to avoid repeated filtering on render
  const productsByCategory = useMemo(() => {
    const map = new Map<string, typeof products[number][]>();
    for (const c of categories) map.set(c.id, []);
    for (const p of products) {
      const arr = map.get(p.category_id) ?? [];
      arr.push(p);
      map.set(p.category_id, arr);
    }
    return map;
  }, [products, categories]);

  // Visible products depend on active tab
  const visibleProducts = useMemo(() => {
    if (activeTab === "all") return products;
    return productsByCategory.get(activeTab) ?? [];
  }, [activeTab, products, productsByCategory]);
    
  return (
    <>
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[70vh] sm:min-h-[80vh] lg:min-h-screen flex items-center">
        <div className="absolute inset-0">
          {/* Video Background */}
          <video 
            autoPlay 
            muted 
            loop
            playsInline
            preload="metadata"
            className={`w-full h-full object-cover transition-opacity duration-700 ease-out ${videoLoaded ? 'opacity-90' : 'opacity-0'}`}
            onLoadedData={() => setVideoLoaded(true)}
          >
          <source src={PUBLIC_ASSETS.HERO_VIDEO} type="video/mp4" />
            {/* Fallback to static image if video fails */}
          </video>
          {/* Fallback background image */}
          {/* <img 
            src={heroImg} 
            alt="Fresh organic vegetables"
            className="w-full h-full object-cover opacity-60"
            style={{ display: 'none' }}
            onError={(e) => { e.currentTarget.style.display = 'block'; }}
          /> */}
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-12 sm:py-16 lg:py-24 xl:py-32 slide-text animate-fadeInText">
          <div className="max-w-2xl text-white">
            <Badge className="mb-3 sm:mb-4 bg-primary/20 text-white border-white/20 text-xs sm:text-sm">
              🌱 Farm Fresh
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
              Fresh Vegetables
              <span className="block text-accent">Delivered Daily</span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 text-white/90 leading-relaxed">
              Discover the finest selection of organic, locally-sourced vegetables 
              delivered straight to your doorstep. Fresh, healthy, and sustainable.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button size="lg" className="bg-gradient-to-r from-primary to-primary-glow text-white w-full sm:w-auto" asChild>
                <a href="#products">Shop Now</a>
              </Button>
              {!user && (
                <Button variant="none" size="lg" className="border-white text-white hover:bg-white hover:text-primary w-full sm:w-auto" asChild>
                  <Link to="/auth">Sign Up</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-0 shadow-none bg-transparent">
                <CardContent className="pt-4 sm:pt-6 px-2 sm:px-4">
                  <feature.icon className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-primary" />
                  <h3 className="font-semibold text-base sm:text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">Our Fresh Selection</h2>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
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
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex justify-center mb-6 sm:mb-8">
                <TabsList className="grid grid-cols-3 sm:grid-cols-6 w-full max-w-5xl overflow-x-auto text-xs sm:text-sm">
                  <TabsTrigger value="all" className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4">
                    <Leaf className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden xs:block">All</span>
                  </TabsTrigger>
                  {topCategories.map((category) => (
                    <TabsTrigger key={category.id} value={category.id} className="px-2 sm:px-4 whitespace-nowrap">
                      <span className="truncate">{category.name.split(' ')[0]}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              <TabsContent value="all">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {visibleProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </TabsContent>

              {categories.map((category) => (
                <TabsContent key={category.id} value={category.id}>
                  <div className="text-center mb-6 sm:mb-8">
                    <h3 className="text-xl sm:text-2xl font-semibold mb-2">{category.name}</h3>
                    <p className="text-sm sm:text-base text-muted-foreground">{category.description}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {visibleProducts.map((product) => (
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
