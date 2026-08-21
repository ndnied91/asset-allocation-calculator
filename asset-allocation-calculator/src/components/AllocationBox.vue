<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
  value: {
    type: [String, Number],
    default: '—',
  },
  id: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div>
    <span :id="`${id}-label`" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
    </span>
    <div
      :aria-labelledby="`${id}-label`"
      role="status"
      aria-live="polite"
      class="border border-gray-300 rounded-md px-3 py-2 bg-gray-50"
    >
      {{ value }}
    </div>
  </div>
</template>