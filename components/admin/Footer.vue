<template>
  <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
    <div class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
      <div class="flex items-center space-x-4">
        <span>&copy; {{ currentYear }} ByteLife 管理系统</span>
        <span>版本 1.0.0</span>
      </div>
      
      <div class="flex items-center space-x-4">
        <span>在线用户: {{ onlineUsers }}</span>
        <div class="flex items-center space-x-1">
          <div class="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>系统正常</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()
const onlineUsers = ref(1) // 这里可以从API获取实际的在线用户数

// 可以添加实时更新在线用户数的逻辑
onMounted(() => {
  // 示例：每30秒更新一次在线用户数
  // const interval = setInterval(async () => {
  //   try {
  //     const data = await $fetch('/api/admin/system/stats')
  //     onlineUsers.value = data.onlineUsers
  //   } catch (error) {
  //     console.error('获取在线用户数失败:', error)
  //   }
  // }, 30000)
  
  // onUnmounted(() => {
  //   clearInterval(interval)
  // })
})
</script>
