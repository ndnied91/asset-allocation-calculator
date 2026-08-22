<script setup>
import { computed } from 'vue'
import { formatUSD , formatTime } from '../utils/utils'
const formattedLastUpdated = computed(() => formatTime(props.lastUpdated))


const props = defineProps({
  rates: { type: Object, default: null },
  loading: { type: Boolean, default: false },
  error: { type: Boolean, default: false },
  lastUpdated: { type: [Date, null], default: null },
})

const emit = defineEmits(['refresh'])

</script>

<template>
  <div class="mb-6 flex items-center justify-between">
    <div v-if="loading && !rates" role="status" class="text-sm text-gray-400">
      Loading live rates...
    </div>
    <div v-else-if="error" role="alert" class="text-sm text-red-600">
      Couldn't load live rates. Please try again.
    </div>
    <div v-else class="text-sm text-gray-600 space-y-1">
      <p>BTC: {{ formatUSD(rates ? 1 / rates.BTC : null) }}</p>
      <p>ETH: {{ formatUSD(rates ? 1 / rates.ETH : null) }}</p>
      <p v-if="formattedLastUpdated" class="text-xs text-gray-400">
        Last updated: {{ formattedLastUpdated }}
      </p>
    </div>

    <button
      @click="emit('refresh')"
      :aria-busy="loading"
      class="text-sm cursor-pointer border p-2 rounded-xl text-blue-600 hover:text-blue-800"
    >
      Refresh
    </button>
  </div>
</template>