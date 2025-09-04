<template>
  <div class="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
    <div class="flex items-center justify-between h-16 px-5">
      <!-- 左侧：页面标题 -->
      <div class="flex items-center">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ getPageTitle() }}
        </h2>
      </div>

      <!-- 右侧：操作按钮组 -->
      <div class="flex items-center gap-2">
        <!-- 前端访问入口 -->
        <UButton
          to="/"
          target="_blank"
          variant="ghost"
          color="neutral"
          size="sm"
          icon="i-heroicons-arrow-top-right-on-square"
          square
          title="访问前端网站"
        />

        <!-- 通知消息 -->
        <UPopover :popper="{ placement: 'bottom-end' }">
          <div class="relative">
            <UButton
              variant="ghost"
              color="neutral"
              size="sm"
              icon="i-heroicons-bell"
              square
              title="通知消息"
            />
            <UBadge
              v-if="unreadCount > 0"
              :label="unreadCount > 99 ? '99+' : unreadCount.toString()"
              color="error"
              variant="solid"
              size="xs"
              class="absolute -top-1 -right-1"
            />
          </div>

          <template #panel>
            <UCard class="w-80 max-w-sm">
              <template #header>
                <div class="flex items-center justify-between">
                  <h3 class="text-sm font-medium">通知消息</h3>
                  <UBadge
                    v-if="unreadCount > 0"
                    :label="unreadCount.toString()"
                    color="error"
                    variant="soft"
                    size="xs"
                  />
                </div>
              </template>

              <div class="space-y-3 max-h-64 overflow-y-auto">
                <div v-if="notifications.length === 0" class="text-center py-4">
                  <UIcon name="i-heroicons-bell-slash" class="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p class="text-sm text-gray-500">暂无新消息</p>
                </div>
                
                <div v-else class="space-y-3">
                  <div
                    v-for="notification in notifications"
                    :key="notification.id"
                    class="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <UIcon
                      :name="getNotificationIcon(notification.type)"
                      :class="getNotificationIconClass(notification.type)"
                      class="w-5 h-5 mt-0.5 flex-shrink-0"
                    />
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-gray-900 dark:text-white">
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

              <template #footer>
                <UButton
                  to="/admin/system/messages"
                  variant="ghost"
                  color="primary"
                  size="sm"
                  class="w-full justify-center"
                >
                  查看所有消息
                </UButton>
              </template>
            </UCard>
          </template>
        </UPopover>

        <!-- 主题切换 -->
        <UButton
          variant="ghost"
          color="neutral"
          size="sm"
          :icon="isDark ? 'i-heroicons-sun' : 'i-heroicons-moon'"
          square
          :title="isDark ? '切换到浅色模式' : '切换到深色模式'"
          @click="toggleTheme"
        />

        <!-- 用户菜单 -->
        <UDropdownMenu :items="userMenuItems">
          <UButton
            variant="ghost"
            color="neutral"
            size="sm"
            class="gap-2"
          >
            <UAvatar
              :alt="currentUser?.email || 'Admin'"
              size="xs"
              class="bg-primary-500 dark:bg-primary-400"
            >
              <UIcon name="i-heroicons-user" class="text-white" />
            </UAvatar>
            <span class="hidden md:block text-sm">{{ currentUser?.email || 'Admin' }}</span>
            <UIcon name="i-heroicons-chevron-down" class="w-4 h-4" />
          </UButton>
        </UDropdownMenu>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 定义事件
const emit = defineEmits<{
  logout: []
}>()

// 响应式数据
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

// 用户菜单项
const userMenuItems = [
  [{
    label: '个人设置',
    icon: 'i-heroicons-cog-6-tooth',
    to: '/admin/settings'
  }],
  [{
    label: '退出登录',
    icon: 'i-heroicons-arrow-right-on-rectangle',
    onSelect: () => emit('logout')
  }]
]

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
    message: 'i-heroicons-envelope',
    system: 'i-heroicons-cog-6-tooth',
    warning: 'i-heroicons-exclamation-triangle',
    success: 'i-heroicons-check-circle'
  }
  return icons[type as keyof typeof icons] || 'i-heroicons-bell'
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
</script>
