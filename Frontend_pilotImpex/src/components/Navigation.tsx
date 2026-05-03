import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Search as SearchIcon, Menu, X, ChevronRight, Flame, Droplets, FlaskConical, Atom, TestTube2, Beaker, Box, Package, Layers, Hexagon, Activity, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import header_icon from "../assets/header-icon.png";
import { useCatalog } from "@/hooks/useCatalog";

const groupIcons: Record<string, React.ReactNode> = {
  "caustic-soda": <Droplets className="w-4 h-4 text-blue-500" />,
  "industrial-acids": <FlaskConical className="w-4 h-4 text-orange-500" />,
  "caustic-potash": <Beaker className="w-4 h-4 text-purple-500" />,
  "hydrogen-peroxide": <Flame className="w-4 h-4 text-red-500" />,
  "chlorination-chemicals": <TestTube2 className="w-4 h-4 text-green-500" />,
  "other-chemicals": <Atom className="w-4 h-4 text-yellow-500" />,
};

const fallbackIcons = [Box, Package, Layers, Hexagon, Activity, Sparkles, Zap, Atom];
const fallbackColors = [
  "text-blue-500", "text-orange-500", "text-purple-500", 
  "text-red-500", "text-green-500", "text-yellow-500", 
  "text-pink-500", "text-indigo-500", "text-teal-500"
];

