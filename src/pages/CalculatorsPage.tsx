import { Link } from "react-router-dom";
import { categories } from "@/lib/calculators";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const CalculatorsPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="container max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-slate-900 mb-4">All Calculators</h1>
          <p className="text-slate-600 max-w-2xl">
            Browse our complete collection of financial, educational, and utility calculators. Click on any category to explore its tools.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, idx) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-teal-50 rounded-lg">
                  <category.icon className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="font-bold text-lg text-slate-900">{category.name}</h3>
              </div>

              <p className="text-sm text-slate-600 mb-4">
                {category.description}
              </p>

              <div className="space-y-2 mb-6">
                {category.calculators.slice(0, 3).map((calc) => (
                  <p key={calc.id} className="text-xs text-slate-500">
                    • {calc.name}
                  </p>
                ))}
                {category.calculators.length > 3 && (
                  <p className="text-xs text-slate-400">
                    + {category.calculators.length - 3} more...
                  </p>
                )}
              </div>

              <Link
                to={`/category/${category.id}`}
                className="inline-flex items-center gap-2 text-teal-600 font-semibold hover:gap-3 transition-all"
              >
                Explore <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalculatorsPage;
