<script setup>
import { computed } from 'vue'
import { getPriceFromRate, formatUSD, formatTime } from '../utils/utils.js'

// Used to display what it's given, fetching happens in the parent so the
// same rates can be used for the allocation math too. Emits 'refresh' when clicked.

const props = defineProps({
  rates: { type: Object, default: null },
  loading: { type: Boolean, default: false },
  error: { type: Boolean, default: false },
  lastUpdated: { type: [Date, null], default: null },
  // which coins to show, passed down from the parent's crypto list
  symbols: { type: Array, default: () => ['BTC', 'ETH'] },
})

const emit = defineEmits(['refresh'])

const formattedLastUpdated = computed(() => formatTime(props.lastUpdated))
</script>

<template>
  <div class="mb-6 flex items-center justify-between">
    <!-- only show this before the first successful load, keep old prices on refresh -->
    <div v-if="loading && !rates" role="status" class="text-sm text-gray-400">
      Loading live rates...
    </div>
    <div v-else-if="error" role="alert" class="text-sm text-red-600">
      Couldn't load live rates. Please try again.
    </div>
    <div v-else class="text-sm text-gray-600 space-y-1">
      <p v-for="symbol in symbols" :key="symbol">
        {{ symbol }}: {{ formatUSD(rates ? getPriceFromRate(rates, symbol) : null) }}
      </p>
      <p v-if="formattedLastUpdated" class="text-xs text-gray-400">
        Last updated: {{ formattedLastUpdated }}
      </p>
    </div>

    <!-- using aria-disabled instead of disabled so the button stays tabbable -->
    <button
      @click="emit('refresh')"
      :aria-disabled="loading"
      :aria-busy="loading"
      class="text-sm cursor-pointer border p-2 rounded-xl text-blue-600 hover:text-blue-800"
      :class="loading ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''"
    >
      {{ loading ? 'Updating...' : 'Refresh' }}
    </button>
  </div>
</template>