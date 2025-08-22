<template>
  <aside class="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex-shrink-0 flex flex-col">
    <!-- 头部 -->
    <div class="px-6 py-3 border-b border-gray-200 dark:border-gray-800 flex items-center h-16">
      <UIcon name="i-heroicons-squares-2x2" class="w-6 h-6 mr-3 text-gray-700 dark:text-gray-300" />
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
        管理后台
      </h2>
    </div>

    <!-- 导航菜单 -->
    <nav class="flex-1 overflow-y-auto p-4">
      <UNavigationMenu  orientation="vertical" :items="navigationLinks" class="data-[orientation=vertical]:w-full"/>
    </nav>
  </aside>
</template>

<script setup lang="ts">
// 定义事件
const emit = defineEmits<{
  logout: []
}>()

// 获取路由信息
const route = useRoute()

// 导航链接配置
const navigationLinks = [
  {
    label: '仪表板',
    icon: 'i-heroicons-home',
    to: '/admin'
  },
  {
    label: '内容管理',
    icon: 'i-heroicons-document-duplicate',
    children: [
      {
        label: '栏目管理',
        icon: 'i-heroicons-tag',
        to: '/admin/content/channels'
      },
      {
        label: '文章管理',
        icon: 'i-heroicons-document-text',
        to: '/admin/content/articles'
      }
    ]
  },
  {
    label: '系统管理',
    icon: 'i-heroicons-cog-6-tooth',
    children: [
      {
        label: '消息管理',
        icon: 'i-heroicons-envelope',
        to: '/admin/system/messages'
      },
      {
        label: '系统设置',
        icon: 'i-heroicons-adjustments-horizontal',
        to: '/admin/settings'
      }
    ]
  }
]
</script>

<style scoped>
/* 自定义滚动条样式 */
nav::-webkit-scrollbar {
  width: 6px;
}

nav::-webkit-scrollbar-track {
  background: transparent;
}

nav::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.3);
  border-radius: 3px;
}

nav::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.5);
}
</style>