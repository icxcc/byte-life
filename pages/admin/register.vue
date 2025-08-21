<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
    <div class="max-w-md w-full space-y-8 p-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          管理员注册
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          创建管理员账户以访问后台管理系统
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email" class="sr-only">邮箱</label>
            <input
              id="email"
              v-model="registerForm.email"
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
              v-model="registerForm.password"
              name="password"
              type="password"
              required
              minlength="6"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              placeholder="密码（至少6位）"
            >
          </div>
          <div>
            <label for="confirmPassword" class="sr-only">确认密码</label>
            <input
              id="confirmPassword"
              v-model="registerForm.confirmPassword"
              name="confirmPassword"
              type="password"
              required
              minlength="6"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              placeholder="确认密码"
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
            :disabled="loading || registerForm.password !== registerForm.confirmPassword || registerForm.password.length < 6"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <span v-if="loading">注册中...</span>
            <span v-else>注册</span>
          </button>
        </div>
        
        <div class="text-center">
          <NuxtLink to="/admin" class="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
            已有账户？返回登录
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

const registerForm = ref({
  email: '',
  password: '',
  confirmPassword: ''
})

const loading = ref(false)
const message = ref('')
const success = ref(false)

const handleRegister = async () => {
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    message.value = '两次输入的密码不一致'
    success.value = false
    return
  }

  if (registerForm.value.password.length < 6) {
    message.value = '密码长度至少为6位'
    success.value = false
    return
  }

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
      message.value = '注册成功！请检查您的邮箱以验证账户。'
      
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
    message.value = error.message || '注册失败，请重试'
    console.error('注册失败:', error)
  } finally {
    loading.value = false
  }
}

useHead({
  title: '管理员注册 - ByteLife'
})
</script>