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
    const body = await readBody(event)
    const { read } = body

    if (!messageId) {
      throw createError({
        statusCode: 400,
        statusMessage: '消息ID不能为空'
      })
    }

    // 更新消息状态
    const { data, error } = await supabase
      .from('contacts')
      .update({ read: read })
      .eq('id', messageId)
      .select()

    if (error) {
      console.error('Supabase 更新错误:', error)
      throw createError({
        statusCode: 500,
        statusMessage: '更新消息状态失败'
      })
    }

    if (!data || data.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: '消息不存在'
      })
    }

    return {
      success: true,
      message: '消息状态更新成功',
      data: data[0]
    }
  } catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }
    
    console.error('更新消息状态失败:', error)
    throw createError({
      statusCode: 500,
      statusMessage: '更新消息状态失败'
    })
  }
})