const getDynamicIcon = (slug: string) => {
  if (groupIcons[slug]) return groupIcons[slug];
  
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = slug.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);
  
  const IconComponent = fallbackIcons[hash % fallbackIcons.length];
  const colorClass = fallbackColors[hash % fallbackColors.length];
  
  return <IconComponent className={`w-4 h-4 ${colorClass}`} />;
};

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const { data: catalog, isError, isLoading } = useCatalog();
  const allGroups = catalog?.groups ?? [];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProductDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path: string) => {
    // Special handling for products page since it has hash fragments
    if (path === '/products') {
      return location.pathname.startsWith('/products');
    }
    return location.pathname === path;
  };

  // Filter groups based on search query
  const filteredGroups = allGroups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.products.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSearchFocus = () => {
    setShowProductDropdown(true);
  };

  const scrollToHero = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    // If we're not on the home page, navigate there first
    if (location.pathname !== '/') {
      // Store the scroll behavior in session storage
      sessionStorage.setItem('shouldScrollToHero', 'true');
      window.location.href = '/';
      return;
    }
    
    // If we're already on the home page, scroll to hero
    const heroSection = document.querySelector('section.relative.min-h-screen');
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Close mobile menu if open
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border shadow-sm transition-colors duration-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 group"
            onClick={scrollToHero}
          >
            <div className="w-16 h-16 rounded-xl flex items-center justify-center transform transition-transform duration-300 group-hover:scale-105">
              <img 
                src={header_icon}
                alt="Pilot Impex Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-2xl text-primary">PILOT IMPEX</span>
              <span className="text-xs font-medium text-muted-foreground">Navigating the Future of Chemical Trade</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Home Link */}
            <Link 
              to="/" 
              className={`px-3 py-2 text-base font-semibold rounded-md transition-all duration-200 ${
                location.pathname === '/' 
                  ? 'text-primary dark:text-primary-light bg-primary/10 dark:bg-primary/20' 
                  : 'text-foreground/70 dark:text-foreground/70 hover:text-primary dark:hover:text-primary-light hover:bg-primary/5 dark:hover:bg-primary/10'
              }`}
              onClick={(e) => {
                if (location.pathname === '/') {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
            >
              Home
            </Link>
            
            {/* Products Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <div 
                className="group"
                onMouseEnter={() => setShowProductDropdown(true)}
                onMouseLeave={() => setShowProductDropdown(false)}
              >
                <Link 
                  to="/products"
                  className={`flex items-center space-x-1 px-3 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${
                    isActive('/products')
                      ? 'text-primary dark:text-primary-light bg-primary/10 dark:bg-primary/20'
                      : 'text-foreground/70 dark:text-foreground/70 hover:text-primary dark:hover:text-primary-light hover:bg-primary/5 dark:hover:bg-primary/10'
                  }`}
                >
                  <span className="text-base">Products</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showProductDropdown ? 'transform rotate-180' : ''}`} />
                </Link>
              
                {showProductDropdown && (
                  <div 
                    className="absolute left-1/2 -translate-x-1/2 mt-0 w-[85vw] max-w-xs bg-background dark:bg-card border border-border rounded-lg shadow-xl overflow-hidden transition-all duration-300 ease-out z-50"
                    onMouseEnter={() => setShowProductDropdown(true)}
                    onMouseLeave={() => setShowProductDropdown(false)}
                  >
                    <div className="p-4 space-y-1 max-h-[70vh] overflow-y-auto">
                      {isLoading && (
                        <div className="text-center py-4 text-muted-foreground text-sm">Loading product groups...</div>
                      )}
                      {isError && (
                        <div className="text-center py-4 text-destructive text-sm">Catalog unavailable</div>
                      )}
                      {!isLoading && !isError && filteredGroups.map((group) => (
                        <Link
                          key={group.slug}
                          to={`/products/${group.slug}`}
                          className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all group"
                          onClick={() => setShowProductDropdown(false)}
                        >
                          {getDynamicIcon(group.slug)}
                          <div className="flex-1">
                            <span className="font-medium text-foreground group-hover:text-primary transition-colors">{group.name}</span>
                            <span className="ml-2 text-xs text-muted-foreground">({group.products.length})</span>
                          </div>
                          <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      ))}
                      {!isLoading && !isError && filteredGroups.length === 0 && (
                        <div className="text-center py-4 text-muted-foreground text-sm">No groups found</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Link 
              to="/about" 
              className={`px-4 py-2 text-base font-semibold rounded-md transition-all duration-200 ${
                isActive('/about')
                  ? 'text-primary dark:text-primary-light bg-primary/10 dark:bg-primary/20' 
                  : 'text-foreground/70 dark:text-foreground/70 hover:text-primary dark:hover:text-primary-light hover:bg-primary/5 dark:hover:bg-primary/10'
              }`}
            >
              About Us
            </Link>
            
            <Link 
              to="/contact" 
              className={`px-4 py-2 text-base font-semibold rounded-md transition-all duration-200 ${
                isActive('/contact')
                  ? 'text-primary dark:text-primary-light bg-primary/10 dark:bg-primary/20' 
                  : 'text-foreground/70 dark:text-foreground/70 hover:text-primary dark:hover:text-primary-light hover:bg-primary/5 dark:hover:bg-primary/10'
              }`}
            >
              Contact Us
            </Link>
            
            <Button 
              variant="default" 
              className="bg-primary hover:bg-primary-dark text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-primary-dark/40 transition-all duration-300 transform hover:-translate-y-0.5"
              asChild
            >
              <Link to="/contact">
                Send Inquiry
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden space-x-3">
            <button
              className="p-2 text-foreground/70 hover:text-primary transition-colors"
              onClick={() => setShowProductDropdown(!showProductDropdown)}
            >
              <SearchIcon className="w-5 h-5" />
            </button>
            <button
              className="p-2 text-foreground/70 hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {showProductDropdown && (
          <div className="lg:hidden p-4 border-t border-border bg-background">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search products..."
                className="pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>
            <div className="mt-4 max-h-96 overflow-y-auto space-y-1">
              {isLoading && (
                <div className="text-center py-4 text-muted-foreground">
                  Loading product groups...
                </div>
              )}
              {isError && (
                <div className="text-center py-4 text-destructive">
                  Catalog unavailable
                </div>
              )}
              {!isLoading && !isError && filteredGroups.map((group) => (
                <Link
                  key={group.slug}
                  to={`/products/${group.slug}`}
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm hover:bg-primary/5 transition-all"
                  onClick={() => {
                    setShowProductDropdown(false);
                    setIsMenuOpen(false);
                  }}
                >
                  {getDynamicIcon(group.slug)}
                  <span className="font-medium text-foreground">{group.name}</span>
                  <span className="text-xs text-muted-foreground">({group.products.length})</span>
                </Link>
              ))}
              {!isLoading && !isError && filteredGroups.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  No product groups found
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-background border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link 
                to="/products"
                className={`block px-4 py-3 rounded-lg text-base font-bold ${
                  location.pathname.startsWith('/products')
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground/70 hover:bg-primary/5'
                }`}
                onClick={() => {
                  setShowProductDropdown(true);
                  searchRef.current?.focus();
                }}
              >
                Products
              </Link>
              
              <Link
                to="/about"
                className={`block px-4 py-3 rounded-lg text-base font-semibold ${
                  isActive('/about')
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground/70 hover:bg-primary/5'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
              
              <Link
                to="/contact"
                className={`block px-4 py-3 rounded-lg text-base font-semibold ${
                  isActive('/contact')
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground/70 hover:bg-primary/5'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact Us
              </Link>
              
              <div className="px-4 py-3">
                <Button 
                  variant="default" 
                  className="w-full bg-primary hover:bg-primary-dark text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 transform hover:-translate-y-0.5"
                  asChild
                >
                  <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
                    Send Inquiry
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
