<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">系统消息</h1>
      <div class="flex space-x-2">
        <Button @click="markAllAsRead" variant="outline" size="sm">
          全部标记为已读
        </Button>
        <Button @click="deleteAllRead" variant="outline" size="sm" class="text-red-600 hover:text-red-700">
          删除已读消息
        </Button>
      </div>
    </div>

    <!-- 消息列表 -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <div v-if="loading" class="text-center py-4">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p class="mt-2 text-gray-600 dark:text-gray-400">加载中...</p>
        </div>
        
        <div v-else-if="!messages?.length" class="text-center py-8">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4 4m0 0l-4-4m4 4V3" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">暂无消息</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">当前没有系统消息</p>
        </div>

        <div v-else class="space-y-4">
          <div v-for="message in messages" :key="message.id" 
               class="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
               :class="{ 'bg-blue-50 dark:bg-blue-900/20': !message.is_read }">
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <div class="flex items-center space-x-2">
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white">{{ message.title }}</h3>
                  <span v-if="!message.is_read" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    未读
                  </span>
                </div>
                <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">{{ message.content }}</p>
                <div class="mt-2 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <span>{{ formatDate(message.created_at) }}</span>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        :class="getTypeClass(message.type)">
                    {{ getTypeLabel(message.type) }}
                  </span>
                </div>
              </div>
              <div class="flex space-x-2 ml-4">
                <Button v-if="!message.is_read" @click="markAsRead(message.id)" variant="outline" size="sm">
                  标记已读
                </Button>
                <Button @click="deleteMessage(message.id)" variant="outline" size="sm" class="text-red-600 hover:text-red-700">
                  删除
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})

// 使用 useApi 获取消息数据
const { data: messages, loading, get: loadMessages } = useAdminApi<any[]>('/system/messages')

// 格式化日期
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 获取消息类型样式
const getTypeClass = (type: string) => {
  const classes = {
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  }
  return classes[type] || classes.info
}

// 获取消息类型标签
const getTypeLabel = (type: string) => {
  const labels = {
    info: '信息',
    warning: '警告',
    error: '错误',
    success: '成功'
  }
  return labels[type] || '信息'
}

// 标记消息为已读
const markAsRead = async (messageId: number) => {
  try {
    const { patch } = useAdminApi(`/system/messages/${messageId}`)
    await patch({ is_read: true })
    await loadMessages()
  } catch (error) {
    console.error('标记消息失败:', error)
  }
}

// 删除消息
const deleteMessage = async (messageId: number) => {
  if (!confirm('确定要删除这条消息吗？')) return
  
  try {
    const { delete: del } = useAdminApi(`/system/messages/${messageId}`)
    await del()
    await loadMessages()
  } catch (error) {
    console.error('删除消息失败:', error)
  }
}

// 全部标记为已读
const markAllAsRead = async () => {
  try {
    const unreadMessages = messages.value?.filter(m => !m.is_read) || []
    await Promise.all(
      unreadMessages.map(message => {
        const { patch } = useAdminApi(`/system/messages/${message.id}`)
        return patch({ is_read: true })
      })
    )
    await loadMessages()
  } catch (error) {
    console.error('批量标记失败:', error)
  }
}

// 删除已读消息
const deleteAllRead = async () => {
  if (!confirm('确定要删除所有已读消息吗？')) return
  
  try {
    const readMessages = messages.value?.filter(m => m.is_read) || []
    await Promise.all(
      readMessages.map(message => {
        const { delete: del } = useAdminApi(`/system/messages/${message.id}`)
        return del()
      })
    )
    await loadMessages()
  } catch (error) {
    console.error('批量删除失败:', error)
  }
}

// 页面加载时获取数据
onMounted(() => {
  loadMessages()
})

// SEO
useHead({
  title: '系统消息 - 管理后台'
})
</script>