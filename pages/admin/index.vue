<template>
  <AdminDashboard 
    :stats="stats" 
    :recent-messages="recentMessages"
    @refresh="refreshData"
  />
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

const refreshData = async () => {
  await Promise.all([loadStats(), loadRecentMessages()])
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
    supabase.auth.onAuthStateChange(async (event, session) => {
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
