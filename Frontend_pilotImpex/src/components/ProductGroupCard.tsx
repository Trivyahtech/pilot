import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ProductGroup } from "@/data/productGroups";

interface ProductGroupCardProps {
  group: ProductGroup;
}

export default function ProductGroupCard({ group }: ProductGroupCardProps) {
  const firstImage = group.products[0]?.image;

  return (
    <Link to={`/products/${group.slug}`} className="block group">
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/20 hover:-translate-y-1 h-full">
        {/* Image area */}
        <div className="relative h-48 bg-gradient-to-br from-primary/10 to-brand-accent/10 overflow-hidden">
          {firstImage ? (
            <img
              src={firstImage}
              alt={group.name}
              className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-4xl font-heading font-bold text-primary/20">{group.name[0]}</span>
            </div>
          )}
          <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
            {group.products.length} {group.products.length === 1 ? "Product" : "Products"}
          </Badge>
        </div>

        <CardContent className="p-6">
          <h3 className="font-heading font-semibold text-xl text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
            {group.name}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-4">
            {group.description}
          </p>
          <div className="flex items-center text-primary text-sm font-medium">
            <span>View Products</span>
            <ArrowRight className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
