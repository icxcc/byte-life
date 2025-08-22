<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
    <div class="flex items-center">
      <div class="flex-shrink-0">
        <div :class="[
          'w-8 h-8 rounded-md flex items-center justify-center',
          colorClasses[color]
        ]">
          <Icon :name="icon" class="w-5 h-5 text-white" />
        </div>
      </div>
      <div class="ml-5 w-0 flex-1">
        <dl>
          <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
            {{ title }}
          </dt>
          <dd class="text-lg font-medium text-gray-900 dark:text-white">
            {{ value }}
          </dd>
        </dl>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  value: string | number
  icon: string
  color?: 'blue' | 'green' | 'red' | 'purple' | 'yellow' | 'indigo'
}

const props = withDefaults(defineProps<Props>(), {
  color: 'blue'
})

const colorClasses = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  red: 'bg-red-500',
  purple: 'bg-purple-500',
  yellow: 'bg-yellow-500',
  indigo: 'bg-indigo-500'
}
</script>