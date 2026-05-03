import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { CatalogErrorState, CatalogLoadingState } from "@/components/CatalogState";
import ProductGroupCard from "@/components/ProductGroupCard";
import { Button } from "@/components/ui/button";
import { useCatalog } from "@/hooks/useCatalog";

export default function ProductGroups() {
  const { data: catalog, isError, isLoading, refetch } = useCatalog();

  useEffect(() => {
    document.title = "Products | PILOT IMPEX - Chemical Suppliers Since 1992";
    window.scrollTo(0, 0);
  }, []);

  const groups = catalog?.groups ?? [];
  const totalProducts = groups.reduce((sum, group) => sum + group.products.length, 0);

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Page Header */}
      <section className="page-header pt-28 pb-8">
        <div className="container mx-auto px-4 text-center">
          <span className="section-badge">Our Product Range</span>
          <h1 className="page-header-title">Product Groups</h1>
          <p className="page-header-subtitle">
            Explore our {groups.length} product groups with {totalProducts}+ industrial chemicals
          </p>
        </div>
      </section>

      {isLoading ? (
        <CatalogLoadingState />
      ) : isError ? (
        <CatalogErrorState onRetry={() => refetch()} />
      ) : (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {groups.map((group, index) => (
                <div
                  key={group.slug}
                  className="stagger-fade"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProductGroupCard group={group} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Can't Find Product CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-card rounded-xl shadow-lg overflow-hidden border-2 border-primary-dark">
            <div className="md:flex">
              <div className="md:w-1/2 bg-brand-accent p-8 flex flex-col justify-center">
                <div className="w-16 h-1 bg-white/80 mx-auto md:mx-0 mb-6 rounded-full"></div>
                <h3 className="text-2xl md:text-3xl font-heading font-bold text-white mb-4 text-center md:text-left">
                  Can't Find Your Product?
                </h3>
                <p className="text-white/80 text-center md:text-left">
                  We supply 100+ chemical products. Contact us for custom requirements.
                </p>
              </div>
              <div className="md:w-1/2 p-8 flex flex-col justify-center">
                <p className="text-muted-foreground mb-8 text-center md:text-left">
                  Contact us with your specific requirements, and our team will be happy to assist you.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button asChild size="lg" className="bg-brand-accent hover:bg-brand-accent-dark text-white">
                    <Link to="/contact?inquiryType=product&product=Custom+Product+Inquiry">
                      Contact Us <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => {
                      const message = "Hello, I'm looking for a specific chemical product. Can you help?";
                      window.open(`https://wa.me/918140444873?text=${encodeURIComponent(message)}`, "_blank");
                    }}
                  >
                    <MessageCircle className="mr-2 w-4 h-4" /> WhatsApp
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
