export const formatUSD = (value) => {
  if (value === null) return '—';
  return value.toLocaleString(undefined, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// utils.js
export function formatTime(date) {
  if (!date) return null;
  return date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
  });
}

//formats and returns the correct rate of the crypto
export function getPriceFromRate(rates, symbol) {
  if (!rates || !rates[symbol]) return null;
  return 1 / rates[symbol];
}

export const calculateAllocation = (totalAmount, percentage, price) => {
  if (!totalAmount || !price) return null;
  return (totalAmount * percentage) / price;
};

export const formatCrypto = (value) => {
  if (value === null) return '—';
  return value.toLocaleString(undefined, { maximumFractionDigits: 6 });
};
