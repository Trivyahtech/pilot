import { useState, useMemo, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import Navigation from "@/components/Navigation";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import { CatalogErrorState, CatalogLoadingState } from "@/components/CatalogState";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Breadcrumb from "@/components/Breadcrumb";
import { flattenCatalogProducts, type CatalogProduct, useCatalog } from "@/hooks/useCatalog";

export default function Products() {
  const { data: catalog, isError, isLoading, refetch } = useCatalog();
  const groups = useMemo(() => catalog?.groups ?? [], [catalog?.groups]);
  const allProducts = useMemo(() => flattenCatalogProducts(groups), [groups]);
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(allProducts.map((product) => product.category || product.groupName)))],
    [allProducts]
  );

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
        (product.category || product.groupName).toLowerCase().includes(query)
      )
      .slice(0, 5); // Show max 5 suggestions
  }, [allProducts, searchQuery]);

  const handleSuggestionClick = (suggestion: CatalogProduct) => {
    setSearchQuery(suggestion.name);
    setSelectedCategory(suggestion.category || suggestion.groupName);
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
      products = products.filter(product => (product.category || product.groupName) === selectedCategory);
    }

    if (searchQuery.trim()) {
      products = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.category || product.groupName).toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return products;
  }, [allProducts, selectedCategory, searchQuery]);

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
                      <div className="text-xs text-muted-foreground">{suggestion.category || suggestion.groupName}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {isLoading ? (
        <CatalogLoadingState />
      ) : isError ? (
        <CatalogErrorState onRetry={() => refetch()} />
      ) : (
        <>
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
                        <ProductCard
                          name={product.name}
                          description={product.description || `${product.name} from ${product.groupName}.`}
                          image={product.image}
                          slug={product.slug}
                          category={product.category || product.groupName}
                          to={product.detailPath}
                        />
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
        </>
      )}

      {/* Can't Find Product Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-card rounded-xl shadow-lg overflow-hidden border-2 border-primary-dark">
            <div className="md:flex">
              {/* Left side - Blue background */}
              <div className="md:w-1/2 bg-brand-accent p-8 flex flex-col justify-center">
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
                <p className="text-muted-foreground mb-8 text-center md:text-left">
                  Contact us with your specific requirements, and our team will be happy to assist you.
                </p>
                <div className="text-center md:text-left">
                  <Button asChild size="lg" className="bg-brand-accent hover:bg-brand-accent-dark text-white px-8 py-6 text-lg font-medium group transition-all hover:shadow-lg">
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
