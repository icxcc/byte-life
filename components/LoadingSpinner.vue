<template>
  <div class="flex items-center justify-center">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    <span v-if="text" class="ml-2 text-gray-600 dark:text-gray-400">{{ text }}</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  text?: string
}

defineProps<Props>()
</script>