import { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const { base = "USD" } = req.query;

  // Add CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Try jsDelivr first (most reliable)
    const baseUrl = String(base).toLowerCase();
    const jsdelivrUrl = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${baseUrl}.json`;

    console.log(`[API] Fetching rates for ${base} from jsDelivr`);
    let response = await fetch(jsdelivrUrl, { timeout: 5000 });

    if (!response.ok) {
      console.log(`[API] jsDelivr failed with status ${response.status}, trying exchangerate.host`);
      // Fallback to exchangerate.host
      const hostUrl = `https://api.exchangerate.host/latest?base=${encodeURIComponent(base)}`;
      response = await fetch(hostUrl, { timeout: 5000 });
    }

    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch exchange rates" });
    }

    const data = await response.json();

    // Handle jsDelivr format
    if (jsdelivrUrl.includes("jsDelivr") || data[baseUrl]) {
      const rates = data[baseUrl.toLowerCase()] || {};
      const upperRates: Record<string, number> = {};
      Object.entries(rates).forEach(([key, val]) => {
        upperRates[key.toUpperCase()] = val as number;
      });
      return res.status(200).json({
        base: String(base).toUpperCase(),
        rates: upperRates,
        timestamp: Date.now(),
      });
    }

    // Handle exchangerate.host format
    if (data.rates) {
      return res.status(200).json({
        base: data.base || String(base).toUpperCase(),
        rates: data.rates,
        timestamp: Date.now(),
      });
    }

    return res.status(400).json({ error: "Invalid response format" });
  } catch (error) {
    console.error("[API] Error fetching exchange rates:", error);
    return res.status(500).json({
      error: "Failed to fetch exchange rates",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
