import { supabase } from '~/lib/supabase'

export default defineEventHandler(async (event) => {
  try {
    // 验证管理员权限
    const adminToken = getCookie(event, 'admin-token')
    if (!adminToken) {
      throw createError({
        statusCode: 401,
        statusMessage: '未授权访问'
      })
    }

    // 从 Supabase 获取博客数据
    const { data: blogPosts, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase 查询错误:', error)
      throw createError({
        statusCode: 500,
        statusMessage: '获取博客数据失败'
      })
    }

    // 统计数据
    const stats = {
      total: blogPosts.length,
      published: blogPosts.filter(p => p.status === '已发布').length,
      draft: blogPosts.filter(p => p.status === '草稿').length,
      featured: blogPosts.filter(p => p.featured).length,
      totalViews: blogPosts.reduce((sum, post) => sum + (post.views || 0), 0),
      totalLikes: blogPosts.reduce((sum, post) => sum + (post.likes || 0), 0)
    }

    // 格式化博客数据
    const formattedPosts = blogPosts.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      tags: post.tags || [],
      status: post.status,
      featured: post.featured,
      readTime: post.read_time,
      views: post.views || 0,
      likes: post.likes || 0,
      author: post.author,
      publishedAt: post.published_at,
      createdAt: post.created_at,
      updatedAt: post.updated_at
    }))

    return {
      success: true,
      data: {
        posts: formattedPosts,
        stats
      }
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('获取博客数据失败:', error)
    throw createError({
      statusCode: 500,
      statusMessage: '获取博客数据失败'
    })
  }
})