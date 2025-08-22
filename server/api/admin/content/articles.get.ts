import { supabase, supabaseAdmin } from '~/lib/supabase'

export default defineEventHandler(async (event) => {
  try {
    // 验证 Supabase Authentication
    const authHeader = getHeader(event, 'authorization')
    
    if (!authHeader) {
      throw createError({
        statusCode: 401,
        statusMessage: '未授权访问'
      })
    }

    const token = authHeader.replace('Bearer ', '')
    
    // 使用 Supabase 认证验证令牌
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    
    if (authError || !user) {
      throw createError({
        statusCode: 401,
        statusMessage: '认证失败'
      })
    }

    // 从 Supabase 获取文章数据
    const { data: articles, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase 查询错误:', error)
      throw createError({
        statusCode: 500,
        statusMessage: '获取文章数据失败'
      })
    }

    // 统计数据
    const stats = {
      total: articles.length,
      published: articles.filter(a => a.status === '已发布').length,
      draft: articles.filter(a => a.status === '草稿').length,
      featured: articles.filter(a => a.featured).length
    }

    // 格式化文章数据
    const formattedArticles = articles.map(article => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content,
      category: article.category,
      tags: article.tags || [],
      status: article.status,
      featured: article.featured,
      readTime: article.read_time,
      views: article.views,
      likes: article.likes,
      author: article.author,
      publishedAt: article.published_at,
      createdAt: article.created_at,
      updatedAt: article.updated_at
    }))

    return {
      success: true,
      data: {
        articles: formattedArticles,
        stats
      }
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('获取文章数据失败:', error)
    throw createError({
      statusCode: 500,
      statusMessage: '获取文章数据失败'
    })
  }
})
