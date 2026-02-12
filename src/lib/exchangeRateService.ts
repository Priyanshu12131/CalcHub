export type ExchangeRates = {
  base: string;
  rates: Record<string, number>;
  fetchedAt: number; // epoch ms
};

const CACHE_KEY = "exchange_rates_cache_v1";
const DEFAULT_TTL = 1000 * 60 * 60; // 1 hour

type FetchOptions = {
  provider?: "fixer" | "openexchangerates" | "exchangerate_host";
  apiKey?: string;
  base?: string;
  ttl?: number;
};

async function fetchFromVercelAPI(base = "USD") {
  // Use Vercel serverless function to avoid CORS issues
  // On client side, call relative /api/ endpoint
  // On server side (should not reach here), use full URL
  try {
    if (typeof window !== "undefined") {
      // Client-side: use relative URL which will be proxied to /api/
      const url = `/api/exchangeRates?base=${encodeURIComponent(base)}`;
      console.log(`[fetchFromVercelAPI] Fetching from ${url}`);
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Vercel API error ${res.status}`);
      const json = await res.json();
      console.log("[fetchFromVercelAPI] Response:", json);
      
      if (!json.rates || Object.keys(json.rates).length === 0) {
        throw new Error("fetchFromVercelAPI: no rates in response");
      }
      
      return { base: json.base || base, rates: json.rates } as ExchangeRates;
    } else {
      // Server-side: should not reach here in this app
      throw new Error("fetchFromVercelAPI should only run on client");
    }
  } catch (err) {
    console.error("[fetchFromVercelAPI] Failed:", err);
    throw err;
  }
}

async function fetchFromExchangerateHost(base = "USD") {
  const url = `https://api.exchangerate.host/latest?base=${encodeURIComponent(base)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`exchange host error ${res.status}`);
  const json = await res.json();
  console.log('[exchangerate.host] Response:', json);
  if (!json) throw new Error("invalid exchange data: empty response");
  // Check for success flag if present
  if (json.success === false) throw new Error(`invalid exchange data: ${json.error?.info || 'API error'}`);
  if (!json.rates) throw new Error(`invalid exchange data: no rates in response. Keys: ${Object.keys(json).join(', ')}`);
  return { base: json.base || base, rates: json.rates } as ExchangeRates;
}

async function fetchFromJsdelivr(base = "USD") {
  // Free exchange rates from jsDelivr CDN (no API key required)
  const baseUrl = encodeURIComponent(base.toLowerCase());
  const url = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${baseUrl}.json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`jsDelivr error ${res.status}`);
  const json = await res.json();
  console.log('[jsDelivr] Response available currencies:', Object.keys(json).length);
  
  const rates = json[baseUrl.toLowerCase()] || {};
  if (!rates || Object.keys(rates).length === 0) {
    throw new Error(`jsDelivr: no rates for base ${base}`);
  }
  
  console.log(`[jsDelivr] Fetched ${Object.keys(rates).length} rates for ${base}. Has INR:`, 'inr' in rates);
  
  // Convert keys to uppercase to match expected format
  const upperRates: Record<string, number> = {};
  Object.entries(rates).forEach(([key, val]) => {
    upperRates[key.toUpperCase()] = val as number;
  });
  
  return { base: base.toUpperCase(), rates: upperRates } as ExchangeRates;
}

async function fetchFromFixer(apiKey: string, base = "USD") {
  // Fixer requires paid plan for changing base; use latest with base if supported
  const url = `https://data.fixer.io/api/latest?access_key=${encodeURIComponent(apiKey)}&base=${encodeURIComponent(base)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`fixer error ${res.status}`);
  const json = await res.json();
  console.log('[fixer.io] Response:', json);
  if (!json) throw new Error("invalid fixer data: empty response");
  if (json.success === false) throw new Error(`invalid fixer data: ${json.error?.info || 'API error'}`);
  if (!json.rates) throw new Error(`invalid fixer data: no rates in response. Keys: ${Object.keys(json).join(', ')}`);
  return { base: json.base || base, rates: json.rates } as ExchangeRates;
}

async function fetchFromOpenExchangeRates(apiKey: string, base = "USD") {
  const url = `https://openexchangerates.org/api/latest.json?app_id=${encodeURIComponent(apiKey)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`openexchangerates error ${res.status}`);
  const json = await res.json();
  console.log('[openexchangerates] Response:', json);
  if (!json) throw new Error("invalid openexchangerates data: empty response");
  if (json.error) throw new Error(`invalid openexchangerates data: ${json.error}`);
  if (!json.rates) throw new Error(`invalid openexchangerates data: no rates in response. Keys: ${Object.keys(json).join(', ')}`);
  // openexchangerates base is USD
  return { base: json.base || base, rates: json.rates } as ExchangeRates;
}

function readCache(): ExchangeRates | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ExchangeRates;
    return parsed;
  } catch (e) {
    return null;
  }
}

function writeCache(data: ExchangeRates) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch (e) {
    // ignore
  }
}

export async function fetchExchangeRates(opts: FetchOptions = {}): Promise<ExchangeRates> {
  const { provider = "vercel", apiKey, base = "USD", ttl = DEFAULT_TTL } = opts;

  // return cache when valid
  const cached = readCache();
  if (cached && Date.now() - cached.fetchedAt < ttl && cached.rates && Object.keys(cached.rates).length > 0) {
    return cached;
  }

  // attempt provider order with fallbacks
  const providers = [];
  
  if (provider === "vercel" || provider === undefined) {
    providers.push(() => fetchFromVercelAPI(base));
  }
  if (provider === "fixer" || !provider) {
    if (apiKey) providers.push(() => fetchFromFixer(apiKey, base));
  }
  if (provider === "openexchangerates" || !provider) {
    if (apiKey) providers.push(() => fetchFromOpenExchangeRates(apiKey, base));
  }
  if (provider === "exchangerate_host" || !provider) {
    providers.push(() => fetchFromExchangerateHost(base));
  }
  if (provider === "jsdelivr" || !provider) {
    providers.push(() => fetchFromJsdelivr(base));
  }

  for (const fetchFn of providers) {
    try {
      const data = await fetchFn();
      const out: ExchangeRates = { base: data.base || base, rates: data.rates || {}, fetchedAt: Date.now() };
      // Ensure base currency is always in rates (required for proper conversion)
      if (!out.rates[out.base]) {
        out.rates[out.base] = 1;
      }
      // Debug log
      console.log(`[ExchangeRates] Fetched rates for base ${out.base}:`, Object.keys(out.rates).length, 'currencies');
      console.log(`[ExchangeRates] Has INR:`, 'INR' in out.rates, out.rates['INR']);
      writeCache(out);
      return out;
    } catch (err) {
      console.error('[ExchangeRates] Provider failed:', err);
      continue; // Try next provider
    }
  }

  // All providers failed, try cache
  console.error('[ExchangeRates] All providers failed');
  try {
    const cached = readCache();
    if (cached) {
      console.log('[ExchangeRates] Using stale cache');
      return cached;
    }
  } catch (e2) {
    // ignore
  }

  // as last resort return identity rates for base
  console.log('[ExchangeRates] Using fallback identity rates');
  return { base: base.toUpperCase(), rates: { [base.toUpperCase()]: 1 }, fetchedAt: Date.now() };
}

export function clearExchangeCache() {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch (e) {
    // ignore
  }
}
