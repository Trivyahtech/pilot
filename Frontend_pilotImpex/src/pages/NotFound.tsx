import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {

    document.title = "404 Page Not Found"

    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 flex items-center justify-center bg-muted/30 pt-20">
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-heading font-bold text-primary">404</h1>
          <p className="text-xl text-muted-foreground">Oops! Page not found</p>
          <Button asChild variant="default" size="lg">
            <Link to="/" className="inline-flex items-center gap-2">
              <Home className="w-4 h-4" />
              Return to Home
            </Link>
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
