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

    // 从 Supabase 获取栏目数据
    const { data: channels, error } = await supabase
      .from('channels')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Supabase 查询错误:', error)
      throw createError({
        statusCode: 500,
        statusMessage: '获取栏目数据失败'
      })
    }

    // 统计数据
    const stats = {
      total: channels.length,
      active: channels.filter(c => c.is_active).length,
      inactive: channels.filter(c => !c.is_active).length,
      children: channels.filter(c => c.parent_id).length
    }

    return {
      success: true,
      data: {
        channels,
        stats
      }
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('获取栏目数据失败:', error)
    throw createError({
      statusCode: 500,
      statusMessage: '获取栏目数据失败'
    })
  }
})