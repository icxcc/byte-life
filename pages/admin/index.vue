<template>
  <AdminDashboard 
    :stats="stats" 
    :recent-messages="recentMessages"
    @refresh="refreshData"
  />
</template>

<script setup lang="ts">
import { supabase } from '~/lib/supabase'

definePageMeta({ layout: 'admin' })

const stats = ref({
  unreadMessages: 0,
  projectCount: 0,
  blogPosts: 0,
  todayVisits: 0
})

const recentMessages = ref([])

const refreshData = async () => {
  await Promise.all([loadStats(), loadRecentMessages()])
}

const loadStats = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.access_token) return

    const token = session.access_token
    const [messagesRes, projectsRes, articlesRes] = await Promise.allSettled([
      $fetch('/api/admin/system/messages', { headers: { 'Authorization': `Bearer ${token}` } }),
      $fetch('/api/admin/content/projects', { headers: { 'Authorization': `Bearer ${token}` } }),
      $fetch('/api/admin/content/articles', { headers: { 'Authorization': `Bearer ${token}` } })
    ])

    if (messagesRes.status === 'fulfilled' && messagesRes.value.success) {
      const messages = messagesRes.value.data.messages || []
      stats.value.unreadMessages = messages.filter((msg: any) => !msg.read).length
    }

    if (projectsRes.status === 'fulfilled' && projectsRes.value.success) {
      stats.value.projectCount = (projectsRes.value.data.projects || []).length
    }

    if (articlesRes.status === 'fulfilled' && articlesRes.value.success) {
      const articles = articlesRes.value.data.articles || []
      stats.value.blogPosts = articles.filter((article: any) => article.published).length
    }

    stats.value.todayVisits = Math.floor(Math.random() * 500) + 100
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
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) {
    await navigateTo('/admin/login')
    return
  }

  await refreshData()

  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_OUT' || !session) {
      await navigateTo('/admin/login')
    } else if (event === 'SIGNED_IN' && session?.user) {
      await refreshData()
    }
  })
})

useHead({ title: '管理后台 - ByteLife' })
</script>
