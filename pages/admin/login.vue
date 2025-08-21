<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          管理员登录
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          请使用管理员账号登录
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email" class="sr-only">邮箱地址</label>
            <input
              id="email"
              v-model="loginForm.email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="邮箱地址"
            />
          </div>
          <div>
            <label for="password" class="sr-only">密码</label>
            <input
              id="password"
              v-model="loginForm.password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="密码"
            />
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="text-sm">
            <NuxtLink
              to="/admin/forgot-password"
              class="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              忘记密码？
            </NuxtLink>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            </span>
            {{ isLoading ? '登录中...' : '登录' }}
          </button>
        </div>

        <!-- 错误提示 -->
        <div v-if="errorMessage" class="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <Icon name="heroicons:x-circle" class="h-5 w-5 text-red-400" />
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800 dark:text-red-200">
                登录失败
              </h3>
              <div class="mt-2 text-sm text-red-700 dark:text-red-300">
                {{ errorMessage }}
              </div>
            </div>
          </div>
        </div>
      </form>
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
const loginForm = ref({
  email: '',
  password: ''
})

const isLoading = ref(false)
const errorMessage = ref('')

// 处理登录
const handleLogin = async () => {
  if (isLoading.value) return
  
  isLoading.value = true
  errorMessage.value = ''

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginForm.value.email,
      password: loginForm.value.password
    })

    if (error) {
      console.error('登录失败:', error)
      errorMessage.value = getErrorMessage(error.message)
      return
    }

    if (data.user) {
      console.log('登录成功:', data.user.email)
      // 登录成功后跳转到管理后台首页
      await navigateTo('/admin')
    }
  } catch (error: any) {
    console.error('登录过程中发生错误:', error)
    errorMessage.value = '登录过程中发生错误，请稍后重试'
  } finally {
    isLoading.value = false
  }
}

// 错误信息映射
const getErrorMessage = (error: string) => {
  const errorMap: Record<string, string> = {
    'Invalid login credentials': '邮箱或密码错误',
    'Email not confirmed': '邮箱未验证，请检查您的邮箱',
    'Too many requests': '请求过于频繁，请稍后重试',
    'User not found': '用户不存在',
    'Invalid email': '邮箱格式不正确',
    'Password should be at least 6 characters': '密码至少需要6个字符'
  }
  
  return errorMap[error] || '登录失败，请检查您的邮箱和密码'
}

// 检查是否已登录
onMounted(async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      // 如果已经登录，直接跳转到管理后台
      await navigateTo('/admin')
    }
  } catch (error) {
    console.error('检查登录状态失败:', error)
  }
})

// SEO
useHead({
  title: '管理员登录 - ByteLife',
  meta: [
    { name: 'description', content: '管理员登录页面' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>