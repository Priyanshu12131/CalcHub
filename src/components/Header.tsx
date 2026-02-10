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

          {/* Mega menu trigger */}
          <div
            className="relative"
            onMouseEnter={() => setMegaOpen(true)}
            onMouseLeave={() => setMegaOpen(false)}
          >
            <button className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary ${location.pathname.startsWith("/calculators") ? "text-primary" : "text-foreground"}`}>
              Our Calculators <ChevronDown className={`h-4 w-4 transition-transform ${megaOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {megaOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-1/2 -translate-x-1/2 top-full pt-2"
                >
                  <div className="w-[700px] rounded-xl border bg-card shadow-xl p-6 grid grid-cols-3 gap-6">
                    {categories.map((cat) => (
                      <div key={cat.id}>
                        <div className="flex items-center gap-2 mb-3">
                          <cat.icon className="h-4 w-4 text-primary" />
                          <span className="font-semibold text-sm text-foreground">{cat.name}</span>
                        </div>
                        <ul className="space-y-1.5">
                          {cat.calculators.map((calc) => (
                            <li key={calc.id}>
                              <Link
                                to={calc.path}
                                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                                onClick={() => setMegaOpen(false)}
                              >
                                {calc.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
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
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden border-t bg-card overflow-hidden"
          >
            <div className="container py-4 space-y-4">
              <SmartSearch variant="header" onSelect={() => setMobileOpen(false)} />
              <nav className="flex flex-col gap-3">
                <Link to="/" className={navLinkClass("/")} onClick={() => setMobileOpen(false)}>Home</Link>
                <Link to="/about" className={navLinkClass("/about")} onClick={() => setMobileOpen(false)}>About Us</Link>
                <Link to="/dashboard" className={navLinkClass("/dashboard")} onClick={() => setMobileOpen(false)}>Analytics</Link>
                {categories.map((cat) => (
                  <div key={cat.id}>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{cat.name}</span>
                    <div className="ml-3 mt-1 flex flex-col gap-1.5">
                      {cat.calculators.map((calc) => (
                        <Link key={calc.id} to={calc.path} className="text-sm text-foreground hover:text-primary" onClick={() => setMobileOpen(false)}>
                          {calc.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
                <Link to="/contact" className={navLinkClass("/contact")} onClick={() => setMobileOpen(false)}>Contact Us</Link>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
