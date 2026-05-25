import { Award, Users, MapPin, Target } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";

// Animated number component
const AnimatedNumber = ({ value, label }: { value: string | number; label?: string }) => {
  const [displayValue, setDisplayValue] = useState<string | number>(0);
  const controls = useAnimation();
  const isNumeric = !isNaN(Number(value));
  const target = isNumeric ? Number(value) : 0;
  const isYear = label?.toLowerCase().includes('since');

  useEffect(() => {
    if (isNumeric && !isYear) {
      controls.start({
        scale: [1, 1.1, 1],
        transition: { duration: 0.5 }
      });
      
      // Counter animation only for non-year values
      const duration = 1500; // 1.5 seconds
      const start = Date.now();
      const end = start + duration;
      
      const animate = () => {
        const now = Date.now();
        const progress = Math.min(1, (now - start) / duration);
        const currentValue = Math.floor(progress * target);
        
        setDisplayValue(currentValue);
        
        if (now < end) {
          requestAnimationFrame(animate);
        } else {
          setDisplayValue(target);
        }
      };
      
      const timer = setTimeout(animate, 300); // Slight delay for better effect
      return () => clearTimeout(timer);
    } else {
      setDisplayValue(value);
    }
  }, [value, controls, isNumeric, isYear, target]);

  return (
    <motion.span animate={controls}>
      {isYear || !isNumeric ? value : displayValue}
    </motion.span>
  );
};

const achievements = [
  {
    icon: Award,
    title: "Strong Ethics",
    description: "Reputation as a company with strong ethics and transparent business practices"
  },
  {
    icon: Users,
    title: "Customer Trust",
    description: "Earned the trust of customers and enrolled in their good books through consistent quality"
  },
  {
    icon: MapPin,
    title: "Market Image",
    description: "Unique market image and strong associate relationships across India"
  },
  {
    icon: Target,
    title: "Daily Growth",
    description: "List of our clients is increasing daily with expanding service network"
  }
];

const stats = [
  { number: "1992", label: "Serving Since" },
  { number: "100+", label: "Products" },
  { number: "All India", label: "Delivery Network" },
  { number: "6+", label: "Authorized Dealers" }
];

const dealerLogos = [
  { name: "GACL", logo: "https://gacl.com/wp-content/uploads/2023/12/gacl-final-logo-1024x149.png" },
  { name: "GNFC", logo: "https://www.gnfc.in/wp-content/uploads/2018/02/logo.png" },
  { name: "Epigral", logo: "https://epigral.com/wp-content/uploads/2023/08/epigral-logo-1.svg" },
  { name: "Grasim", logo: "https://www.grasim.com/images/logo.jpg" },
  { name: "Universal", logo: "https://universalchemicals.co/images/logo.png" },
  { name: "DCM Shriram", logo: "https://www.dcmshriram.com/images/shriram-logo.svg" },
];

