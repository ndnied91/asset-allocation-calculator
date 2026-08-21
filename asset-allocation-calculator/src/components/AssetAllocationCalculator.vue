<script setup>
import { ref, onMounted, computed } from 'vue'
import AllocationBox from './AllocationBox.vue'
import { fetchExchangeRates } from '../api/coinbase.js'

const amount = ref('')
const rates = ref(null)

onMounted(async () => {
  const data = await fetchExchangeRates()
  rates.value = data
})

const btcPrice = computed(() => {
  if (!rates.value) return null
  return 1 / rates.value.BTC
})

const ethPrice = computed(() => {
  if (!rates.value) return null
  return 1 / rates.value.ETH
})
</script>

<template>
  <main class="p-8 max-w-md mx-auto">
    <h1 class="text-2xl font-bold mb-6">Asset Allocation Calculator</h1>

    <div v-if="rates" class="mb-6 text-sm text-gray-600 space-y-1">
      <p>BTC: ${{ btcPrice.toLocaleString(undefined, { maximumFractionDigits: 2 }) }}</p>
      <p>ETH: ${{ ethPrice.toLocaleString(undefined, { maximumFractionDigits: 2 }) }}</p>
    </div>
    <div v-else class="mb-6 text-sm text-gray-400">
      Loading live rates...
    </div>

    <label for="amount" class="block text-sm font-medium text-gray-700 mb-1">
      Investable assets
    </label>
    <input
      id="amount"
      type="number"
      inputmode="decimal"
      min="0"
      v-model="amount"
      aria-describedby="amount-hint"
      class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <span id="amount-hint" class="sr-only">Enter the total USD amount you want to invest</span>

    <div class="mt-6 grid grid-cols-2 gap-4">
      <AllocationBox id="btc" label="70% BTC allocation" />
      <AllocationBox id="eth" label="30% ETH allocation" />
    </div>
  </main>
</template>