<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">文章管理</h1>
      <UButton @click="openArticleEditor()" color="primary" icon="i-heroicons-plus">
        新建文章
      </UButton>
    </div>

    <!-- 文章列表 -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <div v-if="blogLoading" class="text-center py-4">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p class="mt-2 text-gray-600 dark:text-gray-400">加载中...</p>
        </div>
        
        <div v-else-if="!articles?.length" class="text-center py-8">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">暂无文章</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">开始创建您的第一篇文章吧</p>
        </div>

        <div v-else class="space-y-4">
          <div v-for="article in articles" :key="article.id" 
               class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">{{ article.title }}</h3>
                <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">{{ article.excerpt }}</p>
                <div class="mt-2 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <span>{{ formatDate(article.created_at || article.createdAt) }}</span>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        :class="article.status === 'published' || article.status === '已发布' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'">
                    {{ article.status === 'published' ? '已发布' : article.status === 'draft' ? '草稿' : article.status }}
                  </span>
                </div>
              </div>
              <div class="flex space-x-2 ml-4">
                <UButton @click="openArticleEditor(article)" variant="outline" size="sm">
                  编辑
                </UButton>
                <UButton @click="deleteArticle(article.id)" variant="outline" size="sm" color="red">
                  删除
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 文章编辑器模态框 -->
    <UModal 
      v-model:open="showArticleEditor" 
      :title="currentArticle ? '编辑文章' : '新建文章'"
      class="w-full max-w-6xl"
    >
      <template #body>
        <AdminArticleEditor 
          :article="currentArticle" 
          :is-edit="!!currentArticle"
          @save="saveArticle" 
          @close="closeArticleEditor" 
        />
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})

// 使用文章管理组合式函数
const {
  articles,
  loading: blogLoading,
  stats,
  fetchArticles,
  createArticle,
  updateArticle,
  deleteArticle: deleteArticleApi,
  formatDate
} = useArticles()

const showArticleEditor = ref(false)
const currentArticle = ref(null)

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
const saveArticle = async (articleData: any) => {
  try {
    if (currentArticle.value?.id) {
      // 更新文章
      await updateArticle(currentArticle.value.id, articleData)
    } else {
      // 创建文章
      await createArticle(articleData)
    }

    closeArticleEditor()
  } catch (error) {
    console.error('保存文章失败:', error)
  }
}

// 删除文章
const deleteArticle = async (articleId: string) => {
  if (!confirm('确定要删除这篇文章吗？')) return
  
  try {
    await deleteArticleApi(articleId)
  } catch (error) {
    console.error('删除文章失败:', error)
  }
}

// 页面加载时获取数据
onMounted(async () => {
  try {
    await fetchArticles()
  } catch (error) {
    console.error('加载文章失败:', error)
  }
})
</script>