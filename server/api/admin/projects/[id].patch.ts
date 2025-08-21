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

    // 获取请求体数据
    const body = await readBody(event)
    const {
      title,
      description,
      projectUrl,
      githubUrl,
      coverImage,
      technologies,
      status,
      featured
    } = body

    // 验证必填字段
    if (!title || !description) {
      throw createError({
        statusCode: 400,
        statusMessage: '项目名称和描述为必填字段'
      })
    }

    // 模拟更新项目
    const updatedProject = {
      id: parseInt(projectId),
      title,
      description,
      projectUrl: projectUrl || '',
      githubUrl: githubUrl || '',
      coverImage: coverImage || '',
      technologies: technologies || [],
      status: status || '进行中',
      featured: featured || false,
      updatedAt: new Date().toISOString()
    }

    // 在实际应用中，这里应该更新数据库中的数据
    console.log('更新项目:', updatedProject)

    return {
      success: true,
      data: {
        project: updatedProject
      },
      message: '项目更新成功'
    }
  } catch (error: any) {
    console.error('更新项目失败:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || '服务器内部错误'
    })
  }
})