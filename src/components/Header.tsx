import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, Calculator } from "lucide-react";
import { categories } from "@/lib/calculators";
import { SmartSearch } from "@/components/SmartSearch";
import { AnimatePresence, motion } from "framer-motion";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const location = useLocation();

  const navLinkClass = (path: string) =>
    `text-sm font-medium transition-colors hover:text-primary ${
      location.pathname === path ? "text-primary" : "text-foreground"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Calculator className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">
            Calc<span className="text-primary">Hub</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-6">
          <Link to="/" className={navLinkClass("/")}>Home</Link>
          <Link to="/about" className={navLinkClass("/about")}>About Us</Link>

          {/* Mega menu trigger - Categories only */}
          <div
            className="relative"
            onMouseEnter={() => setMegaOpen(true)}
            onMouseLeave={() => setMegaOpen(false)}
          >
            <button className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary ${location.pathname.startsWith("/calculators") || location.pathname.startsWith("/category") ? "text-primary" : "text-foreground"}`}>
              Categories <ChevronDown className={`h-4 w-4 transition-transform ${megaOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {megaOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-full pt-2"
                >
                  <div className="rounded-xl border bg-card shadow-xl p-4">
                    <ul className="space-y-2 min-w-max">
                      {categories.map((cat) => (
                        <li key={cat.id}>
                          <Link
                            to={`/category/${cat.id}`}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-primary hover:bg-accent transition-colors"
                            onClick={() => setMegaOpen(false)}
                          >
                            <cat.icon className="h-4 w-4" />
                            {cat.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link to="/dashboard" className={navLinkClass("/dashboard")}>Analytics</Link>
          <Link to="/contact" className={navLinkClass("/contact")}>Contact Us</Link>
        </nav>

        {/* Desktop search */}
        <div className="hidden lg:block w-64">
          <SmartSearch variant="header" />
        </div>

        {/* Mobile hamburger */}
        <button className="lg:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
            className="lg:hidden border-t bg-card"
          >
            <div className="container py-4 space-y-3">
              <Link to="/" className="block px-4 py-2 text-sm font-medium hover:text-primary transition-colors">Home</Link>
              <Link to="/about" className="block px-4 py-2 text-sm font-medium hover:text-primary transition-colors">About Us</Link>
              
              {/* Mobile Categories */}
              <div className="px-4 py-2">
                <p className="text-sm font-medium mb-2">Categories</p>
                <ul className="space-y-2 ml-2">
                  {categories.map((cat) => (
                    <li key={cat.id}>
                      <Link
                        to={`/category/${cat.id}`}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                        onClick={() => setMobileOpen(false)}
                      >
                        <cat.icon className="h-4 w-4" />
                        {cat.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <Link to="/dashboard" className="block px-4 py-2 text-sm font-medium hover:text-primary transition-colors">Analytics</Link>
              <Link to="/contact" className="block px-4 py-2 text-sm font-medium hover:text-primary transition-colors">Contact Us</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
