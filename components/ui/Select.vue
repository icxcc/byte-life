<template>
  <div class="space-y-1">
    <label v-if="label" :for="selectId" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <select
      :id="selectId"
      v-model="selectValue"
      :disabled="disabled"
      :required="required"
      :class="selectClasses"
      @change="handleChange"
    >
      <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
      <option
        v-for="option in options"
        :key="getOptionValue(option)"
        :value="getOptionValue(option)"
      >
        {{ getOptionLabel(option) }}
      </option>
    </select>
    
    <p v-if="error" class="text-sm text-red-600 dark:text-red-400">
      {{ error }}
    </p>
    
    <p v-else-if="hint" class="text-sm text-gray-500 dark:text-gray-400">
      {{ hint }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Option {
  label: string
  value: string | number
}

interface Props {
  modelValue?: string | number
  options: Option[] | string[]
  label?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  error?: string
  hint?: string
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md'
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  change: [value: string | number]
}>()

const selectId = computed(() => `select-${Math.random().toString(36).substr(2, 9)}`)

const selectValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const selectClasses = computed(() => {
  const baseClasses = 'block w-full border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  }
  
  const errorClasses = props.error 
    ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500'
    : ''
  
  return [baseClasses, sizeClasses[props.size], errorClasses].join(' ')
})

const getOptionValue = (option: Option | string): string | number => {
  return typeof option === 'string' ? option : option.value
}

const getOptionLabel = (option: Option | string): string => {
  return typeof option === 'string' ? option : option.label
}

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const value = target.value
  emit('change', value)
}
</script>