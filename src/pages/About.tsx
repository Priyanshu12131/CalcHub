import { motion } from "framer-motion";

const About = () => {
  return (
    <>
      <header className="hero-gradient py-16 md:py-24">
        <div className="container text-center">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-5xl font-extrabold text-primary-foreground mb-4"
          >
            About CalcHub
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 }}
            className="text-lg text-primary-foreground/80 max-w-3xl mx-auto"
          >
            Free, accurate, and easy-to-use online calculators for finance, property, education, insurance, and everyday needs.
          </motion.p>
        </div>
      </header>

      <main className="container py-12 md:py-16 max-w-3xl mx-auto space-y-10">
        <section>
          <h2 className="text-2xl font-semibold mb-3">Introduction</h2>
          <p className="text-muted-foreground">
            CalcHub is a global platform providing free online calculators that make complex numbers simple. Our tools help individuals, students, and professionals perform trustworthy calculations across finance, tax, property, education, insurance, and more.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Our Mission</h2>
          <p className="text-muted-foreground">
            We simplify complex calculations and present results clearly so anyone can make smarter decisions. We aim to empower users worldwide with tools that are accurate, transparent, and easy to use.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">What We Offer</h2>
          <p className="text-muted-foreground mb-2">
            A wide range of calculators, regularly updated and designed to current standards. Many tools include configurable units, currency and formatting options so they adapt to different regions and personal needs.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Why Choose Us</h2>
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li><strong>Simplicity:</strong> Intuitive, fast interfaces with clear outputs.</li>
            <li><strong>Accuracy:</strong> Reliable formulas with regular validation and updates.</li>
            <li><strong>Mobile-friendly:</strong> Designed for use on phones, tablets, and desktops.</li>
            <li><strong>Accessible:</strong> Free to use without signup and optimized for assistive tools.</li>
            <li><strong>Improving constantly:</strong> Active updates, feedback-driven enhancements, and expanding coverage.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Our Vision</h2>
          <p className="text-muted-foreground">
            To be the trusted global resource for everyday calculations—helping people everywhere turn data into confident decisions.
          </p>
        </section>

        <section className="text-center pt-6">
          <motion.a
            href="/calculators"
            whileHover={{ scale: 1.03 }}
            className="inline-block bg-primary text-white px-6 py-3 rounded-md font-medium"
          >
            Browse Calculators
          </motion.a>
        </section>
      </main>
    </>
  );
};

export default About;
