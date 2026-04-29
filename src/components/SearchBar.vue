<script setup>
import { onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const localValue = ref(props.modelValue)
let timerId = null

watch(
  () => props.modelValue,
  (next) => {
    localValue.value = next
  }
)

watch(localValue, (value) => {
  if (timerId) {
    clearTimeout(timerId)
  }

  timerId = setTimeout(() => {
    emit('update:modelValue', value)
  }, 300)
})

onBeforeUnmount(() => {
  if (timerId) {
    clearTimeout(timerId)
  }
})
</script>

<template>
  <div class="search-bar">
    <input
      v-model="localValue"
      type="text"
      placeholder="Search by game name..."
      aria-label="Search games by name"
    />
  </div>
</template>
