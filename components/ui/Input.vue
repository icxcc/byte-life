<template>
  <div class="space-y-1">
    <label v-if="label" :for="inputId" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <div class="relative">
      <div v-if="prefixIcon" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon :name="prefixIcon" class="h-5 w-5 text-gray-400" />
      </div>
      
      <input
        :id="inputId"
        v-model="inputValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :class="inputClasses"
        @blur="$emit('blur', $event)"
        @focus="$emit('focus', $event)"
        @input="handleInput"
      />
      
      <div v-if="suffixIcon" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <Icon :name="suffixIcon" class="h-5 w-5 text-gray-400" />
      </div>
    </div>
    
    <p v-if="error" class="text-sm text-red-600 dark:text-red-400">
      {{ error }}
    </p>
    
    <p v-else-if="hint" class="text-sm text-gray-500 dark:text-gray-400">
      {{ hint }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: string | number
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  label?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  error?: string
  hint?: string
  prefixIcon?: string
  suffixIcon?: string
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  size: 'md'
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const inputId = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`)

const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const inputClasses = computed(() => {
  const baseClasses = 'block w-full border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  }
  
  const paddingClasses = []
  if (props.prefixIcon) {
    paddingClasses.push('pl-10')
  }
  if (props.suffixIcon) {
    paddingClasses.push('pr-10')
  }
  
  const errorClasses = props.error 
    ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500'
    : ''
  
  return [baseClasses, sizeClasses[props.size], ...paddingClasses, errorClasses].join(' ')
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = props.type === 'number' ? Number(target.value) : target.value
  emit('update:modelValue', value)
}
</script>