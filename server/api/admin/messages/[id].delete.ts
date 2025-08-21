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

    const messageId = getRouterParam(event, 'id')

    if (!messageId) {
      throw createError({
        statusCode: 400,
        statusMessage: '消息ID不能为空'
      })
    }

    // 删除消息
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', messageId)

    if (error) {
      console.error('Supabase 删除错误:', error)
      throw createError({
        statusCode: 500,
        statusMessage: '删除消息失败'
      })
    }

    return {
      success: true,
      message: '消息删除成功'
    }
  } catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }
    
    console.error('删除消息失败:', error)
    throw createError({
      statusCode: 500,
      statusMessage: '删除消息失败'
    })
  }
})