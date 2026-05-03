import { Link } from "react-router-dom";
import { ArrowRight, Beaker } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

interface ProductCardProps {
  name: string;
  description: string;
  image?: string;
  slug: string;
  category?: string;
}

export default function ProductCard({ name, description, image, slug, category }: ProductCardProps) {
  return (
    <Link to={`/products/${slug}`} className="block h-full">
      <Card className="group relative overflow-hidden h-full bg-gradient-to-br from-card to-card/80 hover:shadow-xl transition-all duration-300 border border-border/50 hover:border-primary/30">
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 z-0" />
        {image ? (
          <img 
            src={image} 
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
            <Beaker className="w-16 h-16 text-primary/50 group-hover:text-primary/70 transition-colors duration-300" />
          </div>
        )}
        {category && (
          <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm text-foreground px-3 py-1 rounded-full text-xs font-medium shadow-sm border border-border/50">
            {category}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <CardContent className="p-6 pt-4">
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <h3 className="font-heading font-semibold text-xl text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
              {name}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
              {description}
            </p>
          </div>
          
          <Button 
            variant="outline" 
            className="mt-6 w-full group/btn border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 hover:text-foreground transition-all duration-300 relative z-10"
            onClick={(e) => e.stopPropagation()}
            asChild
          >
            <div className="flex items-center justify-center gap-2 cursor-pointer">
              <span className="relative inline-flex flex-col items-center">
                <span>View Details</span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary/60 group-hover/btn:w-full transition-all duration-300"></span>
              </span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
            </div>
          </Button>
        </div>
      </CardContent>
      
        {/* Glow effect on hover */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg" />
      </Card>
    </Link>
  );
}