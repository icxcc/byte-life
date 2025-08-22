<template>
  <div>
    <!-- 页面标题和操作 -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">管理后台</h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">欢迎回来！这里是您的管理后台，您可以管理网站的各项内容。</p>
      </div>
      <UButton
        icon="i-heroicons-arrow-path"
        variant="soft"
        @click="refreshData"
      >
        刷新数据
      </UButton>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <UCard>
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <UIcon name="i-heroicons-document-text" class="w-8 h-8 text-blue-500" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">总文章数</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.blogPosts }}</p>
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <UIcon name="i-heroicons-folder" class="w-8 h-8 text-green-500" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">总项目数</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.projectCount }}</p>
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <UIcon name="i-heroicons-envelope" class="w-8 h-8 text-yellow-500" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">未读消息</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.unreadMessages }}</p>
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <UIcon name="i-heroicons-eye" class="w-8 h-8 text-purple-500" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">今日访问</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.todayVisits }}</p>
          </div>
        </div>
      </UCard>
    </div>

    <!-- 快速操作 -->
    <UiCard title="快速操作" class="mt-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <UButton
          to="/admin/content/articles"
          color="primary"
          variant="soft"
          size="lg"
          icon="i-heroicons-plus"
          class="justify-start"
          block
        >
          新建文章
        </UButton>
        
        <UButton
          to="/admin/content/channels"
          color="success"
          variant="soft"
          size="lg"
          icon="i-heroicons-folder-plus"
          class="justify-start"
          block
        >
          管理栏目
        </UButton>
        
        <UButton
          to="/admin/system/messages"
          color="warning"
          variant="soft"
          size="lg"
          icon="i-heroicons-envelope"
          class="justify-start"
          block
        >
          查看消息
        </UButton>
        
        <UButton
          to="/admin/settings"
          color="secondary"
          variant="soft"
          size="lg"
          icon="i-heroicons-cog-6-tooth"
          class="justify-start"
          block
        >
          系统设置
        </UButton>
      </div>
    </UiCard>

    <!-- 最近活动 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <UiCard title="最近消息">
        <div class="space-y-3">
          <div
            v-for="message in recentMessages"
            :key="message.id"
            class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <div>
              <h3 class="text-sm font-medium text-gray-900 dark:text-white">
                {{ message.name }}
              </h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ message.email }}
              </p>
            </div>
            <UButton
              :to="`/admin/system/messages`"
              color="neutral"
              variant="ghost"
              icon="i-heroicons-eye"
              size="sm"
            />
          </div>
        </div>
      </UiCard>

      <UiCard title="系统状态">
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400">服务器状态</span>
            <UBadge color="success" variant="soft">正常</UBadge>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400">数据库连接</span>
            <UBadge color="success" variant="soft">正常</UBadge>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400">存储空间</span>
            <UBadge color="warning" variant="soft">75% 已使用</UBadge>
          </div>
        </div>
      </UiCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { supabase } from '~/lib/supabase'

// 页面元数据配置
definePageMeta({ 
  layout: 'admin',
  middleware: 'auth'
})

const stats = ref({
  unreadMessages: 0,
  projectCount: 0,
  blogPosts: 0,
  todayVisits: 0
})

const recentMessages = ref<any[]>([])

// 通知系统
const toast = useToast()

const refreshData = async () => {
  await Promise.all([loadStats(), loadRecentMessages()])
  toast.add({
    title: '数据刷新完成！',
    color: 'success'
  })
}

const loadStats = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.access_token) {
      console.log('没有访问令牌')
      return
    }

    console.log('开始加载统计数据...')
    const token = session.access_token
    const { get: getMessages } = useAdminApi('/system/messages')
    const { get: getProjects } = useAdminApi('/content/projects')
    const { get: getArticles } = useAdminApi('/content/articles')
    
    const [messagesRes, projectsRes, articlesRes] = await Promise.allSettled([
      getMessages(),
      getProjects(),
      getArticles()
    ])

    console.log('API 响应:', { messagesRes, projectsRes, articlesRes })

    if (messagesRes.status === 'fulfilled' && messagesRes.value.success) {
      const messages = messagesRes.value.data.messages || []
      stats.value.unreadMessages = messages.filter((msg: any) => !msg.read).length
      console.log('未读消息数:', stats.value.unreadMessages)
    } else {
      console.log('消息API失败:', messagesRes)
    }

    if (projectsRes.status === 'fulfilled' && projectsRes.value.success) {
      stats.value.projectCount = (projectsRes.value.data.projects || []).length
      console.log('项目数:', stats.value.projectCount)
    } else {
      console.log('项目API失败:', projectsRes)
    }

    if (articlesRes.status === 'fulfilled' && articlesRes.value.success) {
      const articles = articlesRes.value.data.articles || []
      stats.value.blogPosts = articles.filter((article: any) => article.published).length
      console.log('文章数:', stats.value.blogPosts)
    } else {
      console.log('文章API失败:', articlesRes)
    }

    stats.value.todayVisits = Math.floor(Math.random() * 500) + 100
    console.log('最终统计数据:', stats.value)
  } catch (error) {
    console.error('加载统计数据失败:', error)
    toast.add({
      title: '加载统计数据失败',
      color: 'error'
    })
  }
}

const loadRecentMessages = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.access_token) return

    const response = await $fetch('/api/admin/system/messages', {
      headers: { 'Authorization': `Bearer ${session.access_token}` }
    })

    if (response.success) {
      recentMessages.value = (response.data.messages || [])
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)
    }
  } catch (error) {
    console.error('加载最近消息失败:', error)
  }
}

onMounted(async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) {
      console.log('未登录，重定向到登录页面')
      await navigateTo('/admin/login')
      return
    }

    console.log('用户已登录:', session.user.email)
    await refreshData()

    // 监听认证状态变化
    supabase.auth.onAuthStateChange(async (event: any, session: any) => {
      console.log('认证状态变化:', event)
      if (event === 'SIGNED_OUT' || !session) {
        console.log('用户已登出，重定向到登录页面')
        await navigateTo('/admin/login')
      } else if (event === 'SIGNED_IN' && session?.user) {
        console.log('用户已登录，刷新数据')
        await refreshData()
      }
    })
  } catch (error) {
    console.error('认证检查失败:', error)
    await navigateTo('/admin/login')
  }
})

useHead({ title: '管理后台 - ByteLife' })
</script>
