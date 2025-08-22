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

    // 获取请求数据
    const body = await readBody(event)
    const { name, slug, description, parent_id, sort_order, is_active } = body

    // 验证必填字段
    if (!name || !slug) {
      throw createError({
        statusCode: 400,
        statusMessage: '栏目名称和别名不能为空'
      })
    }

    // 创建栏目
    const { data: channel, error } = await supabase
      .from('channels')
      .insert({
        name,
        slug,
        description,
        parent_id: parent_id || null,
        sort_order: sort_order || 0,
        is_active: is_active !== undefined ? is_active : true
      })
      .select()
      .single()

    if (error) {
      console.error('创建栏目失败:', error)
      throw createError({
        statusCode: 500,
        statusMessage: error.code === '23505' ? '栏目别名已存在' : '创建栏目失败'
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
    
    console.error('创建栏目失败:', error)
    throw createError({
      statusCode: 500,
      statusMessage: '创建栏目失败'
    })
  }
})