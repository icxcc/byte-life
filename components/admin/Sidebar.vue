<template>
  <aside class="w-64 bg-white dark:bg-gray-800 shadow-lg flex-shrink-0 flex flex-col">
    <div class="p-6 flex-shrink-0">
      <h1 class="text-xl font-bold text-gray-900 dark:text-white">管理后台</h1>
    </div>
    <nav class="flex-1 overflow-y-auto custom-scrollbar">
      <div class="px-6 py-3">
        <!-- 仪表板 -->
        <NuxtLink
          to="/admin"
          :class="[
            'menu-item w-full text-left px-4 py-2 rounded-lg mb-2 block no-underline',
            route.path === '/admin'
              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          ]"
        >
          <Icon name="heroicons:home" class="inline-block w-5 h-5 mr-3" />
          仪表板
        </NuxtLink>

        <!-- 内容管理 -->
        <div class="mb-2">
          <button
            @click="toggleSubmenu('content')"
            :class="[
              'menu-item w-full text-left px-4 py-2 rounded-lg flex items-center justify-between',
              isContentActive
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            ]"
          >
            <div class="flex items-center">
              <Icon name="heroicons:document-duplicate" class="inline-block w-5 h-5 mr-3" />
              内容管理
            </div>
            <Icon 
              :name="expandedMenus.content ? 'heroicons:chevron-down' : 'heroicons:chevron-right'" 
              class="w-4 h-4" 
            />
          </button>
          <div v-show="expandedMenus.content" class="ml-4 mt-1">
            <NuxtLink
              to="/admin/content/channels"
              :class="[
                'menu-item w-full text-left px-4 py-2 rounded-lg mb-1 block no-underline text-sm',
                route.path === '/admin/content/channels'
                  ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400'
                  : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700/50'
              ]"
            >
              <Icon name="heroicons:tag" class="inline-block w-4 h-4 mr-2" />
              栏目管理
            </NuxtLink>
            <NuxtLink
              to="/admin/content/articles"
              :class="[
                'menu-item w-full text-left px-4 py-2 rounded-lg mb-1 block no-underline text-sm',
                route.path === '/admin/content/articles'
                  ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400'
                  : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700/50'
              ]"
            >
              <Icon name="heroicons:document-text" class="inline-block w-4 h-4 mr-2" />
              文章管理
            </NuxtLink>
          </div>
        </div>

        <!-- 系统管理 -->
        <div class="mb-2">
          <button
            @click="toggleSubmenu('system')"
            :class="[
              'menu-item w-full text-left px-4 py-2 rounded-lg flex items-center justify-between',
              isSystemActive
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            ]"
          >
            <div class="flex items-center">
              <Icon name="heroicons:cog-6-tooth" class="inline-block w-5 h-5 mr-3" />
              系统管理
            </div>
            <Icon 
              :name="expandedMenus.system ? 'heroicons:chevron-down' : 'heroicons:chevron-right'" 
              class="w-4 h-4" 
            />
          </button>
          <div v-show="expandedMenus.system" class="ml-4 mt-1">
            <NuxtLink
              to="/admin/system/messages"
              :class="[
                'menu-item w-full text-left px-4 py-2 rounded-lg mb-1 block no-underline text-sm',
                route.path === '/admin/system/messages'
                  ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400'
                  : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700/50'
              ]"
            >
              <Icon name="heroicons:envelope" class="inline-block w-4 h-4 mr-2" />
              消息管理
            </NuxtLink>
            <NuxtLink
              to="/admin/settings"
              :class="[
                'menu-item w-full text-left px-4 py-2 rounded-lg mb-1 block no-underline text-sm',
                route.path === '/admin/settings'
                  ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400'
                  : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700/50'
              ]"
            >
              <Icon name="heroicons:adjustments-horizontal" class="inline-block w-4 h-4 mr-2" />
              系统设置
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
// 定义事件
defineEmits<{
  logout: []
}>()

// 获取路由信息
const route = useRoute()

// 响应式数据
const expandedMenus = ref({
  content: false,
  system: false
})

// 计算属性：判断当前路由是否在对应模块下
const isContentActive = computed(() => {
  return route.path.startsWith('/admin/content')
})

const isSystemActive = computed(() => {
  return route.path.startsWith('/admin/system') || route.path === '/admin/settings'
})

// 切换子菜单展开状态
const toggleSubmenu = (menu: 'content' | 'system') => {
  expandedMenus.value[menu] = !expandedMenus.value[menu]
}

// 监听路由变化，自动展开对应的菜单
watch(() => route.path, (newPath) => {
  if (newPath.startsWith('/admin/content')) {
    expandedMenus.value.content = true
  } else if (newPath.startsWith('/admin/system') || newPath === '/admin/settings') {
    expandedMenus.value.system = true
  }
}, { immediate: true })
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
