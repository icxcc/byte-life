import { supabaseAdmin } from '~/lib/supabase'

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

    // 验证必填字段
    if (!title || !slug || !content) {
      throw createError({
        statusCode: 400,
        statusMessage: '标题、URL别名和内容为必填字段'
      })
    }

    // 模拟创建文章
    const newArticle = {
      id: Date.now(), // 在实际应用中应该由数据库生成
      title,
      slug,
      content,
      excerpt: excerpt || content.substring(0, 200) + '...',
      coverImage: coverImage || '',
      category: category || '',
      tags: tags || '',
      published: published || false,
      featured: featured || false,
      publishedAt: published ? new Date().toISOString() : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      readTime: Math.ceil(content.length / 200), // 简单估算阅读时间
      views: 0,
      likes: 0,
      authorId: user.id
    }

    // 在实际应用中，这里应该将数据保存到数据库
    console.log('创建文章:', newArticle)

    return {
      success: true,
      data: {
        article: newArticle
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