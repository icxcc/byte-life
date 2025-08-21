<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white">仪表板概览</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div class="flex items-center">
          <Icon name="heroicons:envelope" class="w-8 h-8 text-blue-500" />
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">未读消息</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ stats.unreadMessages }}</p>
          </div>
        </div>
      </div>
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div class="flex items-center">
          <Icon name="heroicons:folder" class="w-8 h-8 text-green-500" />
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">项目数量</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ stats.projectCount }}</p>
          </div>
        </div>
      </div>
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div class="flex items-center">
          <Icon name="heroicons:document-text" class="w-8 h-8 text-purple-500" />
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">博客文章</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ stats.blogPosts }}</p>
          </div>
        </div>
      </div>
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div class="flex items-center">
          <Icon name="heroicons:eye" class="w-8 h-8 text-orange-500" />
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">今日访问</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ stats.todayVisits }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 最近活动 -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">最近活动</h3>
      <div class="space-y-4">
        <div class="flex items-center space-x-3">
          <div class="flex-shrink-0">
            <Icon name="heroicons:document-plus" class="w-5 h-5 text-green-500" />
          </div>
          <div class="flex-1">
            <p class="text-sm text-gray-900 dark:text-white">创建了新文章</p>
            <p class="text-xs text-gray-500">2 小时前</p>
          </div>
        </div>
        <div class="flex items-center space-x-3">
          <div class="flex-shrink-0">
            <Icon name="heroicons:folder-plus" class="w-5 h-5 text-blue-500" />
          </div>
          <div class="flex-1">
            <p class="text-sm text-gray-900 dark:text-white">添加了新项目</p>
            <p class="text-xs text-gray-500">1 天前</p>
          </div>
        </div>
        <div class="flex items-center space-x-3">
          <div class="flex-shrink-0">
            <Icon name="heroicons:envelope" class="w-5 h-5 text-yellow-500" />
          </div>
          <div class="flex-1">
            <p class="text-sm text-gray-900 dark:text-white">收到新消息</p>
            <p class="text-xs text-gray-500">2 天前</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Stats {
  unreadMessages: number
  projectCount: number
  blogPosts: number
  todayVisits: number
}

defineProps<{
  stats: Stats
}>()

// 页面元数据
definePageMeta({
  layout: 'admin'
})

// SEO
useHead({
  title: '仪表板 - 管理后台'
})
</script>