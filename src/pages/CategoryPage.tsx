import { useParams, Link } from "react-router-dom";
import { categories } from "@/lib/calculators";
import { ArrowRight } from "lucide-react";

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();

  const category = categories.find((c) => c.id === categoryId);

  if (!category) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Category not found</h1>
        <Link to="/" className="text-primary hover:underline">
          Go back home
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-10 max-w-4xl">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-primary">Home</Link>
        <ArrowRight className="h-3 w-3" />
        <span className="font-medium">{category.name}</span>
      </nav>

      <h1 className="text-3xl font-bold mb-6">{category.name}</h1>
      <p className="text-muted-foreground mb-8">{category.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {category.calculators.map((calc) => (
          <div key={calc.id} className="bg-white rounded-xl border p-6 shadow-sm">
            <h3 className="font-semibold text-lg mb-2">{calc.name}</h3>
            <p className="text-sm text-slate-600 mb-4">{calc.description}</p>
            <Link
              to={`/calculators/${calc.id}`}
              className="inline-flex items-center gap-2 text-teal-600 font-bold hover:gap-3 transition-all"
            >
              Use Tool <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