export default function About() {

  useEffect(()=>{
      document.title = "About Us | PILOT IMPEX - Chemical Suppliers Since 1992"
    }, [])

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="pt-24">
        <Breadcrumb 
          items={[
            { label: 'Home', to: '/' },
            { label: 'About Us' }
          ]} 
        />
      </div>

      {/* Hero Section */}
      <section className="pt-12 pb-1 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              About PILOT IMPEX
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A trusted chemical supplier since 1992, serving industries across India with quality chemicals and reliable service.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story & Company Info */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
                Our Story
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Pilot Impex has a wide distribution network across the country and is popular for supplying a huge array of chemicals. We offer Caustic, Potash, HCl, Sodium Hypo & many other chemicals at competitive rates.
                </p>
                <p>
                  With intense hard work, we have emerged as one of the trusted dealers of GACL chemicals and specialty chemicals. Our company is serving customers from various sectors and the list of our clients is increasing daily.
                </p>
                <p>
                  We maintain stringent quality control measures and ensure that all products meet industry standards. Our experienced team works tirelessly to provide exceptional customer service and technical support.
                </p>
                <p>
                  Over the years, we have built strong relationships with manufacturers and suppliers, enabling us to offer competitive pricing and reliable supply chains to our customers across India.
                </p>
              </div>
            </div>
            
            <div className="bg-card rounded-xl p-8 shadow-md border border-border hover:shadow-lg transition-all duration-300">
              <h3 className="text-2xl font-heading font-bold text-primary-dark mb-6 pb-3 border-b border-primary/10">
                Company Information
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between py-3 px-2 rounded-lg hover:bg-primary/5 transition-colors duration-200">
                  <span className="font-medium text-muted-foreground">Established:</span>
                  <span className="font-semibold text-primary-dark">1992</span>
                </div>
                <div className="flex justify-between py-3 px-2 rounded-lg hover:bg-primary/5 transition-colors duration-200">
                  <span className="font-medium text-muted-foreground">Market:</span>
                  <span className="font-semibold text-primary-dark">All India</span>
                </div>
                <div className="flex justify-between py-3 px-2 rounded-lg hover:bg-primary/5 transition-colors duration-200">
                  <span className="font-medium text-muted-foreground">Certification:</span>
                  <span className="font-semibold text-primary-dark">FIRM REGISTRATION</span>
                </div>
                <div className="flex justify-between py-3 px-2 rounded-lg hover:bg-primary/5 transition-colors duration-200">
                  <span className="font-medium text-muted-foreground">Products:</span>
                  <span className="text-foreground">100+ Chemicals</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 relative overflow-hidden bg-brand-accent">
        <div className="container mx-auto px-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white text-center mb-8">
            Our Authorized Dealers
          </h2>
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            {dealerLogos.map((dealer, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-transparent rounded-xl px-6 py-4 flex flex-col items-center justify-center gap-2 border border-white/20 hover:scale-105 transition-all duration-300"
                style={{ minWidth: "140px" }}
              >
                <img
                  src={dealer.logo}
                  alt={dealer.name}
                  loading="lazy"
                  decoding="async"
                  className="max-h-10 max-w-[120px] w-auto object-contain brightness-0 invert"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
                <span className="text-xs font-semibold text-white/80 tracking-wide">{dealer.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                <div 
                  className="group relative bg-card rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-border overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                  
                  <div className="relative">
                    <div className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-3">
                      <AnimatedNumber value={stat.number} label={stat.label} />
                    </div>
                    <div className="text-primary-dark font-medium text-sm uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </div>
                  
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-primary-light transition-all duration-300 group-hover:w-full"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16 bg-muted/70">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-4">
              Our Achievements
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Through dedication and commitment to excellence, we have achieved significant milestones in the chemical industry.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <motion.div 
                key={index}
                className="group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full text-center transition-all duration-300 hover:shadow-lg hover:border-primary/20 hover:-translate-y-1">
                  <CardHeader>
                    <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                      <achievement.icon className="w-6 h-6 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h3 className="text-xl font-heading font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                      {achievement.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {achievement.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Authorized Dealers */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-4">
              Authorized Dealer
            </h2>
            <p className="text-muted-foreground text-lg">
              We are proud to be authorized dealers for leading chemical manufacturers
            </p>
          </div>
          
          {/* Dealer Logos Marquee */}
          <div className="relative overflow-hidden">
            <div className="flex space-x-12 animate-marquee">
              {[...dealerLogos, ...dealerLogos].map((dealer, index) => (
                <div key={index} className="flex-shrink-0 w-48 h-28 bg-transparent rounded-lg border border-border flex flex-col items-center justify-center gap-2 px-4">
                  <img
                    src={dealer.logo}
                    alt={dealer.name}
                    loading="lazy"
                    decoding="async"
                    className="max-h-12 max-w-[140px] w-auto object-contain"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <span className="font-medium text-foreground text-xs text-center">{dealer.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
