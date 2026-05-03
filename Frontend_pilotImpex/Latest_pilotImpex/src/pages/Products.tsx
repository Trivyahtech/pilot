import { useState, useMemo, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import Navigation from "@/components/Navigation";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Breadcrumb from "@/components/Breadcrumb";
import caustic_soda_lye from "../assets/Pilot Impex Product Image/Caustic Soda Lye.png"
import caustic_soda_flakes from "../assets/Pilot Impex Product Image/Caustic Soda Flakes.png"
import hydrocloric_acid from "../assets/Pilot Impex Product Image/Hydrochloric Acid.png"
import dilute_sulphuric_acid from "../assets/Pilot Impex Product Image/Dilute Sulphuric Acid.png"
import sulphuric_acid from "../assets/Pilot Impex Product Image/Sulphuric Acid.png"
import phosphoric_acid from "../assets/Pilot Impex Product Image/Phosphoric Acid.png"
import caustic_potash_flakes from "../assets/Pilot Impex Product Image/Caustic Potash Flakes.png"
import caustic_potash_lye from "../assets/Pilot Impex Product Image/Caustic Potash Lye.png"
import caustic_soda_prill from "../assets/Pilot Impex Product Image/Caustic-Soda-Prills.png"
import hydrogen_paroxide from "../assets/Pilot Impex Product Image/Hydrogen Peroxide.png"
import alu_cloride from "../assets/Pilot Impex Product Image/Aluminium Chloride.png"
import benzyle_cloride from "../assets/Pilot Impex Product Image/Benzyl Chloride.png"
import sodium_clorate from "../assets/Pilot Impex Product Image/Sodium Chlorate.png"
import methylene_chloride_mdc from "../assets/Pilot Impex Product Image/Methylene Chloride MDC.png"
import potassium_permanganate from "../assets/Pilot Impex Product Image/Potassium Permanganate.png"
import hydrazine_hydrate from "../assets/Pilot Impex Product Image/Hydrazine Hydrate.png"
import stable_bleaching_powder from "../assets/Pilot Impex Product Image/Stable Bleaching Powder.png"
import chloroform_99 from "../assets/Pilot Impex Product Image/Chloroform.png"
import sodium_hypochlorite from "../assets/Pilot Impex Product Image/Sodium Hypochlorite.png"
import poly_aluminium_chloride from "../assets/Pilot Impex Product Image/Poly Aluminium Chloride.png"
import benzaldehyde_99 from "../assets/Pilot Impex Product Image/Benzaldehyde.png"
import chlorinated_paraffin from "../assets/Pilot Impex Product Image/Chlorinated Paraffin.png"
import liquid_chlorine from "../assets/Pilot Impex Product Image/Liquid Chlorine.png"
import benzyl_alcohol from "../assets/Pilot Impex Product Image/Benzyl Alcohol.png"
import potassium_carbonate from "../assets/Pilot Impex Product Image/Potassium Carbonate.png"

const allProducts = [
  // Caustic Soda
  { name: "Caustic Soda Lye", description: "High concentration liquid caustic soda for industrial cleaning and chemical processing.", slug: "caustic-soda-lye", category: "Caustic Soda", image: caustic_soda_lye },
  { name: "Caustic Soda Flakes", description: "Pure white caustic soda flakes ideal for soap making and paper production.", slug: "caustic-soda-flakes", category: "Caustic Soda", image: caustic_soda_flakes },
  
  // Industrial Acids
  { name: "Hydrochloric Acid", description: "Technical grade hydrochloric acid for metal cleaning and chemical synthesis.", slug: "hydrochloric-acid", category: "Industrial Acids", image: hydrocloric_acid },
  { name: "Dilute Sulphuric Acid", description: "Diluted sulphuric acid solution for various industrial applications.", slug: "dilute-sulphuric-acid", category: "Industrial Acids", image: dilute_sulphuric_acid },
  { name: "Sulphuric Acid", description: "Concentrated sulphuric acid with 98% purity for manufacturing processes.", slug: "sulphuric-acid", category: "Industrial Acids", image: sulphuric_acid },
  { name: "Phosphoric Acid", description: "Food grade and technical phosphoric acid for fertilizers and beverages.", slug: "phosphoric-acid", category: "Industrial Acids", image: phosphoric_acid },
  
  // Caustic Potash
  { name: "Caustic Potash Flakes", description: "Premium quality potassium hydroxide flakes for fertilizer production.", slug: "caustic-potash-flakes", category: "Caustic Potash", image: caustic_potash_flakes },
  { name: "Caustic Potash Lye", description: "Liquid potassium hydroxide solution for chemical processing.", slug: "caustic-potash-lye", category: "Caustic Potash", image: caustic_potash_lye },
  
  // Hydrogen Peroxide
  { name: "Caustic Soda Prill", description: "Spherical caustic soda pellets for easy handling and dissolution.", slug: "caustic-soda-prill", category: "Hydrogen Peroxide", image: caustic_soda_prill },
  { name: "Hydrogen Peroxide", description: "Stabilized hydrogen peroxide for bleaching and disinfection.", slug: "hydrogen-peroxide", category: "Hydrogen Peroxide", image: hydrogen_paroxide },
  
  // Chlorination Chemical
  { name: "Aluminium Chloride", description: "Anhydrous aluminium chloride for water treatment and catalysis.", slug: "aluminium-chloride", category: "Chlorination Chemical", image: alu_cloride },
  { name: "Benzyl Chloride", description: "High purity benzyl chloride for pharmaceutical intermediates.", slug: "benzyl-chloride", category: "Chlorination Chemical", image: benzyle_cloride },
  
  // Other Chemicals
  { name: "Sodium Chlorate", description: "Technical grade sodium chlorate for paper bleaching and herbicides.", slug: "sodium-chlorate", category: "Other Chemicals", image: sodium_clorate },
  { name: "Methylene Chloride MDC", description: "Dichloromethane solvent for paint stripping and extraction.", slug: "methylene-chloride-mdc", category: "Other Chemicals", image: methylene_chloride_mdc },
  { name: "Potassium Permanganate", description: "Crystalline potassium permanganate for water treatment and oxidation.", slug: "potassium-permanganate", category: "Other Chemicals", image: potassium_permanganate },
  { name: "Hydrazine Hydrate", description: "High purity hydrazine hydrate for pharmaceutical synthesis.", slug: "hydrazine-hydrate", category: "Other Chemicals", image: hydrazine_hydrate },
  { name: "Stable Bleaching Powder", description: "Calcium hypochlorite powder for water disinfection.", slug: "stable-bleaching-powder", category: "Other Chemicals", image: stable_bleaching_powder },
  { name: "Chloroform", description: "High purity chloroform for laboratory and industrial applications.", slug: "chloroform", category: "Other Chemicals", image: chloroform_99 },
  { name: "Sodium Hypochlorite", description: "Liquid sodium hypochlorite solution for sanitization.", slug: "sodium-hypochlorite", category: "Other Chemicals", image: sodium_hypochlorite },
  { name: "Poly Aluminium Chloride", description: "Coagulant for water and wastewater treatment applications.", slug: "poly-aluminium-chloride", category: "Other Chemicals", image: poly_aluminium_chloride },
  { name: "Benzaldehyde", description: "High purity benzaldehyde for flavoring, perfumery, and pharmaceutical applications.", slug: "benzaldehyde", category: "Other Chemicals", image: benzaldehyde_99 },
  { name: "Chlorinated Paraffin", description: "Flame retardant additive for plastics and rubber industries.", slug: "chlorinated-paraffin", category: "Other Chemicals", image: chlorinated_paraffin },
  { name: "Liquid Chlorine", description: "Compressed liquid chlorine for water treatment and manufacturing.", slug: "liquid-chlorine", category: "Other Chemicals", image: liquid_chlorine },
  { name: "Benzyl Alcohol", description: "Pharmaceutical grade benzyl alcohol as solvent and preservative.", slug: "benzyl-alcohol", category: "Other Chemicals", image: benzyl_alcohol },
  { name: "Potassium Carbonate", description: "Anhydrous potassium carbonate for glass and soap production.", slug: "potassium-carbonate", category: "Other Chemicals", image: potassium_carbonate }
];

const categories = ["All", "Caustic Soda", "Industrial Acids", "Caustic Potash", "Hydrogen Peroxide", "Chlorination Chemical", "Other Chemicals"];

export default function Products() {

  useEffect(()=>{
    document.title = "Products | PILOT IMPEX - Chemical Suppliers Since 1992"
  }, [])

  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || "");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target as Node) &&
          suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter products for suggestions
  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return allProducts
      .filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.category.toLowerCase().includes(query)
      )
      .slice(0, 5); // Show max 5 suggestions
  }, [searchQuery]);

  const handleSuggestionClick = (suggestion: typeof allProducts[0]) => {
    setSearchQuery(suggestion.name);
    setSelectedCategory(suggestion.category);
    setShowSuggestions(false);
    // Optional: Focus the search input after selection
    searchInputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestion(prev => 
        prev < searchSuggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestion(prev => prev > 0 ? prev - 1 : 0);
    } else if (e.key === 'Enter' && searchSuggestions.length > 0) {
      e.preventDefault();
      const selectedSuggestion = searchSuggestions[activeSuggestion];
      if (selectedSuggestion) {
        handleSuggestionClick(selectedSuggestion);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const filteredProducts = useMemo(() => {
    let products = allProducts;

    if (selectedCategory !== "All") {
      products = products.filter(product => product.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      products = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return products;
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="pt-24">
        <Breadcrumb 
          items={[
            { label: 'Home', to: '/' },
            { label: 'Products' }
          ]} 
        />
      </div>

      {/* Hero Section */}
      <section className="pt-12 pb-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              Our Products
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Comprehensive range of high-quality chemicals for various industrial applications.
            </p>
          </div>
          
          {/* Search */}
          <div className="max-w-md mx-auto">
            <div className="relative" ref={searchInputRef}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                ref={searchInputRef}
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                  setActiveSuggestion(0);
                }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={handleKeyDown}
                className="pl-10 border-border focus:border-primary focus:ring-1 focus:ring-primary/20"
              />
              
              {/* Search Suggestions */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div 
                  ref={suggestionsRef}
                  className="absolute z-10 w-full mt-1 bg-background border border-border rounded-md shadow-lg overflow-hidden"
                >
                  {searchSuggestions.map((suggestion, index) => (
                    <div
                      key={`${suggestion.slug}-${index}`}
                      className={`px-4 py-2 cursor-pointer hover:bg-muted/50 transition-colors ${
                        index === activeSuggestion ? 'bg-muted/30' : ''
                      }`}
                      onClick={() => handleSuggestionClick(suggestion)}
                      onMouseEnter={() => setActiveSuggestion(index)}
                    >
                      <div className="font-medium">{suggestion.name}</div>
                      <div className="text-xs text-muted-foreground">{suggestion.category}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full border-2 transition-colors duration-200 ${
                  selectedCategory === category 
                    ? 'border-primary' 
                    : 'border-border hover:border-primary/60 hover:bg-accent/50'
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {filteredProducts.length > 0 ? (
            <>
              <div className="text-center mb-8">
                <p className="text-muted-foreground">
                  Showing {filteredProducts.length} products
                  {selectedCategory !== "All" && ` in ${selectedCategory}`}
                  {searchQuery && ` matching "${searchQuery}"`}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product, index) => (
                  <div key={product.slug} className="stagger-fade" style={{ animationDelay: `${index * 0.05}s` }}>
                    <ProductCard {...product} />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No products found matching your criteria.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
                className="mt-4"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Can't Find Product Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border-2 border-gray-900">
            <div className="md:flex">
              {/* Left side - Blue background */}
              <div className="md:w-1/2 bg-[#2A6F97] p-8 flex flex-col justify-center">
                <div className="w-16 h-1 bg-white/80 mx-auto md:mx-0 mb-6 rounded-full"></div>
                <h3 className="text-2xl md:text-3xl font-heading font-bold text-white mb-4 text-center md:text-left">
                  Can't Find Your Product?
                </h3>
                <p className="text-white/90 mb-8 text-lg text-center md:text-left">
                  We offer a wide range of chemical products beyond what's listed here.
                </p>
              </div>
              
              {/* Right side - White background with CTA */}
              <div className="md:w-1/2 p-8 flex flex-col justify-center">
                <p className="text-gray-600 mb-8 text-center md:text-left">
                  Contact us with your specific requirements, and our team will be happy to assist you.
                </p>
                <div className="text-center md:text-left">
                  <Button asChild size="lg" className="bg-[#2A6F97] hover:bg-[#1d4d6b] text-white px-8 py-6 text-lg font-medium group transition-all hover:shadow-lg">
                    <a href="/contact?inquiryType=product&product=Custom+Product+Inquiry" className="relative">
                      Contact Us
                      <span className="absolute bottom-2 left-1/2 w-0 h-0.5 bg-white group-hover:w-4/5 group-hover:left-[10%] transition-all duration-300"></span>
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
