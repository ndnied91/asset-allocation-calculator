// utils.js
// Shared helper functions used across multiple components — math and formatting logic.

// Converts a Coinbase rate (crypto-per-1-USD) into a USD price per coin
// e.g. getPriceFromRate({ BTC: "0.0000091" }, 'BTC') → 109,890.11
export function getPriceFromRate(rates, symbol) {
  if (!rates || !rates[symbol]) return null;
  return 1 / rates[symbol];
}

// Splits a USD amount by percentage and converts it to a crypto amount at the given price
// e.g. calculateAllocation(1000, 0.7, 109890) → 0.00637 (BTC)
export const calculateAllocation = (totalAmount, percentage, price) => {
  if (!totalAmount || !price) return null;
  return (totalAmount * percentage) / price;
};

// e.g. formatUSD(1234.5) → "$1,234.50"
export const formatUSD = (value) => {
  if (value === null) return '—';
  return value.toLocaleString(undefined, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// e.g. formatCrypto(0.00637) → "0.00637"
export const formatCrypto = (value) => {
  if (value === null) return '—';
  return value.toLocaleString(undefined, { maximumFractionDigits: 6 });
};

// e.g. formatTime(new Date()) → "2:45:12 PM"
export function formatTime(date) {
  if (!date) return null;
  return date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
  });
}
