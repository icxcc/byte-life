<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
    <div class="max-w-md w-full space-y-8 p-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          创建管理员账户
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          设置管理员登录凭据
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="createAdmin">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email" class="sr-only">邮箱</label>
            <input
              id="email"
              v-model="form.email"
              name="email"
              type="email"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              placeholder="管理员邮箱"
            >
          </div>
          <div>
            <label for="password" class="sr-only">密码</label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              placeholder="密码（至少6位）"
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
            <span v-if="loading">创建中...</span>
            <span v-else>创建管理员</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})

const form = ref({
  email: 'admin@bytelife.com',
  password: 'admin123456'
})

const loading = ref(false)
const message = ref('')
const success = ref(false)

const createAdmin = async () => {
  loading.value = true
  message.value = ''
  success.value = false

  try {
    const { post } = useAdminApi('/register')
    const response = await post(form.value)

    if (response.success) {
      success.value = true
      message.value = response.message || '管理员账户创建成功！'
      
      // 如果用户已创建，直接跳转登录
      if (response.user) {
        setTimeout(() => {
          navigateTo('/admin')
        }, 2000)
      } else {
        message.value += ' 请检查邮箱确认后再登录。'
      }
    }
  } catch (error: any) {
    success.value = false
    const errorMessage = error.data?.statusMessage || error.message || '创建失败，请重试'
    
    if (errorMessage.includes('User already registered') || errorMessage.includes('用户已存在')) {
      message.value = '用户已存在，正在跳转到登录页面...'
      setTimeout(() => {
        navigateTo('/admin')
      }, 2000)
    } else {
      message.value = errorMessage
    }
  } finally {
    loading.value = false
  }
}

useHead({
  title: '创建管理员 - ByteLife'
})
</script>