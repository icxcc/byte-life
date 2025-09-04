<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <!-- 装饰性背景 -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-400 to-amber-400 rounded-full opacity-10 animate-pulse"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full opacity-10 animate-pulse" style="animation-delay: 2s;"></div>
    </div>

    <UContainer class="relative z-10">
      <div class="max-w-md mx-auto">
        <UCard class="shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <template #header>
            <div class="text-center space-y-4">
              <div class="mx-auto w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg">
                <UIcon name="i-heroicons-key" class="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 class="text-3xl font-bold text-gray-900 dark:text-white">
                  找回密码
                </h2>
                <p class="mt-2 text-gray-600 dark:text-gray-400">
                  请输入您的邮箱，我们将发送重置密码链接
                </p>
              </div>
            </div>
          </template>

          <UForm :state="{ email }" @submit="handleResetPassword" class="space-y-8">
            <!-- 表单输入区域 -->
            <div class="space-y-6">
              <UFormGroup label="邮箱地址" name="email" required>
                <UInput
                  v-model="email"
                  type="email"
                  placeholder="请输入注册时使用的邮箱"
                  icon="i-heroicons-envelope"
                  size="lg"
                  :disabled="loading"
                  class="h-12"
                />
              </UFormGroup>
            </div>

            <!-- 发送按钮 -->
            <div class="pt-8">
              <UButton
                type="submit"
                color="primary"
                size="lg"
                block
                :loading="loading"
                :disabled="!email || loading"
                icon="i-heroicons-paper-airplane"
                class="h-14 text-base font-medium"
              >
                {{ loading ? '发送中...' : '发送重置链接' }}
              </UButton>
            </div>

            <!-- 状态提示 -->
            <div class="space-y-4">
              <UAlert
                v-if="message"
                :color="success ? 'success' : 'error'"
                variant="soft"
                :title="success ? '发送成功' : '发送失败'"
                :description="message"
                :icon="success ? 'i-heroicons-check-circle' : 'i-heroicons-exclamation-triangle'"
              />

              <!-- 温馨提示 -->
              <UAlert
                v-if="!message"
                color="info"
                variant="soft"
                title="温馨提示"
                description="重置链接将发送到您的邮箱，请注意查收垃圾邮件文件夹"
                icon="i-heroicons-information-circle"
              />
            </div>
          </UForm>

          <template #footer>
            <div class="text-center space-y-3 pt-2">
              <p class="text-sm text-gray-600 dark:text-gray-400">
                想起密码了？
                <UButton
                  to="/admin"
                  variant="ghost"
                  color="primary"
                  size="sm"
                  :padded="false"
                  class="text-sm hover:underline"
                >
                  返回登录
                </UButton>
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                还没有账号？
                <UButton
                  to="/admin/register"
                  variant="ghost"
                  color="primary"
                  size="sm"
                  :padded="false"
                  class="text-sm hover:underline"
                >
                  立即注册
                </UButton>
              </p>
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

const email = ref('')
const loading = ref(false)
const message = ref('')
const success = ref(false)

const handleResetPassword = async () => {
  loading.value = true
  message.value = ''
  success.value = false

  try {
    // 使用 Supabase Authentication 的密码重置功能
    const { error } = await supabase.auth.resetPasswordForEmail(email.value, {
      redirectTo: `${window.location.origin}/admin/reset-password`
    })

    if (error) {
      throw error
    }

    success.value = true
    message.value = '重置密码链接已发送到您的邮箱，请查收'
  } catch (error: any) {
    success.value = false
    message.value = error.message || '发送重置链接失败，请重试'
    console.error('密码重置错误:', error)
  } finally {
    loading.value = false
  }
}

useHead({
  title: '找回密码 - ByteLife'
})
</script>
