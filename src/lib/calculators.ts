import { Home, IndianRupee, Percent } from "lucide-react";

/* ---------- TYPES ---------- */

export type InputField = {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  default: number;
  suffix?: string;
};

export type CalculatorLogic = {
  inputs: InputField[];
  calculate: (values: Record<string, number>) => Record<string, number>;
};

export type CalculatorMeta = {
  id: string;
  name: string;
  description: string;
};

export type Category = {
  id: string;
  name: string;
  description: string;
  icon: any;
  calculators: CalculatorMeta[];
};

/* ---------- CALCULATION LOGIC ---------- */

export const calculatorLogic: Record<string, CalculatorLogic> = {
  mortgage: {
    inputs: [
      { id: "amount", label: "Property Price", min: 500000, max: 20000000, step: 50000, default: 3000000, suffix: "₹" },
      { id: "rate", label: "Interest Rate (%)", min: 5, max: 15, step: 0.1, default: 8.5 },
      { id: "years", label: "Loan Term (Years)", min: 5, max: 30, step: 1, default: 20 },
    ],
    calculate: ({ amount, rate, years }) => {
      const r = rate / 12 / 100;
      const n = years * 12;
      const emi = (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      return {
        "Monthly EMI": Math.round(emi),
        "Total Interest": Math.round(emi * n - amount),
        "Total Payment": Math.round(emi * n),
      };
    },
  },

  loan: {
    inputs: [
      { id: "amount", label: "Loan Amount", min: 10000, max: 5000000, step: 10000, default: 500000, suffix: "₹" },
      { id: "rate", label: "Interest Rate (%)", min: 6, max: 25, step: 0.1, default: 11 },
      { id: "months", label: "Tenure (Months)", min: 6, max: 120, step: 1, default: 36 },
    ],
    calculate: ({ amount, rate, months }) => {
      const r = rate / 12 / 100;
      const emi = (amount * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
      return {
        "Monthly EMI": Math.round(emi),
        "Total Payment": Math.round(emi * months),
      };
    },
  },

  vat: {
    inputs: [
      { id: "amount", label: "Net Amount", min: 0, max: 1000000, step: 100, default: 10000, suffix: "₹" },
      { id: "rate", label: "VAT Rate (%)", min: 0, max: 30, step: 0.5, default: 20 },
    ],
    calculate: ({ amount, rate }) => {
      const vat = (amount * rate) / 100;
      return {
        "VAT Amount": Math.round(vat),
        "Total Price": Math.round(amount + vat),
      };
    },
  },

  "tax-calculator": {
    inputs: [
      { id: "gross", label: "Gross Income (Annual €)", min: 0, max: 500000, step: 5000, default: 50000 },
    ],
    calculate: ({ gross }) => {
      const taxableIncome = Math.max(0, gross - 12570);
      const tax = Math.min(taxableIncome * 0.20, taxableIncome);
      return { "Income Tax": Math.round(tax), "Net Income": Math.round(gross - tax) };
    },
  },

  "salary-deductions": {
    inputs: [
      { id: "gross", label: "Gross Salary (€)", min: 0, max: 200000, step: 1000, default: 40000 },
    ],
    calculate: ({ gross }) => {
      const tax = Math.round(gross * 0.205);
      const prsi = Math.round(gross * 0.0875);
      const usc = Math.round(gross * 0.045);
      const total = tax + prsi + usc;
      return { "Income Tax": tax, "PRSI": prsi, "USC": usc, "Total Deductions": total };
    },
  },

  "take-home-pay": {
    inputs: [
      { id: "gross", label: "Gross Annual (€)", min: 0, max: 300000, step: 5000, default: 50000 },
    ],
    calculate: ({ gross }) => {
      const deductions = Math.round(gross * 0.335);
      const netPay = gross - deductions;
      return { "Deductions": deductions, "Net Annual Pay": Math.round(netPay), "Monthly Net": Math.round(netPay / 12) };
    },
  },

  "car-loan": {
    inputs: [
      { id: "amount", label: "Loan Amount (€)", min: 1000, max: 100000, step: 500, default: 25000, suffix: "€" },
      { id: "rate", label: "Interest Rate (% per year)", min: 1, max: 20, step: 0.1, default: 5.5 },
      { id: "years", label: "Loan Term (years)", min: 1, max: 10, step: 1, default: 5 },
    ],
    calculate: ({ amount, rate, years }) => {
      const principal = amount;
      const monthlyRate = rate / 12 / 100;
      const n = years * 12;
      const monthlyPayment = monthlyRate === 0 ? principal / n : (principal * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
      const totalPayment = monthlyPayment * n;
      const totalInterest = totalPayment - principal;
      return {
        "Monthly Payment": Math.round(monthlyPayment),
        "Total Payment": Math.round(totalPayment),
        "Total Interest": Math.round(totalInterest),
      };
    },
  },

  "car-finance": {
    inputs: [
      { id: "price", label: "Vehicle Price (€)", min: 5000, max: 150000, step: 1000, default: 35000 },
      { id: "deposit", label: "Deposit %", min: 10, max: 50, step: 5, default: 20 },
      { id: "rate", label: "APR (%)", min: 2, max: 10, step: 0.1, default: 4.9 },
      { id: "months", label: "Months", min: 12, max: 84, step: 6, default: 60 },
    ],
    calculate: ({ price, deposit, rate, months }) => {
      const dep = Math.round(price * deposit / 100);
      const fin = price - dep;
      const r = rate / 12 / 100;
      const emi = (fin * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
      return { "Deposit": dep, "Amount to Finance": Math.round(fin), "Monthly Payment": Math.round(emi), "Total Paid": Math.round(emi * months) };
    },
  },

  "credit-union-loan": {
    inputs: [
      { id: "amount", label: "Loan Amount (€)", min: 1000, max: 50000, step: 500, default: 10000 },
      { id: "rate", label: "Interest Rate (%)", min: 4, max: 15, step: 0.5, default: 7 },
      { id: "months", label: "Loan Term (Months)", min: 6, max: 120, step: 6, default: 36 },
    ],
    calculate: ({ amount, rate, months }) => {
      const r = rate / 12 / 100;
      const emi = (amount * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
      return { "Monthly Repayment": Math.round(emi), "Total Interest": Math.round(emi * months - amount), "Total Amount": Math.round(emi * months) };
    },
  },

  "credit-union-mortgage": {
    inputs: [
      { id: "price", label: "Property Price (€)", min: 100000, max: 1000000, step: 10000, default: 400000 },
      { id: "rate", label: "Interest Rate (%)", min: 2, max: 8, step: 0.1, default: 3.5 },
      { id: "years", label: "Term (Years)", min: 5, max: 40, step: 1, default: 25 },
    ],
    calculate: ({ price, rate, years }) => {
      const r = rate / 12 / 100;
      const n = years * 12;
      const emi = (price * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      return { "Monthly Repayment": Math.round(emi), "Total Interest": Math.round(emi * n - price), "Total Amount": Math.round(emi * n) };
    },
  },

  "buy-to-let": {
    inputs: [
      { id: "price", label: "Property Price (€)", min: 100000, max: 2000000, step: 20000, default: 500000 },
      { id: "rent", label: "Expected Monthly Rent (€)", min: 500, max: 10000, step: 100, default: 1500 },
      { id: "rate", label: "Interest Rate (%)", min: 2, max: 8, step: 0.1, default: 3.8 },
      { id: "years", label: "Loan Term (Years)", min: 5, max: 35, step: 1, default: 20 },
    ],
    calculate: ({ price, rent, rate, years }) => {
      const r = rate / 12 / 100;
      const n = years * 12;
      const emi = (price * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const annualRent = rent * 12;
      const roi = ((annualRent - emi * 12) / price) * 100;
      return { "Monthly Mortgage": Math.round(emi), "Monthly Rent": Math.round(rent), "ROI %": roi.toFixed(2) };
    },
  },

  /* ---------- Insurance & Pension Calculators (Global) ---------- */

  "pension-defined-benefit": {
    inputs: [
      { id: "finalSalary", label: "Final/Avg Salary (€)", min: 0, max: 1000000, step: 1000, default: 60000 },
      { id: "yearsService", label: "Years of Service", min: 0, max: 60, step: 1, default: 30 },
      { id: "accrualRate", label: "Accrual Rate (%)", min: 0.1, max: 5, step: 0.01, default: 1.25 },
    ],
    calculate: ({ finalSalary, yearsService, accrualRate }) => {
      const rate = accrualRate / 100;
      const annualPension = finalSalary * yearsService * rate;
      return { "Annual Pension": Math.round(annualPension), "Monthly Pension": Math.round(annualPension / 12) };
    },
  },

  "pension-defined-contribution": {
    inputs: [
      { id: "pot", label: "Current Pot (€)", min: 0, max: 5000000, step: 100, default: 50000 },
      { id: "monthly", label: "Monthly Contribution (€)", min: 0, max: 20000, step: 10, default: 500 },
      { id: "years", label: "Years to Retirement", min: 0, max: 60, step: 1, default: 30 },
      { id: "return", label: "Expected Annual Return (%)", min: 0, max: 20, step: 0.1, default: 5 },
    ],
    calculate: ({ pot, monthly, years, return: annualReturn }) => {
      const r = annualReturn / 100 / 12;
      const n = Math.max(0, Math.round(years * 12));
      const fvPot = pot * Math.pow(1 + r, n);
      const fvContrib = monthly * ((Math.pow(1 + r, n) - 1) / (r || 1));
      const futureValue = fvPot + fvContrib;
      const estimatedAnnualIncome = futureValue * 0.04; // simple 4% withdrawal rule
      return { "Future Value": Math.round(futureValue), "Est. Annual Income (4%)": Math.round(estimatedAnnualIncome) };
    },
  },

  "annuity": {
    inputs: [
      { id: "pot", label: "Pension Pot (€)", min: 0, max: 5000000, step: 100, default: 200000 },
      { id: "rate", label: "Annuity Rate (%)", min: 0.1, max: 20, step: 0.1, default: 5 },
    ],
    calculate: ({ pot, rate }) => {
      const annual = pot * (rate / 100);
      return { "Annual Income": Math.round(annual), "Monthly Income": Math.round(annual / 12) };
    },
  },

  "pension-max-funding": {
    inputs: [
      { id: "age", label: "Age", min: 16, max: 100, step: 1, default: 45 },
      { id: "salary", label: "Gross Annual Salary (€)", min: 0, max: 2000000, step: 1000, default: 60000 },
      { id: "existing", label: "Existing Pension Contributions (€)", min: 0, max: 2000000, step: 100, default: 5000 },
    ],
    calculate: ({ age, salary, existing }) => {
      let pct = 0.15;
      if (age < 30) pct = 0.15;
      else if (age < 40) pct = 0.20;
      else if (age < 50) pct = 0.25;
      else if (age < 55) pct = 0.30;
      else if (age < 60) pct = 0.35;
      else pct = 0.40;
      const max = Math.round(salary * pct);
      const remaining = Math.max(0, max - (existing || 0));
      return { "Max Contribution": max, "Remaining Allowance": Math.round(remaining) };
    },
  },

  "pension-single-scheme": {
    inputs: [
      { id: "careerAvg", label: "Career-average Salary (€)", min: 0, max: 2000000, step: 1000, default: 50000 },
      { id: "years", label: "Total Service (Years)", min: 0, max: 60, step: 1, default: 30 },
      { id: "accrual", label: "Accrual Rate (%)", min: 0.1, max: 5, step: 0.01, default: 0.58 },
      { id: "lump", label: "Lump Sum (€)", min: 0, max: 2000000, step: 100, default: 0 },
    ],
    calculate: ({ careerAvg, years, accrual, lump }) => {
      const rate = accrual / 100;
      const pension = careerAvg * years * rate;
      return { "Annual Pension": Math.round(pension), "Lump Sum": Math.round(lump) };
    },
  },

  /* --------------------------------------------------------------- */

  "aib-business-loan": {
    inputs: [
      { id: "amount", label: "Loan Amount (€)", min: 1000, max: 500000, step: 500, default: 50000 },
      { id: "rate", label: "Interest Rate (% p.a.)", min: 2, max: 12, step: 0.1, default: 5.5 },
      { id: "years", label: "Loan Term (Years)", min: 1, max: 10, step: 1, default: 5 },
    ],
    calculate: ({ amount, rate, years }) => {
      const r = rate / 12 / 100;
      const n = years * 12;
      const monthly = (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      return { "Monthly Repayment": Math.round(monthly), "Total Interest": Math.round(monthly * n - amount), "Total Amount": Math.round(monthly * n) };
    },
  },

  "permanent-tsb-loan": {
    inputs: [
      { id: "amount", label: "Loan Amount (€)", min: 1000, max: 500000, step: 500, default: 40000 },
      { id: "rate", label: "Interest Rate (% p.a.)", min: 2, max: 12, step: 0.1, default: 5.2 },
      { id: "years", label: "Loan Term (Years)", min: 1, max: 10, step: 1, default: 5 },
    ],
    calculate: ({ amount, rate, years }) => {
      const r = rate / 12 / 100;
      const n = years * 12;
      const monthly = (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      return { "Monthly Repayment": Math.round(monthly), "Total Cost": Math.round(monthly * n) };
    },
  },

  "bank-of-ireland-loan": {
    inputs: [
      { id: "amount", label: "Loan Amount (€)", min: 1000, max: 500000, step: 500, default: 50000 },
      { id: "rate", label: "Annual Rate (%)", min: 2, max: 12, step: 0.1, default: 5.8 },
      { id: "months", label: "Loan Term (Months)", min: 6, max: 120, step: 6, default: 60 },
    ],
    calculate: ({ amount, rate, months }) => {
      const r = rate / 12 / 100;
      const monthly = (amount * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
      return { "Monthly Payment": Math.round(monthly), "Total Interest": Math.round(monthly * months - amount), "Total Amount": Math.round(monthly * months) };
    },
  },

  "hsscu-loan": {
    inputs: [
      { id: "amount", label: "Loan Amount (€)", min: 500, max: 30000, step: 100, default: 8000 },
      { id: "rate", label: "Interest Rate (%)", min: 4, max: 12, step: 0.5, default: 6.5 },
      { id: "years", label: "Loan Term (Years)", min: 1, max: 7, step: 1, default: 3 },
    ],
    calculate: ({ amount, rate, years }) => {
      const r = rate / 12 / 100;
      const n = years * 12;
      const monthly = (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      return { "Monthly Repayment": Math.round(monthly), "Total Repaid": Math.round(monthly * n) };
    },
  },

  "spry-finance": {
    inputs: [
      { id: "amount", label: "Finance Amount (€)", min: 1000, max: 100000, step: 500, default: 25000 },
      { id: "rate", label: "APR (%)", min: 4.9, max: 15, step: 0.1, default: 8.5 },
      { id: "months", label: "Term (Months)", min: 12, max: 84, step: 1, default: 48 },
    ],
    calculate: ({ amount, rate, months }) => {
      const r = rate / 12 / 100;
      const monthly = (amount * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
      return { "Monthly Payment": Math.round(monthly), "Total Cost": Math.round(monthly * months) };
    },
  },

  "farm-loan": {
    inputs: [
      { id: "amount", label: "Loan Amount (€)", min: 5000, max: 500000, step: 1000, default: 100000 },
      { id: "rate", label: "Interest Rate (% p.a.)", min: 2, max: 10, step: 0.1, default: 4.5 },
      { id: "years", label: "Loan Term (Years)", min: 1, max: 20, step: 1, default: 10 },
    ],
    calculate: ({ amount, rate, years }) => {
      const r = rate / 12 / 100;
      const n = years * 12;
      const monthly = (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      return { "Monthly Repayment": Math.round(monthly), "Total Interest": Math.round(monthly * n - amount), "Total Repaid": Math.round(monthly * n) };
    },
  },

  "vw-pcp": {
    inputs: [
      { id: "price", label: "Car Price (€)", min: 10000, max: 100000, step: 1000, default: 40000 },
      { id: "deposit", label: "Deposit (€)", min: 2000, max: 30000, step: 500, default: 8000 },
      { id: "balloon", label: "Guaranteed Future Value (€)", min: 5000, max: 50000, step: 1000, default: 18000 },
      { id: "rate", label: "Interest Rate (%)", min: 2, max: 8, step: 0.1, default: 4.5 },
      { id: "months", label: "Term (Months)", min: 24, max: 60, step: 6, default: 48 },
    ],
    calculate: ({ price, deposit, balloon, rate, months }) => {
      const capitalize = price - deposit - balloon;
      const r = rate / 12 / 100;
      const monthly = (capitalize * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
      return { "Monthly Payment": Math.round(monthly), "Final Balloon": Math.round(balloon), "Total Cost": Math.round(monthly * months + deposit + balloon) };
    },
  },

  "audi-loan": {
    inputs: [
      { id: "price", label: "Vehicle Price (€)", min: 15000, max: 150000, step: 1000, default: 50000 },
      { id: "deposit", label: "Deposit %", min: 10, max: 50, step: 5, default: 20 },
      { id: "rate", label: "Interest Rate (%)", min: 2.9, max: 8, step: 0.1, default: 4.9 },
      { id: "years", label: "Loan Term (Years)", min: 1, max: 7, step: 1, default: 5 },
    ],
    calculate: ({ price, deposit, rate, years }) => {
      const dep = Math.round(price * deposit / 100);
      const fin = price - dep;
      const r = rate / 12 / 100;
      const n = years * 12;
      const monthly = (fin * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      return { "Deposit": dep, "Monthly Payment": Math.round(monthly), "Total Interest": Math.round(monthly * n - fin) };
    },
  },

  "kia-loan": {
    inputs: [
      { id: "price", label: "Vehicle Price (€)", min: 10000, max: 80000, step: 500, default: 35000 },
      { id: "down", label: "Down Payment (€)", min: 1000, max: 40000, step: 500, default: 7000 },
      { id: "rate", label: "APR (%)", min: 2.9, max: 9, step: 0.1, default: 5.2 },
      { id: "months", label: "Months", min: 24, max: 84, step: 12, default: 60 },
    ],
    calculate: ({ price, down, rate, months }) => {
      const fin = price - down;
      const r = rate / 12 / 100;
      const monthly = (fin * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
      return { "Monthly Payment": Math.round(monthly), "Total Paid": Math.round(monthly * months), "Down Payment": down };
    },
  },

  "hyundai-loan": {
    inputs: [
      { id: "price", label: "Vehicle Price (€)", min: 10000, max: 80000, step: 500, default: 38000 },
      { id: "down", label: "Down Payment (€)", min: 1000, max: 40000, step: 500, default: 7600 },
      { id: "rate", label: "Interest Rate (%)", min: 2.5, max: 9, step: 0.1, default: 5.0 },
      { id: "years", label: "Loan Term (Years)", min: 1, max: 7, step: 1, default: 5 },
    ],
    calculate: ({ price, down, rate, years }) => {
      const fin = price - down;
      const r = rate / 12 / 100;
      const n = years * 12;
      const monthly = (fin * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      return { "Monthly Payment": Math.round(monthly), "Total Cost": Math.round(monthly * n + down) };
    },
  },

  "peugeot-loan": {
    inputs: [
      { id: "price", label: "Vehicle Price (€)", min: 12000, max: 90000, step: 500, default: 42000 },
      { id: "down", label: "Down Payment (€)", min: 1000, max: 45000, step: 500, default: 8400 },
      { id: "rate", label: "Rate (%)", min: 2.9, max: 8.5, step: 0.1, default: 5.1 },
      { id: "months", label: "Finance Term (Months)", min: 24, max: 84, step: 6, default: 60 },
    ],
    calculate: ({ price, down, rate, months }) => {
      const fin = price - down;
      const r = rate / 12 / 100;
      const monthly = (fin * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
      return { "Monthly Payment": Math.round(monthly), "Total Interest": Math.round(monthly * months - fin) };
    },
  },

  "skoda-loan": {
    inputs: [
      { id: "price", label: "Vehicle Price (€)", min: 10000, max: 85000, step: 500, default: 36000 },
      { id: "deposit", label: "Deposit %", min: 15, max: 50, step: 5, default: 20 },
      { id: "rate", label: "APR (%)", min: 2.8, max: 8, step: 0.1, default: 4.8 },
      { id: "years", label: "Term (Years)", min: 1, max: 7, step: 1, default: 5 },
    ],
    calculate: ({ price, deposit, rate, years }) => {
      const dep = Math.round(price * deposit / 100);
      const fin = price - dep;
      const r = rate / 12 / 100;
      const n = years * 12;
      const monthly = (fin * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      return { "Deposit": dep, "Monthly Payment": Math.round(monthly), "Total Financed": Math.round(fin) };
    },
  },

  "skoda-pcp": {
    inputs: [
      { id: "price", label: "Vehicle Price (€)", min: 10000, max: 85000, step: 500, default: 36000 },
      { id: "deposit", label: "Deposit €", min: 2000, max: 25000, step: 500, default: 5400 },
      { id: "residual", label: "Residual Value (€)", min: 5000, max: 40000, step: 500, default: 16200 },
      { id: "rate", label: "APR (%)", min: 2.5, max: 7, step: 0.1, default: 4.2 },
      { id: "months", label: "Months", min: 24, max: 60, step: 6, default: 48 },
    ],
    calculate: ({ price, deposit, residual, rate, months }) => {
      const capitalize = price - deposit - residual;
      const r = rate / 12 / 100;
      const monthly = (capitalize * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
      return { "Monthly Payment": Math.round(monthly), "Residual Value": residual, "Total Paid": Math.round(monthly * months + deposit + residual) };
    },
  },

  "volkswagen-pcp": {
    inputs: [
      { id: "price", label: "Vehicle Price (€)", min: 12000, max: 100000, step: 500, default: 50000 },
      { id: "deposit", label: "Initial Payment (€)", min: 2000, max: 35000, step: 500, default: 10000 },
      { id: "gfv", label: "Guaranteed Future Value (€)", min: 5000, max: 50000, step: 1000, default: 20000 },
      { id: "rate", label: "APR (%)", min: 2.2, max: 7.5, step: 0.1, default: 4.5 },
      { id: "months", label: "Term (Months)", min: 24, max: 60, step: 6, default: 48 },
    ],
    calculate: ({ price, deposit, gfv, rate, months }) => {
      const capitalize = price - deposit - gfv;
      const r = rate / 12 / 100;
      const monthly = (capitalize * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
      return { "Monthly Payment": Math.round(monthly), "Final Payment": gfv, "Total Paid": Math.round(monthly * months + deposit + gfv) };
    },
  },

  "hyundai-pcp": {
    inputs: [
      { id: "price", label: "Vehicle Price (€)", min: 10000, max: 80000, step: 500, default: 38000 },
      { id: "down", label: "Down Payment (€)", min: 2000, max: 20000, step: 500, default: 5700 },
      { id: "gfv", label: "Guaranteed Future Value (€)", min: 3000, max: 35000, step: 500, default: 17100 },
      { id: "rate", label: "Interest Rate (%)", min: 2.2, max: 7, step: 0.1, default: 4.2 },
      { id: "months", label: "Months", min: 24, max: 60, step: 6, default: 48 },
    ],
    calculate: ({ price, down, gfv, rate, months }) => {
      const capitalize = price - down - gfv;
      const r = rate / 12 / 100;
      const monthly = (capitalize * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
      return { "Monthly: €": Math.round(monthly), "Residual €": gfv, "Total €": Math.round(monthly * months + down + gfv) };
    },
  },

  "aib-mortgage-overpayment": {
    inputs: [
      { id: "balance", label: "Current Mortgage Balance (€)", min: 50000, max: 5000000, step: 10000, default: 400000 },
      { id: "rate", label: "Interest Rate (%)", min: 1.5, max: 8, step: 0.1, default: 3.5 },
      { id: "years", label: "Remaining Mortgage (Years)", min: 1, max: 30, step: 1, default: 20 },
      { id: "overpay", label: "Extra Monthly Payment (€)", min: 0, max: 5000, step: 100, default: 200 },
    ],
    calculate: ({ balance, rate, years, overpay }) => {
      const r = rate / 12 / 100;
      const n = years * 12;
      const monthly = (balance * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const totalWithOverpay = (monthly + overpay) * n;
      const saved = (monthly * n) - totalWithOverpay;
      return { "Standard Monthly": Math.round(monthly), "With Extra": Math.round(monthly + overpay), "Savings": Math.round(saved) };
    },
  },

  "topup-mortgage": {
    inputs: [
      { id: "existing", label: "Existing Mortgage (€)", min: 50000, max: 3000000, step: 10000, default: 300000 },
      { id: "topup", label: "Top-Up Amount (€)", min: 5000, max: 500000, step: 5000, default: 50000 },
      { id: "rate", label: "Interest Rate (%)", min: 1.5, max: 8, step: 0.1, default: 3.8 },
      { id: "years", label: "Years", min: 1, max: 35, step: 1, default: 20 },
    ],
    calculate: ({ existing, topup, rate, years }) => {
      const total = existing + topup;
      const r = rate / 12 / 100;
      const n = years * 12;
      const monthly = (total * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      return { "Total Borrowed": total, "Monthly Payment": Math.round(monthly), "Total Interest": Math.round(monthly * n - total) };
    },
  },

  "self-build-mortgage": {
    inputs: [
      { id: "landCost", label: "Land Cost (€)", min: 20000, max: 500000, step: 10000, default: 100000 },
      { id: "buildCost", label: "Build Cost (€)", min: 50000, max: 500000, step: 10000, default: 200000 },
      { id: "rate", label: "Interest Rate (%)", min: 1.5, max: 8, step: 0.1, default: 3.5 },
      { id: "years", label: "Mortgage Term (Years)", min: 5, max: 35, step: 1, default: 25 },
    ],
    calculate: ({ landCost, buildCost, rate, years }) => {
      const total = landCost + buildCost;
      const r = rate / 12 / 100;
      const n = years * 12;
      const monthly = (total * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      return { "Total Project Cost": total, "Monthly Payment": Math.round(monthly), "Total Interest": Math.round(monthly * n - total) };
    },
  },

  "mortgage-switch": {
    inputs: [
      { id: "balance", label: "Current Balance (€)", min: 50000, max: 3000000, step: 10000, default: 400000 },
      { id: "currentRate", label: "Current Rate (%)", min: 1, max: 8, step: 0.1, default: 5.0 },
      { id: "newRate", label: "New Rate (%)", min: 1, max: 8, step: 0.1, default: 3.5 },
      { id: "years", label: "Remaining Years", min: 1, max: 35, step: 1, default: 20 },
    ],
    calculate: ({ balance, currentRate, newRate, years }) => {
      const r1 = currentRate / 12 / 100;
      const r2 = newRate / 12 / 100;
      const n = years * 12;
      const currentMonthly = (balance * r1 * Math.pow(1 + r1, n)) / (Math.pow(1 + r1, n) - 1);
      const newMonthly = (balance * r2 * Math.pow(1 + r2, n)) / (Math.pow(1 + r2, n) - 1);
      const savings = (currentMonthly - newMonthly) * n;
      return { "Current Monthly": Math.round(currentMonthly), "New Monthly": Math.round(newMonthly), "Total Savings": Math.round(savings) };
    },
  },

  "investment-mortgage": {
    inputs: [
      { id: "amount", label: "Mortgage Amount (€)", min: 100000, max: 2000000, step: 20000, default: 500000 },
      { id: "income", label: "Expected Annual Income (€)", min: 5000, max: 100000, step: 1000, default: 30000 },
      { id: "rate", label: "Interest Rate (%)", min: 2, max: 8, step: 0.1, default: 4.0 },
      { id: "years", label: "Mortgage Term (Years)", min: 5, max: 30, step: 1, default: 20 },
    ],
    calculate: ({ amount, income, rate, years }) => {
      const r = rate / 12 / 100;
      const n = years * 12;
      const monthly = (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const annualCost = monthly * 12;
      const netIncome = income - annualCost;
      const roi = (income / amount) * 100;
      return { "Monthly Payment": Math.round(monthly), "Annual Income": Math.round(income), "Net Return %": roi.toFixed(2) };
    },
  },

  "commercial-loan": {
    inputs: [
      { id: "amount", label: "Loan Amount (€)", min: 10000, max: 5000000, step: 10000, default: 250000 },
      { id: "rate", label: "Interest Rate (% p.a.)", min: 2, max: 10, step: 0.1, default: 5.5 },
      { id: "years", label: "Loan Term (Years)", min: 1, max: 25, step: 1, default: 10 },
    ],
    calculate: ({ amount, rate, years }) => {
      const r = rate / 12 / 100;
      const n = years * 12;
      const monthly = (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      return { "Monthly Payment": Math.round(monthly), "Total Interest": Math.round(monthly * n - amount), "Total Cost": Math.round(monthly * n) };
    },
  },

  "business-loan-general": {
    inputs: [
      { id: "amount", label: "Loan Amount (€)", min: 5000, max: 1000000, step: 5000, default: 100000 },
      { id: "rate", label: "Interest Rate (% p.a.)", min: 2, max: 15, step: 0.5, default: 7.0 },
      { id: "years", label: "Loan Term (Years)", min: 1, max: 10, step: 1, default: 5 },
    ],
    calculate: ({ amount, rate, years }) => {
      const r = rate / 12 / 100;
      const n = years * 12;
      const monthly = (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      return { "Monthly Repayment": Math.round(monthly), "Total Interest": Math.round(monthly * n - amount), "Total Repaid": Math.round(monthly * n) };
    },
  },

  "loan-interest-calculator": {
    inputs: [
      { id: "principal", label: "Principal Amount (€)", min: 100, max: 10000000, step: 100, default: 50000 },
      { id: "rate", label: "Interest Rate (% p.a.)", min: 0.1, max: 25, step: 0.1, default: 5.0 },
      { id: "years", label: "Time Period (Years)", min: 0.25, max: 50, step: 0.25, default: 5 },
    ],
    calculate: ({ principal, rate, years }) => {
      const interest = (principal * rate * years) / 100;
      const total = principal + interest;
      return { "Interest": Math.round(interest), "Total Amount": Math.round(total) };
    },
  },

  "equity-release": {
    inputs: [
      { id: "propertyValue", label: "Property Value (€)", min: 100000, max: 5000000, step: 50000, default: 500000 },
      { id: "age", label: "Your Age", min: 55, max: 95, step: 1, default: 75 },
      { id: "ltv", label: "LTV Percentage (%)", min: 10, max: 50, step: 5, default: 25 },
    ],
    calculate: ({ propertyValue, age, ltv }) => {
      const lumpSum = (propertyValue * ltv) / 100;
      const adjustedSum = lumpSum * (1 - (age - 60) * 0.02);
      return { "Maximum Available": Math.round(Math.max(0, adjustedSum)), "Property Value": propertyValue };
    },
  },

  "stamp-duty": {
    inputs: [
      { id: "price", label: "Property Price (€)", min: 100000, max: 2000000, step: 10000, default: 400000 },
      { id: "buyerType", label: "Buyer Type (1=First-Time, 2=Residential, 3=Non-Residential)", min: 1, max: 3, step: 1, default: 1 },
    ],
    calculate: ({ price, buyerType }) => {
      let duty = 0;
      if (buyerType === 1) {
        if (price <= 500000) duty = 0;
        else duty = (price - 500000) * 0.10;
      } else if (buyerType === 2) {
        if (price <= 1000000) duty = price * 0.01;
        else duty = 10000 + (price - 1000000) * 0.02;
      } else {
        duty = price * 0.025;
      }
      return { "Stamp Duty": Math.round(duty), "Total Cost": Math.round(price + duty) };
    },
  },

  "online-property-value": {
    inputs: [
      { id: "size", label: "Property Size (m²)", min: 50, max: 1000, step: 10, default: 150 },
      { id: "bedrooms", label: "Number of Bedrooms", min: 1, max: 10, step: 1, default: 3 },
      { id: "bathrooms", label: "Number of Bathrooms", min: 1, max: 5, step: 1, default: 2 },
      { id: "localPrice", label: "Average Local Price (€/m²)", min: 2000, max: 10000, step: 500, default: 5000 },
    ],
    calculate: ({ size, bedrooms, bathrooms, localPrice }) => {
      const baseValue = size * localPrice;
      const bedroomBonus = bedrooms * 15000;
      const bathroomBonus = bathrooms * 8000;
      const estimatedValue = baseValue + bedroomBonus + bathroomBonus;
      return { "Base Value": Math.round(baseValue), "Estimated Value": Math.round(estimatedValue), "Price/m²": localPrice };
    },
  },

  "cost-of-building-house": {
    inputs: [
      { id: "area", label: "Total Floor Area (m²)", min: 100, max: 500, step: 10, default: 200 },
      { id: "buildRate", label: "Build Rate (€/m²)", min: 1000, max: 3500, step: 100, default: 2000 },
    ],
    calculate: ({ area, buildRate }) => {
      const baseCost = area * buildRate;
      const contingency = Math.round(baseCost * 0.15);
      const fees = Math.round(baseCost * 0.08);
      const total = baseCost + contingency + fees;
      return { "Base Build Cost": Math.round(baseCost), "Contingency (15%)": contingency, "Professional Fees (8%)": fees, "Total": Math.round(total) };
    },
  },

  "build-2000-sqft-house": {
    inputs: [
      { id: "sqft", label: "House Size (sq ft)", min: 1000, max: 5000, step: 100, default: 2000 },
      { id: "ratePerSqft", label: "Build Rate (€ per sq ft)", min: 150, max: 350, step: 10, default: 250 },
    ],
    calculate: ({ sqft, ratePerSqft }) => {
      const totalCost = sqft * ratePerSqft;
      const m2Area = sqft / 10.764;
      const costPerM2 = totalCost / m2Area;
      return { "Total Build Cost": Math.round(totalCost), "Area (m²)": Math.round(m2Area), "Cost per m²": Math.round(costPerM2) };
    },
  },

  "extension-cost-ireland": {
    inputs: [
      { id: "size", label: "Extension Size (m²)", min: 10, max: 100, step: 5, default: 30 },
      { id: "storeys", label: "Storeys (1 or 2)", min: 1, max: 2, step: 1, default: 1 },
      { id: "costPerM2", label: "Cost per m² (€)", min: 1000, max: 3000, step: 100, default: 1800 },
    ],
    calculate: ({ size, storeys, costPerM2 }) => {
      const multiplier = storeys === 1 ? 1 : 1.3;
      const baseCost = size * costPerM2 * multiplier;
      const labour = Math.round(baseCost * 0.25);
      const total = baseCost + labour;
      return { "Material Cost": Math.round(baseCost), "Labour": labour, "Total Extension Cost": Math.round(total) };
    },
  },

  "renovation-cost-ireland": {
    inputs: [
      { id: "area", label: "Total Area (m²)", min: 20, max: 300, step: 10, default: 100 },
      { id: "costPerM2", label: "Renovation Cost (€/m²)", min: 500, max: 2500, step: 100, default: 1200 },
    ],
    calculate: ({ area, costPerM2 }) => {
      const totalCost = area * costPerM2;
      const labour = Math.round(totalCost * 0.30);
      const materials = totalCost - labour;
      return { "Materials": Math.round(materials), "Labour": labour, "Total Renovation": Math.round(totalCost) };
    },
  },

  "conservatory-cost-ireland": {
    inputs: [
      { id: "size", label: "Conservatory Size (m²)", min: 10, max: 100, step: 5, default: 30 },
      { id: "costPerM2", label: "Cost per m² (€)", min: 800, max: 2000, step: 100, default: 1200 },
    ],
    calculate: ({ size, costPerM2 }) => {
      const baseCost = size * costPerM2;
      const foundations = Math.round(baseCost * 0.15);
      const total = baseCost + foundations;
      return { "Structure Cost": Math.round(baseCost), "Foundations": foundations, "Total Conservatory": Math.round(total) };
    },
  },

  "kitchen-cost-ireland": {
    inputs: [
      { id: "length", label: "Kitchen Length (meters)", min: 2, max: 6, step: 0.5, default: 3 },
      { id: "costPerMeter", label: "Cost per Linear Meter (€)", min: 1000, max: 3000, step: 100, default: 1500 },
      { id: "appliances", label: "Appliances Cost (€)", min: 0, max: 10000, step: 500, default: 3000 },
    ],
    calculate: ({ length, costPerMeter, appliances }) => {
      const cabinets = length * costPerMeter;
      const worktop = length * 800;
      const labour = Math.round((cabinets + worktop) * 0.25);
      const total = cabinets + worktop + appliances + labour;
      return { "Cabinetry": Math.round(cabinets), "Worktop": Math.round(worktop), "Appliances": appliances, "Labour": labour, "Total Kitchen": Math.round(total) };
    },
  },

  "bathroom-cost-ireland": {
    inputs: [
      { id: "items", label: "Number of Bathroom Items (toilet/shower/sink)", min: 2, max: 10, step: 1, default: 4 },
      { id: "itemCost", label: "Cost per Item (€)", min: 200, max: 1500, step: 100, default: 500 },
      { id: "tiling", label: "Tiling Area (m²)", min: 5, max: 50, step: 1, default: 15 },
    ],
    calculate: ({ items, itemCost, tiling }) => {
      const sanitaryware = items * itemCost;
      const tilingCost = tiling * 600;
      const labour = Math.round((sanitaryware + tilingCost) * 0.30);
      const total = sanitaryware + tilingCost + labour;
      return { "Sanitaryware": sanitaryware, "Tiling": Math.round(tilingCost), "Labour": labour, "Total Bathroom": Math.round(total) };
    },
  },

  "roof-cost-ireland": {
    inputs: [
      { id: "area", label: "Roof Area (m²)", min: 30, max: 200, step: 10, default: 80 },
      { id: "costPerM2", label: "Cost per m² (€)", min: 300, max: 800, step: 50, default: 500 },
    ],
    calculate: ({ area, costPerM2 }) => {
      const material = area * costPerM2;
      const labour = Math.round(material * 0.35);
      const scaffolding = Math.round(material * 0.10);
      const total = material + labour + scaffolding;
      return { "Material": Math.round(material), "Labour": labour, "Scaffolding": scaffolding, "Total Roof": Math.round(total) };
    },
  },

  "flooring-cost-ireland": {
    inputs: [
      { id: "area", label: "Floor Area (m²)", min: 20, max: 300, step: 10, default: 100 },
      { id: "costPerM2", label: "Material Cost (€/m²)", min: 30, max: 200, step: 10, default: 80 },
    ],
    calculate: ({ area, costPerM2 }) => {
      const material = area * costPerM2;
      const underlay = Math.round(area * 20);
      const labour = Math.round((material + underlay) * 0.25);
      const total = material + underlay + labour;
      return { "Material": Math.round(material), "Underlay": underlay, "Labour": labour, "Total Flooring": Math.round(total) };
    },
  },

  "window-cost-ireland": {
    inputs: [
      { id: "windows", label: "Number of Windows", min: 1, max: 20, step: 1, default: 8 },
      { id: "costPerWindow", label: "Cost per Window (€)", min: 300, max: 1000, step: 50, default: 600 },
    ],
    calculate: ({ windows, costPerWindow }) => {
      const materialCost = windows * costPerWindow;
      const labour = Math.round(materialCost * 0.20);
      const total = materialCost + labour;
      return { "Windows": materialCost, "Installation": labour, "Total Window Cost": Math.round(total) };
    },
  },

  "triple-glazing-cost": {
    inputs: [
      { id: "area", label: "Total Glazing Area (m²)", min: 5, max: 50, step: 1, default: 15 },
      { id: "costPerM2", label: "Cost per m² (€)", min: 400, max: 800, step: 50, default: 600 },
    ],
    calculate: ({ area, costPerM2 }) => {
      const glazing = area * costPerM2;
      const frame = Math.round(area * 300);
      const installation = Math.round((glazing + frame) * 0.15);
      const total = glazing + frame + installation;
      return { "Glazing": Math.round(glazing), "Frame": frame, "Installation": installation, "Total Triple Glazing": Math.round(total) };
    },
  },

  "external-wall-insulation": {
    inputs: [
      { id: "area", label: "External Wall Area (m²)", min: 50, max: 300, step: 10, default: 150 },
      { id: "costPerM2", label: "Total Cost per m² (€)", min: 100, max: 300, step: 20, default: 180 },
    ],
    calculate: ({ area, costPerM2 }) => {
      const material = area * costPerM2;
      const scaffolding = Math.round(area * 15);
      const labour = Math.round(material * 0.25);
      const total = material + scaffolding + labour;
      return { "Material & Render": Math.round(material), "Scaffolding": scaffolding, "Labour": labour, "Total EWI": Math.round(total) };
    },
  },

  "house-rewiring-cost": {
    inputs: [
      { id: "rooms", label: "Number of Rooms", min: 2, max: 10, step: 1, default: 5 },
      { id: "costPerRoom", label: "Cost per Room (€)", min: 500, max: 1500, step: 100, default: 800 },
    ],
    calculate: ({ rooms, costPerRoom }) => {
      const baseCost = rooms * costPerRoom;
      const consumerUnit = 800;
      const testing = Math.round(baseCost * 0.10);
      const total = baseCost + consumerUnit + testing;
      return { "Wiring": Math.round(baseCost), "Consumer Unit": consumerUnit, "Testing": testing, "Total Rewiring": Math.round(total) };
    },
  },

  "decking-calculator": {
    inputs: [
      { id: "area", label: "Deck Area (m²)", min: 10, max: 100, step: 5, default: 30 },
      { id: "costPerM2", label: "Material Cost (€/m²)", min: 100, max: 400, step: 50, default: 200 },
    ],
    calculate: ({ area, costPerM2 }) => {
      const material = area * costPerM2;
      const frame = Math.round(material * 0.30);
      const labour = Math.round((material + frame) * 0.25);
      const total = material + frame + labour;
      return { "Decking Material": Math.round(material), "Frame/Joists": frame, "Labour": labour, "Total Decking": Math.round(total) };
    },
  },

  "tarmac-driveway-ireland": {
    inputs: [
      { id: "area", label: "Driveway Area (m²)", min: 20, max: 200, step: 10, default: 50 },
      { id: "costPerM2", label: "Cost per m² (€)", min: 30, max: 100, step: 10, default: 50 },
    ],
    calculate: ({ area, costPerM2 }) => {
      const tarmac = area * costPerM2;
      const subBase = Math.round(area * 20);
      const edging = Math.round(area * 10);
      const total = tarmac + subBase + edging;
      return { "Tarmac": Math.round(tarmac), "Sub-Base": subBase, "Edging": edging, "Total Driveway": Math.round(total) };
    },
  },

  "fitted-wardrobe-calculator": {
    inputs: [
      { id: "width", label: "Wardrobe Width (meters)", min: 1, max: 3, step: 0.5, default: 2 },
      { id: "costPerMeter", label: "Cost per Linear Meter (€)", min: 800, max: 2000, step: 100, default: 1200 },
    ],
    calculate: ({ width, costPerMeter }) => {
      const baseCost = width * costPerMeter;
      const internalFittings = Math.round(baseCost * 0.20);
      const installation = Math.round(baseCost * 0.15);
      const total = baseCost + internalFittings + installation;
      return { "Cabinet": Math.round(baseCost), "Internal Fittings": internalFittings, "Installation": installation, "Total Wardrobe": Math.round(total) };
    },
  },

  "tree-removal-calculator": {
    inputs: [
      { id: "height", label: "Tree Height (meters)", min: 5, max: 40, step: 2, default: 15 },
      { id: "accessDiff", label: "Access Difficulty (1=Easy, 2=Medium, 3=Hard)", min: 1, max: 3, step: 1, default: 2 },
    ],
    calculate: ({ height, accessDiff }) => {
      const baseRate = 80;
      const baseCost = height * baseRate;
      const difficultyMultiplier = accessDiff === 1 ? 1 : accessDiff === 2 ? 1.4 : 2;
      const adjusted = baseCost * difficultyMultiplier;
      const stumpRemoval = Math.round(adjusted * 0.20);
      const total = adjusted + stumpRemoval;
      return { "Tree Removal": Math.round(adjusted), "Stump Removal": stumpRemoval, "Total": Math.round(total) };
    },
  },

  "cycle-to-work-ireland": {
    inputs: [
      { id: "bikeValue", label: "Bike & Equipment Value (€)", min: 200, max: 1000, step: 50, default: 600 },
      { id: "taxRate", label: "Your Marginal Tax Rate (%)", min: 20, max: 45, step: 1, default: 20 },
    ],
    calculate: ({ bikeValue, taxRate }) => {
      const taxSavings = Math.round(bikeValue * (taxRate / 100));
      const netCost = bikeValue - taxSavings;
      return { "Gross Price": bikeValue, "Tax Saving": taxSavings, "Net Cost": Math.round(netCost) };
    },
  },

  "solar-calculator-ireland": {
    inputs: [
      { id: "systemSize", label: "System Size (kWp)", min: 2, max: 10, step: 0.5, default: 4 },
      { id: "annualSavings", label: "Estimated Annual Savings (€)", min: 200, max: 2000, step: 100, default: 800 },
      { id: "systemCost", label: "System Cost (€)", min: 5000, max: 20000, step: 500, default: 10000 },
    ],
    calculate: ({ systemSize, annualSavings, systemCost }) => {
      const paybackYears = systemCost / annualSavings;
      const savings20Years = annualSavings * 20;
      const roi = ((savings20Years - systemCost) / systemCost) * 100;
      return { "System Size": systemSize, "Payback Period (years)": paybackYears.toFixed(1), "20-Year Savings": Math.round(savings20Years), "ROI %": roi.toFixed(1) };
    },
  },

  "hse-pension": {
    inputs: [
      { id: "salary", label: "Final Salary (€)", min: 20000, max: 200000, step: 5000, default: 60000 },
      { id: "years", label: "Service Years", min: 5, max: 45, step: 1, default: 30 },
    ],
    calculate: ({ salary, years }) => {
      const pension = (salary * years) / 80;
      const lump = pension * 3;
      return { "Annual Pension": Math.round(pension), "Lump Sum": Math.round(lump), "Monthly Pension": Math.round(pension / 12) };
    },
  },

  "hse-retirement": {
    inputs: [
      { id: "current", label: "Current Age", min: 30, max: 70, step: 1, default: 55 },
      { id: "retire", label: "Retirement Age", min: 60, max: 75, step: 1, default: 65 },
      { id: "salary", label: "Annual Salary (€)", min: 30000, max: 150000, step: 5000, default: 75000 },
    ],
    calculate: ({ current, retire, salary }) => {
      const yearsToRetirement = retire - current;
      const estPension = Math.round((salary * yearsToRetirement) / 80);
      return { "Years to Retirement": yearsToRetirement, "Estimated Pension": estPension, "Monthly Pension": Math.round(estPension / 12) };
    },
  },

  "hse-annual-leave": {
    inputs: [
      { id: "days", label: "Annual Leave Days", min: 15, max: 30, step: 1, default: 22 },
      { id: "used", label: "Days Used", min: 0, max: 30, step: 1, default: 10 },
    ],
    calculate: ({ days, used }) => {
      const remaining = days - used;
      const approxValue = remaining * 250;
      return { "Days Remaining": remaining, "Approx Value (€)": approxValue };
    },
  },

  "into-pension": {
    inputs: [
      { id: "salary", label: "Annual Salary (€)", min: 20000, max: 120000, step: 5000, default: 50000 },
      { id: "years", label: "Service Years", min: 5, max: 45, step: 1, default: 25 },
    ],
    calculate: ({ salary, years }) => {
      const pension = (salary * years * 0.02);
      return { "Annual Pension": Math.round(pension), "Monthly Pension": Math.round(pension / 12) };
    },
  },

  "new-ireland-pension": {
    inputs: [
      { id: "monthlyContribution", label: "Monthly Contribution (€)", min: 50, max: 5000, step: 50, default: 500 },
      { id: "rate", label: "Annual Growth Rate (%)", min: 2, max: 10, step: 0.5, default: 5 },
      { id: "years", label: "Investment Period (Years)", min: 5, max: 50, step: 1, default: 20 },
    ],
    calculate: ({ monthlyContribution, rate, years }) => {
      const monthlyRate = rate / 12 / 100;
      const months = years * 12;
      const fv = monthlyContribution * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate));
      const contributed = monthlyContribution * months;
      const growth = fv - contributed;
      return { "Projected Value": Math.round(fv), "Contributed": Math.round(contributed), "Growth": Math.round(growth) };
    },
  },

  "annuity-calculator": {
    inputs: [
      { id: "pot", label: "Pension Pot", min: 1000, max: 10000000, step: 100, default: 100000 },
      { id: "rate", label: "Annuity Rate (%)", min: 0.5, max: 10, step: 0.1, default: 4 },
    ],
    calculate: ({ pot, rate }) => {
      const income = pot * (Number(rate) / 100);
      return { "Estimated Annual Income": Math.round(income), "Estimated Monthly Income": Math.round(income / 12) };
    },
  },

  "max-funding": {
    inputs: [
      { id: "age", label: "Age", min: 18, max: 75, step: 1, default: 45 },
      { id: "salary", label: "Gross Salary", min: 1000, max: 1000000, step: 100, default: 60000 },
    ],
    calculate: ({ age, salary }) => {
      const a = Number(age);
      let limitPct = 0.15;
      if (a >= 50) limitPct = 0.30;
      else if (a >= 40) limitPct = 0.25;
      const max = Math.round(salary * limitPct);
      return { "Max Annual Contribution": max, "Contribution %": (limitPct * 100).toFixed(0) };
    },
  },

  "single-pension-scheme": {
    inputs: [
      { id: "avgSalary", label: "Career-average Salary", min: 10000, max: 500000, step: 500, default: 45000 },
      { id: "years", label: "Years of Service", min: 1, max: 50, step: 1, default: 30 },
      { id: "accrual", label: "Accrual Rate (%)", min: 0.1, max: 5, step: 0.1, default: 0.58 },
    ],
    calculate: ({ avgSalary, years, accrual }) => {
      const pension = (Number(avgSalary) * Number(years) * (Number(accrual) / 100));
      const lump = Math.round(pension * 3);
      return { "Annual Pension": Math.round(pension), "Lump Sum": lump };
    },
  },

  "life-insurance": {
    inputs: [
      { id: "debts", label: "Total Debts", min: 0, max: 10000000, step: 100, default: 50000 },
      { id: "income", label: "Annual Income", min: 0, max: 1000000, step: 1000, default: 40000 },
      { id: "years", label: "Years to Replace", min: 1, max: 50, step: 1, default: 10 },
      { id: "assets", label: "Existing Assets", min: 0, max: 10000000, step: 100, default: 10000 },
    ],
    calculate: ({ debts, income, years, assets }) => {
      const cover = Number(debts) + Number(income) * Number(years) - Number(assets);
      return { "Recommended Cover": Math.max(0, Math.round(cover)) };
    },
  },

  "mortgage-protection": {
    inputs: [
      { id: "mortgage", label: "Outstanding Mortgage", min: 0, max: 10000000, step: 100, default: 200000 },
      { id: "term", label: "Years Remaining", min: 1, max: 40, step: 1, default: 20 },
    ],
    calculate: ({ mortgage, term }) => {
      return { "Suggested Cover": Math.round(mortgage), "Years Remaining": term };
    },
  },

  "income-protection": {
    inputs: [
      { id: "monthlyIncome", label: "Monthly Gross Income", min: 0, max: 200000, step: 100, default: 3000 },
      { id: "replacePct", label: "Replacement %", min: 10, max: 100, step: 5, default: 60 },
      { id: "deferMonths", label: "Deferred Months", min: 0, max: 12, step: 1, default: 3 },
    ],
    calculate: ({ monthlyIncome, replacePct, deferMonths }) => {
      const monthlyBenefit = (Number(monthlyIncome) * Number(replacePct)) / 100;
      return { "Monthly Benefit": Math.round(monthlyBenefit), "Deferred Months": deferMonths };
    },
  },

  "maternity-leave": {
    inputs: [
      { id: "salary", label: "Weekly Wage (€)", min: 200, max: 3000, step: 50, default: 600 },
    ],
    calculate: ({ salary }) => {
      const standardWeeks = 26;
      const additionalWeeks = 16;
      const paidWeeks = 16;
      const unpaidWeeks = standardWeeks - paidWeeks + additionalWeeks;
      const totalPay = salary * paidWeeks;
      return { "Paid Leave Weeks": paidWeeks, "Unpaid Weeks": unpaidWeeks, "Total Payment": Math.round(totalPay) };
    },
  },

  "into-maternity": {
    inputs: [
      { id: "salary", label: "Annual Salary (€)", min: 20000, max: 100000, step: 5000, default: 50000 },
    ],
    calculate: ({ salary }) => {
      const maternityBenefit = Math.round(salary * 0.80 * 26 / 52);
      return { "Expected Maternity Payment": maternityBenefit };
    },
  },

  "maternity-date": {
    inputs: [
      { id: "daysEarly", label: "Days Before Due Date", min: 8, max: 21, step: 1, default: 14 },
    ],
    calculate: ({ daysEarly }) => {
      return { "Leave Start (days before due)": daysEarly, "Standard Duration": 26, "Optional Extended": 16 };
    },
  },

  "annual-leave": {
    inputs: [
      { id: "daysPerYear", label: "Entitled Days per Year", min: 15, max: 35, step: 1, default: 22 },
      { id: "daysUsed", label: "Days Used This Year", min: 0, max: 35, step: 1, default: 12 },
    ],
    calculate: ({ daysPerYear, daysUsed }) => {
      const remaining = daysPerYear - daysUsed;
      const carryOver = Math.min(remaining, 10);
      return { "Days Remaining": remaining, "Days to Carry Over": carryOver, "Days to Use": remaining - carryOver };
    },
  },

  "holiday-pay": {
    inputs: [
      { id: "hourlyRate", label: "Hourly Rate (€)", min: 10, max: 100, step: 1, default: 25 },
      { id: "daysUsed", label: "Holiday Days Used", min: 1, max: 30, step: 1, default: 5 },
      { id: "hoursPerDay", label: "Hours per Day", min: 4, max: 10, step: 0.5, default: 8 },
    ],
    calculate: ({ hourlyRate, daysUsed, hoursPerDay }) => {
      const totalHours = daysUsed * hoursPerDay;
      const holidayPay = totalHours * hourlyRate;
      return { "Total Holiday Hours": totalHours, "Holiday Pay (€)": Math.round(holidayPay) };
    },
  },

  "part-time-holiday-pay": {
    inputs: [
      { id: "fullTimeHours", label: "Full-time Weekly Hours", min: 10, max: 60, step: 1, default: 40 },
      { id: "partTimeHours", label: "Part-time Weekly Hours", min: 1, max: 60, step: 1, default: 20 },
      { id: "fullTimeEntitlement", label: "Full-Time Annual Leave (days)", min: 1, max: 40, step: 1, default: 20 },
    ],
    calculate: ({ fullTimeHours, partTimeHours, fullTimeEntitlement }) => {
      const proRata = (Number(partTimeHours) / Number(fullTimeHours)) * Number(fullTimeEntitlement);
      return { "Pro-Rata Entitlement (days)": parseFloat(proRata.toFixed(2)) };
    },
  },

  "rent-allowance": {
    inputs: [
      { id: "householdIncome", label: "Monthly Household Income", min: 0, max: 100000, step: 100, default: 3000 },
      { id: "localRent", label: "Local Market Rent", min: 100, max: 10000, step: 10, default: 800 },
      { id: "dependents", label: "Number of Dependents", min: 0, max: 10, step: 1, default: 1 },
    ],
    calculate: ({ householdIncome, localRent, dependents }) => {
      const income = Number(householdIncome);
      const disregard = 200; // generic income disregard
      const assessable = Math.max(0, income - disregard);
      const maxAllowance = Number(localRent) * 0.6;
      const benefit = Math.max(0, maxAllowance - assessable * 0.1);
      return { "Estimated Allowance": Math.round(Math.max(0, benefit)), "Assessable Income": assessable };
    },
  },

  "social-housing-rent": {
    inputs: [
      { id: "householdIncome", label: "Monthly Household Income", min: 0, max: 100000, step: 100, default: 3000 },
      { id: "dependents", label: "Number of Dependents", min: 0, max: 10, step: 1, default: 1 },
      { id: "percent", label: "Rent % of Income", min: 10, max: 50, step: 1, default: 30 },
    ],
    calculate: ({ householdIncome, dependents, percent }) => {
      const rent = (Number(householdIncome) * Number(percent)) / 100;
      return { "Suggested Social Rent": Math.round(rent), "Rent %": `${percent}%` };
    },
  },

  /* ---------- Leave, Work & Allowance Calculators (Global) ---------- */

  "annual-leave-pro-rata": {
    inputs: [
      { id: "startDay", label: "Start Day of Month", min: 1, max: 31, step: 1, default: 1 },
      { id: "startMonth", label: "Start Month (1-12)", min: 1, max: 12, step: 1, default: 1 },
      { id: "endMonth", label: "Current Month (1-12)", min: 1, max: 12, step: 1, default: 6 },
      { id: "annualDays", label: "Annual Leave Entitlement (Days)", min: 10, max: 60, step: 1, default: 20 },
    ],
    calculate: ({ startDay, startMonth, endMonth, annualDays }) => {
      const monthsWorked = Math.max(0, Number(endMonth) - Number(startMonth) + 1) || 1;
      const proRataLeave = (Number(annualDays) / 12) * monthsWorked;
      return { "Months Employed": monthsWorked, "Pro-Rata Leave Days": Math.round(proRataLeave * 100) / 100 };
    },
  },

  "holiday-entitlements": {
    inputs: [
      { id: "hoursWorked", label: "Hours Worked in Qualifying Period", min: 0, max: 2000, step: 10, default: 500 },
      { id: "rulePercent", label: "Entitlement % of Hours (typically 5%)", min: 1, max: 20, step: 0.1, default: 5 },
    ],
    calculate: ({ hoursWorked, rulePercent }) => {
      const entitlementHours = (Number(hoursWorked) * Number(rulePercent)) / 100;
      const entitlementDays = entitlementHours / 8; // assuming 8-hour work day
      return { "Entitlement Hours": Math.round(entitlementHours * 100) / 100, "Entitlement Days": Math.round(entitlementDays * 100) / 100 };
    },
  },

  "holiday-pay-accrual": {
    inputs: [
      { id: "grossHourly", label: "Gross Hourly Wage (€)", min: 0, max: 500, step: 1, default: 15 },
      { id: "accruedDays", label: "Accrued but Untaken Leave Days", min: 0, max: 60, step: 1, default: 5 },
      { id: "hoursPerDay", label: "Hours per Working Day", min: 1, max: 12, step: 1, default: 8 },
    ],
    calculate: ({ grossHourly, accruedDays, hoursPerDay }) => {
      const totalHours = Number(accruedDays) * Number(hoursPerDay);
      const payOwed = totalHours * Number(grossHourly);
      return { "Total Accrued Hours": totalHours, "Holiday Pay Owed (€)": Math.round(payOwed) };
    },
  },

  "part-time-holiday-pay-pro-rata": {
    inputs: [
      { id: "partTimeHours", label: "Part-Time Weekly Hours", min: 1, max: 40, step: 0.5, default: 20 },
      { id: "fullTimeHours", label: "Full-Time Benchmark Weekly Hours", min: 20, max: 60, step: 1, default: 40 },
      { id: "fullTimeEntitlement", label: "Full-Time Annual Leave Entitlement (Days)", min: 10, max: 60, step: 1, default: 20 },
    ],
    calculate: ({ partTimeHours, fullTimeHours, fullTimeEntitlement }) => {
      const proRataRatio = Number(partTimeHours) / Number(fullTimeHours);
      const partTimeEntitlement = Number(fullTimeEntitlement) * proRataRatio;
      return { "Pro-Rata Ratio": (proRataRatio * 100).toFixed(1) + "%", "Part-Time Entitlement (Days)": Math.round(partTimeEntitlement * 100) / 100 };
    },
  },

  "maternity-paternity-leave": {
    inputs: [
      { id: "startWeek", label: "Start Week Before Due Date (1-11)", min: 1, max: 11, step: 1, default: 2 },
      { id: "leaveDuration", label: "Total Leave Duration (Weeks)", min: 12, max: 52, step: 1, default: 26 },
      { id: "weeklyGross", label: "Weekly Gross Earnings (€)", min: 0, max: 10000, step: 50, default: 600 },
      { id: "paymentRate", label: "Statutory Payment Rate (%)", min: 50, max: 100, step: 5, default: 80 },
    ],
    calculate: ({ startWeek, leaveDuration, weeklyGross, paymentRate }) => {
      const totalPayment = (Number(weeklyGross) * Number(leaveDuration) * Number(paymentRate)) / 100;
      const eachWeek = (Number(weeklyGross) * Number(paymentRate)) / 100;
      return { "Weekly Statutory Payment (€)": Math.round(eachWeek), "Total Leave Payment (€)": Math.round(totalPayment), "Leave Duration (Weeks)": leaveDuration };
    },
  },

  "rent-benefit-means-test": {
    inputs: [
      { id: "monthlyIncome", label: "Monthly Household Income (€)", min: 0, max: 100000, step: 100, default: 2500 },
      { id: "incomeThreshold", label: "Income Disregard/Threshold (€)", min: 0, max: 50000, step: 100, default: 200 },
      { id: "maxAllowance", label: "Maximum Local Allowance (€)", min: 100, max: 5000, step: 50, default: 800 },
      { id: "taperingRate", label: "Tapering Rate (% per € over threshold)", min: 0.1, max: 20, step: 0.1, default: 10 },
    ],
    calculate: ({ monthlyIncome, incomeThreshold, maxAllowance, taperingRate }) => {
      const assessableIncome = Math.max(0, Number(monthlyIncome) - Number(incomeThreshold));
      const reduction = (assessableIncome * Number(taperingRate)) / 100;
      const benefit = Math.max(0, Number(maxAllowance) - reduction);
      return { "Assessable Income": Math.round(assessableIncome), "Benefit Reduction": Math.round(reduction), "Rent Allowance (€)": Math.round(benefit) };
    },
  },

  "social-housing-rent-calculated": {
    inputs: [
      { id: "annualIncome", label: "Annual Household Income (€)", min: 0, max: 1000000, step: 1000, default: 30000 },
      { id: "dependents", label: "Number of Dependents", min: 0, max: 15, step: 1, default: 2 },
      { id: "rentPercent", label: "Calculated Rent % of Income", min: 20, max: 50, step: 1, default: 30 },
      { id: "minimumRent", label: "Minimum Rent (€)", min: 0, max: 500, step: 10, default: 50 },
    ],
    calculate: ({ annualIncome, dependents, rentPercent, minimumRent }) => {
      const monthlyIncome = Number(annualIncome) / 12;
      const calculatedRent = (monthlyIncome * Number(rentPercent)) / 100;
      const finalRent = Math.max(Number(minimumRent), Math.round(calculatedRent));
      return { "Monthly Income": Math.round(monthlyIncome), "Calculated Rent (€)": Math.round(calculatedRent), "Final Rent (€)": finalRent };
    },
  },

  /* --------------------------------------------------------------- */

  "gpa-calculator": {
    inputs: [
      { id: "mode", label: "Input Mode (1=Grade points,2=Percent,3=Letters)", min: 1, max: 3, step: 1, default: 1 },
      { id: "subjects", label: "Number of Subjects (1-10)", min: 1, max: 10, step: 1, default: 4 },
      { id: "g1", label: "Grade/Percent 1", min: 0, max: 100, step: 0.1, default: 3.8 },
      { id: "c1", label: "Credits 1", min: 0, max: 60, step: 1, default: 5 },
      { id: "g2", label: "Grade/Percent 2", min: 0, max: 100, step: 0.1, default: 3.5 },
      { id: "c2", label: "Credits 2", min: 0, max: 60, step: 1, default: 5 },
      { id: "g3", label: "Grade/Percent 3", min: 0, max: 100, step: 0.1, default: 3.7 },
      { id: "c3", label: "Credits 3", min: 0, max: 60, step: 1, default: 5 },
      { id: "g4", label: "Grade/Percent 4", min: 0, max: 100, step: 0.1, default: 3.9 },
      { id: "c4", label: "Credits 4", min: 0, max: 60, step: 1, default: 5 },
      { id: "g5", label: "Grade/Percent 5", min: 0, max: 100, step: 0.1, default: 0 },
      { id: "c5", label: "Credits 5", min: 0, max: 60, step: 1, default: 5 },
      { id: "g6", label: "Grade/Percent 6", min: 0, max: 100, step: 0.1, default: 0 },
      { id: "c6", label: "Credits 6", min: 0, max: 60, step: 1, default: 5 },
      { id: "g7", label: "Grade/Percent 7", min: 0, max: 100, step: 0.1, default: 0 },
      { id: "c7", label: "Credits 7", min: 0, max: 60, step: 1, default: 5 },
      { id: "g8", label: "Grade/Percent 8", min: 0, max: 100, step: 0.1, default: 0 },
      { id: "c8", label: "Credits 8", min: 0, max: 60, step: 1, default: 5 },
      { id: "g9", label: "Grade/Percent 9", min: 0, max: 100, step: 0.1, default: 0 },
      { id: "c9", label: "Credits 9", min: 0, max: 60, step: 1, default: 5 },
      { id: "g10", label: "Grade/Percent 10", min: 0, max: 100, step: 0.1, default: 0 },
      { id: "c10", label: "Credits 10", min: 0, max: 60, step: 1, default: 5 },
    ],
    calculate: (values) => {
      const mode = Math.round(values.mode || 1);
      const subjects = Math.round(values.subjects || 4);
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
        return letterMap[letter.toUpperCase()] ?? 0;
      }
      let totalQuality = 0;
      let totalCredits = 0;
      for (let i = 1; i <= subjects; i++) {
        const g = Number(values[`g${i}`] ?? 0);
        const c = Number(values[`c${i}`] ?? 0);
        let gp = 0;
        if (mode === 1) gp = g; // already grade point
        else if (mode === 2) gp = percentToGradePoint(g);
        else if (mode === 3) gp = letterToGradePoint(String(g)); // letter grade
        totalQuality += gp * c;
        totalCredits += c;
      }
      const gpa = totalCredits > 0 ? parseFloat((totalQuality / totalCredits).toFixed(3)) : 0;
      return { "GPA": gpa, "Total Credits": totalCredits };
    },
  },

  "leaving-cert-points": {
    inputs: [
      { id: "s1", label: "Subject1 %", min: 0, max: 100, step: 1, default: 85 },
      { id: "h1", label: "Subject1 Higher? (1=yes,0=no)", min: 0, max: 1, step: 1, default: 1 },
      { id: "s2", label: "Subject2 %", min: 0, max: 100, step: 1, default: 80 },
      { id: "h2", label: "Subject2 Higher? (1=yes,0=no)", min: 0, max: 1, step: 1, default: 1 },
      { id: "s3", label: "Subject3 %", min: 0, max: 100, step: 1, default: 75 },
      { id: "h3", label: "Subject3 Higher? (1=yes,0=no)", min: 0, max: 1, step: 1, default: 1 },
      { id: "s4", label: "Subject4 %", min: 0, max: 100, step: 1, default: 70 },
      { id: "h4", label: "Subject4 Higher? (1=yes,0=no)", min: 0, max: 1, step: 1, default: 1 },
      { id: "s5", label: "Subject5 %", min: 0, max: 100, step: 1, default: 65 },
      { id: "h5", label: "Subject5 Higher? (1=yes,0=no)", min: 0, max: 1, step: 1, default: 1 },
      { id: "s6", label: "Subject6 %", min: 0, max: 100, step: 1, default: 60 },
      { id: "h6", label: "Subject6 Higher? (1=yes,0=no)", min: 0, max: 1, step: 1, default: 1 },
    ],
    calculate: (vals) => {
      function pctToPoints(p: number, higher: number) {
        // simplified mapping: higher level has higher weighting
        const base = Math.max(0, Math.min(100, p));
        let pts = 0;
        if (base >= 90) pts = 100;
        else if (base >= 80) pts = 88;
        else if (base >= 70) pts = 77;
        else if (base >= 60) pts = 66;
        else if (base >= 50) pts = 46;
        else pts = 0;
        return higher ? Math.round(pts * 1.0) : Math.round(pts * 0.7);
      }
      const arr = [] as number[];
      for (let i = 1; i <= 6; i++) {
        const p = Number(vals[`s${i}`] ?? 0);
        const h = Number(vals[`h${i}`] ?? 1);
        arr.push(pctToPoints(p, h));
      }
      const total = arr.sort((a,b)=>b-a).slice(0,6).reduce((s,n)=>s+n,0);
      return { "Total Points (6 best)": total };
    },
  },

  "ucas-points": {
    inputs: [
      { id: "a1", label: "Subject1 %", min: 0, max: 100, step: 1, default: 90 },
      { id: "a2", label: "Subject2 %", min: 0, max: 100, step: 1, default: 80 },
      { id: "a3", label: "Subject3 %", min: 0, max: 100, step: 1, default: 70 },
    ],
    calculate: ({ a1, a2, a3 }) => {
      function pctToUcas(p:number){
        if (p>=90) return 56; if (p>=80) return 48; if (p>=70) return 40; if (p>=60) return 32; if (p>=50) return 24; return 0;
      }
      const pts = [a1,a2,a3].map((x)=>pctToUcas(Number(x)||0));
      return { "UCAS Total": pts.reduce((s,n)=>s+n,0) };
    },
  },

  "qqi-points": {
    inputs: [
      { id: "modules", label: "Number of Modules", min: 1, max: 40, step: 1, default: 8 },
      { id: "avgLevel", label: "Average Module Level (1-10)", min: 1, max: 10, step: 0.5, default: 5 },
    ],
    calculate: ({ modules, avgLevel }) => {
      const pointsPerModule = Number(avgLevel) * 10;
      const totalPoints = Number(modules) * pointsPerModule;
      return { "Points Per Module": pointsPerModule, "Total Points": Math.round(totalPoints) };
    },
  },

  "ects-calculator": {
    inputs: [
      { id: "modulesCount", label: "Number of Modules", min: 1, max: 60, step: 1, default: 8 },
      { id: "avgEcts", label: "Average ECTS per Module", min: 1, max: 60, step: 1, default: 5 },
    ],
    calculate: ({ modulesCount, avgEcts }) => {
      const total = Number(modulesCount) * Number(avgEcts);
      return { "Total ECTS": total };
    },
  },

  "ucd-gpa": {
    inputs: [
      { id: "modules", label: "Number of Modules", min: 1, max: 20, step: 1, default: 6 },
      { id: "m1", label: "Module1 %", min: 0, max: 100, step: 1, default: 75 },
      { id: "c1", label: "Credits1", min: 1, max: 60, step: 1, default: 5 },
    ],
    calculate: (vals) => {
      // simple mapping to a 4.0 scale for demonstration
      function pctToUcdPoint(p:number){ if(p>=70) return 4.0; if(p>=60) return 3.0; if(p>=50) return 2.0; return 0; }
      const n = Number(vals.modules||1);
      let totalQ=0, totalC=0;
      for(let i=1;i<=n;i++){ const p=Number(vals[`m${i}`]||0); const c=Number(vals[`c${i}`]||5); const gp=pctToUcdPoint(p); totalQ+=gp*c; totalC+=c; }
      const gpa = totalC>0?parseFloat((totalQ/totalC).toFixed(3)):0;
      return { "UCD-style GPA": gpa, "Total Credits": totalC };
    },
  },

  "hpat-score": {
    inputs: [
      { id: "sec1", label: "Section1 Correct", min: 0, max: 100, step: 1, default: 30 },
      { id: "sec2", label: "Section2 Correct", min: 0, max: 100, step: 1, default: 30 },
      { id: "sec3", label: "Section3 Correct", min: 0, max: 100, step: 1, default: 30 },
    ],
    calculate: ({ sec1, sec2, sec3 }) => {
      const s1 = Number(sec1||0), s2 = Number(sec2||0), s3 = Number(sec3||0);
      const total = s1 + s2 + s3;
      return { "HPAT Estimated Score": total };
    },
  },

  "hpat-points": {
    inputs: [
      { id: "lcPoints", label: "Leaving Cert Points (total)", min: 0, max: 1000, step: 1, default: 450 },
      { id: "hpat", label: "HPAT Score", min: 0, max: 300, step: 1, default: 120 },
    ],
    calculate: ({ lcPoints, hpat }) => {
      const total = (Number(lcPoints||0)/6) + (Number(hpat||0)/3);
      return { "Combined Points": parseFloat(total.toFixed(2)) };
    },
  },

  "running-record": {
    inputs: [
      { id: "totalWords", label: "Total Words", min: 1, max: 10000, step: 1, default: 200 },
      { id: "errors", label: "Errors Made", min: 0, max: 10000, step: 1, default: 5 },
    ],
    calculate: ({ totalWords, errors }) => {
      const t = Number(totalWords||0);
      const e = Number(errors||0);
      const accuracy = t>0?parseFloat((((t - e) / t) * 100).toFixed(2)):0;
      return { "Accuracy (%)": accuracy };
    },
  },

  "compound-interest": {
    inputs: [
      { id: "principal", label: "Principal Amount (€)", min: 1000, max: 1000000, step: 5000, default: 10000 },
      { id: "rate", label: "Annual Rate (%)", min: 0.5, max: 20, step: 0.5, default: 5 },
      { id: "years", label: "Time Period (Years)", min: 1, max: 50, step: 1, default: 10 },
      { id: "frequency", label: "Compounding (1-12)", min: 1, max: 12, step: 1, default: 12 },
    ],
    calculate: ({ principal, rate, years, frequency }) => {
      const amount = principal * Math.pow(1 + rate / 100 / frequency, frequency * years);
      const interest = amount - principal;
      return { "Final Amount": Math.round(amount), "Interest Earned": Math.round(interest) };
    },
  },

  "investment-calculator": {
    inputs: [
      { id: "initial", label: "Initial Investment (€)", min: 5000, max: 500000, step: 5000, default: 50000 },
      { id: "monthly", label: "Monthly Investment (€)", min: 100, max: 10000, step: 100, default: 500 },
      { id: "rate", label: "Annual Return (%)", min: 2, max: 20, step: 1, default: 8 },
      { id: "years", label: "Investment Period (Years)", min: 1, max: 50, step: 1, default: 10 },
    ],
    calculate: ({ initial, monthly, rate, years }) => {
      const monthlyRate = rate / 12 / 100;
      const months = years * 12;
      const futureValue = initial * Math.pow(1 + rate / 100, years) + monthly * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate));
      const totalInvested = initial + monthly * months;
      const gains = futureValue - totalInvested;
      return { "Final Value": Math.round(futureValue), "Total Invested": Math.round(totalInvested), "Capital Gains": Math.round(gains) };
    },
  },

  "savings-calculator": {
    inputs: [
      { id: "monthly", label: "Monthly Savings (€)", min: 50, max: 10000, step: 50, default: 500 },
      { id: "rate", label: "Interest Rate (% p.a.)", min: 0.5, max: 5, step: 0.25, default: 2 },
      { id: "years", label: "Time Period (Years)", min: 1, max: 30, step: 1, default: 5 },
    ],
    calculate: ({ monthly, rate, years }) => {
      const monthlyRate = rate / 12 / 100;
      const months = years * 12;
      const fv = monthly * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate));
      const contributed = monthly * months;
      const interest = fv - contributed;
      return { "Total Saved": Math.round(fv), "Contributed": Math.round(contributed), "Interest Earned": Math.round(interest) };
    },
  },

  "critical-points": {
    inputs: [
      { id: "a", label: "Coefficient a", min: -100, max: 100, step: 0.1, default: 2 },
      { id: "b", label: "Coefficient b", min: -100, max: 100, step: 0.1, default: -4 },
      { id: "c", label: "Coefficient c", min: -100, max: 100, step: 0.1, default: 1 },
    ],
    calculate: ({ a, b, c }) => {
      if (a === 0) return { "Note": 0, "Critical X": 0 };
      const x = (-b) / (2 * a);
      const y = a * x * x + b * x + c;
      return { "Critical X": parseFloat(x.toFixed(4)), "Y Value": parseFloat(y.toFixed(4)), "Type": a > 0 ? "Minimum" : "Maximum" };
    },
  },

  "completing-the-square": {
    inputs: [
      { id: "a", label: "Coefficient a", min: -100, max: 100, step: 0.1, default: 1 },
      { id: "b", label: "Coefficient b", min: -100, max: 100, step: 0.1, default: 6 },
      { id: "c", label: "Coefficient c", min: -100, max: 100, step: 0.1, default: 5 },
    ],
    calculate: ({ a, b, c }) => {
      if (a === 0) return { "Error": 0 };
      const h = (-b) / (2 * a);
      const k = c - (b * b) / (4 * a);
      const discriminant = b * b - 4 * a * c;
      return { "h (vertex x)": parseFloat(h.toFixed(4)), "k (vertex y)": parseFloat(k.toFixed(4)), "Form": `a(x-${h.toFixed(2)})²+${k.toFixed(2)}` };
    },
  },

  "simpsons-rule": {
    inputs: [
      { id: "a", label: "Lower Limit (a)", min: -10, max: 10, step: 0.5, default: 0 },
      { id: "b", label: "Upper Limit (b)", min: -10, max: 10, step: 0.5, default: 2 },
      { id: "n", label: "Number of Intervals (even)", min: 2, max: 100, step: 2, default: 4 },
    ],
    calculate: ({ a, b, n }) => {
      const dx = (b - a) / n;
      const intervals = Math.floor(n / 2);
      let sum = 0;
      for (let i = 0; i <= n; i++) {
        const x = a + i * dx;
        const f_x = Math.sin(x);
        if (i === 0 || i === n) sum += f_x;
        else if (i % 2 === 1) sum += 4 * f_x;
        else sum += 2 * f_x;
      }
      const integral = (dx / 3) * sum;
      return { "Approximate Integral": parseFloat(integral.toFixed(4)), "Interval Width": parseFloat(dx.toFixed(4)) };
    },
  },

  "directional-derivative": {
    inputs: [
      { id: "fx", label: "∂f/∂x (Partial x)", min: -50, max: 50, step: 0.1, default: 3 },
      { id: "fy", label: "∂f/∂y (Partial y)", min: -50, max: 50, step: 0.1, default: 4 },
      { id: "ux", label: "Direction (x component)", min: -1, max: 1, step: 0.1, default: 0.6 },
      { id: "uy", label: "Direction (y component)", min: -1, max: 1, step: 0.1, default: 0.8 },
    ],
    calculate: ({ fx, fy, ux, uy }) => {
      const magnitude = Math.sqrt(ux * ux + uy * uy);
      const u_x = magnitude > 0 ? ux / magnitude : 0;
      const u_y = magnitude > 0 ? uy / magnitude : 0;
      const directional = fx * u_x + fy * u_y;
      return { "Directional Derivative": parseFloat(directional.toFixed(4)), "Unit Vector Length": parseFloat(Math.sqrt(u_x * u_x + u_y * u_y).toFixed(4)) };
    },
  },

  "standard-deviation-casio": {
    inputs: [
      { id: "x1", label: "Data Point 1", min: -10000, max: 10000, step: 1, default: 10 },
      { id: "x2", label: "Data Point 2", min: -10000, max: 10000, step: 1, default: 20 },
      { id: "x3", label: "Data Point 3", min: -10000, max: 10000, step: 1, default: 30 },
      { id: "x4", label: "Data Point 4", min: -10000, max: 10000, step: 1, default: 40 },
      { id: "x5", label: "Data Point 5", min: -10000, max: 10000, step: 1, default: 50 },
    ],
    calculate: ({ x1, x2, x3, x4, x5 }) => {
      const data = [x1, x2, x3, x4, x5];
      const mean = data.reduce((a, b) => a + b, 0) / data.length;
      const variance = data.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / data.length;
      const stdDev = Math.sqrt(variance);
      const sampleVar = data.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / (data.length - 1);
      const sampleStd = Math.sqrt(sampleVar);
      return { "Population σ": parseFloat(stdDev.toFixed(4)), "Sample s": parseFloat(sampleStd.toFixed(4)), "Mean": parseFloat(mean.toFixed(4)) };
    },
  },

  "titration": {
    inputs: [
      { id: "ca", label: "Known Concentration (mol/L)", min: 0.001, max: 10, step: 0.001, default: 0.1 },
      { id: "va", label: "Volume of Known (mL)", min: 1, max: 1000, step: 1, default: 25 },
      { id: "vb", label: "Volume of Unknown (mL)", min: 1, max: 1000, step: 1, default: 20 },
      { id: "ratio", label: "Mole Ratio (nA/nB)", min: 1, max: 4, step: 0.5, default: 1 },
    ],
    calculate: ({ ca, va, vb, ratio }) => {
      const cb = (ca * va * ratio) / vb;
      const moles_a = ca * va / 1000;
      const moles_b = cb * vb / 1000;
      return { "Unknown Concentration": parseFloat(cb.toFixed(4)), "Moles A": parseFloat(moles_a.toFixed(6)), "Moles B": parseFloat(moles_b.toFixed(6)) };
    },
  },

  "binomial-expansion": {
    inputs: [
      { id: "a", label: "Term a", min: -100, max: 100, step: 1, default: 2 },
      { id: "b", label: "Term b", min: -100, max: 100, step: 1, default: 3 },
      { id: "n", label: "Power n", min: 1, max: 10, step: 1, default: 3 },
    ],
    calculate: ({ a, b, n }) => {
      const result = Math.pow(a + b, n);
      const firstTerm = Math.pow(a, n);
      const lastTerm = Math.pow(b, n);
      const middleTerms = result - firstTerm - lastTerm;
      return { "(a+b)^n": result, "First Term (a^n)": firstTerm, "Last Term (b^n)": lastTerm, "Middle Terms": parseFloat(middleTerms.toFixed(4)) };
    },
  },

  "partial-fraction-decomposition": {
    inputs: [
      { id: "p1", label: "Numerator Coeff (px)", min: -100, max: 100, step: 1, default: 5 },
      { id: "p0", label: "Numerator Constant (q)", min: -100, max: 100, step: 1, default: 1 },
      { id: "q1", label: "Denominator (x-r)", min: -50, max: 50, step: 0.5, default: 2 },
      { id: "q2", label: "Denominator (x-s)", min: -50, max: 50, step: 0.5, default: 3 },
    ],
    calculate: ({ p1, p0, q1, q2 }) => {
      const denom_prod = q1 * q2;
      const A = (p1 * q2 + p0) / (q2 - q1);
      const B = (p1 * q1 + p0) / (q1 - q2);
      return { "Coefficient A": parseFloat(A.toFixed(4)), "Coefficient B": parseFloat(B.toFixed(4)), "Verification": "A/(x-r) + B/(x-s)" };
    },
  },

  "taylor-series": {
    inputs: [
      { id: "x", label: "x Value", min: -10, max: 10, step: 0.5, default: 1 },
      { id: "a", label: "Center Point (a)", min: -10, max: 10, step: 0.5, default: 0 },
      { id: "terms", label: "Number of Terms", min: 1, max: 10, step: 1, default: 4 },
    ],
    calculate: ({ x, a, terms }) => {
      let sum = 0;
      for (let n = 0; n < terms; n++) {
        const derivative = Math.pow(a, n);
        const factorial = [1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880][n] || 1;
        const term = (derivative / factorial) * Math.pow(x - a, n);
        sum += term;
      }
      const approx_exp = Math.exp(x);
      const error = Math.abs(sum - approx_exp);
      return { "Taylor Approximation": parseFloat(sum.toFixed(6)), "Actual e^x": parseFloat(approx_exp.toFixed(6)), "Error": parseFloat(error.toFixed(6)) };
    },
  },

  "radius-of-convergence": {
    inputs: [
      { id: "a1", label: "Coefficient a₁", min: 0.1, max: 100, step: 0.5, default: 1 },
      { id: "a2", label: "Coefficient a₂", min: 0.1, max: 100, step: 0.5, default: 2 },
      { id: "a3", label: "Coefficient a₃", min: 0.1, max: 100, step: 0.5, default: 3 },
    ],
    calculate: ({ a1, a2, a3 }) => {
      const ratio1 = a2 / a1;
      const ratio2 = a3 / a2;
      const avgRatio = (ratio1 + ratio2) / 2;
      const radius = 1 / avgRatio;
      return { "Ratio Test Limit": parseFloat(avgRatio.toFixed(4)), "Radius of Convergence": parseFloat(radius.toFixed(4)), "Interval": `(-${radius.toFixed(2)}, ${radius.toFixed(2)})` };
    },
  },

  "fourier-transform": {
    inputs: [
      { id: "freq", label: "Frequency (ω)", min: 0.1, max: 10, step: 0.5, default: 2 },
      { id: "amp", label: "Amplitude", min: 0.1, max: 100, step: 1, default: 5 },
      { id: "phase", label: "Phase Shift (rad)", min: -3.14, max: 3.14, step: 0.1, default: 0 },
    ],
    calculate: ({ freq, amp, phase }) => {
      const magnitude = Math.sqrt(amp * amp + (freq * amp) * (freq * amp)) / 2;
      const realPart = amp * Math.cos(phase);
      const imagPart = amp * Math.sin(phase);
      return { "Magnitude |F(ω)|": parseFloat(magnitude.toFixed(4)), "Real Part": parseFloat(realPart.toFixed(4)), "Imaginary Part": parseFloat(imagPart.toFixed(4)) };
    },
  },

  "fourier-series": {
    inputs: [
      { id: "a0", label: "a₀ Coefficient", min: -50, max: 50, step: 0.5, default: 2 },
      { id: "a1", label: "a₁ Coefficient", min: -50, max: 50, step: 0.5, default: 1 },
      { id: "b1", label: "b₁ Coefficient", min: -50, max: 50, step: 0.5, default: 1.5 },
      { id: "period", label: "Period (T)", min: 0.5, max: 10, step: 0.5, default: 2 },
    ],
    calculate: ({ a0, a1, b1, period }) => {
      const omega = (2 * Math.PI) / period;
      const t = period / 4;
      const f_t = a0 / 2 + a1 * Math.cos(omega * t) + b1 * Math.sin(omega * t);
      const power = (a0 * a0 + a1 * a1 + b1 * b1) / 4;
      return { "f(T/4)": parseFloat(f_t.toFixed(4)), "Fundamental Frequency": parseFloat(omega.toFixed(4)), "Power": parseFloat(power.toFixed(4)) };
    },
  },

  "laplace-transform": {
    inputs: [
      { id: "f_const", label: "Function Constant (k)", min: -100, max: 100, step: 1, default: 5 },
      { id: "s", label: "s Parameter", min: 0.1, max: 10, step: 0.5, default: 2 },
      { id: "t", label: "Time t (reference)", min: 0.1, max: 10, step: 0.5, default: 1 },
    ],
    calculate: ({ f_const, s, t }) => {
      const laplace_const = f_const / s;
      const laplace_exp = f_const / (s - 1);
      const time_domain = f_const * Math.exp(-s * t);
      return { "L{k} = k/s": parseFloat(laplace_const.toFixed(4)), "L{e^t} = 1/(s-1)": parseFloat(laplace_exp.toFixed(4)), "Time Domain": parseFloat(time_domain.toFixed(6)) };
    },
  },

  "inverse-laplace-transform": {
    inputs: [
      { id: "num", label: "Numerator (k)", min: -100, max: 100, step: 1, default: 10 },
      { id: "denom", label: "Denominator (s-a)", min: -50, max: 50, step: 0.5, default: 2 },
      { id: "t", label: "Time (t)", min: 0, max: 10, step: 0.1, default: 1 },
    ],
    calculate: ({ num, denom, t }) => {
      const a = denom;
      const coeff = num / (a || 1);
      const f_t = coeff * Math.exp(a * t);
      const transform_check = coeff / (a || 1);
      return { "f(t) = k*e^(at)": parseFloat(f_t.toFixed(4)), "Inverse Coefficient": parseFloat(coeff.toFixed(4)), "F(s) Check": parseFloat(transform_check.toFixed(4)) };
    },
  },

  "casio-basic": {
    inputs: [
      { id: "num1", label: "Number 1", min: -999999, max: 999999, step: 1, default: 0 },
      { id: "num2", label: "Number 2", min: -999999, max: 999999, step: 1, default: 0 },
    ],
    calculate: ({ num1, num2 }) => {
      return { "Sum": num1 + num2, "Difference": num1 - num2, "Product": num1 * num2, "Quotient": num2 !== 0 ? parseFloat((num1 / num2).toFixed(4)) : 0 };
    },
  },

  "casio-watch": {
    inputs: [
      { id: "num", label: "Number", min: -99999, max: 99999, step: 1, default: 0 },
    ],
    calculate: ({ num }) => {
      return { "Value": num, "Square": num * num, "Square Root": parseFloat(Math.sqrt(Math.abs(num)).toFixed(2)) };
    },
  },

  "casio-fx83gtx": {
    inputs: [
      { id: "x", label: "X", min: -100, max: 100, step: 1, default: 0 },
    ],
    calculate: ({ x }) => {
      return { "x": x, "x²": x * x, "x³": x * x * x, "√x": parseFloat(Math.sqrt(Math.abs(x)).toFixed(2)) };
    },
  },

  "sharp-scientific": {
    inputs: [
      { id: "base", label: "Base", min: 0.1, max: 100, step: 0.1, default: 10 },
      { id: "exponent", label: "Exponent", min: -10, max: 10, step: 0.5, default: 2 },
    ],
    calculate: ({ base, exponent }) => {
      const result = Math.pow(base, exponent);
      return { "Result": parseFloat(result.toFixed(4)), "Logarithm": parseFloat(Math.log(Math.abs(base)).toFixed(4)) };
    },
  },

  "programmable": {
    inputs: [
      { id: "a", label: "Variable A", min: -1000, max: 1000, step: 1, default: 5 },
      { id: "b", label: "Variable B", min: -1000, max: 1000, step: 1, default: 3 },
    ],
    calculate: ({ a, b }) => {
      return { "A": a, "B": b, "A+B": a + b, "A*B": a * b };
    },
  },

  "bra-size": {
    inputs: [
      { id: "band", label: "Band Size (cm)", min: 60, max: 120, step: 2.5, default: 85 },
      { id: "bust", label: "Bust Size (cm)", min: 70, max: 150, step: 2.5, default: 95 },
    ],
    calculate: ({ band, bust }) => {
      const diff = bust - band;
      let cup = "AA";
      if (diff >= 17) cup = "A";
      if (diff >= 19) cup = "B";
      if (diff >= 21) cup = "C";
      if (diff >= 23) cup = "D";
      return { "Band Size": band, "Estimated Size": `${band}${cup}` };
    },
  },

  "clarks-size": {
    inputs: [
      { id: "foot", label: "Foot Length (cm)", min: 15, max: 35, step: 0.5, default: 25 },
    ],
    calculate: ({ foot }) => {
      const usSize = Math.round((foot - 8.128) / 0.254);
      return { "Foot Length": foot, "US Size": usSize, "EU Size": usSize + 32 };
    },
  },

  "clarks-foot-gauge": {
    inputs: [
      { id: "mm", label: "Read from Gauge (mm)", min: 130, max: 280, step: 5, default: 215 },
    ],
    calculate: ({ mm }) => {
      const cm = mm / 10;
      const usSize = Math.round((cm - 8.128) / 0.254);
      return { "Gauge Reading": mm, "Foot Length (cm)": parseFloat(cm.toFixed(1)), "US Size": usSize };
    },
  },

  "clarks-foot-converter": {
    inputs: [
      { id: "cm", label: "Foot Length (cm)", min: 15, max: 35, step: 0.5, default: 25 },
    ],
    calculate: ({ cm }) => {
      const mm = cm * 10;
      const inches = cm / 2.54;
      return { "Centimeters": cm, "Millimeters": mm, "Inches": parseFloat(inches.toFixed(2)) };
    },
  },

  "clarks-shoe-size": {
    inputs: [
      { id: "cm", label: "Foot Length (cm)", min: 15, max: 35, step: 0.5, default: 25 },
    ],
    calculate: ({ cm }) => {
      const ukSize = Math.round((cm * 2 - 15.24) / 0.8467);
      return { "Foot Length": cm, "US Size": parseFloat((ukSize + 1.5).toFixed(1)), "UK Size": ukSize, "EU Size": ukSize + 32 };
    },
  },

  "vrt-calculator": {
    inputs: [
      { id: "price", label: "Vehicle Price (€)", min: 5000, max: 500000, step: 5000, default: 30000 },
      { id: "co2", label: "CO2 Emissions (g/km)", min: 50, max: 300, step: 10, default: 140 },
    ],
    calculate: ({ price, co2 }) => {
      let rate = 0;
      if (co2 <= 120) rate = 0.015;
      else if (co2 <= 160) rate = 0.02;
      else rate = 0.025;
      const vrt = price * rate;
      return { "VRT Rate": `${(rate * 100).toFixed(1)}%`, "VRT Amount": Math.round(vrt), "Total Cost": Math.round(price + vrt) };
    },
  },

  "piab-injury": {
    inputs: [
      { id: "loss", label: "Loss of Earnings (%)", min: 0, max: 100, step: 5, default: 50 },
      { id: "years", label: "Period (Years)", min: 1, max: 50, step: 1, default: 5 },
    ],
    calculate: ({ loss, years }) => {
      const baseAward = 5000;
      const award = baseAward * (loss / 100) * years;
      return { "Loss Level": `${loss}%`, "Estimated Award": Math.round(award) };
    },
  },

  "injury-claim": {
    inputs: [
      { id: "damages", label: "Pain & Suffering (€)", min: 5000, max: 500000, step: 5000, default: 50000 },
      { id: "lost", label: "Lost Wages (€)", min: 0, max: 200000, step: 5000, default: 20000 },
      { id: "medical", label: "Medical Costs (€)", min: 0, max: 100000, step: 5000, default: 10000 },
    ],
    calculate: ({ damages, lost, medical }) => {
      const baseGross = damages + lost + medical;
      const beforeLegal = Math.round(baseGross * 0.85);
      return { "Total Components": Math.round(baseGross), "After Legal Fees (est 15%)": beforeLegal };
    },
  },

  "ex-gratia-redundancy": {
    inputs: [
      { id: "salary", label: "Weekly Salary (€)", min: 200, max: 3000, step: 50, default: 600 },
      { id: "years", label: "Years of Service", min: 1, max: 50, step: 1, default: 10 },
    ],
    calculate: ({ salary, years }) => {
      const redundancy = salary * years * 0.5;
      return { "Redundancy Payment": Math.round(redundancy), "Per Year Avg": Math.round(redundancy / years) };
    },
  },

  "leaving-ireland-tax": {
    inputs: [
      { id: "grossYear", label: "Gross Earned (€)", min: 10000, max: 200000, step: 5000, default: 60000 },
      { id: "taxPaid", label: "Tax Paid to Date (€)", min: 0, max: 100000, step: 1000, default: 15000 },
      { id: "daysWorked", label: "Days Worked (out of 365)", min: 1, max: 365, step: 1, default: 200 },
    ],
    calculate: ({ grossYear, taxPaid, daysWorked }) => {
      const proRata = (grossYear * daysWorked) / 365;
      const applicableRate = 0.33; // default exit tax rate (adjust via UI if needed)
      const finalLiability = proRata * applicableRate;
      const refund = Math.max(0, taxPaid - finalLiability);
      return { "Pro-Rata Gross": Math.round(proRata), "Final Liability (est)": Math.round(finalLiability), "Potential Refund": Math.round(refund) };
    },
  },

  "capital-gains-tax": {
    inputs: [
      { id: "salePrice", label: "Sale Price (€)", min: 0, max: 10000000, step: 100, default: 200000 },
      { id: "purchasePrice", label: "Purchase Price (€)", min: 0, max: 10000000, step: 100, default: 100000 },
      { id: "allowableCosts", label: "Allowable Costs (€)", min: 0, max: 1000000, step: 100, default: 20000 },
      { id: "annualExemption", label: "Annual Exemption (€)", min: 0, max: 50000, step: 100, default: 12700 },
      { id: "cgtRate", label: "CGT Rate (%)", min: 0, max: 100, step: 0.1, default: 33 },
    ],
    calculate: ({ salePrice, purchasePrice, allowableCosts, annualExemption, cgtRate }) => {
      const gain = Math.max(0, salePrice - purchasePrice - allowableCosts - annualExemption);
      const tax = gain * (cgtRate / 100);
      return { "Chargeable Gain": Math.round(gain), "CGT Due": Math.round(tax) };
    },
  },

  "au-pair-ireland-salary": {
    inputs: [
      { id: "hourly", label: "Hourly Rate (€)", min: 2, max: 20, step: 0.1, default: 8 },
      { id: "hoursPerWeek", label: "Hours per Week", min: 5, max: 40, step: 1, default: 30 },
      { id: "weeks", label: "Weeks per Year", min: 1, max: 52, step: 1, default: 52 },
    ],
    calculate: ({ hourly, hoursPerWeek, weeks }) => {
      const annual = hourly * hoursPerWeek * weeks;
      const monthly = annual / 12;
      return { "Annual Pay": Math.round(annual), "Monthly Pay": Math.round(monthly) };
    },
  },

  "one-parent-family": {
    inputs: [
      { id: "weeklyIncome", label: "Weekly Income (€)", min: 0, max: 20000, step: 10, default: 600 },
      { id: "childrenU18", label: "Children (under 18)", min: 0, max: 10, step: 1, default: 1 },
      { id: "children1222", label: "Children (12-22)", min: 0, max: 10, step: 1, default: 0 },
      { id: "meansThreshold", label: "Weekly Means Test Threshold (€)", min: 0, max: 2000, step: 10, default: 400 },
      { id: "taperRate", label: "Taper Rate (decimal)", min: 0, max: 1, step: 0.01, default: 0.5 },
    ],
    calculate: ({ weeklyIncome, childrenU18, children1222, meansThreshold, taperRate }) => {
      const basePaymentPerChild = 70; // default weekly base payment per child (example)
      const dependentCount = childrenU18 + children1222;
      const basePayment = dependentCount * basePaymentPerChild;
      const incomeOver = Math.max(0, weeklyIncome - meansThreshold);
      const reduction = incomeOver * taperRate;
      const adjusted = Math.max(0, basePayment - reduction);
      return { "Base Payment": Math.round(basePayment), "Income Over Threshold": Math.round(incomeOver), "Reduction": Math.round(reduction), "Estimated Weekly Payment": Math.round(adjusted) };
    },
  },

  "job-share-salary": {
    inputs: [
      { id: "fullTimeWeeklyHours", label: "Full-Time Weekly Hours", min: 1, max: 60, step: 1, default: 39 },
      { id: "fullTimeWeeklySalary", label: "Full-Time Weekly Salary (€)", min: 100, max: 5000, step: 10, default: 1000 },
      { id: "yourWeeklyHours", label: "Your Agreed Weekly Hours", min: 1, max: 60, step: 1, default: 20 },
    ],
    calculate: ({ fullTimeWeeklyHours, fullTimeWeeklySalary, yourWeeklyHours }) => {
      const yourSalary = (yourWeeklyHours / fullTimeWeeklyHours) * fullTimeWeeklySalary;
      return { "Your Weekly Salary": parseFloat(yourSalary.toFixed(2)), "Your FTE %": parseFloat(((yourWeeklyHours / fullTimeWeeklyHours) * 100).toFixed(2)) };
    },
  },

  "marginal-tax-rate": {
    inputs: [
      { id: "incomeBefore", label: "Total Income Before (€)", min: 0, max: 10000000, step: 100, default: 50000 },
      { id: "taxBefore", label: "Total Tax Before (€)", min: 0, max: 10000000, step: 10, default: 10000 },
      { id: "incomeAfter", label: "Total Income After (€)", min: 0, max: 10000000, step: 100, default: 51000 },
      { id: "taxAfter", label: "Total Tax After (€)", min: 0, max: 10000000, step: 10, default: 10040 },
      { id: "costBefore", label: "Cost Before (€)", min: 0, max: 10000000, step: 1, default: 100 },
      { id: "costAfter", label: "Cost After (€)", min: 0, max: 10000000, step: 1, default: 120 },
      { id: "qtyBefore", label: "Quantity Before", min: 0, max: 1000000, step: 1, default: 10 },
      { id: "qtyAfter", label: "Quantity After", min: 0, max: 1000000, step: 1, default: 12 },
    ],
    calculate: ({ incomeBefore, taxBefore, incomeAfter, taxAfter, costBefore, costAfter, qtyBefore, qtyAfter }) => {
      const incomeDelta = incomeAfter - incomeBefore;
      const taxDelta = taxAfter - taxBefore;
      const marginalRate = incomeDelta !== 0 ? taxDelta / incomeDelta : 0;
      const qtyDelta = qtyAfter - qtyBefore;
      const effectiveCostChange = qtyDelta !== 0 ? (costAfter - costBefore) / qtyDelta : 0;
      return { "Marginal Tax Rate": parseFloat(marginalRate.toFixed(4)), "Effective Cost Change": parseFloat(effectiveCostChange.toFixed(4)) };
    },
  },

  "income-tax": {
    inputs: [
      { id: "grossAnnual", label: "Gross Annual Income (€)", min: 0, max: 5000000, step: 100, default: 50000 },
      { id: "pensionContrib", label: "Pension Contributions (€)", min: 0, max: 500000, step: 100, default: 0 },
      { id: "band1Limit", label: "Band 1 Limit (€)", min: 0, max: 1000000, step: 100, default: 36800 },
      { id: "rate1", label: "Rate 1 (%)", min: 0, max: 100, step: 0.1, default: 20 },
      { id: "rate2", label: "Rate 2 (%)", min: 0, max: 100, step: 0.1, default: 40 },
      { id: "taxCredits", label: "Tax Credits (€)", min: 0, max: 50000, step: 10, default: 3300 },
    ],
    calculate: ({ grossAnnual, pensionContrib, band1Limit, rate1, rate2, taxCredits }) => {
      const taxable = Math.max(0, grossAnnual - pensionContrib);
      const band1Income = Math.min(taxable, band1Limit);
      const band2Income = Math.max(0, taxable - band1Limit);
      const taxDue = (band1Income * rate1 / 100) + (band2Income * rate2 / 100) - taxCredits;
      return { "Taxable Income": Math.round(taxable), "Tax Due": Math.round(Math.max(0, taxDue)) };
    },
  },

  "usc-calculator": {
    inputs: [
      { id: "grossIncome", label: "Gross Income (€)", min: 0, max: 10000000, step: 100, default: 50000 },
      { id: "uscBand1Limit", label: "USC Band1 Limit (€)", min: 0, max: 1000000, step: 100, default: 12012 },
      { id: "uscRate1", label: "USC Rate1 (%)", min: 0, max: 100, step: 0.01, default: 0.5 },
      { id: "uscBand2Limit", label: "USC Band2 Limit (€)", min: 0, max: 1000000, step: 100, default: 21295 },
      { id: "uscRate2", label: "USC Rate2 (%)", min: 0, max: 100, step: 0.01, default: 2 },
      { id: "uscBand3Limit", label: "USC Band3 Limit (€)", min: 0, max: 1000000, step: 100, default: 70044 },
      { id: "uscRate3", label: "USC Rate3 (%)", min: 0, max: 100, step: 0.01, default: 4 },
      { id: "uscRate4", label: "USC Rate4 (%)", min: 0, max: 100, step: 0.01, default: 8 },
    ],
    calculate: ({ grossIncome, uscBand1Limit, uscRate1, uscBand2Limit, uscRate2, uscBand3Limit, uscRate3, uscRate4 }) => {
      let remaining = grossIncome;
      let totalUSC = 0;
      const applyBand = (limit, rate) => {
        if (limit <= 0) return 0;
        const taxable = Math.max(0, Math.min(remaining, limit));
        remaining -= taxable;
        return taxable * (rate / 100);
      };
      totalUSC += applyBand(uscBand1Limit, uscRate1);
      totalUSC += applyBand(uscBand2Limit - uscBand1Limit, uscRate2);
      totalUSC += applyBand(uscBand3Limit - uscBand2Limit, uscRate3);
      if (remaining > 0) totalUSC += remaining * (uscRate4 / 100);
      return { "Total USC": Math.round(totalUSC) };
    },
  },

  "prsi-calculator": {
    inputs: [
      { id: "grossWeekly", label: "Gross Weekly Earnings (€)", min: 0, max: 10000, step: 1, default: 600 },
      { id: "prsiRate", label: "PRSI Rate (%)", min: 0, max: 100, step: 0.1, default: 4 },
      { id: "lowerLimit", label: "Lower Weekly Limit (€)", min: 0, max: 10000, step: 1, default: 0 },
      { id: "upperLimit", label: "Upper Weekly Limit (€)", min: 0, max: 100000, step: 1, default: 10000 },
    ],
    calculate: ({ grossWeekly, prsiRate, lowerLimit, upperLimit }) => {
      const earnings = Math.min(Math.max(grossWeekly, lowerLimit), upperLimit);
      const weeklyPRSI = earnings * (prsiRate / 100);
      return { "PRSI Weekly": Math.round(weeklyPRSI), "Earnings used": Math.round(earnings) };
    },
  },

  "marginal-cost": {
    inputs: [
      { id: "fixed", label: "Fixed Cost (€)", min: 0, max: 1000000, step: 100, default: 10000 },
      { id: "variablePerUnit", label: "Variable Cost per Unit (€)", min: 0, max: 1000, step: 0.1, default: 5 },
      { id: "units", label: "Units Produced", min: 1, max: 100000, step: 1, default: 1000 },
    ],
    calculate: ({ fixed, variablePerUnit, units }) => {
      const totalVariable = variablePerUnit * units;
      const totalCost = fixed + totalVariable;
      const averageCost = totalCost / units;
      const marginalCost = variablePerUnit;
      return { "Total Cost": Math.round(totalCost), "Average Cost": Math.round(averageCost), "Marginal Cost": Math.round(marginalCost) };
    },
  },

  "ebitda": {
    inputs: [
      { id: "revenue", label: "Revenue (€)", min: 0, max: 10000000, step: 1000, default: 100000 },
      { id: "cogs", label: "COGS (€)", min: 0, max: 10000000, step: 1000, default: 30000 },
      { id: "opex", label: "Operating Expenses (€)", min: 0, max: 10000000, step: 1000, default: 20000 },
      { id: "depr", label: "Depreciation (€)", min: 0, max: 1000000, step: 100, default: 2000 },
      { id: "amort", label: "Amortisation (€)", min: 0, max: 1000000, step: 100, default: 1000 },
    ],
    calculate: ({ revenue, cogs, opex, depr, amort }) => {
      const ebitda = revenue - cogs - opex + depr + amort;
      return { "EBITDA": Math.round(ebitda) };
    },
  },

  "diageo-share-price": {
    inputs: [
      { id: "shares", label: "Number of Shares", min: 1, max: 100000, step: 1, default: 100 },
      { id: "currentPrice", label: "Current Price (€)", min: 0.01, max: 1000, step: 0.01, default: 35 },
      { id: "projectedPrice", label: "Projected Price (€)", min: 0.01, max: 1000, step: 0.01, default: 40 },
    ],
    calculate: ({ shares, currentPrice, projectedPrice }) => {
      const currentValue = shares * currentPrice;
      const projectedValue = shares * projectedPrice;
      const changePct = ((projectedValue - currentValue) / currentValue) * 100;
      return { "Current Value": Math.round(currentValue), "Projected Value": Math.round(projectedValue), "Change %": parseFloat(changePct.toFixed(2)) };
    },
  },

  "dhl-price": {
    inputs: [
      { id: "weight", label: "Weight (kg)", min: 0.1, max: 1000, step: 0.1, default: 5 },
      { id: "distance", label: "Distance (km)", min: 1, max: 5000, step: 1, default: 200 },
    ],
    calculate: ({ weight, distance }) => {
      const base = 5;
      const cost = base + weight * 0.8 + distance * 0.02;
      return { "Estimated Cost": Math.round(cost) };
    },
  },

  "dhl-customs-duty": {
    inputs: [
      { id: "itemValue", label: "Item Value (€)", min: 1, max: 100000, step: 1, default: 100 },
      { id: "dutyRate", label: "Duty Rate (%)", min: 0, max: 50, step: 0.5, default: 5 },
      { id: "vatRate", label: "VAT Rate (%)", min: 0, max: 30, step: 0.5, default: 23 },
    ],
    calculate: ({ itemValue, dutyRate, vatRate }) => {
      const duty = (itemValue * dutyRate) / 100;
      const vat = ((itemValue + duty) * vatRate) / 100;
      return { "Customs Duty": Math.round(duty), "VAT on Import": Math.round(vat), "Total": Math.round(itemValue + duty + vat) };
    },
  },

  "tax-calculator-denmark": {
    inputs: [
      { id: "gross", label: "Gross Income (€)", min: 0, max: 500000, step: 500, default: 50000 },
    ],
    calculate: ({ gross }) => {
      const tax = Math.round(gross * 0.37);
      return { "Estimated Tax": tax, "Net Income": Math.round(gross - tax) };
    },
  },

  "dividend-tax-ireland": {
    inputs: [
      { id: "dividend", label: "Dividend Amount (€)", min: 0, max: 1000000, step: 10, default: 1000 },
      { id: "otherIncome", label: "Other Income (€)", min: 0, max: 5000000, step: 100, default: 30000 },
      { id: "taxCredits", label: "Tax Credits (€)", min: 0, max: 50000, step: 10, default: 3300 },
      { id: "isDIRT", label: "Is DIRT applicable (1=yes,0=no)", min: 0, max: 1, step: 1, default: 0 },
      { id: "dirtRate", label: "DIRT Rate (%)", min: 0, max: 50, step: 0.1, default: 25 },
    ],
    calculate: ({ dividend, otherIncome, taxCredits, isDIRT, dirtRate }) => {
      const totalTaxable = otherIncome + dividend;
      // Simple approach: apply 33% on dividend for non-DIRT; if DIRT applies, apply dirtRate on dividend
      const dividendTax = isDIRT === 1 ? dividend * (dirtRate / 100) : dividend * 0.33;
      // Return quick summary
      return { "Dividend Tax": Math.round(dividendTax), "Net Dividend": Math.round(dividend - dividendTax), "Total Taxable (est)": Math.round(totalTaxable) };
    },
  },

  "airbnb-tax-ireland": {
    inputs: [
      { id: "revenue", label: "Gross Revenue (€)", min: 0, max: 1000000, step: 100, default: 20000 },
      { id: "expensesPct", label: "Allowable Expenses (%)", min: 0, max: 100, step: 1, default: 30 },
    ],
    calculate: ({ revenue, expensesPct }) => {
      const taxable = revenue * (1 - expensesPct / 100);
      const tax = taxable * 0.20;
      return { "Taxable Income": Math.round(taxable), "Estimated Tax": Math.round(tax), "Net Revenue": Math.round(revenue - tax) };
    },
  },

  "inheritance-tax-ireland": {
    inputs: [
      { id: "estate", label: "Estate Value (€)", min: 0, max: 10000000, step: 1000, default: 500000 },
      { id: "threshold", label: "Tax-Free Threshold (€)", min: 0, max: 1000000, step: 1000, default: 335000 },
      { id: "rate", label: "Tax Rate (%)", min: 0, max: 50, step: 1, default: 33 },
    ],
    calculate: ({ estate, threshold, rate }) => {
      const taxable = Math.max(0, estate - threshold);
      const tax = (taxable * rate) / 100;
      return { "Taxable Amount": Math.round(taxable), "Inheritance Tax": Math.round(tax) };
    },
  },

  /* ---------- GENERAL & MISCELLANEOUS ---------- */

  "slimming-syns": {
    inputs: [
      { id: "calories", label: "Calories (kcal)", min: 0, max: 2000, step: 1, default: 250 },
      { id: "satFat", label: "Saturated Fat (g)", min: 0, max: 100, step: 0.1, default: 5 },
      { id: "sugar", label: "Sugar (g)", min: 0, max: 200, step: 0.1, default: 10 },
      { id: "quantity", label: "Quantity (units)", min: 1, max: 1000, step: 1, default: 1 },
    ],
    calculate: ({ calories, satFat, sugar, quantity }) => {
      // Simple syns heuristic: calories/50 + satFat*0.5 + sugar*0.2
      const synPerItem = (calories / 50) + (satFat * 0.5) + (sugar * 0.2);
      const total = synPerItem * quantity;
      return { "Syns per Item": parseFloat(synPerItem.toFixed(2)), "Total Syns": parseFloat(total.toFixed(2)) };
    },
  },

  "safefood-turkey": {
    inputs: [
      { id: "weightKg", label: "Turkey Weight (kg)", min: 1, max: 30, step: 0.1, default: 6 },
      { id: "ovenTemp", label: "Oven Temp (°C)", min: 100, max: 260, step: 1, default: 180 },
      { id: "isStuffed", label: "Stuffed (1=yes,0=no)", min: 0, max: 1, step: 1, default: 0 },
    ],
    calculate: ({ weightKg, ovenTemp, isStuffed }) => {
      // Approximate: 40 min/kg unstuffed at 180C, add 20% if stuffed
      const baseMinsPerKg = 40 * (180 / ovenTemp);
      const factor = isStuffed === 1 ? 1.2 : 1;
      const minutes = weightKg * baseMinsPerKg * factor;
      const rest = 20; // minutes resting
      return { "Cook Time (mins)": Math.round(minutes), "Rest Time (mins)": rest, "Total Time (mins)": Math.round(minutes + rest) };
    },
  },

  "pregnancy-calculator": {
    inputs: [
      { id: "lmpDaysAgo", label: "Days Since LMP", min: 0, max: 300, step: 1, default: 70 },
      { id: "cycleLength", label: "Average Cycle Length (days)", min: 20, max: 40, step: 1, default: 28 },
    ],
    calculate: ({ lmpDaysAgo, cycleLength }) => {
      const gestationDays = 280; // typical
      const daysRemaining = Math.max(0, gestationDays - lmpDaysAgo);
      const weeksGestation = Math.floor(lmpDaysAgo / 7);
      const daysCurrentWeek = lmpDaysAgo % 7;
      const monthsGestation = Math.floor(lmpDaysAgo / 30.44);
      const estimatedDueWeek = Math.round((lmpDaysAgo + daysRemaining) / 7);
      return { 
        "Days": daysCurrentWeek, 
        "Weeks": weeksGestation, 
        "Months": monthsGestation, 
        "Estimated Due Week": estimatedDueWeek 
      };
    },
  },

  "ovulation-calculator": {
    inputs: [
      { id: "lmpDaysAgo", label: "Days Since LMP", min: 0, max: 60, step: 1, default: 14 },
      { id: "cycleLength", label: "Average Cycle Length (days)", min: 20, max: 40, step: 1, default: 28 },
    ],
    calculate: ({ lmpDaysAgo, cycleLength }) => {
      const ovulationDay = cycleLength - 14; // approximate
      const nextOvulationIn = ovulationDay - (lmpDaysAgo % cycleLength);
      const fertileWindowStart = ovulationDay - 5;
      const fertileWindowEnd = ovulationDay + 1;
      return { "Ovulation Day (cycle)": ovulationDay, "Fertile Window (days)": `${fertileWindowStart}-${fertileWindowEnd}`, "Next Ovulation in (days)": nextOvulationIn };
    },
  },

  "rotunda-due-date": {
    inputs: [
      { id: "lmpDaysAgo", label: "Days Since LMP", min: 0, max: 300, step: 1, default: 70 },
      { id: "scanWeeksAgo", label: "Scan Weeks Ago (optional)", min: 0, max: 40, step: 1, default: 0 },
    ],
    calculate: ({ lmpDaysAgo, scanWeeksAgo }) => {
      const gestationDays = 280;
      const daysRemaining = Math.max(0, gestationDays - lmpDaysAgo);
      const dueInWeeks = parseFloat((daysRemaining / 7).toFixed(1));
      return { "Estimated Due In (weeks)": dueInWeeks, "Days Remaining": Math.round(daysRemaining), "Rotunda Note": scanWeeksAgo ? `Using scan at ${scanWeeksAgo} weeks` : "Using LMP" };
    },
  },

  "petrol-calculator-ireland": {
    inputs: [
      { id: "distance", label: "Trip Distance (km)", min: 0, max: 5000, step: 1, default: 100 },
      { id: "consumption", label: "Fuel Consumption (L/100km)", min: 1, max: 30, step: 0.1, default: 6.5 },
      { id: "pricePerL", label: "Fuel Price (€/L)", min: 0.1, max: 5, step: 0.01, default: 1.70 },
    ],
    calculate: ({ distance, consumption, pricePerL }) => {
      const litres = (consumption / 100) * distance;
      const cost = litres * pricePerL;
      return { "Litres Needed": parseFloat(litres.toFixed(2)), "Estimated Cost": parseFloat(cost.toFixed(2)) };
    },
  },

  "fuel-calculator-ireland": {
    inputs: [
      { id: "distance", label: "Distance (km)", min: 0, max: 5000, step: 1, default: 200 },
      { id: "fuelEconomy", label: "Fuel Economy (L/100km)", min: 1, max: 30, step: 0.1, default: 7 },
      { id: "fuelPrice", label: "Fuel Price (€/L)", min: 0.1, max: 5, step: 0.01, default: 1.70 },
    ],
    calculate: ({ distance, fuelEconomy, fuelPrice }) => {
      const litres = (fuelEconomy / 100) * distance;
      const cost = litres * fuelPrice;
      return { "Litres": parseFloat(litres.toFixed(2)), "Cost (€)": parseFloat(cost.toFixed(2)) };
    },
  },

  "electricity-bill-ireland": {
    inputs: [
      { id: "usageKwh", label: "Electricity Usage (kWh)", min: 0, max: 100000, step: 1, default: 400 },
      { id: "unitRate", label: "Unit Rate (€/kWh)", min: 0, max: 1, step: 0.001, default: 0.30 },
      { id: "standingCharge", label: "Standing Charge (€/day)", min: 0, max: 5, step: 0.01, default: 0.20 },
      { id: "days", label: "Billing Days", min: 1, max: 365, step: 1, default: 30 },
    ],
    calculate: ({ usageKwh, unitRate, standingCharge, days }) => {
      const energyCost = usageKwh * unitRate;
      const standing = standingCharge * days;
      const total = energyCost + standing;
      return { "Energy Cost": Math.round(energyCost), "Standing Charge": Math.round(standing), "Total Bill": Math.round(total) };
    },
  },

  "gas-bill-ireland": {
    inputs: [
      { id: "usageKwh", label: "Gas Usage (kWh)", min: 0, max: 100000, step: 1, default: 1000 },
      { id: "unitRate", label: "Unit Rate (€/kWh)", min: 0, max: 1, step: 0.001, default: 0.06 },
      { id: "standingCharge", label: "Standing Charge (€/day)", min: 0, max: 5, step: 0.01, default: 0.15 },
      { id: "days", label: "Billing Days", min: 1, max: 365, step: 1, default: 30 },
    ],
    calculate: ({ usageKwh, unitRate, standingCharge, days }) => {
      const energyCost = usageKwh * unitRate;
      const standing = standingCharge * days;
      const total = energyCost + standing;
      return { "Energy Cost": Math.round(energyCost), "Standing Charge": Math.round(standing), "Total Bill": Math.round(total) };
    },
  },

  "kwh-cost-ireland": {
    inputs: [
      { id: "powerKw", label: "Appliance Power (kW)", min: 0.01, max: 10, step: 0.01, default: 1 },
      { id: "hours", label: "Hours of Use", min: 0, max: 24, step: 0.1, default: 2 },
      { id: "unitCost", label: "Unit Cost (€/kWh)", min: 0.01, max: 1, step: 0.001, default: 0.30 },
    ],
    calculate: ({ powerKw, hours, unitCost }) => {
      const kwh = powerKw * hours;
      const cost = kwh * unitCost;
      return { "kWh Used": parseFloat(kwh.toFixed(2)), "Cost (€)": parseFloat(cost.toFixed(2)) };
    },
  },

  "heat-pump-cost-ireland": {
    inputs: [
      { id: "homeSize", label: "Home Size (m²)", min: 10, max: 1000, step: 5, default: 120 },
      { id: "installationRate", label: "Install Rate (€/m²)", min: 100, max: 1000, step: 10, default: 200 },
      { id: "runningSavingPerYear", label: "Estimated Annual Saving (€)", min: 0, max: 10000, step: 10, default: 800 },
    ],
    calculate: ({ homeSize, installationRate, runningSavingPerYear }) => {
      const installCost = homeSize * installationRate;
      const paybackYears = runningSavingPerYear > 0 ? parseFloat((installCost / runningSavingPerYear).toFixed(1)) : 0;
      return { "Install Cost": Math.round(installCost), "Estimated Annual Saving": Math.round(runningSavingPerYear), "Payback Years": paybackYears };
    },
  },

  "btu-calculator-ireland": {
    inputs: [
      { id: "length", label: "Length (m)", min: 1, max: 50, step: 0.1, default: 4 },
      { id: "width", label: "Width (m)", min: 1, max: 50, step: 0.1, default: 3 },
      { id: "height", label: "Height (m)", min: 1, max: 10, step: 0.1, default: 2.5 },
      { id: "insulationFactor", label: "Insulation Factor (1-poor,0.5-good)", min: 0.1, max: 2, step: 0.1, default: 1 },
    ],
    calculate: ({ length, width, height, insulationFactor }) => {
      const volume = length * width * height;
      // Approximate 337 BTU per m3
      const btu = volume * 337 * insulationFactor;
      return { "Room Volume (m³)": Math.round(volume), "BTU Required": Math.round(btu) };
    },
  },

  "nox-calculator-ireland": {
    inputs: [
      { id: "consumption", label: "Consumption (kWh or L)", min: 0, max: 100000, step: 1, default: 1000 },
      { id: "emissionFactor", label: "NOx Emission Factor (g/unit)", min: 0, max: 1000, step: 0.1, default: 0.5 },
    ],
    calculate: ({ consumption, emissionFactor }) => {
      const nox = consumption * emissionFactor;
      return { "NOx Emissions (g)": Math.round(nox) };
    },
  },

  "stocking-rate-calculator": {
    inputs: [
      { id: "area", label: "Land Area (ha)", min: 0.1, max: 1000, step: 0.1, default: 10 },
      { id: "forageYield", label: "Forage Yield (t DM/ha)", min: 0.1, max: 30, step: 0.1, default: 8 },
      { id: "demandPerAnimal", label: "Annual Demand per Animal (t DM)", min: 0.1, max: 10, step: 0.1, default: 2 },
    ],
    calculate: ({ area, forageYield, demandPerAnimal }) => {
      const totalForage = area * forageYield;
      const stockingRate = totalForage / demandPerAnimal;
      return { "Total Forage (t)": parseFloat(totalForage.toFixed(2)), "Stocking Rate (animals)": Math.round(stockingRate) };
    },
  },

  "nitrates-calculator": {
    inputs: [
      { id: "livestockUnits", label: "Livestock Units", min: 0, max: 10000, step: 1, default: 50 },
      { id: "areaHa", label: "Area (ha)", min: 0.1, max: 1000, step: 0.1, default: 10 },
      { id: "nPerLU", label: "N (kg) per LU per year", min: 0, max: 10000, step: 1, default: 170 },
    ],
    calculate: ({ livestockUnits, areaHa, nPerLU }) => {
      const totalN = livestockUnits * nPerLU;
      const loading = totalN / areaHa;
      return { "Total N (kg)": Math.round(totalN), "N Loading (kg/ha)": Math.round(loading) };
    },
  },

  "sheep-gestation": {
    inputs: [
      { id: "daysSinceBreeding", label: "Days Since Breeding", min: 0, max: 365, step: 1, default: 50 },
    ],
    calculate: ({ daysSinceBreeding }) => {
      const gestation = 147;
      const daysRemaining = Math.max(0, gestation - daysSinceBreeding);
      return { "Gestation Days": gestation, "Days Remaining": daysRemaining };
    },
  },

  "mare-gestation": {
    inputs: [
      { id: "daysSinceBreeding", label: "Days Since Breeding", min: 0, max: 600, step: 1, default: 100 },
    ],
    calculate: ({ daysSinceBreeding }) => {
      const gestation = 340;
      const daysRemaining = Math.max(0, gestation - daysSinceBreeding);
      return { "Gestation Days": gestation, "Days Remaining": daysRemaining };
    },
  },

  "calving-calculator": {
    inputs: [
      { id: "daysSinceBreeding", label: "Days Since Breeding", min: 0, max: 600, step: 1, default: 200 },
    ],
    calculate: ({ daysSinceBreeding }) => {
      const gestation = 283;
      const daysRemaining = Math.max(0, gestation - daysSinceBreeding);
      return { "Gestation Days": gestation, "Days Remaining": daysRemaining };
    },
  },

  "expenses-calculator-ireland": {
    inputs: [
      { id: "items", label: "Number of Items", min: 1, max: 1000, step: 1, default: 5 },
      { id: "costPerItem", label: "Cost per Item (€)", min: 0, max: 100000, step: 0.01, default: 50 },
      { id: "frequencyPerYear", label: "Frequency per Year", min: 0, max: 365, step: 1, default: 12 },
    ],
    calculate: ({ items, costPerItem, frequencyPerYear }) => {
      const totalPerEvent = items * costPerItem;
      const annual = totalPerEvent * frequencyPerYear;
      return { "Total per Event": Math.round(totalPerEvent), "Annual Total": Math.round(annual) };
    },
  },

  "gaa-age-calculator": {
    inputs: [
      { id: "birthYear", label: "Birth Year (YYYY)", min: 1900, max: 2100, step: 1, default: 2005 },
      { id: "currentYear", label: "Current Year", min: 1900, max: 2100, step: 1, default: 2026 },
    ],
    calculate: ({ birthYear, currentYear }) => {
      const age = currentYear - birthYear;
      return { "Age": age };
    },
  },

  "community-games-age": {
    inputs: [
      { id: "birthYear", label: "Birth Year (YYYY)", min: 1900, max: 2100, step: 1, default: 2015 },
      { id: "competitionYear", label: "Competition Year", min: 1900, max: 2100, step: 1, default: 2026 },
    ],
    calculate: ({ birthYear, competitionYear }) => {
      const age = competitionYear - birthYear;
      return { "Age at Competition": age };
    },
  },

  "dog-heat-cycle": {
    inputs: [
      { id: "daysSinceLastHeat", label: "Days Since Last Heat", min: 0, max: 365, step: 1, default: 60 },
      { id: "avgCycle", label: "Average Cycle Length (days)", min: 40, max: 300, step: 1, default: 180 },
    ],
    calculate: ({ daysSinceLastHeat, avgCycle }) => {
      const phase = daysSinceLastHeat % avgCycle;
      return { "Current Phase (days into cycle)": phase, "Next Heat in (days)": avgCycle - phase };
    },
  },

  "non-programmable": {
    inputs: [
      { id: "inputValue", label: "Input Value", min: -99999, max: 99999, step: 0.01, default: 42 },
      { id: "divisor", label: "Divisor (for operations)", min: 1, max: 1000, step: 0.01, default: 7 },
      { id: "simpleOp", label: "Operation (1=Square, 2=Square Root, 3=Divide by divisor, 4=Times 10)", min: 1, max: 4, step: 1, default: 1 },
    ],
    calculate: ({ inputValue, divisor, simpleOp }) => {
      let result = 0;
      if (simpleOp === 1) result = inputValue * inputValue;
      else if (simpleOp === 2) result = Math.sqrt(Math.max(0, inputValue));
      else if (simpleOp === 3) result = divisor !== 0 ? inputValue / divisor : 0;
      else if (simpleOp === 4) result = inputValue * 10;
      return { "Result": parseFloat(result.toFixed(6)) };
    },
  },

  "scientific-general": {
    inputs: [
      { id: "angle", label: "Angle (degrees)", min: -360, max: 360, step: 0.1, default: 30 },
      { id: "number", label: "Number", min: 0.1, max: 100000, step: 0.1, default: 10 },
      { id: "func", label: "Function (1=sin, 2=cos, 3=tan, 4=log, 5=ln, 6=inverse)", min: 1, max: 6, step: 1, default: 1 },
    ],
    calculate: ({ angle, number, func }) => {
      const rad = (angle * Math.PI) / 180;
      let result = 0;
      if (func === 1) result = Math.sin(rad);
      else if (func === 2) result = Math.cos(rad);
      else if (func === 3) result = Math.tan(rad);
      else if (func === 4) result = Math.log10(number);
      else if (func === 5) result = Math.log(number);
      else if (func === 6) result = 1 / number;
      return { "Result": parseFloat(result.toFixed(8)) };
    },
  },

  "casio-reset-guide": {
    inputs: [
      { id: "dummy", label: "(This is an informational guide - no calculation)", min: 0, max: 1, step: 1, default: 0 },
    ],
    calculate: () => {
      return { 
        "Guide": "1. Locate RESET button (usually on back/side)",
        "Step 2": "2. Press and hold for 3-5 seconds",
        "Step 3": "3. Display will show All Clear or similar",
        "Step 4": "4. Memory and settings have been reset",
        "Note": "Refer to your specific Casio model manual"
      };
    },
  },
};

/* ---------- UI CATEGORIES ---------- */

export const categories: Category[] = [
  {
    id: "tax-salary",
    name: "Tax & Salary",
    description: "Tax calculations, salary deductions and take-home pay estimations",
    icon: Percent,
    calculators: [
      { id: "tax-calculator", name: "Tax Calculator", description: "Estimate income tax for Ireland" },
      { id: "income-tax", name: "Income Tax (Standard)", description: "Calculate tax due across two bands with credits" },
      { id: "usc-calculator", name: "USC Calculator", description: "Calculate Universal Social Charge across bands" },
      { id: "prsi-calculator", name: "PRSI Calculator", description: "Weekly PRSI estimate using rate and limits" },
      { id: "salary-deductions", name: "Salary Deductions", description: "Calculate statutory and other deductions" },
      { id: "take-home-pay", name: "Take-home Pay", description: "Estimate net pay after taxes and deductions" },
      { id: "au-pair-ireland-salary", name: "Au Pair Ireland Salary", description: "Estimate annual and monthly pay for au pairs" },
      { id: "one-parent-family", name: "One Parent Family", description: "Estimate benefits and net income for single-parent families" },
      { id: "job-share-salary", name: "Job Share Salary", description: "Calculate your share salary based on weekly hours" },
      { id: "marginal-tax-rate", name: "Marginal Tax Rate / Cost", description: "Calculate marginal tax rate and effective cost change" },
      { id: "marginal-cost", name: "Marginal Cost Calculator", description: "Compute marginal and average costs" },
      { id: "ebitda", name: "EBITDA Calculator", description: "Calculate EBITDA from basic financial inputs" },
      { id: "diageo-share-price", name: "Diageo Share Price", description: "Portfolio value and change for Diageo shares" },
      { id: "dhl-price", name: "DHL Price Calculator", description: "Estimate shipping cost with DHL in Ireland" },
      { id: "dhl-customs-duty", name: "DHL Customs Duty", description: "Estimate customs duty and VAT on imports" },
      { id: "tax-calculator-denmark", name: "Tax Calculator (Denmark)", description: "Simple Denmark tax estimator" },
      { id: "dividend-tax-ireland", name: "Dividend Tax (Ireland)", description: "Estimate tax on dividend income" },
      { id: "capital-gains-tax", name: "Capital Gains Tax (CGT)", description: "Calculate CGT from sale/purchase and allowable costs" },
      { id: "airbnb-tax-ireland", name: "Airbnb Tax (Ireland)", description: "Estimate taxes on short-term rental income" },
      { id: "inheritance-tax-ireland", name: "Inheritance Tax (Ireland)", description: "Estimate inheritance tax payable in Ireland" },
    ],
  },
  {
    id: "loan-finance",
    name: "Loan & Finance",
    description: "Car loans, credit union loans and other finance calculators",
    icon: IndianRupee,
    calculators: [
      { id: "car-loan", name: "Car Loan Calculator", description: "Monthly repayments for car finance" },
      { id: "car-finance", name: "Car Finance Calculator", description: "Compare finance options for vehicles" },
      { id: "credit-union-loan", name: "Credit Union Loan Calculator", description: "Estimate CU loan repayments" },
      { id: "credit-union-mortgage", name: "Credit Union Mortgage Calculator", description: "Mortgage calculations for credit union products" },
      { id: "buy-to-let", name: "Buy-to-Let Mortgage Calculator", description: "Assess buy-to-let mortgage returns and costs" },
      { id: "aib-business-loan", name: "AIB Business Loan Calculator", description: "AIB business loan repayment calculator" },
      { id: "permanent-tsb-loan", name: "Permanent TSB Loan", description: "Permanent TSB personal and business loans" },
      { id: "bank-of-ireland-loan", name: "Bank of Ireland Loan", description: "BoI loan repayment estimator" },
      { id: "hsscu-loan", name: "HSSCU Loan Calculator", description: "Healthcare sector credit union loans" },
      { id: "spry-finance", name: "Spry Finance Calculator", description: "Spry digital lending calculator" },
      { id: "farm-loan", name: "Farm Loan Calculator", description: "Agricultural and farm loan estimator" },
      { id: "vw-pcp", name: "VW PCP Calculator", description: "Volkswagen Personal Contract Plan calculator" },
      { id: "audi-loan", name: "Audi Car Finance Calculator", description: "Audi financing options and payments" },
      { id: "kia-loan", name: "Kia Car Finance", description: "Kia vehicle loan and finance calculator" },
      { id: "hyundai-loan", name: "Hyundai Car Finance", description: "Hyundai financing and loan estimator" },
      { id: "peugeot-loan", name: "Peugeot Car Finance", description: "Peugeot vehicle financing calculator" },
      { id: "skoda-loan", name: "Skoda Car Finance", description: "Skoda car loan and repayment calculator" },
      { id: "skoda-pcp", name: "Skoda PCP Calculator", description: "Skoda Personal Contract Plan option" },
      { id: "volkswagen-pcp", name: "Volkswagen PCP (Alternative)", description: "VW PCP comprehensive calculator" },
      { id: "hyundai-pcp", name: "Hyundai PCP Calculator", description: "Hyundai Personal Contract Plan" },
      { id: "aib-mortgage-overpayment", name: "AIB Mortgage Overpayment", description: "Calculate mortgage savings with overpayments" },
      { id: "topup-mortgage", name: "Mortgage Top-Up Calculator", description: "Add extra borrowing to existing mortgage" },
      { id: "self-build-mortgage", name: "Self-Build Mortgage", description: "Financing for new build properties" },
      { id: "mortgage-switch", name: "Mortgage Switch Calculator", description: "Compare mortgage rates when switching" },
      { id: "investment-mortgage", name: "Investment Mortgage Calculator", description: "Investment property mortgage and ROI" },
      { id: "commercial-loan", name: "Commercial Loan Calculator", description: "Business and commercial lending calculator" },
      { id: "business-loan-general", name: "Business Loan (General)", description: "General business financing tool" },
      { id: "loan-interest-calculator", name: "Loan Interest Calculator", description: "Simple interest calculation for any loan" },
      { id: "equity-release", name: "Equity Release Calculator", description: "Estimate equity release options" },
    ],
  },
  {
    id: "mortgage-property",
    name: "Mortgage & Property",
    description: "Property costs, stamp duty, renovation and construction cost calculators",
    icon: Home,
    calculators: [
      { id: "stamp-duty", name: "Stamp Duty Calculator", description: "Calculate stamp duty on property purchases by buyer type (first-time, residential, non-residential)" },
      { id: "online-property-value", name: "Online Property Valuation", description: "Estimate property value using AVM (Automated Valuation Model) approach" },
      { id: "cost-of-building-house", name: "House Building Cost Calculator", description: "Estimate total cost to build a house including contingency and professional fees" },
      { id: "build-2000-sqft-house", name: "2000 Sq Ft House Build Cost", description: "Calculate build cost for houses in square footage with cost per sq ft" },
      { id: "extension-cost-ireland", name: "Extension Cost Calculator (Global)", description: "Estimate cost of home extension including labour and multi-storey premium" },
      { id: "renovation-cost-ireland", name: "Renovation Cost Calculator (Global)", description: "Calculate renovation costs by area with labour breakdown" },
      { id: "conservatory-cost-ireland", name: "Conservatory Cost Calculator (Global)", description: "Estimate conservatory costs including foundations" },
      { id: "kitchen-cost-ireland", name: "Kitchen Cost Calculator (Global)", description: "Calculate kitchen refit costs (cabinetry, appliances, worktop, labour)" },
      { id: "bathroom-cost-ireland", name: "Bathroom Cost Calculator (Global)", description: "Estimate bathroom renovation costs (sanitaryware, tiling, labour)" },
      { id: "roof-cost-ireland", name: "Roof Cost Calculator (Global)", description: "Calculate roof replacement costs (materials, labour, scaffolding)" },
      { id: "flooring-cost-ireland", name: "Flooring Cost Calculator (Global)", description: "Estimate flooring installation costs (material, underlay, labour)" },
      { id: "window-cost-ireland", name: "Window Cost Calculator (Global)", description: "Calculate window replacement costs per window plus installation" },
      { id: "triple-glazing-cost", name: "Triple Glazing Cost Calculator", description: "Estimate triple glazing costs (glazing, frame, installation)" },
      { id: "external-wall-insulation", name: "External Wall Insulation (EWI) Calculator", description: "Calculate EWI costs (material, render, scaffolding, labour)" },
      { id: "house-rewiring-cost", name: "House Rewiring Cost Calculator", description: "Estimate full house rewiring costs (wiring, consumer unit, testing)" },
      { id: "decking-calculator", name: "Decking Cost Calculator", description: "Calculate decking project costs (material, frame, labour)" },
      { id: "tarmac-driveway-ireland", name: "Tarmac Driveway Calculator (Global)", description: "Estimate tarmac driveway costs (tarmac, sub-base, edging)" },
      { id: "fitted-wardrobe-calculator", name: "Fitted Wardrobe Cost Calculator", description: "Calculate fitted wardrobe costs (cabinet, fittings, installation)" },
      { id: "tree-removal-calculator", name: "Tree Removal Cost Calculator", description: "Estimate tree removal costs (by height and access difficulty, includes stump removal)" },
      { id: "cycle-to-work-ireland", name: "Cycle-to-Work Scheme (Global)", description: "Calculate tax savings from salary sacrifice schemes (varies by country)" },
      { id: "solar-calculator-ireland", name: "Solar Calculator (Global)", description: "Estimate solar panel payback period, 20-year savings and ROI" },
    ],
  },
  {
    id: "insurance-pension",
    name: "Insurance & Pension",
    description: "Pensions, retirement and insurance planning tools",
    icon: Home,
    calculators: [
      { id: "hse-pension", name: "HSE Pension Calculator", description: "Estimate HSE pension entitlements" },
      { id: "hse-retirement", name: "HSE Retirement Calculator", description: "Plan HSE retirement scenarios" },
      { id: "hse-annual-leave", name: "HSE Annual Leave Calculator", description: "Calculate annual leave entitlements" },
      { id: "into-pension", name: "INTO Pension Calculator", description: "INTO pension planning tool" },
      { id: "new-ireland-pension", name: "New Ireland Pension Calculator", description: "New Ireland pension estimator" },
      { id: "pension-defined-benefit", name: "Defined Benefit Pension", description: "Estimate defined benefit (final salary) pension based on accrual rate" },
      { id: "pension-defined-contribution", name: "Defined Contribution Projection", description: "Project pension pot growth based on contributions and returns" },
      { id: "annuity-calculator", name: "Annuity Calculator", description: "Estimate lifetime income from a pension lump sum" },
      { id: "annuity", name: "Annuity (Simple)", description: "Simple annuity estimate from pot and annuity rate" },
      { id: "max-funding", name: "Max Funding Calculator", description: "Estimate max pension funding limits based on age and salary" },
      { id: "pension-max-funding", name: "Pension Max Funding (Age Limits)", description: "Age-based maximum allowable pension contributions" },
      { id: "single-pension-scheme", name: "Single Pension Scheme Calculator", description: "Career-average pension scheme estimator" },
      { id: "pension-single-scheme", name: "Single Pension Scheme (Alternate)", description: "Alternate career-average pension calculator" },
      { id: "life-insurance", name: "Life Insurance Calculator", description: "Recommend life cover based on debts and income replacement" },
      { id: "mortgage-protection", name: "Mortgage Protection Calculator", description: "Calculate mortgage protection cover" },
      { id: "income-protection", name: "Income Protection Calculator", description: "Estimate monthly income protection benefits" },
    ],
  },
  {
    id: "leave-work",
    name: "Leave & Work Allowance",
    description: "Maternity, annual leave and workplace allowance tools",
    icon: Home,
    calculators: [
      { id: "maternity-leave", name: "Maternity Leave Calculator", description: "Estimate maternity leave entitlements" },
      { id: "into-maternity", name: "INTO Maternity Calculator", description: "INTO-specific maternity calculations" },
      { id: "maternity-date", name: "Maternity Leave Date Calculator", description: "Calculate official maternity dates" },
      { id: "maternity-paternity-leave", name: "Maternity/Paternity Leave (Global)", description: "Calculate leave dates and statutory pay globally" },
      { id: "annual-leave", name: "Annual Leave Calculator", description: "Calculate annual leave and balances" },
      { id: "annual-leave-pro-rata", name: "Annual Leave Pro-Rata (Global)", description: "Pro-rated annual leave based on start date and months worked" },
      { id: "holiday-pay", name: "Holiday Pay Calculator", description: "Estimate holiday pay owed" },
      { id: "holiday-pay-accrual", name: "Holiday Pay Accrual (Global)", description: "Calculate accrued holiday pay owed on leaving" },
      { id: "holiday-entitlements", name: "Holiday Entitlements (Global)", description: "Determine paid public holiday entitlements using accrual method" },
      { id: "part-time-holiday-pay", name: "Part-Time Holiday Pay", description: "Pro-rate holiday pay for part-time workers" },
      { id: "part-time-holiday-pay-pro-rata", name: "Part-Time Holiday Pay (Global)", description: "Pro-rata holiday entitlement for part-time workers globally" },
      { id: "rent-allowance", name: "Rent Allowance Calculator", description: "Estimate housing assistance based on means test" },
      { id: "rent-benefit-means-test", name: "Rent Benefit (Means Test Global)", description: "Calculate rent benefit with income disregard and tapering" },
      { id: "social-housing-rent", name: "Social Housing Rent Calculator", description: "Estimate income-based social housing rent" },
      { id: "social-housing-rent-calculated", name: "Social Housing Rent (Global)", description: "Calculate rent as percentage of income with minimum" },
    ],
  },
  {
    id: "education-student",
    name: "Education & Student",
    description: "GPA, QCA and university grade calculators",
    icon: Home,
    calculators: [
      { id: "gpa-calculator", name: "GPA Calculator", description: "Flexible GPA: credits × grade point / total credits" },
      { id: "leaving-cert-points", name: "Leaving Certificate Points", description: "Calculate LC points from best 6 subjects (level-aware)" },
      { id: "ucas-points", name: "UCAS Points Converter", description: "Convert grades to UK UCAS tariff points" },
      { id: "qqi-points", name: "QQI Points Calculator", description: "Points for Further Education awards by module and level" },
      { id: "qca-calculator", name: "QCA Calculator", description: "Quality Credit Average (QCA) calculations" },
      { id: "ects-calculator", name: "ECTS Credits Calculator", description: "Sum ECTS credits across modules/courses" },
      { id: "ucd-grades", name: "UCD Grade Calculator", description: "Weighted module grade calculation (assignments + exams)" },
      { id: "ucd-gpa", name: "UCD GPA Calculator", description: "UCD-style GPA using institution grade-point mapping" },
      { id: "hpat-score", name: "HPAT Score Calculator", description: "Estimate HPAT section scores" },
      { id: "hpat-points", name: "HPAT Points Calculator", description: "Combine HPAT with Leaving Cert points for medicine entry" },
      { id: "running-record", name: "Running Record Calculator", description: "Calculate reading accuracy % (total words - errors) / total words" },
    ],
  },
  {
    id: "math-science",
    name: "Math & Science",
    description: "Advanced mathematics and scientific calculation tools",
    icon: Percent,
    calculators: [
      { id: "compound-interest", name: "Compound Interest Calculator", description: "Compound interest over time" },
      { id: "investment-calculator", name: "Investment Calculator", description: "Project investment growth" },
      { id: "savings-calculator", name: "Savings Calculator", description: "Plan and project savings" },
      { id: "critical-points", name: "Critical Points Calculator", description: "Find critical points of functions via f'(x)=0" },
      { id: "completing-the-square", name: "Completing the Square", description: "Transform quadratic equations to vertex form" },
      { id: "simpsons-rule", name: "Simpson's Rule", description: "Approximate definite integrals numerically" },
      { id: "directional-derivative", name: "Directional Derivative", description: "Rate of change in a given vector direction" },
      { id: "standard-deviation-casio", name: "Standard Deviation (Casio)", description: "Population and sample standard deviation calculator" },
      { id: "titration", name: "Titration Calculator", description: "Acid-base chemistry titration calculations" },
      { id: "binomial-expansion", name: "Binomial Expansion", description: "Expand binomial expressions (a+b)^n" },
      { id: "partial-fraction-decomposition", name: "Partial Fraction Decomposition", description: "Break rational functions into simpler fractions" },
      { id: "taylor-series", name: "Taylor Series", description: "Approximate functions using Taylor series expansion" },
      { id: "radius-of-convergence", name: "Radius of Convergence", description: "Find convergence interval for power series" },
      { id: "fourier-transform", name: "Fourier Transform", description: "Decompose functions into frequency components" },
      { id: "fourier-series", name: "Fourier Series", description: "Represent periodic functions as sine/cosine sums" },
      { id: "laplace-transform", name: "Laplace Transform", description: "Convert time-domain to frequency-domain" },
      { id: "inverse-laplace-transform", name: "Inverse Laplace Transform", description: "Convert frequency-domain back to time-domain" },
    ],
  },
  {
    id: "casio-generic",
    name: "Casio & Generic",
    description: "Virtual handheld and programmable calculators",
    icon: Home,
    calculators: [
      { id: "casio-basic", name: "Casio Calculator", description: "Virtual handheld Casio-style basic arithmetic calculator" },
      { id: "casio-fx83gtx", name: "Casio FX-83GTX", description: "Scientific calculator emulator (trigonometry, logarithms, functions)" },
      { id: "casio-watch", name: "Casio Calculator Watch", description: "Compact watch-style calculator for everyday arithmetic" },
      { id: "sharp-scientific", name: "Sharp-style Scientific", description: "Sharp-style online scientific calculator with advanced functions" },
      { id: "programmable", name: "Programmable Calculator", description: "Programmable-style calculator (financial calculations, time-value-of-money)" },
      { id: "non-programmable", name: "Non-Programmable Calculator", description: "Basic non-programmable handheld calculator" },
      { id: "scientific-general", name: "Scientific Calculator", description: "General-purpose scientific calculator (global standard)" },
      { id: "casio-reset-guide", name: "How to Reset Casio Calculator", description: "Guide: Step-by-step instructions to reset Casio calculators" },
    ],
  },
  {
    id: "fashion-size",
    name: "Fashion & Size",
    description: "Size, measurement and conversion tools",
    icon: Home,
    calculators: [
      { id: "bra-size", name: "Bra Size Calculator", description: "Estimate bra sizes from measurements" },
      { id: "clarks-size", name: "Clarks Size Calculator", description: "Clarks shoe sizing guide" },
      { id: "clarks-foot-gauge", name: "Clarks Foot Gauge", description: "Measure foot gauge for Clarks" },
      { id: "clarks-foot-converter", name: "Clarks Foot Size Converter", description: "Convert foot measurements between systems" },
      { id: "clarks-shoe-size", name: "Clarks Shoe Size Tool", description: "Find your Clarks shoe size" },
    ],
  },
  {
    id: "general-misc",
    name: "General & Miscellaneous",
    description: "Various everyday utility calculators",
    icon: Home,
    calculators: [
      { id: "vrt-calculator", name: "VRT Calculator", description: "Vehicle registration tax estimator" },
      { id: "petrol-calculator-ireland", name: "Petrol Calculator (Global)", description: "Estimate fuel cost for trips worldwide" },
      { id: "fuel-calculator-ireland", name: "Fuel Calculator (Global)", description: "Estimate fuel consumption and cost worldwide" },
      { id: "piab-injury", name: "PIAB Injury Calculator", description: "Estimate PIAB injury awards" },
      { id: "injury-claim", name: "Injury Claim Calculator", description: "Injury claim and compensation estimator" },
      { id: "ex-gratia-redundancy", name: "Ex-Gratia Redundancy Calculator", description: "Redundancy payment estimations" },
      { id: "leaving-ireland-tax", name: "Exit Tax / Leaving Country", description: "Estimate exit tax or final liability when leaving a country" },
      { id: "slimming-syns", name: "Slimming Syns Calculator", description: "Estimate syn values for food items" },
      { id: "safefood-turkey", name: "Turkey Cooking Time Calculator", description: "Estimate turkey cooking time based on weight and oven settings" },
      { id: "pregnancy-calculator", name: "Pregnancy Calculator", description: "Estimate due date and pregnancy timeline (global standards)" },
      { id: "ovulation-calculator", name: "Ovulation Calculator", description: "Predict ovulation and fertile window" },
      { id: "rotunda-due-date", name: "Hospital Due Date Calculator", description: "Hospital-specific due date estimate (enter scan or LMP data)" },
      { id: "electricity-bill-ireland", name: "Electricity Bill Calculator (Global)", description: "Estimate electricity bills (global units/currencies)" },
      { id: "gas-bill-ireland", name: "Gas Bill Calculator (Global)", description: "Estimate gas bills (global units/currencies)" },
      { id: "kwh-cost-ireland", name: "kWh Cost Calculator (Global)", description: "Calculate appliance running costs (global units)" },
      { id: "heat-pump-cost-ireland", name: "Heat Pump Cost Calculator (Global)", description: "Estimate install and payback for heat pumps" },
      { id: "btu-calculator-ireland", name: "BTU Calculator (Global)", description: "Calculate heating/cooling BTU requirements" },
      { id: "nox-calculator-ireland", name: "NOx Calculator (Global)", description: "Estimate NOx emissions from consumption" },
      { id: "stocking-rate-calculator", name: "Stocking Rate Calculator", description: "Determine livestock capacity for land" },
      { id: "nitrates-calculator", name: "Nitrates Calculator", description: "Calculate nitrogen loading for compliance" },
      { id: "sheep-gestation", name: "Sheep Gestation Calculator", description: "Predict lambing date" },
      { id: "mare-gestation", name: "Mare Gestation Calculator", description: "Predict foaling date for horses" },
      { id: "calving-calculator", name: "Calving Calculator", description: "Predict calving date for cattle" },
      { id: "expenses-calculator-ireland", name: "Expenses Calculator (Ireland)", description: "Track and total expenses" },
      { id: "gaa-age-calculator", name: "GAA Age Calculator", description: "Determine age grade for GAA" },
      { id: "community-games-age", name: "Community Games Age Calculator", description: "Determine age group for Community Games" },
      { id: "dog-heat-cycle", name: "Dog Heat Cycle Calculator", description: "Track canine reproductive cycles" },
    ],
  },
];

/* ---------- SEARCH HELPERS ---------- */

export type CalculatorInfo = {
  id: string;
  name: string;
  description: string;
  category: string;
  path: string;
};

export function getAllCalculators(): CalculatorInfo[] {
  const list: CalculatorInfo[] = [];
  for (const cat of categories) {
    for (const calc of cat.calculators) {
      list.push({
        id: calc.id,
        name: calc.name,
        description: calc.description,
        category: cat.name,
        path: `/calculators/${calc.id}`,
      });
    }
  }
  return list;
}

export function searchCalculators(query: string): CalculatorInfo[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return getAllCalculators().filter((c) => {
    return (
      c.id.toLowerCase().includes(q) ||
      c.name.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
    );
  });
}