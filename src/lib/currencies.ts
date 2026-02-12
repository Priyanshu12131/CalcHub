export type CurrencyConfig = {
  country: string;
  code: string;
  symbol: string;
  locale: string;
};

// A compact list — extendable to 180+ entries in production
export const currencyList: CurrencyConfig[] = [
  { country: "United States", code: "USD", symbol: "$", locale: "en-US" },
  { country: "European Union", code: "EUR", symbol: "€", locale: "de-DE" },
  { country: "United Kingdom", code: "GBP", symbol: "£", locale: "en-GB" },
  { country: "India", code: "INR", symbol: "₹", locale: "en-IN" },
];

export const defaultCurrency = currencyList[1];

export function formatCurrency(value: number, currencyCode: string, locale: string) {
  try {
    return new Intl.NumberFormat(locale, { style: "currency", currency: currencyCode }).format(value);
  } catch (e) {
    // fallback simple formatting
    return `${currencyCode} ${value.toLocaleString()}`;
  }
}

export function findCurrencyByCode(code: string) {
  return currencyList.find((c) => c.code === code) || defaultCurrency;
}

// Convert an amount from one currency to another using an optional rates map.
// rates should be a mapping from currency code to relative value (e.g. against a base like USD).
// If rates is omitted or doesn't contain codes, the function returns the original value (identity).
export function convertAmount(value: number, from: string, to: string, rates?: Record<string, number>) {
  if (!rates) return value;
  const fromRate = rates[from];
  const toRate = rates[to];
  if (typeof fromRate !== "number" || typeof toRate !== "number") return value;
  // Convert value -> base -> target
  const baseValue = value / fromRate;
  return baseValue * toRate;
}
