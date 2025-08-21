<template>
  <aside class="w-64 bg-white dark:bg-gray-800 shadow-lg flex-shrink-0 flex flex-col">
    <div class="p-6 flex-shrink-0">
      <h1 class="text-xl font-bold text-gray-900 dark:text-white">管理后台</h1>
    </div>
    <nav class="flex-1 overflow-y-auto custom-scrollbar">
      <div class="px-6 py-3">
        <NuxtLink
          v-for="item in menuItems"
          :key="item.key"
          :to="item.to"
          :class="[
            'menu-item w-full text-left px-4 py-2 rounded-lg mb-2 block no-underline',
            $route.path === item.to
              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          ]"
        >
          <Icon :name="item.icon" class="inline-block w-5 h-5 mr-3" />
          {{ item.label }}
        </NuxtLink>
      </div>
      <div class="px-6 py-3 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
        <button
          @click="$emit('logout')"
          class="menu-item w-full text-left px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
        >
          <Icon name="heroicons:arrow-right-on-rectangle" class="inline-block w-5 h-5 mr-3" />
          退出登录
        </button>
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
// 定义事件
defineEmits<{
  logout: []
}>()

// 菜单项
const menuItems = [
  { key: 'dashboard', label: '仪表板', icon: 'heroicons:home', to: '/admin' },
  { key: 'messages', label: '消息管理', icon: 'heroicons:envelope', to: '/admin/system/messages' },
  { key: 'projects', label: '项目管理', icon: 'heroicons:folder', to: '/admin/content/projects' },
  { key: 'blog', label: '博客管理', icon: 'heroicons:document-text', to: '/admin/content/articles' },
  { key: 'settings', label: '系统设置', icon: 'heroicons:cog-6-tooth', to: '/admin/settings' }
]
</script>

<style scoped>
/* 侧边栏菜单项简洁过渡 */
.menu-item {
  transition: background-color 0.15s ease-in-out;
}

/* 滚动条样式优化 */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.3);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.5);
}
</style>
