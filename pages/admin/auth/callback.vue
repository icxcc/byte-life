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
                <UIcon :name="statusIcon" class="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 class="text-3xl font-bold text-gray-900 dark:text-white">
                  {{ statusTitle }}
                </h2>
                <p class="mt-2 text-gray-600 dark:text-gray-400">
                  {{ statusMessage }}
                </p>
              </div>
            </div>
          </template>

          <!-- 加载状态 -->
          <div v-if="isLoading" class="text-center py-8">
            <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
            <p class="text-gray-600 dark:text-gray-400">正在验证您的邮箱...</p>
          </div>

          <!-- 成功/失败状态 -->
          <div v-else class="space-y-6">
            <UAlert
              :color="isSuccess ? 'success' : 'warning'"
              variant="soft"
              :title="isSuccess ? '邮箱验证成功' : '验证状态未知'"
              :description="alertMessage"
              :icon="isSuccess ? 'i-heroicons-check-circle' : 'i-heroicons-exclamation-triangle'"
            />

            <!-- 按钮组 -->
            <div class="space-y-3 pt-2 w-full">
              <UButton
                to="/admin"
                color="primary"
                size="lg"
                block
                icon="i-heroicons-arrow-right-on-rectangle"
                class="h-12 text-base font-medium w-full"
              >
                前往登录
              </UButton>
              
              <UButton
                v-if="!isSuccess"
                to="/admin/register"
                color="gray"
                variant="ghost"
                size="lg"
                block
                icon="i-heroicons-user-plus"
                class="h-12 text-base font-medium w-full"
              >
                重新注册
              </UButton>
            </div>
          </div>
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

const isLoading = ref(true)
const isSuccess = ref(false)
const errorMessage = ref('')

// 计算属性
const statusIcon = computed(() => {
  if (isLoading.value) return 'i-heroicons-arrow-path'
  return isSuccess.value ? 'i-heroicons-check-circle' : 'i-heroicons-exclamation-triangle'
})

const statusTitle = computed(() => {
  if (isLoading.value) return '验证中'
  return isSuccess.value ? '验证成功' : '验证失败'
})

const statusMessage = computed(() => {
  if (isLoading.value) return '正在处理您的邮箱验证...'
  return isSuccess.value ? '您的邮箱已成功验证' : '邮箱验证过程中出现问题'
})

const alertMessage = computed(() => {
  if (isSuccess.value) {
    return '恭喜！您的邮箱已成功验证，现在可以使用您的账户登录了。3秒后将自动跳转到登录页面。'
  }
  return errorMessage.value || '验证过程中出现问题。如果您能正常登录，说明验证已成功，可以忽略此提示。'
})

// 处理邮箱验证
const handleEmailVerification = async () => {
  try {
    const route = useRoute()
    
    // 检查URL中是否有认证相关的参数
    const { access_token, refresh_token, type, token_hash, next } = route.query
    
    console.log('回调参数:', { access_token, refresh_token, type, token_hash, next })
    
    // 处理不同类型的认证回调
    if (access_token && refresh_token) {
      // 方式1: 直接设置会话（适用于邮箱验证）
      const { data, error } = await supabase.auth.setSession({
        access_token: access_token as string,
        refresh_token: refresh_token as string
      })
      
      if (error) {
        throw error
      }
      
      if (data.user) {
        isSuccess.value = true
        console.log('邮箱验证成功:', data.user.email)
        return
      }
    }
    
    if (token_hash && type) {
      // 方式2: 使用token_hash验证（Supabase新版本）
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token_hash as string,
        type: type as any
      })
      
      if (error) {
        throw error
      }
      
      if (data.user) {
        isSuccess.value = true
        console.log('邮箱验证成功:', data.user.email)
        return
      }
    }
    
    // 方式3: 检查当前会话状态（可能已经自动验证）
    const { data: sessionData } = await supabase.auth.getSession()
    if (sessionData.session?.user) {
      isSuccess.value = true
      console.log('用户已登录:', sessionData.session.user.email)
      return
    }
    
    // 如果所有方式都失败，但URL包含认证参数，可能是已经验证过的
    if (access_token || token_hash) {
      // 尝试获取用户信息
      const { data: userData } = await supabase.auth.getUser()
      if (userData.user) {
        isSuccess.value = true
        console.log('用户验证成功:', userData.user.email)
        return
      }
    }
    
    throw new Error('无法验证邮箱，请检查验证链接是否有效')
    
  } catch (error: any) {
    console.error('邮箱验证过程:', error)
    isSuccess.value = false
    errorMessage.value = error.message || '验证过程中发生错误'
  } finally {
    isLoading.value = false
  }
}

// 页面加载时处理验证
onMounted(async () => {
  // 添加延迟，让用户看到加载状态
  await new Promise(resolve => setTimeout(resolve, 1000))
  await handleEmailVerification()
  
  // 如果验证成功，3秒后自动跳转
  if (isSuccess.value) {
    setTimeout(() => {
      navigateTo('/admin')
    }, 3000)
  }
})

// SEO
useHead({
  title: '邮箱验证 - ByteLife',
  meta: [
    { name: 'description', content: '邮箱验证页面' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>