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

    // 获取请求数据
    const body = await readBody(event)
    const { name, slug, description, parent_id, sort_order, is_active } = body

    // 更新栏目
    const { data: channel, error } = await supabase
      .from('channels')
      .update({
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description !== undefined && { description }),
        ...(parent_id !== undefined && { parent_id }),
        ...(sort_order !== undefined && { sort_order }),
        ...(is_active !== undefined && { is_active })
      })
      .eq('id', channelId)
      .select()
      .single()

    if (error) {
      console.error('更新栏目失败:', error)
      throw createError({
        statusCode: 500,
        statusMessage: error.code === '23505' ? '栏目别名已存在' : '更新栏目失败'
      })
    }

    return {
      success: true,
      data: channel
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('更新栏目失败:', error)
    throw createError({
      statusCode: 500,
      statusMessage: '更新栏目失败'
    })
  }
})