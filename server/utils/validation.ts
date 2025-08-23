import { z } from 'zod'
import { createError } from 'h3'
import { readBody, getQuery } from 'h3'

/**
 * 验证错误接口
 */
export interface ValidationError {
  field: string
  message: string
  code: string
}

/**
 * 验证结果接口
 */
export interface ValidationResult<T> {
  success: boolean
  data?: T
  errors?: ValidationError[]
  message?: string
}

/**
 * 创建验证错误响应
 */
export function createValidationError(errors: ValidationError[]) {
  return createError({
    statusCode: 422,
    statusMessage: 'Validation Failed',
    data: {
      success: false,
      errors,
      message: '数据验证失败'
    }
  })
}

/**
 * 通用验证函数
 */
export async function validateData<T>(
  data: any,
  schema: z.ZodSchema<T>,
  options: {
    stripUnknown?: boolean
    abortEarly?: boolean
  } = {}
): Promise<ValidationResult<T>> {
  try {
    const validatedData = await schema.parseAsync(data, {
      stripUnknown: options.stripUnknown ?? true,
      abortEarly: options.abortEarly ?? false
    })
    
    return {
      success: true,
      data: validatedData
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: ValidationError[] = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
        code: 'VALIDATION_ERROR'
      }))
      
      return {
        success: false,
        errors,
        message: '数据验证失败'
      }
    }
    
    throw error
  }
}

/**
 * 从请求体中验证数据
 */
export async function validateBody<T>(
  event: any,
  schema: z.ZodSchema<T>,
  options?: {
    stripUnknown?: boolean
    abortEarly?: boolean
  }
): Promise<T> {
  const body = await readBody(event)
  const result = await validateData(body, schema, options)
  
  if (!result.success) {
    throw createValidationError(result.errors!)
  }
  
  return result.data!
}

/**
 * 从查询参数中验证数据
 */
export async function validateQuery<T>(
  event: any,
  schema: z.ZodSchema<T>,
  options?: {
    stripUnknown?: boolean
    abortEarly?: boolean
  }
): Promise<T> {
  const query = getQuery(event)
  const result = await validateData(query, schema, options)
  
  if (!result.success) {
    throw createValidationError(result.errors!)
  }
  
  return result.data!
}

/**
 * 常用验证规则
 */

export const commonValidators = {
  // 字符串验证
  string: (message?: string) => 
    z.string({ 
      required_error: message || '字段不能为空',
      invalid_type_error: message || '必须是字符串'
    }),
  
  // 数字验证
  number: (message?: string) => 
    z.number({ 
      required_error: message || '字段不能为空',
      invalid_type_error: message || '必须是数字'
    }),
  
  // 邮箱验证
  email: (message?: string) => 
    z.string().email(message || '邮箱格式不正确'),
  
  // 手机号验证（中国）
  phone: (message?: string) => 
    z.string().regex(/^1[3-9]\d{9}$/, message || '手机号格式不正确'),
  
  // URL验证
  url: (message?: string) => 
    z.string().url(message || 'URL格式不正确'),
  
  // 密码验证（至少8位，包含字母和数字）
  password: (message?: string) =>
    z.string().min(8, '密码至少8位').regex(/^(?=.*[A-Za-z])(?=.*\d)/, message || '密码必须包含字母和数字'),
  
  // 日期验证
  date: (message?: string) =>
    z.string().datetime(message || '日期格式不正确'),
  
  // 布尔值验证
  boolean: (message?: string) =>
    z.boolean({
      required_error: message || '字段不能为空',
      invalid_type_error: message || '必须是布尔值'
    }),
  
  // 数组验证
  array: (schema: z.ZodSchema<any>, message?: string) =>
    z.array(schema, {
      required_error: message || '字段不能为空',
      invalid_type_error: message || '必须是数组'
    }),
  
  // 可选字段
  optional: <T>(schema: z.ZodSchema<T>) => schema.optional(),
  
  // 可为空字段
  nullable: <T>(schema: z.ZodSchema<T>) => schema.nullable()
}

/**
 * 常用模式定义
 */

export const commonSchemas = {
  // 分页参数
  pagination: z.object({
    page: z.number().int().positive().default(1),
    limit: z.number().int().min(1).max(100).default(10),
    sort: z.string().optional(),
    order: z.enum(['asc', 'desc']).default('desc')
  }),
  
  // 搜索参数
  search: z.object({
    q: z.string().min(1).max(100),
    fields: z.array(z.string()).optional()
  }),
  
  // ID参数
  idParam: z.object({
    id: z.string().uuid('ID格式不正确')
  }),
  
  // 时间范围参数
  dateRange: z.object({
    startDate: z.string().datetime(),
    endDate: z.string().datetime()
  })
}

/**
 * 数据清理函数 - 防止 XSS
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return input
  
  // 基本的 XSS 防护
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

/**
 * 清理对象中的所有字符串字段
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized = { ...obj }
  
  for (const key in sanitized) {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = sanitizeInput(sanitized[key])
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeObject(sanitized[key])
    }
  }
  
  return sanitized
}

/**
 * 验证并清理数据
 */
export async function validateAndSanitize<T>(
  data: any,
  schema: z.ZodSchema<T>
): Promise<T> {
  // 先清理数据
  const sanitizedData = sanitizeObject(data)
  
  // 再验证数据
  const result = await validateData(sanitizedData, schema)
  
  if (!result.success) {
    throw createValidationError(result.errors!)
  }
  
  return result.data!
}

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

export default {
  validateData,
  validateBody,
  validateQuery,
  createValidationError,
  commonValidators,
  commonSchemas,
  sanitizeInput,
  sanitizeObject,
  validateAndSanitize
}