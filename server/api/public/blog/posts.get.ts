import { supabase } from '~/lib/supabase'

export default defineEventHandler(async (event) => {
  try {
    // 从 Supabase 获取已发布的博客文章
    const { data: articles, error } = await supabase
      .from('articles')
      .select('*')
      .eq('status', '已发布')
      .order('published_at', { ascending: false })

    if (error) {
      console.error('Supabase 查询错误:', error)
      throw createError({
        statusCode: 500,
        statusMessage: '获取博客数据失败'
      })
    }

    // 格式化为 posts 格式供前端使用
    const posts = articles.map((article: any) => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content,
      category: article.category,
      tags: article.tags || [],
      readTime: article.read_time || 5,
      views: article.views || 0,
      likes: article.likes || 0,
      author: article.author,
      publishedAt: article.published_at,
      createdAt: article.created_at,
      coverImage: article.cover_image,
      featured: article.featured
    }))

    return {
      success: true,
      data: posts
    }
  } catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }
    
    console.error('获取博客数据失败:', error)
    throw createError({
      statusCode: 500,
      statusMessage: '获取博客数据失败'
    })
  }
})