import type { ICountry } from "./countries";

export function formatCurrency(value: number, currencyCode: string, locale: string) {
  try {
    // Format with 2 decimal places and no thousand separators
    const formatter = new Intl.NumberFormat(locale, { 
      style: "currency", 
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: false // This removes thousand separators
    });
    
    return formatter.format(value);
  } catch (e) {
    // Fallback: simple formatting with 2 decimal places
    return `${currencyCode} ${value.toFixed(2)}`;
  }
}

export function formatForCountry(value: number, country: ICountry) {
  return formatCurrency(value, country.currency.code, country.currency.locale);
}
