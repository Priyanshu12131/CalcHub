import type { ICountry } from "./countries";

export function formatCurrency(value: number, currencyCode: string, locale: string) {
  try {
    const formatted = new Intl.NumberFormat(locale, { style: "currency", currency: currencyCode }).format(value);
    // Normalize commas to dots for decimal separator
    return formatted.replace(/,/g, '.');
  } catch (e) {
    return `${currencyCode} ${value.toLocaleString()}`;
  }
}

export function formatForCountry(value: number, country: ICountry) {
  return formatCurrency(value, country.currency.code, country.currency.locale);
}
