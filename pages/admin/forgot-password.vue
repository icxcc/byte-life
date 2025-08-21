<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
    <div class="max-w-md w-full space-y-8 p-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          找回密码
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          请输入您的邮箱，我们将发送重置密码链接
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleResetPassword">
        <div class="rounded-md shadow-sm">
          <div>
            <label for="email" class="sr-only">邮箱</label>
            <input
              id="email"
              v-model="email"
              name="email"
              type="email"
              required
              class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              placeholder="邮箱地址"
            >
          </div>
        </div>

        <div v-if="message" :class="[
          'text-sm text-center',
          success ? 'text-green-600' : 'text-red-600'
        ]">
          {{ message }}
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <span v-if="loading">发送中...</span>
            <span v-else>发送重置链接</span>
          </button>
        </div>
        
        <div class="text-center">
          <NuxtLink to="/admin" class="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
            返回登录
          </NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { supabase } from '~/lib/supabase'

definePageMeta({
  layout: false
})

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
