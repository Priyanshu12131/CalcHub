// Analytics tracking utility for calculator usage

export interface CalculatorUsage {
  id: string;
  name: string;
  count: number;
  lastUsed: string;
  results: number[];
  timestamps: string[];
  events?: {
    criteria?: string;
    input?: number;
    result: number;
    timestamp: string;
  }[];
}

export interface AnalyticsData {
  usageByCalculator: Record<string, CalculatorUsage>;
  totalCalculations: number;
  lastUpdated: string;
}

const STORAGE_KEY = "calculator-analytics";
const DEFAULT_RESULTS_LIMIT = 100;

export function getAnalyticsData(): AnalyticsData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Error loading analytics:", e);
  }
  return {
    usageByCalculator: {},
    totalCalculations: 0,
    lastUpdated: new Date().toISOString(),
  };
}

export function saveAnalyticsData(data: AnalyticsData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Error saving analytics:", e);
  }
}

export function trackCalculatorUsage(
  calculatorId: string,
  calculatorName: string,
  resultValue?: number,
  criteriaName?: string,
  inputValue?: number
): void {
  const analytics = getAnalyticsData();

  if (!analytics.usageByCalculator[calculatorId]) {
    analytics.usageByCalculator[calculatorId] = {
      id: calculatorId,
      name: calculatorName,
      count: 0,
      lastUsed: new Date().toISOString(),
      results: [],
      timestamps: [],
    };
  }

  const usage = analytics.usageByCalculator[calculatorId];
  usage.count += 1;
  usage.lastUsed = new Date().toISOString();

  if (resultValue !== undefined && !isNaN(resultValue)) {
    usage.results.push(resultValue);
    usage.timestamps.push(new Date().toISOString());

    if (!usage.events) usage.events = [];
    usage.events.push({
      criteria: criteriaName,
      input: inputValue,
      result: resultValue,
      timestamp: new Date().toISOString(),
    });

    // Keep only last DEFAULT_RESULTS_LIMIT events/results to avoid storage bloat
    if (usage.results.length > DEFAULT_RESULTS_LIMIT) {
      usage.results.shift();
      usage.timestamps.shift();
    }
    if (usage.events.length > DEFAULT_RESULTS_LIMIT) {
      usage.events.shift();
    }
  }

  analytics.totalCalculations += 1;
  analytics.lastUpdated = new Date().toISOString();

  saveAnalyticsData(analytics);
}

export function clearAnalytics(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error("Error clearing analytics:", e);
  }
}

export function getUsageStats() {
  const analytics = getAnalyticsData();
  const calculators = Object.values(analytics.usageByCalculator);

  const topUsed = [...calculators]
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const recentlyUsed = [...calculators]
    .sort((a, b) => new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime())
    .slice(0, 5);

  return {
    topUsed,
    recentlyUsed,
    totalCalculators: calculators.length,
    totalCalculations: analytics.totalCalculations,
  };
}
