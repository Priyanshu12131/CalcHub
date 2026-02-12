import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from "react";
import type { ICountry } from "../lib/countries";
import { countries, defaultCountry } from "../lib/countries";
import { formatCurrency } from "../lib/currencyFormatter";
import { fetchExchangeRates, ExchangeRates, clearExchangeCache } from "../lib/exchangeRateService";
import { convertAmount, convertFromBase, convertToBase } from "../lib/convertAmount";

export type ICalculatorContext = {
  selectedCountry: ICountry;
  setSelectedCountry: (c: ICountry) => void;
  countries: ICountry[];
  format: (value: number) => string;
  exchangeRates: ExchangeRates | null;
  refreshRates: (force?: boolean) => Promise<void>;
  convertToBase: (amount: number, from?: string) => number;
  convertFromBase: (amount: number, to?: string) => number;
};

const CurrencyContext = createContext<ICalculatorContext | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCountry, setSelectedCountry] = useState<ICountry>(defaultCountry);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);

  const loadRates = useCallback(async (force = false) => {
    try {
      // Allow provider and key via env for production
      const provider = (import.meta.env.VITE_EXCHANGE_PROVIDER as any) || undefined;
      const apiKey = (import.meta.env.VITE_EXCHANGE_API_KEY as any) || undefined;
      const base = (import.meta.env.VITE_EXCHANGE_BASE as any) || "USD";
      const data = await fetchExchangeRates({ provider, apiKey, base });
      // ensure base entry exists
      if (!data.rates[data.base]) data.rates[data.base] = 1;
      setExchangeRates({ ...data, fetchedAt: data.fetchedAt || Date.now() });
      setLastError(null);
    } catch (e: any) {
      setLastError(String(e?.message || e));
      // try to keep existing exchangeRates
    }
  }, []);

  useEffect(() => {
    // load on mount
    loadRates();
    // refresh every hour
    const t = setInterval(() => loadRates(), 1000 * 60 * 60);
    return () => clearInterval(t);
  }, [loadRates]);

  const format = useMemo(() => {
    return (value: number) => formatCurrency(value, selectedCountry.currency.code, selectedCountry.currency.locale);
  }, [selectedCountry]);

  const convertToBaseFn = useCallback((amount: number, from?: string) => {
    if (!exchangeRates) return amount;
    const f = from || selectedCountry.currency.code;
    return convertToBase(amount, f, exchangeRates);
  }, [exchangeRates, selectedCountry]);

  const convertFromBaseFn = useCallback((amount: number, to?: string) => {
    if (!exchangeRates) return amount;
    const t = to || selectedCountry.currency.code;
    return convertFromBase(amount, t, exchangeRates);
  }, [exchangeRates, selectedCountry]);

  const refreshRates = useCallback(async (force = false) => {
    if (force) clearExchangeCache();
    await loadRates(force);
  }, [loadRates]);

  const value = useMemo(
    () => ({ selectedCountry, setSelectedCountry, countries, format, exchangeRates, refreshRates, convertToBase: convertToBaseFn, convertFromBase: convertFromBaseFn }),
    [selectedCountry, format, exchangeRates, refreshRates, convertToBaseFn, convertFromBaseFn]
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
};

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}
