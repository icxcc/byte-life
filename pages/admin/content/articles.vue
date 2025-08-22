<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">文章管理</h1>
      <UiButton @click="openArticleEditor()" class="bg-blue-600 hover:bg-blue-700 text-white">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        新建文章
      </UiButton>
    </div>

    <!-- 文章列表 -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <div v-if="blogLoading" class="text-center py-4">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p class="mt-2 text-gray-600 dark:text-gray-400">加载中...</p>
        </div>
        
        <div v-else-if="!articles?.articles?.length" class="text-center py-8">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">暂无文章</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">开始创建您的第一篇文章吧</p>
        </div>

        <div v-else class="space-y-4">
          <div v-for="article in articles?.articles" :key="article.id" 
               class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">{{ article.title }}</h3>
                <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">{{ article.excerpt }}</p>
                <div class="mt-2 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <span>{{ formatDate(article.createdAt) }}</span>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        :class="article.status === '已发布' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'">
                    {{ article.status }}
                  </span>
                </div>
              </div>
              <div class="flex space-x-2 ml-4">
                <UiButton @click="openArticleEditor(article)" variant="outline" size="sm">
                  编辑
                </UiButton>
                <UiButton @click="deleteArticle(article.id)" variant="outline" size="sm" class="text-red-600 hover:text-red-700">
                  删除
                </UiButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 文章编辑器模态框 -->
    <UiModal 
      v-model="showArticleEditor"
      title="文章编辑器"
      size="xl"
    >
      <AdminArticleEditor 
        :article="currentArticle" 
        @save="saveArticle" 
        @close="closeArticleEditor" 
      />
    </UiModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})

// 响应式数据
const { data: articles, loading: blogLoading, get: loadBlog } = useAdminApi<any[]>('/content/articles')
const showArticleEditor = ref(false)
const currentArticle = ref(null)

// 格式化日期
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

// 打开文章编辑器
const openArticleEditor = (article = null) => {
  currentArticle.value = article
  showArticleEditor.value = true
}

// 关闭文章编辑器
const closeArticleEditor = () => {
  showArticleEditor.value = false
  currentArticle.value = null
}

// 保存文章
const saveArticle = async () => {
  try {
    if (currentArticle.value?.id) {
      // 更新文章
      const { patch } = useAdminApi(`/content/articles/${currentArticle.value.id}`)
      await patch(currentArticle.value)
    } else {
      // 创建文章
      const { post } = useAdminApi('/content/articles')
      await post(currentArticle.value)
    }

    closeArticleEditor()
    await loadBlog()
  } catch (error) {
    console.error('保存文章失败:', error)
  }
}

// 删除文章
const deleteArticle = async (articleId: string) => {
  if (!confirm('确定要删除这篇文章吗？')) return
  
  try {
    const { delete: del } = useAdminApi(`/content/articles/${articleId}`)
    await del()
    await loadBlog()
  } catch (error) {
    console.error('删除文章失败:', error)
  }
}

// 页面加载时获取数据
onMounted(async () => {
  try {
    await loadBlog()
    console.log('文章数据:', articles.value)
  } catch (error) {
    console.error('加载文章失败:', error)
  }
})

// 监听数据变化
watch(articles, (newArticles) => {
  console.log('文章数据更新:', newArticles)
}, { immediate: true })
</script>