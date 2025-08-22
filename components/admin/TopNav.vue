<template>
  <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
    <div class="px-6 py-3 flex items-center justify-between">
      <!-- 左侧：页面标题 -->
      <div class="flex items-center">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ getPageTitle() }}
        </h2>
      </div>

      <!-- 右侧：前端访问入口、通知消息、主题切换、用户信息 -->
      <div class="flex items-center space-x-4">
        <!-- 前端访问入口 -->
        <NuxtLink
          to="/"
          target="_blank"
          class="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          title="访问前端网站"
        >
          <Icon name="heroicons:arrow-top-right-on-square" class="w-5 h-5" />
        </NuxtLink>

        <!-- 通知消息 -->
        <div class="relative">
          <button
            @click="showNotifications = !showNotifications"
            class="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative"
            title="通知消息"
          >
            <Icon name="heroicons:bell" class="w-5 h-5" />
            <!-- 未读消息徽章 -->
            <span
              v-if="unreadCount > 0"
              class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
            >
              {{ unreadCount > 99 ? '99+' : unreadCount }}
            </span>
          </button>

          <!-- 通知下拉菜单 -->
          <Transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <div
              v-if="showNotifications"
              class="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50"
            >
              <div class="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 class="text-sm font-medium text-gray-900 dark:text-white">通知消息</h3>
              </div>
              <div class="max-h-64 overflow-y-auto">
                <div v-if="notifications.length === 0" class="p-4 text-center text-gray-500 dark:text-gray-400">
                  暂无新消息
                </div>
                <div v-else>
                  <div
                    v-for="notification in notifications"
                    :key="notification.id"
                    class="p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <div class="flex items-start space-x-3">
                      <div class="flex-shrink-0">
                        <Icon
                          :name="getNotificationIcon(notification.type)"
                          :class="getNotificationIconClass(notification.type)"
                          class="w-5 h-5"
                        />
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm text-gray-900 dark:text-white">
                          {{ notification.title }}
                        </p>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {{ notification.message }}
                        </p>
                        <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {{ formatTime(notification.created_at) }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="p-3 border-t border-gray-200 dark:border-gray-700">
                <NuxtLink
                  to="/admin/system/messages"
                  class="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
                  @click="showNotifications = false"
                >
                  查看所有消息
                </NuxtLink>
              </div>
            </div>
          </Transition>
        </div>

        <!-- 主题切换 -->
        <button
          @click="toggleTheme"
          class="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          :title="isDark ? '切换到浅色模式' : '切换到深色模式'"
        >
          <Icon
            :name="isDark ? 'heroicons:sun' : 'heroicons:moon'"
            class="w-5 h-5"
          />
        </button>

        <!-- 用户信息 -->
        <div class="relative">
          <button
            @click="showUserMenu = !showUserMenu"
            class="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <div class="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
              <Icon name="heroicons:user" class="w-5 h-5 text-white" />
            </div>
            <span class="hidden md:block">{{ currentUser?.email || 'Admin' }}</span>
            <Icon name="heroicons:chevron-down" class="w-4 h-4" />
          </button>

          <!-- 用户下拉菜单 -->
          <Transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <div
              v-if="showUserMenu"
              class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50"
            >
              <div class="py-1">
                <NuxtLink
                  to="/admin/settings"
                  class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  @click="showUserMenu = false"
                >
                  <Icon name="heroicons:cog-6-tooth" class="w-4 h-4 inline mr-2" />
                  个人设置
                </NuxtLink>
                <button
                  @click="handleLogout"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Icon name="heroicons:arrow-right-on-rectangle" class="w-4 h-4 inline mr-2" />
                  退出登录
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
// 定义事件
const emit = defineEmits<{
  logout: []
}>()

// 响应式数据
const showUserMenu = ref(false)
const showNotifications = ref(false)
const notifications = ref([
  {
    id: 1,
    type: 'message',
    title: '新的联系消息',
    message: '有用户通过联系表单发送了新消息',
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    type: 'system',
    title: '系统更新',
    message: '后台管理系统已更新到最新版本',
    created_at: new Date(Date.now() - 3600000).toISOString()
  }
])

// 计算属性
const unreadCount = computed(() => notifications.value.length)
const currentUser = ref({ email: 'admin@bytelife.com' })

// 主题相关
const { isDark, toggleTheme } = useTheme()

// 获取当前页面标题
const getPageTitle = () => {
  const route = useRoute()
  const titleMap: Record<string, string> = {
    '/admin': '仪表板',
    '/admin/dashboard': '仪表板',
    '/admin/content/articles': '文章管理',
    '/admin/content/channels': '栏目管理',
    '/admin/system/messages': '消息管理',
    '/admin/settings': '系统设置'
  }
  return titleMap[route.path] || '管理后台'
}

// 获取通知图标
const getNotificationIcon = (type: string) => {
  const icons = {
    message: 'heroicons:envelope',
    system: 'heroicons:cog-6-tooth',
    warning: 'heroicons:exclamation-triangle',
    success: 'heroicons:check-circle'
  }
  return icons[type as keyof typeof icons] || 'heroicons:bell'
}

// 获取通知图标样式
const getNotificationIconClass = (type: string) => {
  const classes = {
    message: 'text-blue-500',
    system: 'text-gray-500',
    warning: 'text-yellow-500',
    success: 'text-green-500'
  }
  return classes[type as keyof typeof classes] || 'text-gray-500'
}

// 格式化时间
const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  return `${Math.floor(diff / 86400000)}天前`
}

// 处理退出登录
const handleLogout = () => {
  showUserMenu.value = false
  emit('logout')
}

// 点击外部关闭菜单
onMounted(() => {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!target.closest('.relative')) {
      showUserMenu.value = false
      showNotifications.value = false
    }
  })
})
</script>