import { useParams, Link } from "react-router-dom";
import { useState, useRef } from "react";
import { calculatorLogic, categories } from "../lib/calculators";
import { ArrowRight, Download } from "lucide-react";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import { trackCalculatorUsage } from "../lib/analytics";
import { getVisualizationConfig } from "../lib/visualizations";
import { ResultVisualizer } from "../components/ResultVisualizer";
import CurrencySelector from "../components/CurrencySelector";
import { useCurrency } from "../hooks/useCurrency";
import type { VisualizationType } from "../lib/visualizations";

const CalculatorPage = () => {
  const { calculatorId } = useParams<{ calculatorId: string }>();

  const { selectedCountry, format, convertFromBase } = useCurrency();

  const sanitizeLabel = (s: string) => s.replace(/[€£$₹¥¢₩₽₺₴،٫]/g, "").trim();

  // GPA editor component (inline) ---------------------------------
  const GpaEditor = ({ values, onChange }: { values: Record<string, any>; onChange: (v: Record<string, any>) => void }) => {
    const mode = Number(values.mode || 1);
    const subjects = Math.max(1, Math.min(10, Number(values.subjects || 4)));

    // conversion helpers (same rules as calculators.ts)
    function percentToGradePoint(p: number) {
      if (p >= 85) return 4.0;
      if (p >= 80) return 3.7;
      if (p >= 75) return 3.3;
      if (p >= 70) return 3.0;
      if (p >= 65) return 2.7;
      if (p >= 60) return 2.3;
      if (p >= 55) return 2.0;
      if (p >= 50) return 1.7;
      return 0;
    }
    function letterToGradePoint(letter: string): number {
      const letterMap: Record<string, number> = {
        "A+": 4.0, "A": 4.0, "A-": 3.7,
        "B+": 3.3, "B": 3.0, "B-": 2.7,
        "C+": 2.3, "C": 2.0, "C-": 1.7,
        "D+": 1.3, "D": 1.0, "D-": 0.7,
        "F": 0.0
      };
      return letterMap[(letter || "").toUpperCase()] ?? 0;
    }
    function gradePointToLetter(gp: number) {
      if (gp >= 4.0) return "A";
      if (gp >= 3.7) return "A-";
      if (gp >= 3.3) return "B+";
      if (gp >= 3.0) return "B";
      if (gp >= 2.7) return "B-";
      if (gp >= 2.3) return "C+";
      if (gp >= 2.0) return "C";
      if (gp >= 1.7) return "C-";
      if (gp >= 1.3) return "D+";
      if (gp >= 1.0) return "D";
      if (gp >= 0.7) return "D-";
      return "F";
    }

    function updateField(field: string, val: any) {
      onChange({ ...values, [field]: val });
    }

    function syncSubjectFromPercent(i: number, percent: number) {
      const gp = percentToGradePoint(percent);
      const letter = gradePointToLetter(gp);
      const copy = { ...values };
      copy[`percent${i}`] = percent;
      copy[`gp${i}`] = gp;
      copy[`let${i}`] = letter;
      // keep legacy g{i} consistent with selected mode
      if (mode === 1) copy[`g${i}`] = gp;
      else if (mode === 2) copy[`g${i}`] = percent;
      else copy[`g${i}`] = letter;
      onChange(copy);
    }

    function syncSubjectFromGP(i: number, gp: number) {
      const letter = gradePointToLetter(gp);
      // approximate percent by mapping back from gp thresholds (use gp*25 as rough)
      const percent = Math.round((gp / 4) * 100);
      const copy = { ...values };
      copy[`gp${i}`] = gp;
      copy[`percent${i}`] = percent;
      copy[`let${i}`] = letter;
      if (mode === 1) copy[`g${i}`] = gp;
      else if (mode === 2) copy[`g${i}`] = percent;
      else copy[`g${i}`] = letter;
      onChange(copy);
    }

    function syncSubjectFromLetter(i: number, letter: string) {
      const gp = letterToGradePoint(letter);
      const percent = Math.round((gp / 4) * 100);
      const copy = { ...values };
      copy[`let${i}`] = letter;
      copy[`gp${i}`] = gp;
      copy[`percent${i}`] = percent;
      if (mode === 1) copy[`g${i}`] = gp;
      else if (mode === 2) copy[`g${i}`] = percent;
      else copy[`g${i}`] = letter;
      onChange(copy);
    }

    function updateCredits(i: number, credits: number) {
      const copy = { ...values };
      copy[`c${i}`] = Number(credits);
      onChange(copy);
    }

    function addSubject() {
      const n = Math.min(10, subjects + 1);
      onChange({ ...values, subjects: n });
    }

    function removeSubject() {
      const n = Math.max(1, subjects - 1);
      const copy: Record<string, any> = { ...values, subjects: n };
      // clear last subject fields
      copy[`g${n + 1}`] = 0;
      copy[`c${n + 1}`] = 0;
      copy[`percent${n + 1}`] = undefined;
      copy[`gp${n + 1}`] = undefined;
      copy[`let${n + 1}`] = undefined;
      onChange(copy);
    }

    function saveToLocalStorage() {
      const dataToSave = JSON.stringify(values);
      localStorage.setItem("gpa-calculator-data", dataToSave);
      alert("GPA data saved to browser storage!");
    }

    function loadFromLocalStorage() {
      const savedData = localStorage.getItem("gpa-calculator-data");
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          onChange(parsed);
          alert("GPA data loaded from browser storage!");
        } catch (e) {
          alert("Error loading saved data");
        }
      } else {
        alert("No saved GPA data found");
      }
    }

    // compute live totals for display
    let totalQuality = 0;
    let totalCredits = 0;
    for (let i = 1; i <= subjects; i++) {
      const credits = Number(values[`c${i}`] ?? 0);
      const gp = Number(values[`gp${i}`] ?? (mode === 1 ? Number(values[`g${i}`] ?? 0) : (mode === 2 ? percentToGradePoint(Number(values[`g${i}`] ?? 0)) : letterToGradePoint(String(values[`g${i}`] ?? "")))));
      totalQuality += gp * credits;
      totalCredits += credits;
    }
    const liveGpa = totalCredits > 0 ? parseFloat((totalQuality / totalCredits).toFixed(3)) : 0;

    const letterGrades = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "F"];

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <label className="font-medium">Mode (sets how results are stored):</label>
          <select value={mode} onChange={(e) => updateField("mode", Number(e.target.value))} className="border rounded p-1">
            <option value={1}>Grade Points (e.g. 3.7)</option>
            <option value={2}>Percentage</option>
            <option value={3}>Letter Grade</option>
          </select>
          <div className="ml-4 flex gap-2">
            <button onClick={addSubject} className="px-3 py-1 bg-blue-50 border border-blue-300 text-blue-700 rounded hover:bg-blue-100">Add Subject</button>
            <button onClick={removeSubject} className="px-3 py-1 bg-red-50 border border-red-300 text-red-700 rounded hover:bg-red-100">Remove</button>
            <button onClick={saveToLocalStorage} className="px-3 py-1 bg-green-50 border border-green-300 text-green-700 rounded hover:bg-green-100">Save</button>
            <button onClick={loadFromLocalStorage} className="px-3 py-1 bg-purple-50 border border-purple-300 text-purple-700 rounded hover:bg-purple-100">Load</button>
          </div>
        </div>

        <div className="space-y-3">
          {Array.from({ length: subjects }).map((_, idx) => {
            const i = idx + 1;
            const name = String(values[`name${i}`] ?? "");
            const credits = Number(values[`c${i}`] ?? 5);
            const percent = values[`percent${i}`] ?? (typeof values[`g${i}`] === "number" && Number(values[`g${i}`]) <= 100 ? Number(values[`g${i}`]) : undefined);
            const gp = values[`gp${i}`] ?? (typeof values[`g${i}`] === "number" && Number(values[`g${i}`]) <= 4 ? Number(values[`g${i}`]) : (percent !== undefined ? percentToGradePoint(Number(percent)) : undefined));
            const letter = values[`let${i}`] ?? (values[`g${i}`] && typeof values[`g${i}`] === "string" ? String(values[`g${i}`]) : (gp !== undefined ? gradePointToLetter(Number(gp)) : ""));

            return (
              <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                <div>
                  <label className="text-sm">Subject {i} Name</label>
                  <input type="text" value={name} onChange={(e) => updateField(`name${i}`, e.target.value)} className="w-full p-1 border rounded mt-1" />
                </div>

                <div>
                  <label className="text-sm">Percentage</label>
                  <input type="number" value={percent ?? ""} step={0.1} onChange={(e) => syncSubjectFromPercent(i, Number(e.target.value || 0))} className="w-full p-1 border rounded mt-1" />
                </div>

                <div>
                  <label className="text-sm">Grade Point</label>
                  <input type="number" value={gp ?? ""} step={0.1} onChange={(e) => syncSubjectFromGP(i, Number(e.target.value || 0))} className="w-full p-1 border rounded mt-1" />
                </div>

                <div>
                  <label className="text-sm">Letter</label>
                  <select value={letter} onChange={(e) => syncSubjectFromLetter(i, e.target.value)} className="w-full p-1 border rounded mt-1">
                    <option value="">--Select--</option>
                    {letterGrades.map((lg) => (
                      <option key={lg} value={lg}>{lg}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-1">
                  <label className="text-sm">Credits</label>
                  <input type="number" value={credits} step={1} min={0} onChange={(e) => updateCredits(i, Number(e.target.value || 0))} className="w-28 p-1 border rounded mt-1" />
                </div>

                <div className="md:col-span-3 text-sm text-muted-foreground">
                  <div>Computed GP: <strong>{(gp ?? 0).toFixed(2)}</strong> • Letter: <strong>{letter || "-"}</strong></div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Live GPA</div>
              <div className="text-2xl font-bold">{liveGpa}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Total Credits</div>
              <div className="text-2xl font-bold">{totalCredits}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Displayed Grade</div>
              <div className="text-2xl font-bold">{gradePointToLetter(liveGpa)}</div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  // end GPA editor --------------------------------------------------

  if (!calculatorId || !calculatorLogic[calculatorId]) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Calculator not found</h1>
        <Link to="/" className="text-primary hover:underline">
          Go back home
        </Link>
      </div>
    );
  }

  const config = calculatorLogic[calculatorId];

  const [values, setValues] = useState<Record<string, any>>(
    Object.fromEntries(config.inputs.map((i) => [i.id, i.default]))
  );

  const result = config.calculate(values);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [lastResult, setLastResult] = useState<Record<string, number> | null>(null);
  
  // Visualization states
  const vizConfig = getVisualizationConfig(calculatorId!);
  const [selectedVizType, setSelectedVizType] = useState<VisualizationType>(vizConfig.recommended);
  const [showVisualization, setShowVisualization] = useState(false);

  function handleCalculate() {
    setLastResult(result);
    setShowVisualization(true);
    // Track the calculation usage
    const calculator = calculatorLogic[calculatorId!];
    if (calculator) {
      // Find the calculator name from categories
      let calcName = calculatorId!;
      for (const category of categories) {
        const found = category.calculators.find((c) => c.id === calculatorId);
        if (found) {
          calcName = found.name;
          break;
        }
      }
      
      // Extract first numeric result value if available
      const resultValues = Object.values(result);
      const firstNumericValue = resultValues.find((v) => typeof v === "number");

      // Choose a primary input to record as criteria/input (use first input field)
      const primaryInput = calculator.inputs && calculator.inputs[0];
      const criteriaName = primaryInput ? sanitizeLabel(primaryInput.label) : undefined;
      const inputValue = primaryInput ? Number(values[primaryInput.id]) : undefined;

      trackCalculatorUsage(calculatorId!, calcName, firstNumericValue as number, criteriaName, inputValue);
    }
  }

  function downloadPDF(data?: Record<string, number> | null) {
    const res = data ?? result;
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    let y = 40;
    doc.setFontSize(18);
    doc.text(`${calculatorId} Calculator Results`, 40, y);
    y += 28;
    doc.setFontSize(12);
    doc.text("Inputs:", 40, y);
    y += 18;
    for (const input of config.inputs) {
      const raw = values[input.id];
      let display = String(raw ?? "");
      // Heuristic: treat as monetary when max is large or label contains money keywords
      const moneyKeywords = ["amount", "price", "salary", "income", "deposit", "rent", "payment", "pot", "balance", "loan"];
      const isMoney = (input.max && input.max >= 1000) || moneyKeywords.some((k) => input.label.toLowerCase().includes(k));
      if (typeof raw === "number" && isMoney) display = format(raw);
      const label = `${input.label}: ${display}`;
      doc.text(label, 48, y);
      y += 16;
      if (y > 750) {
        doc.addPage();
        y = 40;
      }
    }

    // Include GPA subject names and details if present
    if (calculatorId === "gpa-calculator") {
      y += 8;
      doc.text("Subjects:", 40, y);
      y += 18;
      const subjects = Number(values.subjects || 0);
      for (let i = 1; i <= subjects; i++) {
        const name = values[`name${i}`] || `Subject ${i}`;
        const grade = values[`g${i}`];
        const credits = values[`c${i}`];
        const line = `${i}. ${name} — Grade: ${grade} — Credits: ${credits}`;
        doc.text(line, 48, y);
        y += 14;
        if (y > 750) {
          doc.addPage();
          y = 40;
        }
      }
    }

    y += 8;
    doc.text("Results:", 40, y);
    y += 18;
    for (const [k, v] of Object.entries(res)) {
      const display = typeof v === "number" ? format(v) : String(v);
      const line = `${k}: ${display}`;
      doc.text(line, 48, y);
      y += 16;
      if (y > 750) {
        doc.addPage();
        y = 40;
      }
    }

    doc.save(`${calculatorId}-results.pdf`);
  }

  return (
    <div className="container py-10 max-w-4xl">
      <nav className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary">Home</Link>
          <ArrowRight className="h-3 w-3" />
          <span className="font-medium capitalize">{calculatorId}</span>
        </div>
        <CurrencySelector />
      </nav>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-6 capitalize">
          {calculatorId} Calculator
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* INPUTS */}
          <div className="space-y-6">
            {calculatorId === "gpa-calculator" ? (
              <GpaEditor
                values={values}
                onChange={(v) => setValues(v)}
              />
            ) : (
              config.inputs.map((input) => (
                <div key={input.id}>
                  <div className="flex items-center justify-between mb-2">
                      <label className="font-medium">{sanitizeLabel(input.label)}</label>
                    <input
                      type="number"
                      min={input.min}
                      step={input.step}
                      value={values[input.id]}
                      onChange={(e) =>
                        setValues({
                          ...values,
                          [input.id]: Number(e.target.value),
                        })
                      }
                      className="w-28 p-1 rounded-md border text-sm"
                    />
                  </div>
                  <input
                    type="range"
                    min={input.min}
                    max={input.max}
                    step={input.step}
                    value={values[input.id]}
                    onChange={(e) =>
                      setValues({
                        ...values,
                        [input.id]: Number(e.target.value),
                      })
                    }
                    className="w-full"
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    Max Limit: {input.max.toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* RESULTS */}
          <div ref={containerRef} className="rounded-xl border bg-card p-6 space-y-4">
            <h3 className="font-semibold text-lg">Results</h3>
            {Object.entries(result).map(([key, val]) => {
              const skipCurrency = /%|roi|rate|years|tenor|count|score|grade|letter|gpa|level|status|profile|allocation|plan|recommendation|approach|optimizer|planner|focus/i.test(key);
              let display = String(val);
              
              // Convert numeric currency values from USD to selected country currency
              if (typeof val === "number" && !skipCurrency) {
                const convertedValue = convertFromBase(val, selectedCountry.currency.code);
                display = format(convertedValue);
              } else if (typeof val === "number") {
                display = val.toLocaleString();
              }
              
              return (
                <div key={key} className="flex justify-between border-b pb-2">
                  <span>{key}</span>
                  <span className="font-semibold text-primary">{display}</span>
                </div>
              );
            })}

            <div className="pt-4 flex flex-col items-end gap-3">
              <button
                onClick={handleCalculate}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-teal-600 text-teal-600 hover:bg-teal-50"
              >
                Calculate
              </button>

              <button
                onClick={() => downloadPDF(lastResult ?? result)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-teal-600 text-white hover:bg-teal-700"
              >
                <Download className="w-4 h-4" /> Download PDF
              </button>
            </div>
          </div>
        </div>

        {/* Interactive Visualization Menu */}
        {showVisualization && lastResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 rounded-xl border bg-card p-6"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">📊 Visualization Options</h2>
              <p className="text-muted-foreground mb-4">
                {vizConfig.description}
              </p>
              
              {/* Display key metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {Object.entries(lastResult)
                  .filter(([_, v]) => typeof v === "number")
                  .slice(0, 3)
                  .map(([key, value]) => (
                      <div key={key} className="rounded-lg bg-slate-50 p-4">
                        <div className="text-sm text-muted-foreground">{key}</div>
                        <div className="text-2xl font-bold text-primary mt-1">
                          {typeof value === "number" && !/%|roi|rate|years|tenor/i.test(key)
                            ? format(value)
                            : String(value)}
                        </div>
                      </div>
                    ))}
              </div>
            </div>

            {/* Visualization Type Selector */}
            <div className="mb-6">
              <p className="font-semibold mb-3">
                How would you like to visualize this data?
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {vizConfig.available.map((vizType) => (
                  <button
                    key={vizType}
                    onClick={() => setSelectedVizType(vizType)}
                    className={`p-3 rounded-lg border-2 transition text-center ${
                      selectedVizType === vizType
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="text-lg mb-1">
                      {vizType === "area" && "📈"}
                      {vizType === "bar" && "📊"}
                      {vizType === "donut" && "🥧"}
                      {vizType === "line" && "📉"}
                      {vizType === "waterfall" && "🏞️"}
                      {vizType === "comparison" && "🔄"}
                    </div>
                    <div className="text-xs font-semibold capitalize">{vizType}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Chart Display */}
            <div className="mt-6 p-4 bg-slate-50 rounded-lg">
              <h3 className="font-semibold mb-4 capitalize">{selectedVizType} Chart</h3>
              <ResultVisualizer
                calculatorId={calculatorId!}
                result={lastResult}
                visualizationType={selectedVizType}
              />
            </div>

            {/* Additional Options */}
            <div className="mt-6 pt-4 border-t flex gap-3">
              <button
                onClick={() => downloadPDF(lastResult)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-teal-600 text-white hover:bg-teal-700"
              >
                <Download className="w-4 h-4" /> Download PDF
              </button>
              <button
                onClick={() => setShowVisualization(false)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md border hover:bg-gray-50"
              >
                Hide Chart
              </button>
            </div>
          </motion.div>
        )}
        {calculatorId === "car-loan" && (
          <div className="mt-8 bg-white rounded-xl border p-6">
            <h2 className="text-2xl font-bold mb-3">How This Calculator Works</h2>
            <p className="mb-4">Buying a car is a big financial decision... Our Car Loan Calculator helps you estimate your monthly repayments in Ireland.</p>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Inputs</h4>
                <ol className="list-decimal list-inside text-sm text-slate-700 space-y-1">
                  <li><strong>Loan Amount:</strong> The total amount you need to borrow.</li>
                  <li><strong>Interest Rate:</strong> Annual interest rate (percentage per year).</li>
                  <li><strong>Loan Term:</strong> Duration of the loan in years.</li>
                </ol>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Outputs</h4>
                <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
                  <li><strong>Monthly Payment:</strong> Estimated monthly repayment amount.</li>
                  <li><strong>Total Payment:</strong> Sum of all payments over the loan term.</li>
                  <li><strong>Total Interest:</strong> Total interest paid over the loan term.</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CalculatorPage;