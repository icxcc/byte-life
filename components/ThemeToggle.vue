<template>
  <button
    @click="toggleTheme"
    class="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
    :aria-label="isDark ? '切换到浅色模式' : '切换到深色模式'"
  >
    <Icon 
      :name="isDark ? 'heroicons:sun' : 'heroicons:moon'" 
      class="w-5 h-5 text-gray-600 dark:text-gray-400"
    />
  </button>
</template>

<script setup>
// 使用优化的主题组合式函数
const { isDark, toggleTheme } = useTheme()
</script>