<template>
  <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
    <div class="flex items-center">
      <div class="flex-shrink-0">
        <Icon :name="icon" :class="iconClass" class="w-8 h-8" />
      </div>
      <div class="ml-4 flex-1">
        <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ title }}</p>
        <div class="flex items-baseline">
          <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ value }}</p>
          <p v-if="change" :class="changeClass" class="ml-2 text-sm font-medium">
            {{ change }}
          </p>
        </div>
        <p v-if="description" class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {{ description }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  value: string | number
  icon: string
  iconClass?: string
  change?: string
  changeType?: 'increase' | 'decrease' | 'neutral'
  description?: string
}

const props = withDefaults(defineProps<Props>(), {
  iconClass: 'text-blue-500',
  changeType: 'neutral'
})

const changeClass = computed(() => {
  if (!props.change) return ''
  
  switch (props.changeType) {
    case 'increase':
      return 'text-green-600 dark:text-green-400'
    case 'decrease':
      return 'text-red-600 dark:text-red-400'
    default:
      return 'text-gray-600 dark:text-gray-400'
  }
})
</script>
</template>