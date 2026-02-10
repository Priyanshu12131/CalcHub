import { motion } from "framer-motion";
import { Calculator, Target, Users, Zap } from "lucide-react";

const About = () => {
  const values = [
    { icon: Calculator, title: "Free & Accessible", description: "All calculators are completely free, with no signup or hidden fees." },
    { icon: Zap, title: "Instant Results", description: "Real-time calculations with dynamic charts — no waiting, no page reloads." },
    { icon: Target, title: "Accuracy First", description: "Built with precision in mind. Clear inputs, transparent formulas, reliable outputs." },
    { icon: Users, title: "Built for Everyone", description: "Whether you're a student, homebuyer, or business owner — we've got a calculator for you." },
  ];

  return (
    <>
      <section className="hero-gradient py-16 md:py-24">
        <div className="container text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-3xl md:text-4xl font-extrabold text-primary-foreground mb-4"
          >
            About CalcHub
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-primary-foreground/70 max-w-2xl mx-auto"
          >
            We believe everyone deserves access to clear, reliable financial tools. CalcHub is your all-in-one platform for instant calculations across finance, tax, education, and more.
          </motion.p>
        </div>
      </section>

      <section className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="rounded-xl border bg-card p-6"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mb-4">
                <v.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{v.title}</h3>
              <p className="text-sm text-muted-foreground">{v.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
};

export default About;
