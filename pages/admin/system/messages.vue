<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white">消息管理</h2>
    
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">联系消息</h3>
      </div>
      <div class="divide-y divide-gray-200 dark:divide-gray-700">
        <div v-for="message in messages" :key="message.id" class="p-6">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center">
                <h4 class="text-sm font-medium text-gray-900 dark:text-white">{{ message.name }}</h4>
                <span class="ml-2 text-sm text-gray-500">{{ message.email }}</span>
                <span v-if="!message.read" class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                  未读
                </span>
              </div>
              <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">{{ message.message }}</p>
              <p class="mt-1 text-xs text-gray-500">{{ formatDate(message.createdAt) }}</p>
            </div>
            <div class="flex space-x-2">
              <button
                v-if="!message.read"
                @click="markAsRead(message.id)"
                class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                标记已读
              </button>
              <button
                @click="deleteMessage(message.id)"
                class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
              >
                删除
              </button>
            </div>
          </div>
        </div>
        
        <!-- 空状态 -->
        <div v-if="messages.length === 0" class="p-12 text-center">
          <Icon name="heroicons:envelope" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">暂无消息</h3>
          <p class="text-gray-500 dark:text-gray-400">当有用户通过联系表单发送消息时，会在这里显示。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { supabase } from '~/lib/supabase'

// 页面元数据
definePageMeta({
  layout: 'admin'
})

// 响应式数据
const messages = ref([])

// 获取认证令牌
const getAuthToken = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token
}

// 加载消息数据
const loadMessages = async () => {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('未找到认证令牌')
    }

    const response = await $fetch('/api/admin/system/messages', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if (response.success) {
      messages.value = response.data.messages
    }
  } catch (error) {
    console.error('加载消息失败:', error)
  }
}

// 标记消息为已读
const markAsRead = async (messageId: number) => {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('未找到认证令牌')
    }

    await $fetch(`/api/admin/system/messages/${messageId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: { read: true }
    })
    
    const message = messages.value.find((m: any) => m.id === messageId)
    if (message) {
      message.read = true
    }
  } catch (error) {
    console.error('标记已读失败:', error)
  }
}

// 删除消息
const deleteMessage = async (messageId: number) => {
  if (!confirm('确定要删除这条消息吗？')) {
    return
  }

  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('未找到认证令牌')
    }

    await $fetch(`/api/admin/system/messages/${messageId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    const index = messages.value.findIndex((m: any) => m.id === messageId)
    if (index > -1) {
      messages.value.splice(index, 1)
    }
  } catch (error) {
    console.error('删除消息失败:', error)
  }
}

// 格式化日期
const formatDate = (date: string) => {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

// 初始化数据
onMounted(() => {
  loadMessages()
})

// SEO
useHead({
  title: '消息管理 - 管理后台'
})
</script>