import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { CountryConfig, COUNTRIES, detectCountryFromLocale } from "@/lib/countryConfig";

interface CountryContextType {
  selectedCountry: CountryConfig;
  setSelectedCountry: (country: CountryConfig) => void;
  changeCountryByCode: (code: string) => void;
}

const CountryContext = createContext<CountryContextType | undefined>(undefined);

interface CountryProviderProps {
  children: ReactNode;
}

export function CountryProvider({ children }: CountryProviderProps) {
  const [selectedCountry, setSelectedCountryState] = useState<CountryConfig>(() => {
    // Try to load from localStorage first
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("calchub_country_code");
      if (saved) {
        const country = COUNTRIES.find((c) => c.code === saved);
        if (country) return country;
      }
    }
    // Fall back to auto-detect
    return detectCountryFromLocale();
  });

  // Save to localStorage whenever country changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("calchub_country_code", selectedCountry.code);
    }
  }, [selectedCountry]);

  const setSelectedCountry = (country: CountryConfig) => {
    setSelectedCountryState(country);
  };

  const changeCountryByCode = (code: string) => {
    const country = COUNTRIES.find((c) => c.code === code);
    if (country) {
      setSelectedCountryState(country);
    }
  };

  return (
    <CountryContext.Provider value={{ selectedCountry, setSelectedCountry, changeCountryByCode }}>
      {children}
    </CountryContext.Provider>
  );
}

export function useCountry(): CountryContextType {
  const context = useContext(CountryContext);
  if (!context) {
    throw new Error("useCountry must be used within a CountryProvider");
  }
  return context;
}
