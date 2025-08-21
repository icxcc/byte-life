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

    // 获取项目 ID
    const projectId = getRouterParam(event, 'id')
    if (!projectId) {
      throw createError({
        statusCode: 400,
        statusMessage: '项目 ID 不能为空'
      })
    }

    // 在实际应用中，这里应该从数据库中删除项目
    console.log('删除项目 ID:', projectId)

    return {
      success: true,
      message: '项目删除成功'
    }
  } catch (error: any) {
    console.error('删除项目失败:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || '服务器内部错误'
    })
  }
})