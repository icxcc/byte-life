<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- 未认证时重定向到登录页面 -->
    <div v-if="!isAuthenticated && !isLoading" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400">正在验证身份...</p>
      </div>
    </div>

    <!-- 管理员仪表板 -->
    <div v-else-if="isAuthenticated" class="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
      <!-- 侧边栏 -->
      <div class="w-64 bg-white dark:bg-gray-800 shadow-lg flex-shrink-0 flex flex-col">
        <div class="p-6 flex-shrink-0">
          <h1 class="text-xl font-bold text-gray-900 dark:text-white">管理后台</h1>
        </div>
        <nav class="flex-1 overflow-y-auto">
          <div class="px-6 py-3">
            <NuxtLink
              v-for="item in menuItems"
              :key="item.key"
              :to="item.to"
              :class="[
                'w-full text-left px-4 py-2 rounded-lg mb-2 transition-colors block no-underline',
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
              @click="handleLogout"
              class="w-full text-left px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
            >
              <Icon name="heroicons:arrow-right-on-rectangle" class="inline-block w-5 h-5 mr-3" />
              退出登录
            </button>
          </div>
        </nav>
      </div>

      <!-- 主内容区域 -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- 顶部导航栏 -->
        <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div class="px-6 py-4">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ getPageTitle() }}
            </h2>
          </div>
        </header>
        
        <!-- 主内容 -->
        <main class="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div class="p-6">
            <slot />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { supabase } from '~/lib/supabase'

// 响应式数据
const user = ref<any>(null)
const isAuthenticated = computed(() => !!user.value)
const isLoading = ref(true)

// 菜单项
const menuItems = [
  { key: 'dashboard', label: '仪表板', icon: 'heroicons:home', to: '/admin/dashboard' },
  { key: 'messages', label: '消息管理', icon: 'heroicons:envelope', to: '/admin/system/messages' },
  { key: 'projects', label: '项目管理', icon: 'heroicons:folder', to: '/admin/content/projects' },
  { key: 'blog', label: '博客管理', icon: 'heroicons:document-text', to: '/admin/content/articles' },
  { key: 'settings', label: '系统设置', icon: 'heroicons:cog-6-tooth', to: '/admin/settings' }
]

// 存储当前会话信息
const currentSession = ref<any>(null)

// 获取当前页面标题
const getPageTitle = () => {
  const route = useRoute()
  const titleMap: Record<string, string> = {
    '/admin/dashboard': '仪表板',
    '/admin/content/articles': '文章管理',
    '/admin/content/projects': '项目管理',
    '/admin/system/messages': '消息管理',
    '/admin/settings': '系统设置'
  }
  return titleMap[route.path] || '管理后台'
}

// 退出登录
const handleLogout = async () => {
  try {
    // 使用 Supabase 退出登录
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('退出登录失败:', error)
      throw error
    }
    
    // 清理本地状态
    user.value = null
    currentSession.value = null
    loginForm.value = { email: '', password: '' }
    
    // 跳转到登录页面
    await navigateTo('/admin')
    
    console.log('退出登录成功')
  } catch (error) {
    console.error('退出登录失败:', error)
    // 即使 Supabase 退出失败，也要清理本地状态
    user.value = null
    currentSession.value = null
    loginForm.value = { email: '', password: '' }
    await navigateTo('/admin')
  }
}

// 初始化认证状态
onMounted(async () => {
  try {
    // 获取当前会话
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      user.value = session.user
      currentSession.value = session
    } else {
      // 如果没有会话，重定向到登录页面
      await navigateTo('/admin')
    }
  } catch (error) {
    console.error('获取会话失败:', error)
    await navigateTo('/admin')
  } finally {
    isLoading.value = false
  }

  // 监听认证状态变化
  supabase.auth.onAuthStateChange(async (event, session) => {
    console.log('认证状态变化:', event, session?.user?.email)
    
    if (event === 'SIGNED_IN' && session?.user) {
      user.value = session.user
      currentSession.value = session
    } else if (event === 'SIGNED_OUT' || !session) {
      // 清理所有状态
      user.value = null
      currentSession.value = null
      // 重定向到登录页面
      await navigateTo('/admin')
    }
  })
})

// 提供认证状态给子组件
provide('auth', {
  user: readonly(user),
  session: readonly(currentSession),
  isAuthenticated: readonly(isAuthenticated)
})
</script>