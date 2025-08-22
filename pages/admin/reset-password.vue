<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
    <div class="max-w-md w-full space-y-8 p-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          重置密码
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          请设置您的新密码
        </p>
      </div>
      
      <form v-if="!resetComplete" class="mt-8 space-y-6" @submit.prevent="handleUpdatePassword">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="password" class="sr-only">新密码</label>
            <input
              id="password"
              v-model="password"
              name="password"
              type="password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              placeholder="新密码"
              minlength="6"
            >
          </div>
          <div>
            <label for="confirmPassword" class="sr-only">确认密码</label>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              placeholder="确认密码"
              minlength="6"
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
            :disabled="loading || password !== confirmPassword || password.length < 6"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <span v-if="loading">更新中...</span>
            <span v-else>更新密码</span>
          </button>
        </div>
      </form>

      <div v-else class="text-center space-y-6">
        <div class="text-green-600 font-medium">
          密码已成功重置！
        </div>
        <div>
          <NuxtLink 
            to="/admin" 
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            返回登录
          </NuxtLink>
        </div>
      </div>
    </div>
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

// 监听认证状态变化，处理密码重置
onMounted(() => {
  supabase.auth.onAuthStateChange(async (event, session) => {
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