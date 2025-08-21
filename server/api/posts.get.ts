import { supabase } from '~/lib/supabase'

export default defineEventHandler(async (event) => {
  try {
    // 从 Supabase 获取已发布的博客文章
    const { data: posts, error } = await supabase
      .from('blog_posts')
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

    // 格式化博客数据
    const formattedPosts = posts.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      tags: post.tags || [],
      readTime: post.read_time || 5,
      views: post.views || 0,
      likes: post.likes || 0,
      author: post.author,
      publishedAt: post.published_at,
      createdAt: post.created_at
    }))

    return {
      success: true,
      data: formattedPosts
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