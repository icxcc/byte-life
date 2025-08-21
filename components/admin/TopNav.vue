<template>
  <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
    <div class="px-6 py-4">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
        {{ getPageTitle() }}
      </h2>
    </div>
  </header>
</template>

<script setup lang="ts">
// 定义事件
defineEmits<{
  logout: []
}>()

// 获取当前页面标题
const getPageTitle = () => {
  const route = useRoute()
  const titleMap: Record<string, string> = {
    '/admin': '仪表板',
    '/admin/dashboard': '仪表板',
    '/admin/content/articles': '文章管理',
    '/admin/content/projects': '项目管理',
    '/admin/system/messages': '消息管理',
    '/admin/settings': '系统设置'
  }
  return titleMap[route.path] || '管理后台'
}
</script>
