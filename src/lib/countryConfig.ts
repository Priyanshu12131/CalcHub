export type CountryConfig = {
	code: string;
	countryName: string;
	currency: {
		code: string;
		symbol: string;
		locale: string;
	};
};

export const COUNTRIES: CountryConfig[] = [
	{ code: "US", countryName: "United States", currency: { code: "USD", symbol: "$", locale: "en-US" } },
	{ code: "IE", countryName: "Ireland", currency: { code: "EUR", symbol: "€", locale: "en-IE" } },
	{ code: "GB", countryName: "United Kingdom", currency: { code: "GBP", symbol: "£", locale: "en-GB" } },
	{ code: "IN", countryName: "India", currency: { code: "INR", symbol: "₹", locale: "en-IN" } },
];

export function detectCountryFromLocale(): CountryConfig {
	if (typeof navigator !== "undefined") {
		const locale = (navigator.language || "en-US").toLowerCase();
		const found = COUNTRIES.find((c) => locale.includes(c.currency.locale.toLowerCase().split("-")[0]) || locale.includes(c.code.toLowerCase()));
		if (found) return found;
	}
	return COUNTRIES[0];
}

export default COUNTRIES[0];

