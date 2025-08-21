import { supabase } from '~/lib/supabase'

export default defineEventHandler(async (event) => {
  try {
    // 从 Supabase 获取已发布的项目数据
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
      image: project.image || '/images/projects/default.jpg',
      featured: project.featured,
      createdAt: project.created_at,
      updatedAt: project.updated_at
    }))

    return {
      success: true,
      data: formattedProjects
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