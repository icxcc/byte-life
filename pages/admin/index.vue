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

    <!-- 已登录状态自动跳转到仪表板 -->
    <div v-else class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400">正在跳转到管理后台...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { supabase } from '~/lib/supabase'

// 页面元数据
definePageMeta({
  layout: false
})

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

// 存储当前会话信息
const currentSession = ref<any>(null)

// 登录处理
const handleLogin = async () => {
  isLoading.value = true
  loginError.value = ''

  try {
    console.log('开始登录:', loginForm.value.email)
    
    // 使用 Supabase Authentication 登录
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginForm.value.email,
      password: loginForm.value.password
    })

    console.log('登录响应:', { data, error })

    if (error) {
      console.error('Supabase 登录错误:', error)
      throw error
    }

    if (data.user) {
      console.log('登录成功，用户信息:', data.user)
      user.value = data.user
      currentSession.value = data.session
      // 登录成功后跳转到仪表板
      await navigateTo('/admin/dashboard')
    } else {
      throw new Error('登录失败：未获取到用户信息')
    }
  } catch (error: any) {
    console.error('登录失败详细信息:', error)
    
    // 根据错误类型提供更友好的错误信息
    if (error.message?.includes('Invalid login credentials')) {
      loginError.value = '邮箱或密码错误，请检查后重试'
    } else if (error.message?.includes('Email not confirmed')) {
      loginError.value = '请先验证您的邮箱地址'
    } else if (error.message?.includes('Too many requests')) {
      loginError.value = '登录尝试次数过多，请稍后再试'
    } else {
      loginError.value = error.message || '登录失败，请重试'
    }
  } finally {
    isLoading.value = false
  }
}

// 初始化认证状态
onMounted(async () => {
  // 获取当前会话
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.user) {
    user.value = session.user
    currentSession.value = session
    // 如果已经登录，直接跳转到仪表板
    await navigateTo('/admin/dashboard')
  }

  // 监听认证状态变化
  supabase.auth.onAuthStateChange(async (event, session) => {
    console.log('认证状态变化:', event, session?.user?.email)
    
    if (event === 'SIGNED_IN' && session?.user) {
      user.value = session.user
      currentSession.value = session
      await navigateTo('/admin/dashboard')
    } else if (event === 'SIGNED_OUT' || !session) {
      // 清理所有状态
      user.value = null
      currentSession.value = null
      loginForm.value = { email: '', password: '' }
    }
  })
})

// 页面标题
useHead({
  title: '管理员登录 - ByteLife'
})
</script>