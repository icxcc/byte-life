<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">博客管理</h2>
      <button
        @click="openArticleEditor()"
        class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
      >
        写文章
      </button>
    </div>
    
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">文章列表</h3>
      </div>
      <div class="divide-y divide-gray-200 dark:divide-gray-700">
        <div v-for="post in blogPosts" :key="post.id" class="p-6">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-2">
                <h4 class="text-lg font-medium text-gray-900 dark:text-white">{{ post.title }}</h4>
                <span v-if="post.published" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  已发布
                </span>
                <span v-else class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
                  草稿
                </span>
                <span v-if="post.featured" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                  推荐
                </span>
              </div>
              <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">{{ post.excerpt }}</p>
              <div class="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                <span>{{ formatDate(post.createdAt) }}</span>
                <span>{{ post.category }}</span>
                <span>{{ post.readTime }} 分钟阅读</span>
                <span>{{ post.views }} 次浏览</span>
                <span>{{ post.likes }} 个赞</span>
              </div>
            </div>
            <div class="flex space-x-2">
              <button 
                @click="openArticleEditor(post)"
                class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400"
              >
                编辑
              </button>
              <button 
                @click="deleteArticle(post.id)"
                class="text-red-600 hover:text-red-900 dark:text-red-400"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 文章编辑器 -->
    <AdminArticleEditor
      v-if="showArticleEditor"
      :article="currentArticle"
      :is-edit="!!currentArticle"
      @close="closeArticleEditor"
      @save="saveArticle"
    />
  </div>
</template>

<script setup lang="ts">
import { supabase } from '~/lib/supabase'

// 页面元数据
definePageMeta({
  layout: 'admin'
})

// 响应式数据
const blogPosts = ref([])
const showArticleEditor = ref(false)
const currentArticle = ref(null)

// 获取认证令牌
const getAuthToken = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token
}

// 加载博客数据
const loadBlog = async () => {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('未找到认证令牌')
    }

    const response = await $fetch('/api/admin/content/articles', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if (response.success) {
      blogPosts.value = response.data.articles
    }
  } catch (error) {
    console.error('加载博客失败:', error)
  }
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
const saveArticle = async (articleData) => {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('未找到认证令牌')
    }

    if (currentArticle.value) {
      // 更新文章
      await $fetch(`/api/admin/content/articles/${currentArticle.value.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: articleData
      })
    } else {
      // 创建文章
      await $fetch('/api/admin/content/articles', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: articleData
      })
    }

    // 关闭编辑器并重新加载列表
    closeArticleEditor()
    await loadBlog()
  } catch (error) {
    console.error('保存文章失败:', error)
  }
}

// 删除文章
const deleteArticle = async (articleId) => {
  if (!confirm('确定要删除这篇文章吗？')) {
    return
  }

  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('未找到认证令牌')
    }

    await $fetch(`/api/admin/content/articles/${articleId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    // 重新加载文章列表
    await loadBlog()
  } catch (error) {
    console.error('删除文章失败:', error)
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
  loadBlog()
})

// SEO
useHead({
  title: '文章管理 - 管理后台'
})
</script>