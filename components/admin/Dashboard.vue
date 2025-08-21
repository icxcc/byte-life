<template>
  <div class="space-y-8">
    <!-- 页面标题 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">仪表板</h1>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          欢迎回来！这里是您的网站管理概览。
        </p>
      </div>
      <div class="flex items-center space-x-3">
        <button
          @click="$emit('refresh')"
          :disabled="isRefreshing"
          class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
        >
          <Icon 
            name="heroicons:arrow-path" 
            :class="{ 'animate-spin': isRefreshing }"
            class="w-4 h-4 mr-2" 
          />
          刷新数据
        </button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="未读消息"
        :value="stats.unreadMessages"
        icon="heroicons:envelope"
        icon-class="text-blue-500"
        :change="getMessageChange()"
        :change-type="getMessageChangeType()"
        description="需要处理的联系消息"
      />
      <StatsCard
        title="项目总数"
        :value="stats.projectCount"
        icon="heroicons:folder"
        icon-class="text-green-500"
        :change="getProjectChange()"
        change-type="increase"
        description="已创建的项目数量"
      />
      <StatsCard
        title="博客文章"
        :value="stats.blogPosts"
        icon="heroicons:document-text"
        icon-class="text-purple-500"
        :change="getBlogChange()"
        change-type="increase"
        description="已发布的文章数量"
      />
      <StatsCard
        title="今日访问"
        :value="stats.todayVisits"
        icon="heroicons:eye"
        icon-class="text-orange-500"
        change="+12%"
        change-type="increase"
        description="相比昨日访问量"
      />
    </div>

    <!-- 快速操作 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">快速操作</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <NuxtLink
          to="/admin/system/messages"
          class="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
        >
          <Icon name="heroicons:envelope" class="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
          <div class="text-left">
            <p class="font-medium text-blue-900 dark:text-blue-100">查看消息</p>
            <p class="text-sm text-blue-600 dark:text-blue-300">处理用户联系</p>
          </div>
        </NuxtLink>
        
        <NuxtLink
          to="/admin/content/projects"
          class="flex items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
        >
          <Icon name="heroicons:plus-circle" class="w-6 h-6 text-green-600 dark:text-green-400 mr-3" />
          <div class="text-left">
            <p class="font-medium text-green-900 dark:text-green-100">管理项目</p>
            <p class="text-sm text-green-600 dark:text-green-300">创建和编辑项目</p>
          </div>
        </NuxtLink>
        
        <NuxtLink
          to="/admin/content/articles"
          class="flex items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
        >
          <Icon name="heroicons:pencil-square" class="w-6 h-6 text-purple-600 dark:text-purple-400 mr-3" />
          <div class="text-left">
            <p class="font-medium text-purple-900 dark:text-purple-100">写文章</p>
            <p class="text-sm text-purple-600 dark:text-purple-300">发布新内容</p>
          </div>
        </NuxtLink>
      </div>
    </div>

    <!-- 最近活动 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 最新消息 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">最新消息</h3>
            <NuxtLink
              to="/admin/system/messages"
              class="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300"
            >
              查看全部
            </NuxtLink>
          </div>
        </div>
        <div class="p-6">
          <div v-if="recentMessages.length === 0" class="text-center py-8">
            <Icon name="heroicons:inbox" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p class="text-gray-500 dark:text-gray-400">暂无新消息</p>
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="message in recentMessages"
              :key="message.id"
              class="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span class="text-white font-medium text-xs">{{ getInitials(message.name) }}</span>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center space-x-2">
                  <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ message.name }}</p>
                  <span v-if="!message.read" class="w-2 h-2 bg-red-500 rounded-full"></span>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400 truncate">{{ message.message }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">{{ formatRelativeTime(message.createdAt) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 系统状态 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">系统状态</h3>
        </div>
        <div class="p-6">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span class="text-sm text-gray-700 dark:text-gray-300">数据库连接</span>
              </div>
              <span class="text-sm text-green-600 dark:text-green-400 font-medium">正常</span>
            </div>
            
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span class="text-sm text-gray-700 dark:text-gray-300">API 服务</span>
              </div>
              <span class="text-sm text-green-600 dark:text-green-400 font-medium">运行中</span>
            </div>
            
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span class="text-sm text-gray-700 dark:text-gray-300">Supabase</span>
              </div>
              <span class="text-sm text-green-600 dark:text-green-400 font-medium">已连接</span>
            </div>
            
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                <span class="text-sm text-gray-700 dark:text-gray-300">存储空间</span>
              </div>
              <span class="text-sm text-yellow-600 dark:text-yellow-400 font-medium">75% 已用</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 显式导入 StatsCard 组件
import StatsCard from '~/components/admin/StatsCard.vue'

interface Props {
  stats: {
    unreadMessages: number
    projectCount: number
    blogPosts: number
    todayVisits: number
  }
  recentMessages: Array<{
    id: number
    name: string
    email: string
    message: string
    read: boolean
    createdAt: string
  }>
}

defineProps<Props>()
defineEmits<{
  refresh: []
}>()

const isRefreshing = ref(false)

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const formatRelativeTime = (date: string) => {
  const now = new Date()
  const messageDate = new Date(date)
  const diffInMinutes = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 1) return '刚刚'
  if (diffInMinutes < 60) return `${diffInMinutes} 分钟前`
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} 小时前`
  return `${Math.floor(diffInMinutes / 1440)} 天前`
}

const getMessageChange = () => {
  // 这里可以根据实际数据计算变化
  return '+3'
}

const getMessageChangeType = () => {
  // 根据消息数量变化返回类型
  return 'increase'
}

const getProjectChange = () => {
  return '+2'
}

const getBlogChange = () => {
  return '+1'
}
</script>