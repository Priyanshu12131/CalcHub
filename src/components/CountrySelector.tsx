import { useCountry } from "@/contexts/CountryContext";
import { COUNTRIES } from "@/lib/countryConfig";
import { Globe } from "lucide-react";

export function CountrySelector() {
  const { selectedCountry, changeCountryByCode } = useCountry();

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <Globe className="h-4 w-4 text-muted-foreground" />
        <label htmlFor="country-select" className="text-sm font-medium text-foreground">
          Country:
        </label>
      </div>
      <select
        id="country-select"
        value={selectedCountry.code}
        onChange={(e) => changeCountryByCode(e.target.value)}
        className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-900 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
      >
        {COUNTRIES.map((country) => (
          <option key={country.code} value={country.code}>
            {country.name} ({country.currencySymbol})
          </option>
        ))}
      </select>
    </div>
  );
}
