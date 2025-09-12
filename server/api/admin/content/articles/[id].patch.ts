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

    // 获取文章 ID
    const articleId = getRouterParam(event, 'id')
    if (!articleId) {
      throw createError({
        statusCode: 400,
        statusMessage: '文章 ID 不能为空'
      })
    }

    // 获取请求体数据
    const body = await readBody(event)
    const {
      title,
      slug,
      content,
      excerpt,
      coverImage,
      category,
      tags,
      published,
      featured
    } = body

    // 检查文章是否存在
    const { data: existingArticle, error: fetchError } = await supabase
      .from('articles')
      .select('id, slug')
      .eq('id', articleId)
      .single()

    if (fetchError || !existingArticle) {
      throw createError({
        statusCode: 404,
        statusMessage: '文章不存在'
      })
    }

    // 如果slug发生变化，检查新slug是否已存在
    if (slug && slug !== existingArticle.slug) {
      const { data: slugExists } = await supabase
        .from('articles')
        .select('id')
        .eq('slug', slug)
        .neq('id', articleId)
        .single()

      if (slugExists) {
        throw createError({
          statusCode: 400,
          statusMessage: 'URL别名已存在，请使用其他别名'
        })
      }
    }

    // 准备更新数据
    const updateData: any = {}
    if (title) updateData.title = title
    if (slug) updateData.slug = slug
    if (content) updateData.content = content
    if (excerpt !== undefined) updateData.excerpt = excerpt || content?.substring(0, 200) + '...'
    if (coverImage !== undefined) updateData.cover_image = coverImage || null
    if (category !== undefined) updateData.category = category || null
    if (tags !== undefined) {
      updateData.tags = Array.isArray(tags) ? tags : (tags ? tags.split(',').map((t: string) => t.trim()) : [])
    }
    if (published !== undefined) {
      updateData.status = published ? '已发布' : '草稿'
      updateData.published_at = published ? new Date().toISOString() : null
    }
    if (featured !== undefined) updateData.featured = featured
    if (content) updateData.read_time = Math.ceil(content.length / 200)

    // 更新文章
    const { data: article, error } = await supabase
      .from('articles')
      .update(updateData)
      .eq('id', articleId)
      .select()
      .single()

    if (error) {
      console.error('Supabase 更新错误:', error)
      throw createError({
        statusCode: 500,
        statusMessage: '更新文章失败'
      })
    }

    return {
      success: true,
      data: {
        article: {
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
        }
      },
      message: '文章更新成功'
    }
  } catch (error: any) {
    console.error('更新文章失败:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || '服务器内部错误'
    })
  }
})