<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <div :class="['p-3 rounded-lg', iconClass]">
          <Icon :name="icon" class="w-6 h-6" />
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ title }}</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ value }}</p>
        </div>
      </div>
      <div v-if="change" class="text-right">
        <div :class="[
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
          changeType === 'increase' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
        ]">
          <Icon 
            :name="changeType === 'increase' ? 'heroicons:arrow-trending-up' : 'heroicons:arrow-trending-down'" 
            class="w-3 h-3 mr-1" 
          />
          {{ change }}
        </div>
      </div>
    </div>
    <p v-if="description" class="mt-2 text-sm text-gray-500 dark:text-gray-400">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  value: number | string
  icon: string
  iconClass?: string
  change?: string
  changeType?: 'increase' | 'decrease'
  description?: string
}

withDefaults(defineProps<Props>(), {
  iconClass: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
  changeType: 'increase'
})
</script>