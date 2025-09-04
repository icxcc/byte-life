<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <!-- 装饰性背景 -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full opacity-10 animate-pulse"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-10 animate-pulse" style="animation-delay: 2s;"></div>
    </div>

    <UContainer class="relative z-10">
      <div class="max-w-md mx-auto">
        <UCard class="shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <template #header>
            <div class="text-center space-y-4">
              <div class="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <UIcon name="i-heroicons-shield-check" class="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 class="text-3xl font-bold text-gray-900 dark:text-white">
                  管理员登录
                </h2>
                <p class="mt-2 text-gray-600 dark:text-gray-400">
                  请使用管理员账号登录后台系统
                </p>
              </div>
            </div>
          </template>

          <UForm :state="loginForm" @submit="handleLogin" class="space-y-5 w-full">
            <!-- 表单输入区域 -->
            <div class="space-y-4 w-full">
              <UFormGroup label="邮箱地址" name="email" required class="w-full">
                <UInput
                  v-model="loginForm.email"
                  type="email"
                  placeholder="请输入邮箱地址"
                  icon="i-heroicons-envelope"
                  size="lg"
                  :disabled="isLoading"
                  class="h-11 w-full"
                />
              </UFormGroup>

              <UFormGroup label="密码" name="password" required class="w-full">
                <UInput
                  v-model="loginForm.password"
                  type="password"
                  placeholder="请输入密码"
                  icon="i-heroicons-lock-closed"
                  size="lg"
                  :disabled="isLoading"
                  class="h-11 w-full"
                />
              </UFormGroup>
            </div>

            <!-- 登录按钮 -->
            <div class="pt-2 w-full">
              <UButton
                type="submit"
                color="primary"
                size="lg"
                block
                :loading="isLoading"
                :disabled="!loginForm.email || !loginForm.password"
                icon="i-heroicons-arrow-right-on-rectangle"
                class="h-12 text-base font-medium w-full"
              >
                {{ isLoading ? '登录中...' : '登录' }}
              </UButton>
            </div>

            <!-- 错误提示 -->
            <div v-if="errorMessage" class="pt-3">
              <UAlert
                color="error"
                variant="soft"
                :title="'登录失败'"
                :description="errorMessage"
                icon="i-heroicons-exclamation-triangle"
              />
            </div>
          </UForm>

          <template #footer>
            <div class="flex items-center justify-between pt-2">
              <!-- 忘记密码链接 -->
              <UButton
                to="/admin/forgot-password"
                variant="ghost"
                color="primary"
                size="sm"
                :padded="false"
                class="text-sm hover:underline"
              >
                忘记密码？
              </UButton>
              
              <!-- 注册链接 -->
              <div class="text-sm text-gray-600 dark:text-gray-400">
                还没有账号？
                <UButton
                  to="/admin/register"
                  variant="ghost"
                  color="primary"
                  size="sm"
                  :padded="false"
                  class="text-sm hover:underline ml-1"
                >
                  立即注册
                </UButton>
              </div>
            </div>
          </template>
        </UCard>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  requiresAuth: false,
  layout: false
})
import { supabase } from '~/lib/supabase'

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