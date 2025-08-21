<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- 管理员登录界面 -->
    <div v-if="!isAuthenticated" class="flex items-center justify-center min-h-screen">
      <div class="max-w-md w-full space-y-8 p-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            管理员登录
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            请输入管理员凭据以访问后台管理系统
          </p>
        </div>
        <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
          <div class="rounded-md shadow-sm -space-y-px">
            <div>
              <label for="email" class="sr-only">邮箱</label>
              <input
                id="email"
                v-model="loginForm.email"
                name="email"
                type="email"
                required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                placeholder="邮箱地址"
              >
            </div>
            <div>
              <label for="password" class="sr-only">密码</label>
              <input
                id="password"
                v-model="loginForm.password"
                name="password"
                type="password"
                required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                placeholder="密码"
              >
            </div>
          </div>

          <div v-if="loginError" class="text-red-600 text-sm text-center">
            {{ loginError }}
          </div>

          <div class="space-y-4">
            <button
              type="submit"
              :disabled="isLoading"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <span v-if="isLoading">登录中...</span>
              <span v-else>登录</span>
            </button>
            
            <div class="text-center space-y-2">
              <div>
                <NuxtLink to="/admin/forgot-password" class="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                  忘记密码？
                </NuxtLink>
              </div>
              <div>
                <NuxtLink to="/admin/register" class="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                  还没有账户？立即注册
                </NuxtLink>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- 管理员仪表板 -->
    <div v-else class="flex h-screen bg-gray-100 dark:bg-gray-900">
      <!-- 侧边栏 -->
      <div class="w-64 bg-white dark:bg-gray-800 shadow-lg">
        <div class="p-6">
          <h1 class="text-xl font-bold text-gray-900 dark:text-white">管理后台</h1>
        </div>
        <nav class="mt-6">
          <div class="px-6 py-3">
            <NuxtLink
              v-for="item in menuItems"
              :key="item.key"
              :to="item.to"
              :class="[
                'w-full text-left px-4 py-2 rounded-lg mb-2 transition-colors block',
                $route.path === item.to
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              ]"
            >
              <Icon :name="item.icon" class="inline-block w-5 h-5 mr-3" />
              {{ item.label }}
            </NuxtLink>
          </div>
          <div class="px-6 py-3 border-t border-gray-200 dark:border-gray-700">
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
      <div class="flex-1 overflow-hidden">
        <div class="p-8">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { supabase } from '~/lib/supabase'

// 响应式数据
const user = ref<any>(null)
const isAuthenticated = computed(() => !!user.value)
const isLoading = ref(false)
const loginError = ref('')

// 登录表单
const loginForm = ref({
  email: '',
  password: ''
})

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

// 登录处理
const handleLogin = async () => {
  isLoading.value = true
  loginError.value = ''

  try {
    // 使用 Supabase Authentication 登录
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginForm.value.email,
      password: loginForm.value.password
    })

    if (error) {
      throw error
    }

    if (data.user) {
      user.value = data.user
      currentSession.value = data.session
      // 登录成功后跳转到仪表板
      await navigateTo('/admin/dashboard')
    }
  } catch (error: any) {
    loginError.value = error.message || '邮箱或密码错误'
    console.error('登录失败:', error)
  } finally {
    isLoading.value = false
  }
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
  // 获取当前会话
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.user) {
    user.value = session.user
    currentSession.value = session
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
      loginForm.value = { email: '', password: '' }
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