import { supabase, supabaseAdmin } from '~/lib/supabase'

export default defineEventHandler(async (event) => {
  try {
    // 验证认证
    const authHeader = getHeader(event, 'authorization')
    if (!authHeader) {
      throw createError({
        statusCode: 401,
        statusMessage: '未授权访问'
      })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    
    if (authError || !user) {
      throw createError({
        statusCode: 401,
        statusMessage: '认证失败'
      })
    }

    // 获取栏目ID
    const channelId = getRouterParam(event, 'id')
    if (!channelId) {
      throw createError({
        statusCode: 400,
        statusMessage: '栏目ID不能为空'
      })
    }

    // 检查是否有子栏目
    const { data: children, error: childrenError } = await supabase
      .from('channels')
      .select('id')
      .eq('parent_id', channelId)

    if (childrenError) {
      throw createError({
        statusCode: 500,
        statusMessage: '检查子栏目失败'
      })
    }

    if (children && children.length > 0) {
      throw createError({
        statusCode: 400,
        statusMessage: '该栏目下还有子栏目，无法删除'
      })
    }

    // 删除栏目
    const { error } = await supabase
      .from('channels')
      .delete()
      .eq('id', channelId)

    if (error) {
      console.error('删除栏目失败:', error)
      throw createError({
        statusCode: 500,
        statusMessage: '删除栏目失败'
      })
    }

    return {
      success: true,
      message: '栏目删除成功'
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('删除栏目失败:', error)
    throw createError({
      statusCode: 500,
      statusMessage: '删除栏目失败'
    })
  }
})