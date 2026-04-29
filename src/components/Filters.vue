<script setup>
const props = defineProps({
  providers: {
    type: Array,
    default: () => []
  },
  filters: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:filters'])

function onProviderChange(event) {
  emit('update:filters', { provider: event.target.value })
}
</script>

<template>
  <div class="filters">
    <label>
      Filter by provider:
      <select :value="filters.provider" @change="onProviderChange">
        <option v-for="provider in providers" :key="provider" :value="provider">
          {{ provider === 'all' ? 'All providers' : provider }}
        </option>
      </select>
    </label>
  </div>
</template>
