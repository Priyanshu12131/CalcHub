import { Link } from "react-router-dom";
import { SmartSearch } from "@/components/SmartSearch";
import { categories } from "@/lib/calculators";
import { ArrowRight, Star, TrendingUp, Sliders, ChartBar, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const featured = [
  {
    id: "mortgage",
    name: "Mortgage Calculator",
    description: "Estimate your monthly repayments & total interest for Irish property.",
      path: "/calculators/mortgage",
  },
  {
    id: "loan",
    name: "Personal Loan Tool",
    description: "Plan your finances with accurate monthly payment breakdowns.",
    path: "/calculators/loan",
  },
  {
    id: "vat",
    name: "VAT Calculator",
    description: "Calculate VAT instantly using standard Irish rates (23%).",
    path: "/calculators/vat",
  },
];

const featureBlocks = [
  {
    icon: Sliders,
    title: "Interactive Sliders",
    text: "Adjust values and watch results update in real time with precision.",
  },
  {
    icon: ChartBar,
    title: "Fintech Grade Visuals",
    text: "Clean, professional data presentation for better financial planning.",
  },
  {
    icon: CheckCircle,
    title: "Irish Market Accuracy",
    text: "Tools specifically calibrated for Irish tax, property, and banking.",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* ===== HERO SECTION (Blue/Teal Fintech Vibe) ===== */}
      <section className="relative overflow-hidden bg-slate-900 pt-24 pb-32 text-center">
        {/* Background decorative element */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-teal-500 via-transparent to-transparent"></div>
        </div>

        <div className="container relative z-10 mx-auto px-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6"
          >
            Calculate Smarter <span className="text-teal-400">Every Day</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto"
          >
            Fast, free, and accurate tools for finance, tax, and property—built specifically for Ireland.
          </motion.p>

          {/* Search Bar - Main Connection Point */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white p-2 rounded-2xl shadow-2xl shadow-teal-900/20">
              <SmartSearch variant="hero" />
            </div>
          </motion.div>

          <p className="text-sm text-slate-400 mt-6">
            Try searching: <span className="text-teal-400 font-medium italic">“mortgage”, “vat rate”, “loan emi”</span>
          </p>
        </div>
      </section>

      {/* ===== POPULAR TOOLS ===== */}
      <section className="container -mt-16 relative z-20 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((tool) => (
            <motion.div
              key={tool.id}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="h-12 w-12 bg-teal-50 rounded-xl flex items-center justify-center mb-6 text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                <Star className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-xl text-slate-900 mb-2">{tool.name}</h3>
              <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                {tool.description}
              </p>
              <Link
                to={tool.path}
                className="inline-flex items-center gap-2 text-teal-600 font-bold hover:gap-3 transition-all"
              >
                Use Tool <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== FEATURE HIGHLIGHTS ===== */}
      <section className="bg-white py-20 border-y border-slate-200">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Powerful Financial Utilities</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Built with modern fintech standards for clarity and speed.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {featureBlocks.map((block, i) => (
              <div key={i} className="text-center group">
                <div className="inline-flex p-4 bg-slate-50 rounded-2xl text-teal-600 mb-6 group-hover:scale-110 transition-transform">
                  <block.icon className="h-8 w-8" />
                </div>
                <h4 className="font-bold text-lg text-slate-900 mb-2">{block.title}</h4>
                <p className="text-slate-600 text-sm leading-relaxed">{block.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES SECTION ===== */}
      <section className="container py-24">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Browse by Category</h2>
            <p className="text-slate-600">Find specialized tools across all sectors of Irish life and finance.</p>
          </div>
          <Link to="/calculators" className="text-teal-600 font-bold flex items-center gap-2 border-b-2 border-teal-100 hover:border-teal-600 transition-all pb-1">
            View All Categories
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <motion.div
              key={cat.id}
              whileHover={{ scale: 1.02 }}
              className="group bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:border-teal-200 transition-all"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-slate-50 rounded-xl text-slate-600 group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
                  <cat.icon className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-slate-900">{cat.name}</h3>
              </div>
              <p className="text-sm text-slate-500 mb-6 line-clamp-2">
                {cat.description}
              </p>
              <Link
                to={`/category/${cat.id}`}
                className="text-sm font-bold text-slate-400 group-hover:text-teal-600 flex items-center gap-2"
              >
                Explore <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="container mb-24">
        <div className="bg-teal-600 rounded-[2.5rem] py-16 px-8 text-center text-white relative overflow-hidden shadow-2xl shadow-teal-900/30">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Ready to start calculating?</h2>
            <p className="text-teal-100 text-lg mb-10 max-w-xl mx-auto opacity-90">
              Join thousands of users planning their future with CalcIreland's free tools.
            </p>
            <Link
              to="/calculators"
              className="inline-block bg-white text-teal-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-slate-100 transition-colors shadow-lg"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;