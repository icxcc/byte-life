import { supabase, supabaseAdmin } from '~/lib/supabase'

export default defineEventHandler(async (event) => {
  try {
    // 验证管理员权限
    const authHeader = getHeader(event, 'authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError({
        statusCode: 401,
        statusMessage: '未授权访问'
      })
    }

    const token = authHeader.substring(7)
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    
    if (authError || !user) {
      throw createError({
        statusCode: 401,
        statusMessage: '认证失败'
      })
    }

    // 获取请求体数据
    const body = await readBody(event)
    console.log('接收到的请求数据:', JSON.stringify(body, null, 2))
    
    // 严格按照数据库表结构解构数据
    const {
      title,
      slug,
      content,
      excerpt,
      cover_image,
      channel_id,
      author,
      status,
      featured,
      tags,
      meta_title,
      meta_description,
      read_time,
      views,
      likes
    } = body

    // 验证必填字段
    if (!title || !slug) {
      console.error('必填字段验证失败:', { title, slug })
      throw createError({
        statusCode: 400,
        statusMessage: '标题和URL别名为必填字段'
      })
    }

    console.log('字段验证通过，开始检查数据库连接...')

    // 检查slug是否已存在
    const { data: existingArticle } = await supabase
      .from('articles')
      .select('id')
      .eq('slug', slug)
      .single()

    if (existingArticle) {
      throw createError({
        statusCode: 400,
        statusMessage: 'URL别名已存在，请使用其他别名'
      })
    }

    // 严格按照数据库表结构创建文章数据
    const articleData = {
      title: title,                                                    // VARCHAR(500) NOT NULL
      slug: slug,                                                      // VARCHAR(500) UNIQUE NOT NULL
      content: content || null,                                        // TEXT
      excerpt: excerpt || null,                                        // TEXT
      cover_image: cover_image || null,                               // TEXT
      channel_id: channel_id || null,                                 // UUID REFERENCES channels(id)
      author: author || user.email || null,                          // VARCHAR(255)
      status: status || 'draft',                                      // VARCHAR(20) DEFAULT 'draft'
      featured: featured || false,                                    // BOOLEAN DEFAULT false
      tags: Array.isArray(tags) ? tags : [],                        // TEXT[] DEFAULT '{}'
      meta_title: meta_title || null,                                // VARCHAR(255)
      meta_description: meta_description || null,                    // TEXT
      read_time: parseInt(read_time) || 0,                          // INTEGER DEFAULT 0
      views: parseInt(views) || 0,                                  // INTEGER DEFAULT 0
      likes: parseInt(likes) || 0,                                  // INTEGER DEFAULT 0
      published_at: status === 'published' ? new Date().toISOString() : null  // TIMESTAMP WITH TIME ZONE
    }

    // 保存到数据库
    console.log('准备插入的文章数据:', JSON.stringify(articleData, null, 2))
    
    const { data: article, error } = await supabase
      .from('articles')
      .insert(articleData)
      .select()
      .single()

    if (error) {
      console.error('Supabase 插入错误:', error)
      console.error('错误详情:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      })
      throw createError({
        statusCode: 500,
        statusMessage: `创建文章失败: ${error.message}`
      })
    }

    console.log('文章创建成功:', article)

    // 严格按照数据库表结构返回数据
    return {
      success: true,
      data: {
        article: {
          id: article.id,
          title: article.title,
          slug: article.slug,
          content: article.content,
          excerpt: article.excerpt,
          cover_image: article.cover_image,
          channel_id: article.channel_id,
          author: article.author,
          status: article.status,
          featured: article.featured,
          tags: article.tags,
          meta_title: article.meta_title,
          meta_description: article.meta_description,
          read_time: article.read_time,
          views: article.views,
          likes: article.likes,
          published_at: article.published_at,
          created_at: article.created_at,
          updated_at: article.updated_at
        }
      },
      message: '文章创建成功'
    }
  } catch (error: any) {
    console.error('创建文章失败:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || '服务器内部错误'
    })
  }
})