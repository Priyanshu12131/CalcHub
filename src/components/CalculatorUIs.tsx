import React, { useState } from "react";
import { motion } from "framer-motion";
import CurrencySelector from "./CurrencySelector";
import { useCurrency } from "../hooks/useCurrency";

/* ==================== FINANCIAL PERSONALITY CALCULATOR ==================== */
export const FinancialPersonalityCalculator: React.FC = () => {
  const [inputs, setInputs] = useState({
    age: 34,
    income: 42000,
    savingsPercent: 10,
    debt: 4000,
    emergencyFund: 3,
    horizon: 2,
    riskTolerance: 3,
    priority: 3,
  });

  const [result, setResult] = useState<Record<string, any> | null>(null);

  const { selectedCountry, format, convertFromBase } = useCurrency();

  const handleCalculate = () => {
    const monthlyIncome = inputs.income / 12;
    const monthlySavings = monthlyIncome * (inputs.savingsPercent / 100);
    const yearsToRetirement = Math.max(5, 65 - inputs.age);
    
    const emergencyFundTargets = ["None", "Less than 3 months", "3-6 months", "6+ months"];
    const horizonLabels = ["Short (0-3yr)", "Medium (3-7yr)", "Long (7+yr)"];
    const riskLabels = ["Very Low", "Low", "Moderate", "High"];
    const priorityLabels = ["Pay down debt", "Build emergency fund", "Grow investments", "Plan retirement"];

    let profile = "Balanced Growth";
    let actionPlan = "";

    if (inputs.priority === 1) {
      profile = "Debt Elimination Focus";
      const debtConverted = convertFromBase(Math.round(inputs.debt), selectedCountry.currency.code);
      actionPlan = `Focus on paying down ${format(debtConverted)} debt. Consider increasing savings to accelerate payoff.`;
    } else if (inputs.priority === 2) {
      profile = "Security-First Approach";
      const emergencyConverted = convertFromBase(Math.round(monthlyIncome * 4.5), selectedCountry.currency.code);
      actionPlan = `Build 3-6 months emergency fund first (${format(emergencyConverted)}). This cushions financial shocks.`;
    } else if (inputs.priority === 3) {
      profile = "Growth Optimizer";
      actionPlan = "Diversify investments across bonds, stocks, and funds based on your medium risk tolerance.";
    } else {
      profile = "Long-Term Retirement Planner";
      actionPlan = `Maximize pension contributions. You have ${yearsToRetirement} years to retirement.`;
    }

    const recommendation =
      inputs.riskTolerance <= 2
        ? "Conservative: 70% bonds, 30% stocks"
        : inputs.riskTolerance === 3
          ? "Balanced: 50% bonds, 50% stocks"
          : "Aggressive: 20% bonds, 80% stocks/growth";

    setResult({
      Profile: profile,
      "Monthly Savings": format(convertFromBase(Math.round(monthlySavings), selectedCountry.currency.code)),
      Priority: priorityLabels[inputs.priority - 1],
      "Risk Level": riskLabels[inputs.riskTolerance - 1],
      "Time Horizon": horizonLabels[inputs.horizon - 1],
      "Emergency Fund Status": emergencyFundTargets[inputs.emergencyFund - 1],
      "Outstanding Debt": format(convertFromBase(Math.round(inputs.debt), selectedCountry.currency.code)),
      "Action Plan": actionPlan,
      "Recommended Allocation": recommendation,
    });
  };

  return (
    <motion.div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-indigo-200">
      <div className="font-mono text-sm space-y-4">
        {/* Header */}
        <div className="text-center font-bold text-lg border-b-2 border-indigo-600 pb-4">
          Sean Casey – Financial Personality Calculator
        </div>

        {/* Input Form */}
        <div className="space-y-3 bg-white p-4 rounded border border-indigo-200">
          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs text-gray-600">Age</label>
            <input
              type="number"
              value={inputs.age}
              onChange={(e) => setInputs({ ...inputs, age: parseInt(e.target.value) })}
              className="border border-gray-300 rounded px-2 py-1 text-xs"
            />

            <label className="text-xs text-gray-600">Annual Net Income</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={inputs.income}
                onChange={(e) => {
                  setInputs({ ...inputs, income: parseInt(e.target.value || "0") });
                  handleCalculate();
                }}
                placeholder={selectedCountry.currency.symbol + "0"}
                className="border border-gray-300 rounded px-2 py-1 text-xs flex-1"
              />
              <CurrencySelector />
            </div>

            <label className="text-xs text-gray-600">Monthly Savings (%)</label>
            <input
              type="number"
              value={inputs.savingsPercent}
              onChange={(e) => setInputs({ ...inputs, savingsPercent: parseInt(e.target.value) })}
              className="border border-gray-300 rounded px-2 py-1 text-xs"
            />

            <label className="text-xs text-gray-600">Outstanding Debt</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={inputs.debt}
                onChange={(e) => {
                  setInputs({ ...inputs, debt: parseInt(e.target.value || "0") });
                  handleCalculate();
                }}
                placeholder={selectedCountry.currency.symbol + "0"}
                className="border border-gray-300 rounded px-2 py-1 text-xs flex-1"
              />
              <CurrencySelector />
            </div>
          </div>

          {/* Multi-choice sections */}
          <div className="mt-4 p-3 bg-gray-50 rounded space-y-3">
            <div>
              <label className="text-xs font-semibold">Emergency Fund:</label>
              <div className="flex gap-2 mt-1">
                {["None", "<3m", "3-6m", "6+m"].map((label, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInputs({ ...inputs, emergencyFund: idx + 1 })}
                    className={`px-2 py-1 text-xs rounded ${inputs.emergencyFund === idx + 1 ? "bg-indigo-600 text-white" : "bg-white border border-gray-300"}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold">Investment Horizon:</label>
              <div className="flex gap-2 mt-1">
                {["Short (0-3y)", "Medium (3-7y)", "Long (7+y)"].map((label, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInputs({ ...inputs, horizon: idx + 1 })}
                    className={`px-2 py-1 text-xs rounded ${inputs.horizon === idx + 1 ? "bg-indigo-600 text-white" : "bg-white border border-gray-300"}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold">Risk Tolerance:</label>
              <div className="flex gap-2 mt-1">
                {["Very Low", "Low", "Moderate", "High"].map((label, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInputs({ ...inputs, riskTolerance: idx + 1 })}
                    className={`px-2 py-1 text-xs rounded ${inputs.riskTolerance === idx + 1 ? "bg-indigo-600 text-white" : "bg-white border border-gray-300"}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold">Top Priority:</label>
              <div className="flex gap-2 mt-1">
                {["Pay Debt", "Emergency Fund", "Investments", "Retirement"].map((label, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInputs({ ...inputs, priority: idx + 1 })}
                    className={`px-2 py-1 text-xs rounded ${inputs.priority === idx + 1 ? "bg-indigo-600 text-white" : "bg-white border border-gray-300"}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 justify-center">
          <button
            onClick={handleCalculate}
            className="bg-indigo-600 text-white px-6 py-2 rounded text-xs font-semibold hover:bg-indigo-700"
          >
            [Calculate Personality]
          </button>
          <button
            onClick={() => {
              setInputs({
                age: 34,
                income: 42000,
                savingsPercent: 10,
                debt: 4000,
                emergencyFund: 3,
                horizon: 2,
                riskTolerance: 3,
                priority: 3,
              });
              setResult(null);
            }}
            className="bg-gray-400 text-white px-6 py-2 rounded text-xs font-semibold hover:bg-gray-500"
          >
            [Reset]
          </button>
        </div>

        {/* Results */}
        {result && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-indigo-100 p-4 rounded border-2 border-indigo-600 space-y-2">
            <div className="font-bold text-indigo-700 border-b border-indigo-400 pb-2">RESULTS</div>
            {Object.entries(result).map(([key, value]) => (
              <div key={key} className="text-xs">
                <span className="font-semibold">{key}:</span> {String(value)}
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

/* ==================== LOAN REPAYMENT CALCULATOR ==================== */
export const LoanRepaymentCalculator: React.FC = () => {
  const [inputs, setInputs] = useState({
    amount: 15000,
    rate: 7.5,
    years: 5,
  });

  const [result, setResult] = useState<Record<string, any> | null>(null);

  const { selectedCountry, format, convertFromBase } = useCurrency();

  const handleCalculate = () => {
    const monthlyRate = inputs.rate / 100 / 12;
    const numPayments = inputs.years * 12;
    let monthlyPayment = 0;

    if (monthlyRate === 0) {
      monthlyPayment = inputs.amount / numPayments;
    } else {
      monthlyPayment =
        (inputs.amount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
        (Math.pow(1 + monthlyRate, numPayments) - 1);
    }

    const totalPayment = monthlyPayment * numPayments;
    const totalInterest = totalPayment - inputs.amount;

    setResult({
      "Loan Amount": format(convertFromBase(Math.round(inputs.amount), selectedCountry.currency.code)),
      "Monthly Payment": format(convertFromBase(Math.round(monthlyPayment), selectedCountry.currency.code)),
      "Total Payments": format(convertFromBase(Math.round(totalPayment), selectedCountry.currency.code)),
      "Total Interest": format(convertFromBase(Math.round(totalInterest), selectedCountry.currency.code)),
      "Tenor": `${inputs.years} years (${numPayments} months)`,
    });
  };

  return (
    <motion.div className="p-6 bg-gradient-to-br from-green-50 to-teal-50 rounded-lg border border-teal-200">
      <div className="font-mono text-sm space-y-4">
        <div className="text-center font-bold text-lg border-b-2 border-teal-600 pb-4">
          James Smith Financial Calculator
        </div>

        <div className="space-y-3 bg-white p-4 rounded border border-teal-200">
          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs text-gray-600">Loan Amount</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={inputs.amount}
                onChange={(e) => {
                  setInputs({ ...inputs, amount: parseInt(e.target.value || "0") });
                  // live recalc
                  setTimeout(handleCalculate, 0);
                }}
                placeholder={selectedCountry.currency.symbol + "0"}
                className="border border-gray-300 rounded px-2 py-1 text-xs flex-1"
              />
              <CurrencySelector />
            </div>

            <label className="text-xs text-gray-600">Interest Rate (%)</label>
            <input
              type="number"
              step="0.1"
              value={inputs.rate}
              onChange={(e) => setInputs({ ...inputs, rate: parseFloat(e.target.value) })}
              className="border border-gray-300 rounded px-2 py-1 text-xs"
            />

            <label className="text-xs text-gray-600">Loan Tenure (Years)</label>
            <input
              type="number"
              value={inputs.years}
              onChange={(e) => setInputs({ ...inputs, years: parseInt(e.target.value) })}
              className="border border-gray-300 rounded px-2 py-1 text-xs"
            />
          </div>
        </div>

        <div className="flex gap-2 justify-center">
          <button
            onClick={handleCalculate}
            className="bg-teal-600 text-white px-6 py-2 rounded text-xs font-semibold hover:bg-teal-700"
          >
            [Calculate Loan]
          </button>
        </div>

        {result && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-teal-100 p-4 rounded border-2 border-teal-600 space-y-2">
            <div className="font-bold text-teal-700 border-b border-teal-400 pb-2">LOAN CALCULATION RESULT</div>
            {Object.entries(result).map(([key, value]) => (
              <div key={key} className="text-xs">
                <span className="font-semibold">{key}:</span> {String(value)}
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

/* ==================== CASIO FX-83GTX SCIENTIFIC CALCULATOR ==================== */
export const ScientificCalculatorCasio: React.FC = () => {
  const [display, setDisplay] = useState("0");
  const [input, setInput] = useState("");
  const [lastResult, setLastResult] = useState(0);

  const handleButtonClick = (value: string) => {
    if (value === "AC") {
      setDisplay("0");
      setInput("");
    } else if (value === "=") {
      try {
        const result = eval(input.replace(/×/g, "*").replace(/÷/g, "/"));
        setDisplay(result.toString());
        setLastResult(result);
        setInput("");
      } catch (e) {
        setDisplay("Error");
      }
    } else if (["+", "-", "×", "÷"].includes(value)) {
      if (input) {
        setInput(input + value);
        setDisplay(input + value);
      }
    } else if (["(", ")"].includes(value)) {
      setInput(input + value);
      setDisplay(input + value);
    } else if (value === ".") {
      setInput(input + value);
      setDisplay(input + value);
    } else if (value === "Ans") {
      setInput(lastResult.toString());
      setDisplay(lastResult.toString());
    } else if (["sin", "cos", "tan", "log", "ln", "√", "x²", "^"].includes(value)) {
      const num = parseFloat(input || display);
      let result = 0;
      switch (value) {
        case "sin":
          result = Math.sin((num * Math.PI) / 180);
          setDisplay(`sin(${num}°) = ${result.toFixed(6)}`);
          break;
        case "cos":
          result = Math.cos((num * Math.PI) / 180);
          setDisplay(`cos(${num}°) = ${result.toFixed(6)}`);
          break;
        case "tan":
          result = Math.tan((num * Math.PI) / 180);
          setDisplay(`tan(${num}°) = ${result.toFixed(6)}`);
          break;
        case "log":
          result = Math.log10(Math.abs(num));
          setDisplay(`log(${num}) = ${result.toFixed(6)}`);
          break;
        case "ln":
          result = Math.log(Math.abs(num));
          setDisplay(`ln(${num}) = ${result.toFixed(6)}`);
          break;
        case "√":
          result = Math.sqrt(Math.abs(num));
          setDisplay(`√${num} = ${result.toFixed(6)}`);
          break;
        case "x²":
          result = num * num;
          setDisplay(`${num}² = ${result.toFixed(6)}`);
          break;
      }
      setLastResult(result);
      setInput("");
    } else if (value === "π") {
      const pi = Math.PI;
      setInput(pi.toString());
      setDisplay(pi.toString());
    } else {
      setInput(input + value);
      setDisplay(input + value);
    }
  };

  return (
    <motion.div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-50 p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl p-6 w-full max-w-sm border-8 border-gray-700"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-white text-3xl font-bold" style={{ fontFamily: "'Courier New', monospace" }}>
            Casio Calculator
          </h1>
          <h2 className="text-gray-300 text-lg font-semibold">FX-83GTX</h2>
        </div>

        {/* Display */}
        <div className="bg-gradient-to-b from-gray-950 to-gray-900 rounded-lg p-4 mb-6 border-2 border-gray-700 shadow-inner">
          <div className="text-right text-yellow-300 font-bold text-4xl break-words" style={{ fontFamily: "'Courier New', monospace", minHeight: "60px" }}>
            {display.length > 12 ? display.substring(0, 12) + "..." : display}
          </div>
        </div>

        {/* Scientific Functions Row 1 */}
        <div className="grid grid-cols-5 gap-2 mb-3">
          {["sin", "cos", "tan", "π", "AC"].map((btn) => (
            <button
              key={btn}
              onClick={() => handleButtonClick(btn)}
              className={`py-3 rounded font-semibold text-sm transition-all transform hover:scale-105 ${
                btn === "AC"
                  ? "bg-red-600 hover:bg-red-700 text-white col-span-1"
                  : "bg-white hover:bg-gray-100 text-gray-800"
              }`}
            >
              {btn}
            </button>
          ))}
        </div>

        {/* Scientific Functions Row 2 */}
        <div className="grid grid-cols-5 gap-2 mb-3">
          {["log", "ln", "√", "x²", "^"].map((btn) => (
            <button
              key={btn}
              onClick={() => handleButtonClick(btn)}
              className="bg-white hover:bg-gray-100 text-gray-800 py-3 rounded font-semibold text-sm transition-all transform hover:scale-105"
            >
              {btn}
            </button>
          ))}
        </div>

        {/* Number Pad Row 1 */}
        <div className="grid grid-cols-5 gap-2 mb-3">
          {["7", "8", "9", "+", "("].map((btn) => (
            <button
              key={btn}
              onClick={() => handleButtonClick(btn)}
              className={`py-3 rounded font-semibold text-sm transition-all transform hover:scale-105 ${
                ["+", "-", "×", "÷"].includes(btn)
                  ? "bg-blue-400 hover:bg-blue-500 text-white"
                  : ["(", ")"].includes(btn)
                    ? "bg-blue-300 hover:bg-blue-400 text-gray-800"
                    : "bg-white hover:bg-gray-100 text-gray-800"
              }`}
            >
              {btn}
            </button>
          ))}
        </div>

        {/* Number Pad Row 2 */}
        <div className="grid grid-cols-5 gap-2 mb-3">
          {["4", "5", "6", "×", ")"].map((btn) => (
            <button
              key={btn}
              onClick={() => handleButtonClick(btn)}
              className={`py-3 rounded font-semibold text-sm transition-all transform hover:scale-105 ${
                ["+", "-", "×", "÷"].includes(btn)
                  ? "bg-blue-400 hover:bg-blue-500 text-white"
                  : ["(", ")"].includes(btn)
                    ? "bg-blue-300 hover:bg-blue-400 text-gray-800"
                    : "bg-white hover:bg-gray-100 text-gray-800"
              }`}
            >
              {btn}
            </button>
          ))}
        </div>

        {/* Number Pad Row 3 */}
        <div className="grid grid-cols-5 gap-2 mb-3">
          {["1", "2", "3", "-", "."].map((btn) => (
            <button
              key={btn}
              onClick={() => handleButtonClick(btn)}
              className={`py-3 rounded font-semibold text-sm transition-all transform hover:scale-105 ${
                ["+", "-", "×", "÷"].includes(btn)
                  ? "bg-blue-400 hover:bg-blue-500 text-white"
                  : "bg-white hover:bg-gray-100 text-gray-800"
              }`}
            >
              {btn}
            </button>
          ))}
        </div>

        {/* Number Pad Row 4 */}
        <div className="grid grid-cols-5 gap-2">
          {["0", "Ans", "=", "+"].map((btn) => (
            <button
              key={btn}
              onClick={() => handleButtonClick(btn)}
              className={`py-3 rounded font-semibold text-sm transition-all transform hover:scale-105 ${
                btn === "="
                  ? "bg-blue-600 hover:bg-blue-700 text-white col-span-1"
                  : btn === "+"
                    ? "bg-blue-400 hover:bg-blue-500 text-white"
                    : btn === "0"
                      ? "bg-white hover:bg-gray-100 text-gray-800"
                      : "bg-white hover:bg-gray-100 text-gray-800"
              }`}
            >
              {btn}
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ==================== CASIO WATCH CALCULATOR ==================== */
export const WatchCalculator: React.FC = () => {
  const [display, setDisplay] = useState("0");
  const [input, setInput] = useState("");

  const handleClick = (value: string) => {
    if (value === "AC") {
      setDisplay("0");
      setInput("");
    } else if (value === "=") {
      try {
        const result = eval(input.replace(/×/g, "*").replace(/÷/g, "/"));
        setDisplay(result.toString());
        setInput("");
      } catch {
        setDisplay("Err");
      }
    } else if (["+", "-", "×", "÷"].includes(value)) {
      if (input) {
        setInput(input + value);
        setDisplay(input + value);
      }
    } else {
      const newInput = input + value;
      setInput(newInput);
      setDisplay(newInput);
    }
  };

  return (
    <motion.div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg border border-gray-400">
      <div className="font-mono text-sm space-y-4 max-w-xs">
        <div className="text-center font-bold text-sm border-b border-gray-400 pb-2">
          Casio Watch Calculator
        </div>

        {/* Minimal Display */}
        <div className="bg-gray-800 text-green-400 p-2 rounded text-right font-bold text-lg border border-gray-600 overflow-auto min-h-6">
          {display}
        </div>

        {/* Button Grid */}
        <div className="space-y-1">
          <div className="grid grid-cols-4 gap-1">
            {["7", "8", "9", "÷"].map((btn) => (
              <button
                key={btn}
                onClick={() => handleClick(btn)}
                className={`px-2 py-1 rounded text-xs font-bold ${btn === "÷" ? "bg-orange-500 text-white" : "bg-white border border-gray-300"}`}
              >
                {btn}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-1">
            {["4", "5", "6", "×"].map((btn) => (
              <button
                key={btn}
                onClick={() => handleClick(btn)}
                className={`px-2 py-1 rounded text-xs font-bold ${btn === "×" ? "bg-orange-500 text-white" : "bg-white border border-gray-300"}`}
              >
                {btn}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-1">
            {["1", "2", "3", "-"].map((btn) => (
              <button
                key={btn}
                onClick={() => handleClick(btn)}
                className={`px-2 py-1 rounded text-xs font-bold ${btn === "-" ? "bg-orange-500 text-white" : "bg-white border border-gray-300"}`}
              >
                {btn}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-1">
            {["0", ".", "=", "+"].map((btn) => (
              <button
                key={btn}
                onClick={() => handleClick(btn)}
                className={`px-2 py-1 rounded text-xs font-bold ${["=", "+"].includes(btn) ? "bg-green-600 text-white" : "bg-white border border-gray-300"}`}
              >
                {btn}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => {
            setDisplay("0");
            setInput("");
          }}
          className="w-full bg-gray-600 text-white px-2 py-1 rounded text-xs font-bold"
        >
          AC (All Clear)
        </button>
      </div>
    </motion.div>
  );
};

/* ==================== PROGRAMMABLE CALCULATOR ==================== */
export const ProgrammableCalculator: React.FC = () => {
  const [stored, setStored] = useState(3.14);
  const [display, setDisplay] = useState("0");
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);

  const handleSTO = () => {
    setStored(parseFloat(input || display));
    setHistory([...history, `STO: Stored ${parseFloat(input || display).toFixed(4)}`]);
  };

  const handleRCL = () => {
    setDisplay(stored.toFixed(4));
    setInput(stored.toFixed(4));
    setHistory([...history, `RCL: Retrieved ${stored.toFixed(4)}`]);
  };

  const handleClick = (value: string) => {
    if (value === "AC") {
      setDisplay("0");
      setInput("");
    } else if (value === "=") {
      try {
        const result = eval(input.replace(/×/g, "*").replace(/÷/g, "/"));
        setDisplay(result.toString());
        setHistory([...history, `Result: ${result}`]);
        setInput("");
      } catch {
        setDisplay("Err");
      }
    } else if (["+", "-", "×", "÷", "(", ")"].includes(value)) {
      setInput(input + value);
      setDisplay(input + value);
    } else {
      const newInput = input + value;
      setInput(newInput);
      setDisplay(newInput);
    }
  };

  return (
    <motion.div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-orange-200">
      <div className="font-mono text-sm space-y-4">
        <div className="text-center font-bold text-lg border-b-2 border-orange-600 pb-4">
          Programmable Calculator - Memory Functions
        </div>

        {/* Display */}
        <div className="bg-orange-900 text-yellow-300 p-3 rounded font-bold text-right text-xl border border-orange-600 overflow-auto">
          {display}
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="bg-white p-2 rounded border border-orange-300 max-h-24 overflow-y-auto text-xs">
            <div className="font-semibold text-orange-700 mb-1">History:</div>
            {history.slice(-5).map((item, idx) => (
              <div key={idx} className="text-gray-700">
                {item}
              </div>
            ))}
          </div>
        )}

        {/* Buttons */}
        <div className="grid grid-cols-5 gap-1">
          {["7", "8", "9", "/", "("].map((btn) => (
            <button key={btn} onClick={() => handleClick(btn)} className="bg-white p-2 border border-gray-300 rounded text-xs font-bold hover:bg-gray-100">
              {btn}
            </button>
          ))}
          {["4", "5", "6", "*", ")"].map((btn) => (
            <button key={btn} onClick={() => handleClick(btn)} className="bg-white p-2 border border-gray-300 rounded text-xs font-bold hover:bg-gray-100">
              {btn === "*" ? "×" : btn}
            </button>
          ))}
          {["1", "2", "3", "-", "."].map((btn) => (
            <button key={btn} onClick={() => handleClick(btn)} className="bg-white p-2 border border-gray-300 rounded text-xs font-bold hover:bg-gray-100">
              {btn}
            </button>
          ))}
          {["0", "AC", "=", "+"].map((btn) => (
            <button
              key={btn}
              onClick={() => (btn === "AC" ? (() => { setDisplay("0"); setInput(""); })() : handleClick(btn))}
              className={`p-2 border rounded text-xs font-bold ${btn === "=" ? "bg-green-600 text-white col-span-2" : btn === "AC" ? "bg-red-500 text-white col-span-2" : "bg-white border-gray-300 hover:bg-gray-100"}`}
            >
              {btn}
            </button>
          ))}
        </div>

        {/* Memory Buttons */}
        <div className="flex gap-2 justify-center pt-2">
          <button onClick={handleSTO} className="bg-purple-600 text-white px-4 py-2 rounded text-xs font-semibold hover:bg-purple-700">
            [STO]
          </button>
          <button onClick={handleRCL} className="bg-blue-600 text-white px-4 py-2 rounded text-xs font-semibold hover:bg-blue-700">
            [RCL]
          </button>
          <div className="text-xs text-gray-700">M: {stored.toFixed(4)}</div>
        </div>
      </div>
    </motion.div>
  );
};
