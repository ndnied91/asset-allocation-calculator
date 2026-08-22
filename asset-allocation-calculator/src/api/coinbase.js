// Coinbase's exchange-rates endpoint, returns crypto-per-USD rates for all supported currencies
const COINBASE_URL = 'https://api.coinbase.com/v2/exchange-rates?currency=USD';

/**
 * Fetches live crypto exchange rates from Coinbase.
 * Returns an object keyed by currency symbol (e.g. { BTC: "0.0000091", ETH: "..." }),
 * where each value is how much of that currency 1 USD buys.
 */
export async function fetchExchangeRates() {
  const res = await fetch(COINBASE_URL);
  const data = await res.json();

  // Coinbase wraps the actual rates in a nested `data.rates` object —  unwrap it here so callers don't need to know about Coinbase's response shape
  return data.data.rates;
}
