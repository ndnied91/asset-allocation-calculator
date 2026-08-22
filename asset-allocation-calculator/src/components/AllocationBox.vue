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
  <div class="h-full flex flex-col">
    <span :id="`${id}-label`" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
    </span>
    <div
      :aria-labelledby="`${id}-label`"
      role="status"
      aria-live="polite"
      class="border border-gray-300 text-sm rounded-md px-3 py-2 bg-gray-50 break-words flex-1"
    >
      {{ value }}
    </div>
  </div>
</template>