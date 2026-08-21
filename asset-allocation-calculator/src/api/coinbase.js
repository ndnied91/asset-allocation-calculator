const COINBASE_URL = 'https://api.coinbase.com/v2/exchange-rates?currency=USD';

export async function fetchExchangeRates() {
  const res = await fetch(COINBASE_URL);
  const data = await res.json();
  return data.data.rates; //unwrapping data as it returns an data object
}
