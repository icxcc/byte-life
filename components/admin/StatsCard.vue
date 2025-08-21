<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
    <div class="flex items-center">
      <div class="flex-shrink-0">
        <Icon :name="icon" :class="iconClass" class="w-8 h-8" />
      </div>
      <div class="ml-5 w-0 flex-1">
        <dl>
          <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
            {{ title }}
          </dt>
          <dd class="flex items-baseline">
            <div class="text-2xl font-semibold text-gray-900 dark:text-white">
              {{ value }}
            </div>
            <div v-if="change" class="ml-2 flex items-baseline text-sm font-semibold">
              <span 
                :class="[
                  changeType === 'increase' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                ]"
              >
                {{ change }}
              </span>
            </div>
          </dd>
        </dl>
      </div>
    </div>
    <div v-if="description" class="mt-3">
      <p class="text-sm text-gray-600 dark:text-gray-400">
        {{ description }}
      </p>
    </div>
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
  iconClass: 'text-gray-500',
  changeType: 'increase'
})
</script>
