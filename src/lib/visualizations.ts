// Calculator visualization configurations
// Maps calculator IDs to recommended graphs and available visualization options

export type VisualizationType = "area" | "donut" | "bar" | "line" | "waterfall" | "comparison";

export interface VisualizationConfig {
  id: string;
  name: string;
  recommended: VisualizationType;
  available: VisualizationType[];
  description: string;
  keyMetric?: string; // Primary metric to visualize
  breakdownFields?: string[]; // Fields to show in breakdown charts
}

export const visualizationConfigs: Record<string, VisualizationConfig> = {
  // Car Calculators
  "car-loan": {
    id: "car-loan",
    name: "Car Loan Calculator",
    recommended: "area",
    available: ["area", "donut", "bar"],
    description: "Visualize how your loan balance reduces over time and see the interest vs principal split",
    keyMetric: "Monthly Payment",
    breakdownFields: ["Monthly Payment", "Total Interest", "Total Payment"],
  },
  
  "pcp-finance": {
    id: "pcp-finance",
    name: "PCP Finance Calculator",
    recommended: "area",
    available: ["area", "donut", "comparison"],
    description: "See how monthly payments accumulate and compare against balloon payment scenarios",
    keyMetric: "Balloon Payment",
    breakdownFields: ["Monthly Payment", "Balloon Payment", "Total Amount"],
  },

  // Tax & Income
  "income-tax": {
    id: "income-tax",
    name: "Income Tax Calculator",
    recommended: "donut",
    available: ["donut", "bar", "waterfall"],
    description: "See how your income is split between tax, PRSI, and take-home pay",
    keyMetric: "Take Home Pay",
    breakdownFields: ["Income Tax", "PRSI", "Net Pay", "Gross Salary"],
  },

  "vat-calculator": {
    id: "vat-calculator",
    name: "VAT Calculator",
    recommended: "bar",
    available: ["bar", "donut"],
    description: "Compare VAT amounts across different rates and amounts",
    keyMetric: "VAT Amount",
    breakdownFields: ["Minus VAT", "Plus VAT", "VAT Amount"],
  },

  // Mortgage & Finance
  "mortgage-calculator": {
    id: "mortgage-calculator",
    name: "Mortgage Calculator",
    recommended: "area",
    available: ["area", "donut", "line"],
    description: "Visualize how your mortgage balance decreases over time",
    keyMetric: "Monthly Payment",
    breakdownFields: ["Monthly Payment", "Total Interest", "Total Amount"],
  },

  "mortgage-protection": {
    id: "mortgage-protection",
    name: "Mortgage Protection Insurance",
    recommended: "bar",
    available: ["bar", "donut"],
    description: "Compare insurance premium options for mortgage protection",
    keyMetric: "Monthly Premium",
    breakdownFields: ["Monthly Premium", "Annual Cost"],
  },

  // Pensions & Insurance
  "pension-defined-benefit": {
    id: "pension-defined-benefit",
    name: "Defined Benefit Pension",
    recommended: "comparison",
    available: ["comparison", "bar", "donut"],
    description: "Compare pension scenarios under different conditions",
    keyMetric: "Annual Pension",
    breakdownFields: ["Annual Pension", "Lump Sum"],
  },

  "pension-defined-contribution": {
    id: "pension-defined-contribution",
    name: "Defined Contribution Pension",
    recommended: "line",
    available: ["line", "area", "donut"],
    description: "See how your pension pot grows over time with contributions",
    keyMetric: "Final Pot Value",
    breakdownFields: ["Contributions", "Growth", "Final Value"],
  },

  "life-insurance": {
    id: "life-insurance",
    name: "Life Insurance Calculator",
    recommended: "bar",
    available: ["bar", "donut"],
    description: "Compare coverage amounts and premium costs",
    keyMetric: "Monthly Premium",
    breakdownFields: ["Coverage Amount", "Monthly Premium", "Annual Cost"],
  },

  "income-protection": {
    id: "income-protection",
    name: "Income Protection Insurance",
    recommended: "bar",
    available: ["bar", "donut"],
    description: "Compare monthly benefits against premium costs",
    keyMetric: "Monthly Premium",
    breakdownFields: ["Monthly Benefit", "Monthly Premium"],
  },

  // Leave & Work
  "annual-leave": {
    id: "annual-leave",
    name: "Annual Leave Calculator",
    recommended: "bar",
    available: ["bar", "donut"],
    description: "Calculate and compare leave entitlements",
    keyMetric: "Annual Leave Days",
    breakdownFields: ["Annual Leave Days", "Bank Holidays"],
  },

  "maternity-leave": {
    id: "maternity-leave",
    name: "Maternity Leave Calculator",
    recommended: "donut",
    available: ["donut", "bar"],
    description: "See breakdown of paid vs unpaid maternity leave",
    keyMetric: "Total Leave Weeks",
    breakdownFields: ["Paid Weeks", "Unpaid Weeks"],
  },

  // Education & Finance
  "gpa-calculator": {
    id: "gpa-calculator",
    name: "GPA Calculator",
    recommended: "bar",
    available: ["bar", "donut", "line"],
    description: "Visualize your subject grades and weighted GPA",
    keyMetric: "Overall GPA",
    breakdownFields: [],
  },

  // Default for any unmapped calculator
  "default": {
    id: "default",
    name: "Calculator Results",
    recommended: "bar",
    available: ["bar", "donut", "line"],
    description: "View your calculation results",
    keyMetric: undefined,
    breakdownFields: [],
  },
};

export function getVisualizationConfig(calculatorId: string): VisualizationConfig {
  return visualizationConfigs[calculatorId] || visualizationConfigs["default"];
}

export function getRecommendedViz(calculatorId: string): VisualizationType {
  return getVisualizationConfig(calculatorId).recommended;
}

export function getAvailableViz(calculatorId: string): VisualizationType[] {
  return getVisualizationConfig(calculatorId).available;
}
