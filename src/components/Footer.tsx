import { Link } from "react-router-dom";
import { Calculator } from "lucide-react";
import { categories } from "@/lib/calculators";

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Calculator className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-display text-lg font-bold">
                Calc<span className="text-primary">Hub</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Free, instant calculators for finance, tax, education, property, and more. No signup required.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link to="/dashboard" className="hover:text-primary transition-colors">Analytics</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Categories</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link to={`/category/${cat.id}`} className="hover:text-primary transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t text-center text-xs text-muted-foreground">
          © 2026 CalcHub. All calculations are for informational purposes only.
        </div>
      </div>
    </footer>
  );
}
