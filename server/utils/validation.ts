/**
 * 验证文章数据
 */
export function validateArticleData(data: any) {
  const errors: string[] = []

  if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
    errors.push('标题不能为空')
  }

  if (!data.content || typeof data.content !== 'string' || data.content.trim().length === 0) {
    errors.push('内容不能为空')
  }

  if (data.category && typeof data.category !== 'string') {
    errors.push('分类必须是字符串')
  }

  if (data.tags && !Array.isArray(data.tags)) {
    errors.push('标签必须是数组')
  }

  if (data.status && !['草稿', '已发布'].includes(data.status)) {
    errors.push('状态必须是"草稿"或"已发布"')
  }

  return errors
}

/**
 * 验证项目数据
 */
export function validateProjectData(data: any) {
  const errors: string[] = []

  if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
    errors.push('项目标题不能为空')
  }

  if (!data.description || typeof data.description !== 'string' || data.description.trim().length === 0) {
    errors.push('项目描述不能为空')
  }

  if (data.technologies && !Array.isArray(data.technologies)) {
    errors.push('技术栈必须是数组')
  }

  if (data.status && !['进行中', '已完成', '暂停', '计划中'].includes(data.status)) {
    errors.push('状态必须是"进行中"、"已完成"、"暂停"或"计划中"')
  }

  return errors
}

/**
 * 验证联系表单数据
 */
export function validateContactData(data: any) {
  const errors: string[] = []

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.push('姓名不能为空')
  }

  if (!data.email || typeof data.email !== 'string' || !isValidEmail(data.email)) {
    errors.push('请提供有效的邮箱地址')
  }

  if (!data.message || typeof data.message !== 'string' || data.message.trim().length === 0) {
    errors.push('消息内容不能为空')
  }

  return errors
}

/**
 * 验证邮箱格式
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}