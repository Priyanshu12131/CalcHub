# Country & Currency System Documentation

## Overview

CalcHub now supports a global country and currency selection system. Users can select their country, and all calculators will automatically use the correct currency symbol, locale, and formatting.

## Features

- **10 Countries Supported**: India, United States, United Kingdom, Canada, Australia, Germany, France, Japan, Singapore, New Zealand
- **Auto-Detection**: Detects user's country from browser locale on first visit
- **Persistent Selection**: Saves user's choice in localStorage
- **Centralized Configuration**: Single source of truth for currencies and locales
- **Easy to Extend**: Add new countries without modifying calculator logic
- **Mobile-Friendly UI**: Responsive country selector

## How It Works

### 1. Country Configuration (`src/lib/countryConfig.ts`)

All country data is stored in a centralized config file:

```typescript
import { formatCurrency, getCountryByCode } from "@/lib/countryConfig";

// Format numbers as currency
const formatted = formatCurrency(1000, "IN"); // ₹1000.00
const formatted2 = formatCurrency(1000, "US"); // $1000.00

// Get country details
const country = getCountryByCode("GB"); // { code: "GB", name: "United Kingdom", ... }
```

### 2. Global State Management (`src/contexts/CountryContext.tsx`)

The `CountryProvider` wraps the entire app and provides country state via React Context:

```typescript
import { useCountry } from "@/contexts/CountryContext";

function MyComponent() {
  const { selectedCountry, setSelectedCountry, changeCountryByCode } = useCountry();
  
  console.log(selectedCountry.currencySymbol); // ₹ (based on selection)
  changeCountryByCode("US"); // Switch to US
}
```

### 3. Country Selector Component (`src/components/CountrySelector.tsx`)

A ready-to-use dropdown for selecting countries. Currently added to the CalculatorPage header.

## Using in Calculators

### Getting Currency Symbol in a Calculator

```typescript
import { useCountry } from "@/contexts/CountryContext";

function MyCalculator() {
  const { selectedCountry } = useCountry();
  
  return (
    <div>
      <p>Price: {selectedCountry.currencySymbol}1,000</p>
      <p>Currency Code: {selectedCountry.currencyCode}</p>
    </div>
  );
}
```

### Formatting Currency in Results

```typescript
import { formatCurrency } from "@/lib/countryConfig";
import { useCountry } from "@/contexts/CountryContext";

function Results() {
  const { selectedCountry } = useCountry();
  const amount = 5000;
  
  return (
    <p>Total: {formatCurrency(amount, selectedCountry.code)}</p>
  );
}
```

### Locale-Aware Formatting

```typescript
function MyComponent() {
  const { selectedCountry } = useCountry();
  
  const formatted = new Intl.NumberFormat(selectedCountry.locale, {
    style: 'currency',
    currency: selectedCountry.currencyCode,
  }).format(5000);
  
  return <p>{formatted}</p>;
}
```

## Adding a New Country

Edit `src/lib/countryConfig.ts` and add a new entry to the `COUNTRIES` array:

```typescript
{
  code: "NL",
  name: "Netherlands",
  currency: "Euro",
  currencySymbol: "€",
  currencyCode: "EUR",
  locale: "nl-NL",
}
```

That's it! The new country will automatically appear in the selector and be accessible throughout the app.

## Storage

- User's selected country is saved to browser localStorage under key: `calchub_country_code`
- On next visit, the saved country is loaded automatically
- If no saved preference, browser locale is auto-detected

## Where the Selector Appears

- **CalculatorPage**: Top-right of the calculator header (next to breadcrumbs)

## Future Enhancements

- Add more countries as needed
- Implement cross-rate currency conversions
- Add localized number formatting (thousands separator, decimal point)
- Store conversion rates for real-time currency conversion
- Add country-specific tax/GST rates

## Files Involved

- `src/lib/countryConfig.ts` — Configuration and utilities
- `src/contexts/CountryContext.tsx` — Global state management
- `src/components/CountrySelector.tsx` — UI component
- `src/App.tsx` — Provider wrapper
- `src/pages/CalculatorPage.tsx` — Integration example
