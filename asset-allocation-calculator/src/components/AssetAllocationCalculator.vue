<script setup>
import { ref, onMounted, computed } from 'vue'
import AllocationBox from './AllocationBox.vue'
import RatesDisplay from './RatesDisplay.vue'
import { fetchExchangeRates } from '../api/coinbase.js'
import { getPriceFromRate, calculateAllocation, formatCrypto } from '../utils/utils.js'

// The split — add/remove/change entries here and the rest of the app updates on its own.
// Must add up to 1 (100%), see configError below.
const cryptoAllocations = [
  { symbol: 'BTC', allocation: 0.7 },
  { symbol: 'ETH', allocation: 0.3 },
]

// Catches a bad config (e.g. a typo above) instead of silently showing wrong numbers
const allocationTotal = cryptoAllocations.reduce((sum, { allocation }) => sum + allocation, 0)
const configError = Math.abs(allocationTotal - 1) > 0.001
  ? `Crypto allocations must sum to 100%. Currently configured: ${(allocationTotal * 100).toFixed(1)}%`
  : null

const amount = ref('')
const rates = ref(null)
const loading = ref(false)
const error = ref(false)
const lastUpdated = ref(null)

const loadRates = async () => {
  if (loading.value) return
  loading.value = true
  error.value = false
  try {
    const data = await fetchExchangeRates()
    rates.value = data
    lastUpdated.value = new Date()
  } catch (e) {
    console.log(e)
    error.value = true
  }
  loading.value = false
}

onMounted(() => loadRates())

const validationError = computed(() => {
  if (amount.value === '') return null
  const num = Number(amount.value)
  if (isNaN(num)) return 'Please enter a valid number'
  if (num <= 0) return 'Amount must be greater than 0'
  return null
})

// Validated numeric amount, or null if empty/invalid
const parsedAmount = computed(() => {
  if (validationError.value) return null
  return amount.value === '' ? null : Number(amount.value)
})

// Price per coin for each symbol in cryptoAllocations
const prices = computed(() => {
  if (!rates.value) return {}
  return cryptoAllocations.reduce((acc, { symbol }) => {
    acc[symbol] = getPriceFromRate(rates.value, symbol)
    return acc
  }, {})
})

// How much of each crypto the amount buys, based on the split above
const allocations = computed(() => {
  return cryptoAllocations.map(({ symbol, allocation }) => ({
    symbol,
    allocation,
    value: calculateAllocation(parsedAmount.value, allocation, prices.value[symbol]),
  }))
})

// Comma-formatted for the input (e.g. "100,000"); amount stays plain (e.g. "100000")
const displayAmount = computed(() => {
  if (amount.value === '') return ''
  const num = Number(amount.value)
  if (isNaN(num)) return amount.value
  const [whole, decimal] = amount.value.split('.')
  const formattedWhole = Number(whole).toLocaleString()
  return decimal !== undefined ? `${formattedWhole}.${decimal}` : formattedWhole
})

const handleAmountInput = (e) => {
  const raw = e.target.value.replace(/,/g, '')
  amount.value = raw
}
</script>

<template>
  <main class="p-8 max-w-md mx-auto">
    <h1 class="text-2xl font-bold mb-6">Asset Allocation Calculator</h1>

    <!-- stop here if the config is broken rather than show wrong numbers -->
    <div v-if="configError" role="alert" class="p-4 mb-6 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
      {{ configError }}
    </div>

    <template v-else>
      <RatesDisplay
        :rates="rates"
        :loading="loading"
        :error="error"
        :last-updated="lastUpdated"
        :symbols="cryptoAllocations.map(c => c.symbol)"
        @refresh="loadRates"
      />

      <label for="amount" class="block text-sm font-medium text-gray-700 mb-1">
        Investable assets
      </label>
      <input
        id="amount"
        type="text"
        inputmode="decimal"
        placeholder="Enter amount in $"
        :value="displayAmount"
        @input="handleAmountInput"
        :aria-invalid="!!validationError"
        :aria-describedby="validationError ? 'amount-error' : 'amount-hint'"
        class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2"
        :class="validationError ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500'"
      />
      <span id="amount-hint" class="sr-only">Enter the total USD amount you want to invest</span>
      <p v-if="validationError" id="amount-error" role="alert" class="mt-1 text-sm text-red-600">
        {{ validationError }}
      </p>

      <!-- 2 cols on mobile, 3 on desktop so boxes don't get too narrow -->
      <div class="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
        <AllocationBox
          v-for="item in allocations"
          :key="item.symbol"
          :id="item.symbol.toLowerCase()"
          :label="`${item.allocation * 100}% ${item.symbol} allocation`"
          :value="formatCrypto(item.value)"
        />
      </div>
    </template>
  </main>
</template>