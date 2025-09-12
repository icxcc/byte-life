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

    // 从 Supabase 获取文章数据 - 严格按照数据库表结构
    const { data: articles, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase 查询错误:', error)
      throw createError({
        statusCode: 500,
        statusMessage: '获取文章数据失败'
      })
    }

    // 统计数据 - 按照数据库表结构的状态值
    const stats = {
      total: articles.length,
      published: articles.filter((a: any) => a.status === 'published').length,
      draft: articles.filter((a: any) => a.status === 'draft').length,
      archived: articles.filter((a: any) => a.status === 'archived').length,
      featured: articles.filter((a: any) => a.featured).length
    }

    // 严格按照数据库表结构格式化文章数据
    const formattedArticles = articles.map((article: any) => ({
      id: article.id,                                    // UUID
      title: article.title,                              // VARCHAR(500)
      slug: article.slug,                                // VARCHAR(500)
      content: article.content,                          // TEXT
      excerpt: article.excerpt,                          // TEXT
      cover_image: article.cover_image,                  // TEXT
      channel_id: article.channel_id,                    // UUID
      author: article.author,                            // VARCHAR(255)
      status: article.status,                            // VARCHAR(20)
      featured: article.featured,                        // BOOLEAN
      tags: article.tags || [],                          // TEXT[]
      meta_title: article.meta_title,                    // VARCHAR(255)
      meta_description: article.meta_description,        // TEXT
      read_time: article.read_time,                      // INTEGER
      views: article.views,                              // INTEGER
      likes: article.likes,                              // INTEGER
      published_at: article.published_at,                // TIMESTAMP WITH TIME ZONE
      created_at: article.created_at,                    // TIMESTAMP WITH TIME ZONE
      updated_at: article.updated_at                     // TIMESTAMP WITH TIME ZONE
    }))

    return {
      success: true,
      data: {
        articles: formattedArticles,
        stats
      }
    }
  } catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }
    
    console.error('获取文章数据失败:', error)
    throw createError({
      statusCode: 500,
      statusMessage: '获取文章数据失败'
    })
  }
})