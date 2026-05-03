import type { ProductSpecification } from "@/data/productGroups";

interface SpecificationTableProps {
  specifications: ProductSpecification[];
  caution?: string;
}

export default function SpecificationTable({ specifications, caution }: SpecificationTableProps) {
  return (
    <div>
      {/* Section label */}
      <div className="bg-slate-100 px-3.5 py-2 border-b border-slate-200 text-[11px] font-semibold text-blue-600 uppercase tracking-[0.06em]">
        Specifications
      </div>

      {/* Table — same structure: Sr No | Characteristics | Specification */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#1e3a5f]">
            <th className="text-white font-medium text-xs px-3.5 py-2.5 text-left tracking-wide w-10">Sr No</th>
            <th className="text-white font-medium text-xs px-3.5 py-2.5 text-left tracking-wide">Characteristics</th>
            <th className="text-white font-medium text-xs px-3.5 py-2.5 text-left tracking-wide">Specification</th>
          </tr>
        </thead>
        <tbody>
          {specifications.map((spec, index) => (
            <tr
              key={spec.srNo}
              className={`border-b border-slate-100 ${index % 2 === 1 ? "bg-slate-50" : "bg-white"}`}
            >
              <td className="px-3.5 py-2 text-xs text-slate-400 align-middle">{spec.srNo}</td>
              <td className="px-3.5 py-2 text-[13px] text-gray-700 align-middle">{spec.characteristic}</td>
              <td className="px-3.5 py-2 text-[13px] font-semibold text-slate-900 align-middle">{spec.specification}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Caution banner */}
      {caution && (
        <div className="flex items-start gap-2 px-3.5 py-2 bg-orange-50 border-t border-orange-200">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 mt-0.5">
            <path d="M8 1.5L15 14H1L8 1.5z" stroke="#c2410c" strokeWidth="1.2" fill="#fff7ed"/>
            <text x="8" y="12" fontSize="7" fill="#c2410c" fontWeight="700" textAnchor="middle">!</text>
          </svg>
          <p className="text-xs text-orange-800 leading-relaxed">
            <span className="font-bold">Caution:</span> {caution}
          </p>
        </div>
      )}
    </div>
  );
}
