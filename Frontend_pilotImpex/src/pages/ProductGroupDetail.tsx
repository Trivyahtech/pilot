import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Package } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ProductSection from "@/components/ProductSection";
import { Button } from "@/components/ui/button";
import { getGroupBySlug } from "@/data/productGroups";

export default function ProductGroupDetail() {
  const { groupSlug } = useParams<{ groupSlug: string }>();
  const group = groupSlug ? getGroupBySlug(groupSlug) : undefined;

  useEffect(() => {
    if (group) {
      document.title = `${group.name} | Pilot Impex`;
    } else {
      document.title = "Product Group Not Found | Pilot Impex";
    }
    window.scrollTo(0, 0);
  }, [group]);

  if (!group) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center bg-muted/30 pt-20">
          <div className="text-center space-y-4">
            <Package className="w-16 h-16 text-muted-foreground mx-auto" />
            <h1 className="text-3xl font-heading font-bold text-foreground">Group Not Found</h1>
            <p className="text-muted-foreground">The product group you're looking for doesn't exist.</p>
            <Button asChild>
              <Link to="/products"><ArrowLeft className="mr-2 w-4 h-4" /> Back to Products</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="pt-24">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
            <span>/</span>
            <span className="text-foreground font-medium">{group.name}</span>
          </div>
        </div>

        {/* ═══ PAGE HEADER (redesigned) ═══ */}
        <section className="pt-2 pb-6">
          <div className="container mx-auto px-4">
            <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
              <Link to="/products"><ArrowLeft className="mr-1 w-4 h-4" /> All Products</Link>
            </Button>

            <div className="mb-6 pb-4 border-b border-slate-200">
              <p className="text-[11px] uppercase tracking-[0.1em] text-slate-400 mb-1">
                Chemical Group
              </p>
              <h1 className="text-2xl font-bold text-[#1e3a5f]">
                {group.name}
              </h1>
              <p className="text-[13px] text-slate-500 mt-1.5 leading-relaxed">
                {group.description}
              </p>
              <div className="h-[3px] w-10 bg-blue-600 rounded-sm mt-2.5" />
            </div>

            {/* Quick Jump Nav */}
            {group.products.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {group.products.map((product) => (
                  <a
                    key={product.slug}
                    href={`#${product.slug}`}
                    className="text-sm px-3 py-1.5 rounded-full border border-border hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-all duration-200"
                  >
                    {product.name}
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ═══ PRODUCTS GRID (2-col on desktop) ═══ */}
        <section className="py-6">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {group.products.map((product, index) => (
                <div
                  key={product.slug}
                  className="stagger-fade"
                  style={{ animationDelay: `${index * 0.12}s` }}
                >
                  <ProductSection product={product} groupSlug={group.slug} />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
