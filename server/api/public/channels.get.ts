import { supabase } from '~/lib/supabase'

export default defineEventHandler(async (event) => {
  try {
    // 从 Supabase 获取激活的栏目数据
    const { data: channels, error } = await supabase
      .from('channels')
      .select('id, name, slug, description, sort_order, parent_id')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Supabase 查询错误:', error)
      throw createError({
        statusCode: 500,
        statusMessage: '获取栏目数据失败'
      })
    }

    return {
      success: true,
      data: channels || []
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