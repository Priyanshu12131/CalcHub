import type { ExchangeRates } from "./exchangeRateService";

/**
 * Convert amount from one currency to another using exchange rates mapping.
 * rates: mapping of currency code -> rate relative to rates.base.
 * Formula: converted = amount * (rateTo / rateFrom)
 */
export function convertAmount(amount: number, from: string, to: string, rates: ExchangeRates) {
  if (!rates || !rates.rates) return amount;
  const mapping = Object.create(null) as Record<string, number>;
  // normalize keys to upper case
  Object.keys(rates.rates || {}).forEach((k) => (mapping[k.toUpperCase()] = rates.rates[k] as number));
  const base = (rates.base || "").toUpperCase();
  const f = (from || "").toUpperCase();
  const t = (to || "").toUpperCase();

  const rFrom = mapping[f] ?? (f === base ? 1 : undefined);
  const rTo = mapping[t] ?? (t === base ? 1 : undefined);

  if (typeof rFrom !== "number" || typeof rTo !== "number") {
    // best-effort fallback: if base exists in mapping, convert via base
    const baseRate = mapping[base];
    if (typeof baseRate === "number") {
      const amountInBase = typeof rFrom === "number" ? amount / rFrom : amount;
      const toRate = typeof rTo === "number" ? rTo : 1;
      return amountInBase * toRate;
    }
    return amount; // cannot convert
  }

  return amount * (rTo / rFrom);
}

export function convertToBase(amount: number, from: string, rates: ExchangeRates) {
  if (!rates || !rates.rates) return amount;
  const mapping = Object.create(null) as Record<string, number>;
  Object.keys(rates.rates || {}).forEach((k) => (mapping[k.toUpperCase()] = rates.rates[k] as number));
  const base = (rates.base || "").toUpperCase();
  const f = (from || "").toUpperCase();
  const rFrom = mapping[f] ?? (f === base ? 1 : undefined);
  if (typeof rFrom !== "number") return amount;
  return amount / rFrom;
}

export function convertFromBase(amount: number, to: string, rates: ExchangeRates) {
  if (!rates || !rates.rates) {
    console.warn('[convertFromBase] Missing rates');
    return amount;
  }
  const mapping = Object.create(null) as Record<string, number>;
  Object.keys(rates.rates || {}).forEach((k) => (mapping[k.toUpperCase()] = rates.rates[k] as number));
  const base = (rates.base || "").toUpperCase();
  const t = (to || "").toUpperCase();
  const rTo = mapping[t] ?? (t === base ? 1 : undefined);
  if (typeof rTo !== "number") {
    console.warn(`[convertFromBase] Cannot convert from ${base} to ${t}. Available: ${Object.keys(mapping).join(', ')}`);
    return amount;
  }
  const result = amount * rTo;
  console.log(`[convertFromBase] ${amount} ${base} -> ${t}: ${amount} * ${rTo} = ${result}`);
  return result;
}

export default convertAmount;
