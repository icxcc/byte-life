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

    // 检查文章是否存在
    const { data: existingArticle, error: fetchError } = await supabase
      .from('articles')
      .select('id, title')
      .eq('id', articleId)
      .single()

    if (fetchError || !existingArticle) {
      throw createError({
        statusCode: 404,
        statusMessage: '文章不存在'
      })
    }

    // 删除文章
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', articleId)

    if (error) {
      console.error('Supabase 删除错误:', error)
      throw createError({
        statusCode: 500,
        statusMessage: '删除文章失败'
      })
    }

    return {
      success: true,
      message: '文章删除成功'
    }
  } catch (error: any) {
    console.error('删除文章失败:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || '服务器内部错误'
    })
  }
})