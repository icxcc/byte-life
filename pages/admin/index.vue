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
          @click="refreshData"
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
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <Icon name="heroicons:envelope" class="w-8 h-8 text-blue-500" />
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">未读消息</dt>
              <dd class="text-lg font-medium text-gray-900 dark:text-white">{{ stats.unreadMessages }}</dd>
            </dl>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <Icon name="heroicons:folder" class="w-8 h-8 text-green-500" />
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">项目总数</dt>
              <dd class="text-lg font-medium text-gray-900 dark:text-white">{{ stats.projectCount }}</dd>
            </dl>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <Icon name="heroicons:document-text" class="w-8 h-8 text-purple-500" />
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">博客文章</dt>
              <dd class="text-lg font-medium text-gray-900 dark:text-white">{{ stats.blogPosts }}</dd>
            </dl>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <Icon name="heroicons:eye" class="w-8 h-8 text-orange-500" />
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">今日访问</dt>
              <dd class="text-lg font-medium text-gray-900 dark:text-white">{{ stats.todayVisits }}</dd>
            </dl>
          </div>
        </div>
      </div>
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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { supabase } from '~/lib/supabase'

// 页面元数据 - 使用管理后台布局
definePageMeta({
  layout: 'admin'
})

// 响应式数据
const user = ref<any>(null)
const isLoading = ref(true)
const isRefreshing = ref(false)

// 统计数据
const stats = ref({
  unreadMessages: 0,
  projectCount: 0,
  blogPosts: 0,
  todayVisits: 0
})

// 刷新数据
const refreshData = async () => {
  isRefreshing.value = true
  try {
    await loadStats()
    await new Promise(resolve => setTimeout(resolve, 500)) // 模拟加载延迟
  } finally {
    isRefreshing.value = false
  }
}

// 加载统计数据
const loadStats = async () => {
  try {
    const token = await getAuthToken()
    if (!token) return

    // 并行加载所有统计数据
    const [messagesRes, projectsRes, articlesRes] = await Promise.allSettled([
      $fetch('/api/admin/system/messages', {
        headers: { 'Authorization': `Bearer ${token}` }
      }),
      $fetch('/api/admin/content/projects', {
        headers: { 'Authorization': `Bearer ${token}` }
      }),
      $fetch('/api/admin/content/articles', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
    ])

    // 处理消息统计
    if (messagesRes.status === 'fulfilled' && messagesRes.value.success) {
      const messages = messagesRes.value.data.messages || []
      stats.value.unreadMessages = messages.filter((msg: any) => !msg.read).length
    }

    // 处理项目统计
    if (projectsRes.status === 'fulfilled' && projectsRes.value.success) {
      const projects = projectsRes.value.data.projects || []
      stats.value.projectCount = projects.length
    }

    // 处理文章统计
    if (articlesRes.status === 'fulfilled' && articlesRes.value.success) {
      const articles = articlesRes.value.data.articles || []
      stats.value.blogPosts = articles.filter((article: any) => article.published).length
    }

    // 模拟今日访问数据
    stats.value.todayVisits = Math.floor(Math.random() * 500) + 100

  } catch (error) {
    console.error('加载统计数据失败:', error)
  }
}

// 获取认证令牌
const getAuthToken = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) {
      console.error('获取会话失败:', error)
      throw error
    }
    
    if (!session?.access_token) {
      console.error('未找到访问令牌')
      await navigateTo('/admin/login')
      throw new Error('未找到访问令牌')
    }
    
    return session.access_token
  } catch (error) {
    console.error('获取认证令牌失败:', error)
    await navigateTo('/admin/login')
    throw error
  }
}

// 初始化认证状态
onMounted(async () => {
  try {
    // 获取当前会话
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      user.value = session.user
      // 加载统计数据
      await loadStats()
    } else {
      // 如果没有会话，重定向到登录页面
      await navigateTo('/admin/login')
    }
  } catch (error) {
    console.error('获取会话失败:', error)
    await navigateTo('/admin/login')
  } finally {
    isLoading.value = false
  }

  // 监听认证状态变化
  supabase.auth.onAuthStateChange(async (event, session) => {
    console.log('认证状态变化:', event, session?.user?.email)
    
    if (event === 'SIGNED_OUT' || !session) {
      // 清理状态并重定向到登录页面
      user.value = null
      await navigateTo('/admin/login')
    } else if (event === 'SIGNED_IN' && session?.user) {
      user.value = session.user
      await loadStats()
    }
  })
})

// 页面标题
useHead({
  title: '管理后台 - ByteLife'
})
</script>
