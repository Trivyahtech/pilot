import { Link } from "react-router-dom";
import { ArrowRight, Star, Users, Truck, Shield } from "lucide-react";
import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import benzylChlorideImg from "@/assets/Pilot Impex Product Image/Benzyl Chloride.png";
import hydrogenPeroxideImg from "@/assets/Pilot Impex Product Image/Hydrogen Peroxide.png";
import hydrazineHydrateImg from "@/assets/Pilot Impex Product Image/Hydrazine Hydrate.png";
import phosphoricAcidImg from "@/assets/Pilot Impex Product Image/Phosphoric Acid.png";

const features = [
  {
    icon: Star,
    title: "Quality Assured",
    description: "Premium grade chemicals with consistent quality and purity standards"
  },
  {
    icon: Users,
    title: "Serving Since 1992",
    description: "Over 30 years of expertise in chemical supply and distribution"
  },
  {
    icon: Truck,
    title: "Nationwide Delivery",
    description: "Fast and reliable delivery across India with proper packaging"
  },
  {
    icon: Shield,
    title: "Authorized Dealer",
    description: "Official dealer of GACL chemicals and specialty chemical products"
  }
];

const featuredProducts = [
  {
    name: "Benzyl Chloride",
    description: "A key chlorination agent widely used in pharmaceutical synthesis, fragrance manufacturing, and dye production.",
    image: benzylChlorideImg,
    slug: "benzyl-chloride",
    to: "/products/chlorination-chemicals",
    category: "Chlorination Chemicals",
  },
  {
    name: "Hydrogen Peroxide",
    description: "Multi-grade oxidizing agent used for industrial bleaching, water treatment, and chemical synthesis.",
    image: hydrogenPeroxideImg,
    slug: "hydrogen-peroxide",
    to: "/products/hydrogen-peroxide",
    category: "Hydrogen Peroxide",
  },
  {
    name: "Hydrazine Hydrate",
    description: "High-purity reducing agent essential for boiler water treatment, pharmaceuticals, and agrochemical production.",
    image: hydrazineHydrateImg,
    slug: "hydrazine-hydrate",
    to: "/products/other-chemicals",
    category: "Specialty Chemicals",
  },
  {
    name: "Phosphoric Acid",
    description: "Food-grade and industrial acid used in fertilizers, metal surface treatment, and food & beverage processing.",
    image: phosphoricAcidImg,
    slug: "phosphoric-acid",
    to: "/products/industrial-acids",
    category: "Industrial Acids",
  },
];

const Index = () => {

  useEffect(() => {
    // Check if we need to scroll to hero section
    const shouldScroll = sessionStorage.getItem('shouldScrollToHero');
    if (shouldScroll === 'true') {
      const heroSection = document.querySelector('section.relative.min-h-screen');
      if (heroSection) {
        heroSection.scrollIntoView({ behavior: 'smooth' });
      }
      // Clear the flag
      sessionStorage.removeItem('shouldScrollToHero');
    }
  }, []);

  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      
      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="group relative overflow-hidden text-center border border-border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 stagger-fade" 
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardContent className="p-6 relative z-10">
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-5 group-hover:bg-primary/20 transition-colors duration-300">
                    <feature.icon className="w-7 h-7 text-primary group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="font-heading font-semibold text-xl mb-3 text-foreground group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-base leading-relaxed group-hover:text-foreground/90 transition-colors duration-300">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Showcase */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <span className="section-badge">Featured Products</span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
              Our <span className="text-primary">Flagship Chemicals</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Trusted by industries across India — explore our most sought-after chemical products.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {featuredProducts.map((product, index) => (
              <div
                key={product.slug}
                className="stagger-fade"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCard
                  name={product.name}
                  description={product.description}
                  image={product.image}
                  slug={product.slug}
                  to={product.to}
                  category={product.category}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Explore All Products CTA */}
      <section className="py-10 bg-background">
        <div className="container mx-auto px-4 text-center">
          <Button
            variant="outline"
            size="lg"
            className="px-8 py-4 group relative overflow-hidden transition-all duration-300 border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 hover:text-foreground"
            asChild
          >
            <Link to="/products" className="relative z-10 flex items-center justify-center gap-2">
              <span className="relative inline-flex flex-col items-center">
                <span>Explore All Products</span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary/60 group-hover:w-full transition-all duration-300"></span>
              </span>
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-form" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              Get In Touch
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Ready to discuss your chemical requirements? Send us an inquiry and our team will get back to you promptly.
            </p>
            <Button size="lg" className="px-8 py-4" asChild>
              <Link to="/contact">
                Send Inquiry
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
