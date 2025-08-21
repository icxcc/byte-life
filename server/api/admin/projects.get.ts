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

    // 从 Supabase 获取项目数据
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase 查询错误:', error)
      throw createError({
        statusCode: 500,
        statusMessage: '获取项目数据失败'
      })
    }

    // 统计数据
    const stats = {
      total: projects.length,
      completed: projects.filter(p => p.status === '已完成').length,
      inProgress: projects.filter(p => p.status === '进行中').length,
      featured: projects.filter(p => p.featured).length
    }

    // 格式化项目数据
    const formattedProjects = projects.map(project => ({
      id: project.id,
      title: project.title,
      description: project.description,
      tech: project.tech || [],
      status: project.status,
      category: project.category,
      github: project.github,
      demo: project.demo,
      image: project.image,
      featured: project.featured,
      createdAt: project.created_at,
      updatedAt: project.updated_at
    }))

    return {
      success: true,
      data: {
        projects: formattedProjects,
        stats
      }
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('获取项目数据失败:', error)
    throw createError({
      statusCode: 500,
      statusMessage: '获取项目数据失败'
    })
  }
})