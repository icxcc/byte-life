import type { Article, ArticleForm } from '~/types'

export const useArticles = () => {
  const { data: articlesData, loading, error, get: fetchArticles } = useAdminApi<any>('/content/articles')
  
  // 获取标准化的文章列表
  const getArticleList = (): Article[] => {
    if (!articlesData.value) return []
    
    if (Array.isArray(articlesData.value)) {
      return articlesData.value
    } else if (articlesData.value.articles && Array.isArray(articlesData.value.articles)) {
      return articlesData.value.articles
    } else if (articlesData.value.data && Array.isArray(articlesData.value.data)) {
      return articlesData.value.data
    }
    return []
  }

  // 计算属性：文章列表
  const articles = computed(() => getArticleList())

  // 计算属性：统计数据
  const stats = computed(() => {
    const articleList = getArticleList()
    const statsData = articlesData.value?.stats
    
    if (statsData) {
      return statsData
    }
    
    return {
      total: articleList.length,
      published: articleList.filter(a => a.status === 'published').length,
      draft: articleList.filter(a => a.status === 'draft').length,
      featured: articleList.filter(a => a.featured).length
    }
  })

  // 创建文章
  const createArticle = async (articleData: ArticleForm) => {
    const { post } = useAdminApi('/content/articles')
    await post(articleData)
    await fetchArticles()
  }

  // 更新文章
  const updateArticle = async (id: string, articleData: Partial<ArticleForm>) => {
    const { patch } = useAdminApi(`/content/articles/${id}`)
    await patch(articleData)
    await fetchArticles()
  }

  // 删除文章
  const deleteArticle = async (id: string) => {
    const { delete: del } = useAdminApi(`/content/articles/${id}`)
    await del()
    await fetchArticles()
  }

  // 搜索文章
  const searchArticles = (query: string): Article[] => {
    const articleList = getArticleList()
    if (!query.trim()) return articleList
    
    const lowerQuery = query.toLowerCase()
    return articleList.filter(article =>
      article.title.toLowerCase().includes(lowerQuery) ||
      (article.excerpt && article.excerpt.toLowerCase().includes(lowerQuery)) ||
      (article.content && article.content.toLowerCase().includes(lowerQuery)) ||
      (article.tags && article.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
    )
  }

  // 按分类筛选文章
  const filterByCategory = (category: string): Article[] => {
    const articleList = getArticleList()
    if (!category) return articleList
    return articleList.filter(article => article.channel_id === category)
  }

  // 按状态筛选文章
  const filterByStatus = (status: string): Article[] => {
    const articleList = getArticleList()
    if (!status) return articleList
    return articleList.filter(article => article.status === status)
  }

  // 获取推荐文章
  const getFeaturedArticles = (): Article[] => {
    const articleList = getArticleList()
    return articleList.filter(article => article.featured)
  }

  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return {
    articles,
    articlesData,
    loading,
    error,
    stats,
    fetchArticles,
    createArticle,
    updateArticle,
    deleteArticle,
    searchArticles,
    filterByCategory,
    filterByStatus,
    getFeaturedArticles,
    formatDate
  }
}