import { FileDown, MessageCircle } from "lucide-react";
import SpecificationTable from "@/components/SpecificationTable";
import type { Product } from "@/data/productGroups";

interface ProductSectionProps {
  product: Product;
  groupSlug: string;
}

export default function ProductSection({ product, groupSlug }: ProductSectionProps) {
  const handleEnquiry = () => {
    window.location.href = `/contact?product=${encodeURIComponent(product.name)}`;
  };

  const handleWhatsApp = () => {
    const message = `Hello, I'm interested in ${product.name}. Could you please provide more information?`;
    const phoneNumber = "918140444873";
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  // Defaults for optional props
  const inStock = product.inStock ?? true;
  const category = product.category ?? "Industrial Chemical";
  const documents = product.documents ?? [];

  // Derive physical form from specs or name
  const physicalForm = (() => {
    const formSpec = product.specifications.find(
      (s) => s.characteristic.toLowerCase().includes("form") || s.characteristic.toLowerCase().includes("physical state")
    );
    if (formSpec) return `${formSpec.specification} Form`;
    if (product.name.toLowerCase().includes("lye") || product.name.toLowerCase().includes("liquid")) return "Liquid Form";
    if (product.name.toLowerCase().includes("flakes") || product.name.toLowerCase().includes("powder")) return "Solid Form";
    return category;
  })();

  return (
    <div id={product.slug} className="scroll-mt-24 h-full">
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col h-full shadow-sm hover:shadow-md transition-shadow duration-300">

        {/* ═══ 1. CARD HEADER BAND (dark navy) ═══ */}
        <div className="bg-[#1e3a5f] flex items-stretch">
          {/* Left — image box */}
          <div className="w-[90px] flex-shrink-0 bg-[#0d1f3c] flex items-center justify-center p-3">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="max-h-16 w-auto object-contain drop-shadow-lg"
              />
            ) : (
              <div className="w-12 h-16 rounded bg-slate-700/50" />
            )}
          </div>

          {/* Right — title + meta */}
          <div className="flex-1 p-3.5 min-w-0">
            <p className="text-[10px] uppercase tracking-[0.08em] text-blue-300 mb-1">
              {physicalForm}
            </p>
            <h3 className="text-[15px] font-semibold text-white leading-tight mb-1.5 truncate" title={product.name}>
              {product.name}
            </h3>
            <div className="flex items-center gap-2.5 flex-wrap">
              {product.price && (
                <>
                  <span className="text-lg font-bold text-white">
                    {product.price}
                    {product.unit && <span className="text-[11px] font-normal text-blue-300 ml-1">/{product.unit}</span>}
                  </span>
                  {product.moq && (
                    <span className="text-[10px] text-slate-400">MOQ: {product.moq}</span>
                  )}
                </>
              )}
              {inStock ? (
                <span className="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#E1F5EE] text-[#0F6E56] border border-[#9FE1CB]">
                  ● In Stock
                </span>
              ) : (
                <span className="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#FCEBEB] text-[#A32D2D]">
                  ● Out of Stock
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ═══ 2. SPECIFICATIONS TABLE ═══ */}
        <SpecificationTable
          specifications={product.specifications}
          caution={product.caution}
        />

        {/* ═══ 3. APPLICATIONS BULLET LIST ═══ */}
        <div className="bg-slate-50 px-3.5 py-2 border-t border-b border-slate-200 text-[11px] font-semibold text-blue-600 uppercase tracking-[0.06em]">
          Applications
        </div>
        <div className="px-3.5 py-2.5 flex-1">
          <p className="text-xs text-slate-500 mb-2">Major Consuming Industries:</p>
          <div className="space-y-1">
            {product.applications.map((app) => (
              <div key={app} className="flex items-center gap-2 py-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#1e3a5f] flex-shrink-0" />
                <span className="text-[13px] text-gray-700">{app}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ 4. CTA BUTTONS ═══ */}
        <div className="border-t border-slate-200 px-3.5 py-3 space-y-2 mt-auto">
          {documents.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {documents.map((document) => (
                <a
                  key={document.id}
                  href={document.url}
                  target="_blank"
                  rel="noreferrer"
                  className="min-w-0 inline-flex items-center justify-center gap-1.5 py-2 px-2 text-xs text-slate-600 bg-transparent border border-slate-200 rounded-lg hover:border-blue-300 hover:text-blue-600 transition-colors"
                  title={document.name || document.originalName}
                >
                  <FileDown className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{document.name || document.originalName}</span>
                </a>
              ))}
            </div>
          )}

          {/* Row 2 — Enquiry + WhatsApp (primary) */}
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={handleEnquiry}
              className="inline-flex items-center justify-center gap-2 py-2.5 text-[13px] font-medium text-white bg-[#1e3a5f] hover:bg-[#162d4d] rounded-lg transition-colors cursor-pointer"
            >
              <MessageCircle className="w-3 h-3" />
              Enquiry
            </button>
            <button
              onClick={handleWhatsApp}
              className="inline-flex items-center justify-center gap-2 py-2.5 text-[13px] font-medium text-white bg-[#25D366] hover:bg-[#1fba59] rounded-lg transition-colors cursor-pointer"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.116.55 4.107 1.513 5.84L0 24l6.348-1.486A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.82 0-3.535-.478-5.02-1.313l-.36-.213-3.73.874.914-3.62-.234-.372A9.96 9.96 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/></svg>
              WhatsApp
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
