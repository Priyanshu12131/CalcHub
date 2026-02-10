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
              <li><Link to="/calculators" className="hover:text-primary transition-colors">All Calculators</Link></li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Popular Categories</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link to={`/category/${cat.id}`} className="hover:text-primary transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Calculator Sections by Category */}
        <div className="mt-10 pt-10 border-t">
          <h3 className="font-semibold text-base mb-6">Calculators by Category</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat) => (
              <div key={cat.id}>
                <Link to={`/category/${cat.id}`}>
                  <h4 className="font-semibold text-sm mb-3 text-primary hover:text-primary/80 transition-colors">
                    {cat.name}
                  </h4>
                </Link>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  {cat.calculators.map((calc) => (
                    <li key={calc.id}>
                      <Link to={`/calculators/${calc.id}`} className="hover:text-primary transition-colors line-clamp-1">
                        {calc.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 pt-6 border-t text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} CalcHub. All calculations are for informational purposes only.
        </div>
      </div>
    </footer>
  );
}
