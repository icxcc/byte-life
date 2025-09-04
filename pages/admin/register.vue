<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <!-- 装饰性背景 -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full opacity-10 animate-pulse"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-full opacity-10 animate-pulse" style="animation-delay: 2s;"></div>
    </div>

    <UContainer class="relative z-10">
      <div class="max-w-md mx-auto">
        <UCard class="shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <template #header>
            <div class="text-center space-y-4">
              <div class="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <UIcon name="i-heroicons-user-plus" class="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 class="text-3xl font-bold text-gray-900 dark:text-white">
                  管理员注册
                </h2>
                <p class="mt-2 text-gray-600 dark:text-gray-400">
                  创建管理员账户以访问后台管理系统
                </p>
              </div>
            </div>
          </template>

          <UForm :state="registerForm" @submit="handleRegister" class="space-y-5 w-full">
            <!-- 表单输入区域 -->
            <div class="space-y-4 w-full">
              <UFormGroup label="邮箱地址" name="email" required class="w-full">
                <UInput
                  v-model="registerForm.email"
                  type="email"
                  placeholder="请输入邮箱地址"
                  icon="i-heroicons-envelope"
                  size="lg"
                  :disabled="loading"
                  class="h-11 w-full"
                />
              </UFormGroup>

              <UFormGroup label="密码" name="password" required class="w-full">
                <UInput
                  v-model="registerForm.password"
                  type="password"
                  placeholder="请输入密码（至少6位）"
                  icon="i-heroicons-lock-closed"
                  size="lg"
                  :disabled="loading"
                  class="h-11 w-full"
                />
              </UFormGroup>

              <UFormGroup label="确认密码" name="confirmPassword" required class="w-full">
                <UInput
                  v-model="registerForm.confirmPassword"
                  type="password"
                  placeholder="请再次输入密码"
                  icon="i-heroicons-lock-closed"
                  size="lg"
                  :disabled="loading"
                  :color="passwordsMatch ? 'primary' : 'error'"
                  class="h-11 w-full"
                />
                <template #hint>
                  <div class="mt-2 min-h-[20px]">
                    <span v-if="registerForm.confirmPassword && !passwordsMatch" class="text-red-500 text-sm">
                      两次输入的密码不一致
                    </span>
                    <span v-else-if="registerForm.password && registerForm.password.length < 6" class="text-red-500 text-sm">
                      密码长度至少为6位
                    </span>
                  </div>
                </template>
              </UFormGroup>
            </div>

            <!-- 注册按钮 -->
            <div class="pt-2 w-full">
              <UButton
                type="submit"
                color="primary"
                size="lg"
                block
                :loading="loading"
                :disabled="!canSubmit"
                icon="i-heroicons-user-plus"
                class="h-12 text-base font-medium w-full"
              >
                {{ loading ? '注册中...' : '创建账户' }}
              </UButton>
            </div>

            <!-- 提示信息 -->
            <div v-if="message" class="pt-3">
              <UAlert
                :color="success ? 'success' : 'error'"
                variant="soft"
                :title="success ? '注册成功' : '注册失败'"
                :description="message"
                :icon="success ? 'i-heroicons-check-circle' : 'i-heroicons-exclamation-triangle'"
              />
            </div>
          </UForm>

          <template #footer>
            <div class="flex items-center justify-center pt-2">
              <!-- 登录链接 -->
              <div class="text-sm text-gray-600 dark:text-gray-400">
                已有账户？
                <UButton
                  to="/admin"
                  variant="ghost"
                  color="primary"
                  size="sm"
                  :padded="false"
                  class="text-sm hover:underline ml-1"
                >
                  立即登录
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
import { supabase } from '~/lib/supabase'

definePageMeta({
  layout: false
})

const registerForm = ref({
  email: '',
  password: '',
  confirmPassword: ''
})

const loading = ref(false)
const message = ref('')
const success = ref(false)

// 计算属性
const passwordsMatch = computed(() => {
  if (!registerForm.value.confirmPassword) return true
  return registerForm.value.password === registerForm.value.confirmPassword
})

const canSubmit = computed(() => {
  return registerForm.value.email && 
         registerForm.value.password.length >= 6 && 
         passwordsMatch.value && 
         !loading.value
})

const handleRegister = async () => {
  if (!canSubmit.value) return

  loading.value = true
  message.value = ''
  success.value = false

  try {
    // 使用 Supabase Authentication 注册
    const { data, error } = await supabase.auth.signUp({
      email: registerForm.value.email,
      password: registerForm.value.password,
      options: {
        data: {
          role: 'admin' // 设置用户角色为管理员
        }
      }
    })

    if (error) {
      throw error
    }

    if (data.user) {
      success.value = true
      message.value = '注册成功！请检查您的邮箱以验证账户，然后返回登录。'
      
      // 清空表单
      registerForm.value = {
        email: '',
        password: '',
        confirmPassword: ''
      }
      
      // 3秒后跳转到登录页面
      setTimeout(() => {
        navigateTo('/admin')
      }, 3000)
    }
  } catch (error: any) {
    success.value = false
    const errorMessages: Record<string, string> = {
      'User already registered': '该邮箱已被注册',
      'Invalid email': '邮箱格式不正确',
      'Password should be at least 6 characters': '密码长度至少为6位',
      'Signup is disabled': '注册功能已禁用'
    }
    message.value = errorMessages[error.message] || error.message || '注册失败，请重试'
    console.error('注册失败:', error)
  } finally {
    loading.value = false
  }
}

useHead({
  title: '管理员注册 - ByteLife'
})
</script>
