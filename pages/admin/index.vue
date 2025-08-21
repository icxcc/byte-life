<template>
  <AdminDashboard 
    :stats="stats" 
    :recent-messages="recentMessages"
    @refresh="refreshData"
  />
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

// 统计数据
const stats = ref({
  unreadMessages: 0,
  projectCount: 0,
  blogPosts: 0,
  todayVisits: 0
})

// 最近消息
const recentMessages = ref([])

// 刷新数据
const refreshData = async () => {
  await Promise.all([
    loadStats(),
    loadRecentMessages()
  ])
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

// 加载最近消息
const loadRecentMessages = async () => {
  try {
    const token = await getAuthToken()
    if (!token) return

    const response = await $fetch('/api/admin/system/messages', {
      headers: { 'Authorization': `Bearer ${token}` }
    })

    if (response.success) {
      // 获取最近的5条消息
      recentMessages.value = (response.data.messages || [])
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)
    }
  } catch (error) {
    console.error('加载最近消息失败:', error)
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
      // 加载数据
      await refreshData()
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
      await refreshData()
    }
  })
})

// 页面标题
useHead({
  title: '管理后台 - ByteLife'
})
</script>
