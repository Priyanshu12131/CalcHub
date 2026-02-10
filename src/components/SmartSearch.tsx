import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { searchCalculators, CalculatorInfo } from "@/lib/calculators";
import { motion, AnimatePresence } from "framer-motion";

interface SmartSearchProps {
  variant?: "hero" | "header";
  onSelect?: () => void;
}

export function SmartSearch({ variant = "hero", onSelect }: SmartSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CalculatorInfo[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setResults(searchCalculators(query));
    setSelectedIndex(-1);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(calc: CalculatorInfo) {
    navigate(calc.path);
    setQuery("");
    setOpen(false);
    onSelect?.();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      handleSelect(results[selectedIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  const isHero = variant === "hero";

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        className={`flex items-center rounded-xl border bg-card shadow-sm transition-shadow focus-within:shadow-md focus-within:ring-2 focus-within:ring-primary/30 ${
          isHero ? "h-14 px-5 text-base" : "h-10 px-3 text-sm"
        }`}
      >
        <Search className={`shrink-0 text-muted-foreground ${isHero ? "h-5 w-5 mr-3" : "h-4 w-4 mr-2"}`} />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search calculators... e.g. mortgage, GPA, salary"
          className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
        />
        {query && (
          <button onClick={() => { setQuery(""); inputRef.current?.focus(); }} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {open && query && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 z-50 mt-2 rounded-xl border bg-card shadow-lg overflow-hidden"
          >
            <ul className="py-2 max-h-80 overflow-y-auto">
              {results.map((calc, i) => (
                <li key={calc.id}>
                  <button
                    onClick={() => handleSelect(calc)}
                    onMouseEnter={() => setSelectedIndex(i)}
                    className={`w-full text-left px-4 py-3 flex flex-col gap-0.5 transition-colors ${
                      i === selectedIndex ? "bg-primary/10" : "hover:bg-muted"
                    }`}
                  >
                    <span className="font-medium text-foreground">{calc.name}</span>
                    <span className="text-xs text-muted-foreground">{calc.category} · {calc.description}</span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
        {open && query && results.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute top-full left-0 right-0 z-50 mt-2 rounded-xl border bg-card shadow-lg p-4 text-center text-sm text-muted-foreground"
          >
            No calculators found for "{query}"
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
