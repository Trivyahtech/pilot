import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Search as SearchIcon, Menu, X, ChevronRight, Flame, Droplets, FlaskConical, Atom, TestTube2, Beaker } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import header_icon from "../assets/header-icon.png"

// Icons mapping for product categories
const categoryIcons = {
  "Caustic Soda": <Droplets className="w-4 h-4 text-blue-500" />,
  "Industrial Acids": <FlaskConical className="w-4 h-4 text-orange-500" />,
  "Caustic Potash": <Beaker className="w-4 h-4 text-purple-500" />,
  "Hydrogen Peroxide": <Flame className="w-4 h-4 text-red-500" />,
  "Chlorination Chemical": <TestTube2 className="w-4 h-4 text-green-500" />,
  "Other Chemicals": <Atom className="w-4 h-4 text-yellow-500" />
} as const;

const productCategories = {
  "Caustic Soda": ["Caustic Soda Lye", "Caustic Soda Flakes"],
  "Industrial Acids": ["Hydrochloric Acid", "Dilute Sulphuric Acid", "Sulphuric Acid", "Phosphoric Acid"],
  "Caustic Potash": ["Caustic Potash Flakes", "Caustic Potash Lye"],
  "Hydrogen Peroxide": ["Caustic Soda Prill", "Hydrogen Peroxide"],
  "Chlorination Chemical": ["Aluminium Chloride", "Benzyl Chloride"],
  "Other Chemicals": [
    "Sodium Chlorate",
    "Methylene Chloride MDC",
    "Potassium Permanganate",
    "Hydrazine Hydrate",
    "Stable Bleaching Powder",
    "Chloroform",
    "Sodium Hypochlorite",
    "Poly Aluminium Chloride",
    "Benzaldehyde",
    "Chlorinated Paraffin",
    "Liquid Chlorine",
    "Benzyl Alcohol",
    "Potassium Carbonate"
  ]
};

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

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

  // Filter products based on search query
  const filteredCategories = Object.entries(productCategories).map(([category, items]) => ({
    category,
    items: items.filter(item => 
      item.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(({ items }) => items.length > 0);

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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-200">
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
              <span className="font-bold text-2xl text-[#213C8B]">PILOT IMPEX</span>
              <span className="text-xs font-medium text-gray-600">Navigating the Future of Chemical Trade</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Home Link */}
            <Link 
              to="/" 
              className={`px-3 py-2 text-base font-semibold rounded-md transition-all duration-200 ${
                location.pathname === '/' 
                  ? 'text-[#213C8B] dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30' 
                  : 'text-gray-700 dark:text-gray-300 hover:text-[#213C8B] dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800/50'
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
                      ? 'text-[#213C8B] dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
                      : 'text-gray-700 dark:text-gray-300 hover:text-[#213C8B] dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800/50'
                  }`}
                >
                  <span className="text-base">Products</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showProductDropdown ? 'transform rotate-180' : ''}`} />
                </Link>
              
                {showProductDropdown && (
                  <div 
                    className="absolute left-1/2 -translate-x-1/2 mt-0 w-[85vw] max-w-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl overflow-hidden transition-all duration-300 ease-out z-50"
                    onMouseEnter={() => setShowProductDropdown(true)}
                    onMouseLeave={() => setShowProductDropdown(false)}
                  >
                    <div className="p-4">
                      <div className="max-h-[70vh] overflow-y-auto pr-2">
                        {filteredCategories.map(({ category, items }) => (
                          <div key={category} className="mb-6">
                            <div className="flex items-center space-x-2 mb-2">
                              {categoryIcons[category as keyof typeof categoryIcons]}
                              <h4 className="font-semibold text-sm text-gray-900 dark:text-white">{category}</h4>
                            </div>
                            <div className="space-y-1 pl-7">
                              {items.map((item) => (
                                <Link
                                  key={item}
                                  to={`/products/${item.toLowerCase().replace(/\s+/g, '-')}`}
                                  className="flex items-center py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-[#213C8B] dark:hover:text-blue-400 transition-colors group"
                                  onClick={() => setShowProductDropdown(false)}
                                >
                                  <ChevronRight className="w-3 h-3 mr-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                                  <span className="truncate">{item}</span>
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Link 
              to="/about" 
              className={`px-4 py-2 text-base font-semibold rounded-md transition-all duration-200 ${
                isActive('/about')
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30' 
                  : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800/50'
              }`}
            >
              About Us
            </Link>
            
            <Link 
              to="/contact" 
              className={`px-4 py-2 text-base font-semibold rounded-md transition-all duration-200 ${
                isActive('/contact')
                  ? 'text-[#213C8B] dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30' 
                  : 'text-gray-700 dark:text-gray-300 hover:text-[#213C8B] dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800/50'
              }`}
            >
              Contact Us
            </Link>
            
            <Button 
              variant="default" 
              className="bg-[#213C8B] hover:bg-[#1a3270] text-white shadow-lg shadow-[#213C8B]/30 hover:shadow-[#1a3270]/40 transition-all duration-300 transform hover:-translate-y-0.5"
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
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              onClick={() => setShowProductDropdown(!showProductDropdown)}
            >
              <SearchIcon className="w-5 h-5" />
            </button>
            <button
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
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
          <div className="lg:hidden p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search products..."
                className="pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>
            <div className="mt-4 max-h-96 overflow-y-auto space-y-4">
              {filteredCategories.map(({ category, items }) => (
                <div key={category} className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm font-medium text-gray-900 dark:text-white">
                    {categoryIcons[category as keyof typeof categoryIcons]}
                    <span>{category}</span>
                  </div>
                  <div className="space-y-1 pl-6">
                    {items.map((item) => (
                      <Link
                        key={item}
                        to={`/products/${item.toLowerCase().replace(/\s+/g, '-')}`}
                        className="block py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        onClick={() => {
                          setShowProductDropdown(false);
                          setIsMenuOpen(false);
                        }}
                      >
                        {item}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
              {filteredCategories.length === 0 && (
                <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                  No products found
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link 
                to="/products"
                className={`block px-4 py-3 rounded-lg text-base font-bold ${
                  location.pathname.startsWith('/products')
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50'
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
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
              
              <Link
                to="/contact"
                className={`block px-4 py-3 rounded-lg text-base font-semibold ${
                  isActive('/contact')
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact Us
              </Link>
              
              <div className="px-4 py-3">
                <Button 
                  variant="default" 
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-0.5"
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