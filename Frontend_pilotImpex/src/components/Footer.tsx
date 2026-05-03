import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Linkedin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import footer_icon from "../assets/footer-icon.png"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-primary-dark to-primary/95 text-primary-foreground shadow-lg">
      <div className="container mx-auto px-4 pt-8 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                <img 
                src={footer_icon}
                alt="Pilot Impex Logo" 
                className="w-full h-full object-contain"
              />
              </div>
              <span className="font-heading font-bold text-xl">PILOT IMPEX</span>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-normal mt-2">
              Trusted chemical supplier since 1992. Dealer of GACL chemicals and specialty chemicals with nationwide delivery.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="font-heading font-semibold text-lg mb-1">Quick Links</h3>
            <div className="space-y-3">
              <Link to="/" className="flex items-center text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm group">
                <span className="w-1.5 h-1.5 bg-accent rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                Home
              </Link>
              <Link to="/products" className="flex items-center text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm group">
                <span className="w-1.5 h-1.5 bg-accent rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                Products
              </Link>
              <Link to="/about" className="flex items-center text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm group">
                <span className="w-1.5 h-1.5 bg-accent rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                About Us
              </Link>
              <Link to="/contact" className="flex items-center text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm group">
                <span className="w-1.5 h-1.5 bg-accent rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                Contact Us
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-3">
            <h3 className="font-heading font-semibold text-lg mb-1">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-4 bg-white/10 rounded-lg hover:bg-white/15 transition-colors group">
                <MapPin className="w-5 h-5 mt-0.5 text-accent flex-shrink-0 group-hover:text-primary-foreground transition-colors" />
                <p className="text-primary-foreground/80 text-sm leading-relaxed">
                  B-4, Bela Chamber, Vinoba Bhave Road,
                  Opp. M.C. High School, Salat Wada,
                  Vadodara - 390001, Gujarat, India
                </p>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-white/10 rounded-lg hover:bg-white/15 transition-colors group">
                <Phone className="w-5 h-5 text-accent flex-shrink-0 group-hover:text-primary-foreground transition-colors" />
                <a href="tel:08045804678" className="text-primary-foreground/80 hover:text-primary-foreground text-sm font-medium">08045804678</a>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-white/10 rounded-lg hover:bg-white/15 transition-colors group">
                <Mail className="w-5 h-5 text-accent flex-shrink-0 group-hover:text-primary-foreground transition-colors" />
                <a href="mailto:info@pilotimpex.com" className="text-primary-foreground/80 hover:text-primary-foreground text-sm font-medium">info@pilotimpex.com</a>
              </div>
            </div>
          </div>

          {/* Contact Person & Social */}
          <div className="space-y-3">
            <h3 className="font-heading font-semibold text-lg mb-1">Get In Touch</h3>
            <div className="space-y-3">
              <div className="p-4 bg-white/10 rounded-lg hover:bg-white/15 transition-colors">
                <p className="text-primary-foreground/80 text-sm">
                  <span className="block text-primary-foreground font-semibold">Tejas Turakhia</span>
                  {/* <span className="text-accent-300 font-medium">Marketing Manager</span><br /> */}
                  <a href="tel:918460740387" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors inline-flex items-center mt-1">
                    <Phone className="w-4 h-4 inline-block mr-1.5 text-accent" /> +91 8460740387
                  </a>
                </p>
              </div>
              
              <Button variant="outline" className="w-full border-accent/50 text-accent hover:bg-accent hover:text-white hover:border-accent transition-all mt-3" asChild>
                <Link to="/contact">Send Inquiry</Link>
              </Button>
              
              <div className="flex space-x-3 mt-4">
                <a href="#" className="p-2.5 bg-white/10 rounded-lg hover:bg-accent hover:scale-105 transition-all duration-300" aria-label="Facebook">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="p-2.5 bg-white/10 rounded-lg hover:bg-accent hover:scale-105 transition-all duration-300" aria-label="LinkedIn">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="https://wa.me/08045804678" className="p-2.5 bg-white/10 rounded-lg hover:bg-accent hover:scale-105 transition-all duration-300" aria-label="WhatsApp">
                  <MessageCircle className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-primary-foreground/70 text-sm">
            © {new Date().getFullYear()} PILOT IMPEX. All Rights Reserved.
          </p>
          <p className="text-primary-foreground/70 text-sm mt-2 md:mt-0">
            Powered by: <a href="https://acentric.in" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-primary-foreground font-medium transition-colors">Acentric</a>
          </p>
        </div>
      </div>
    </footer>
  );
}