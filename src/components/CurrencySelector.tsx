import React from "react";
import { useCurrency } from "../hooks/useCurrency";

type Props = {
  id?: string;
  className?: string;
};

export const CurrencySelector: React.FC<Props> = ({ id, className }) => {
  const { countries, selectedCountry, setSelectedCountry } = useCurrency();

  return (
    <select
      id={id}
      value={selectedCountry.countryName}
      onChange={(e) => {
        const name = e.target.value;
        const c = countries.find((x) => x.countryName === name);
        if (c) setSelectedCountry(c);
      }}
      className={"border rounded px-2 py-1 text-xs " + (className || "")}
    >
      {countries.map((c) => (
        <option key={c.countryName} value={c.countryName}>
          {c.countryName} — {c.currency.code} — {c.currency.symbol}
        </option>
      ))}
    </select>
  );
};

export default CurrencySelector;
