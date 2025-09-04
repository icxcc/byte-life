<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <!-- 装饰性背景 -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-10 animate-pulse"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-rose-400 to-orange-400 rounded-full opacity-10 animate-pulse" style="animation-delay: 2s;"></div>
    </div>

    <UContainer class="relative z-10">
      <div class="max-w-md mx-auto">
        <UCard class="shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <template #header>
            <div class="text-center space-y-4">
              <div class="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                <UIcon name="i-heroicons-lock-closed" class="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 class="text-3xl font-bold text-gray-900 dark:text-white">
                  重置密码
                </h2>
                <p class="mt-2 text-gray-600 dark:text-gray-400">
                  请设置您的新密码
                </p>
              </div>
            </div>
          </template>

          <UForm v-if="!resetComplete" :state="{ password, confirmPassword }" @submit="handleUpdatePassword" class="space-y-6">
            <!-- 表单输入区域 -->
            <div class="space-y-5">
              <UFormGroup label="新密码" name="password" required>
                <UInput
                  v-model="password"
                  type="password"
                  placeholder="请输入新密码（至少6位）"
                  icon="i-heroicons-lock-closed"
                  size="lg"
                  :disabled="loading"
                />
              </UFormGroup>

              <UFormGroup label="确认密码" name="confirmPassword" required>
                <UInput
                  v-model="confirmPassword"
                  type="password"
                  placeholder="请再次输入新密码"
                  icon="i-heroicons-lock-closed"
                  size="lg"
                  :disabled="loading"
                  :color="passwordsMatch ? 'primary' : 'error'"
                />
                <template #hint>
                  <div class="mt-2 min-h-[20px]">
                    <span v-if="confirmPassword && !passwordsMatch" class="text-red-500 text-sm">
                      两次输入的密码不一致
                    </span>
                    <span v-else-if="password && password.length < 6" class="text-red-500 text-sm">
                      密码长度至少为6位
                    </span>
                  </div>
                </template>
              </UFormGroup>
            </div>

            <!-- 更新按钮 -->
            <div class="pt-4">
              <UButton
                type="submit"
                color="primary"
                size="lg"
                block
                :loading="loading"
                :disabled="!canSubmit"
                icon="i-heroicons-check"
                class="h-12 text-base font-medium"
              >
                {{ loading ? '更新中...' : '更新密码' }}
              </UButton>
            </div>

            <!-- 错误提示 -->
            <UAlert
              v-if="message && !success"
              color="error"
              variant="soft"
              title="更新失败"
              :description="message"
              icon="i-heroicons-exclamation-triangle"
              class="mt-4"
            />
          </UForm>

          <!-- 成功状态 -->
          <div v-else class="text-center space-y-6">
            <UAlert
              color="success"
              variant="soft"
              title="密码重置成功"
              description="您的密码已成功重置，现在可以使用新密码登录了"
              icon="i-heroicons-check-circle"
            />
            
            <div class="pt-4">
              <UButton
                to="/admin"
                color="primary"
                size="lg"
                block
                icon="i-heroicons-arrow-right-on-rectangle"
                class="h-12 text-base font-medium"
              >
                返回登录
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

const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const message = ref('')
const success = ref(false)
const resetComplete = ref(false)

// 计算属性
const passwordsMatch = computed(() => {
  if (!confirmPassword.value) return true
  return password.value === confirmPassword.value
})

const canSubmit = computed(() => {
  return password.value.length >= 6 && 
         passwordsMatch.value && 
         !loading.value
})

// 监听认证状态变化，处理密码重置
onMounted(() => {
  supabase.auth.onAuthStateChange(async (event: any, session: any) => {
    if (event === 'PASSWORD_RECOVERY') {
      // 用户点击了密码重置链接
      console.log('密码重置流程已启动')
    }
  })
})

const handleUpdatePassword = async () => {
  if (password.value !== confirmPassword.value) {
    message.value = '两次输入的密码不一致'
    success.value = false
    return
  }

  if (password.value.length < 6) {
    message.value = '密码长度至少为6位'
    success.value = false
    return
  }

  loading.value = true
  message.value = ''
  success.value = false

  try {
    const { data, error } = await supabase.auth.updateUser({
      password: password.value
    })

    if (error) {
      success.value = false
      message.value = error.message
    } else {
      success.value = true
      message.value = '密码已成功重置'
      resetComplete.value = true
      
      // 清空表单
      password.value = ''
      confirmPassword.value = ''
    }
  } catch (error: any) {
    success.value = false
    message.value = error.message || '重置密码失败，请重试'
  } finally {
    loading.value = false
  }
}

useHead({
  title: '重置密码 - ByteLife'
})
</script>