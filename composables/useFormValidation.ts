import { ref, computed, reactive } from 'vue'
import { z } from 'zod'

// 注意：如果仍然报找不到模块“zod”的错误，
// 请确保已通过 `npm install zod` 或 `yarn add zod` 安装了 zod 包，
// 并且 TypeScript 配置文件（tsconfig.json）中正确配置了类型解析路径。

/**
 * 表单验证错误接口
 */
export interface FormValidationError {
  field: string
  message: string
  code: string
}

/**
 * 表单验证结果接口
 */
export interface FormValidationResult {
  isValid: boolean
  errors: FormValidationError[]
  firstError?: FormValidationError
}

/**
 * 表单验证配置
 */
export interface FormValidationConfig<T> {
  schema: z.ZodSchema<T>
  initialValues?: Partial<T>
  validateOnChange?: boolean
  validateOnBlur?: boolean
}

/**
 * 表单验证状态
 */
export interface FormValidationState<T> {
  values: Partial<T>
  errors: FormValidationError[]
  touched: Record<string, boolean>
  isValid: boolean
  isDirty: boolean
  isSubmitting: boolean
}

/**
 * 客户端表单验证组合式函数
 */
export function useFormValidation<T extends Record<string, any>>(
  config: FormValidationConfig<T>
) {
  const {
    schema,
    initialValues = {},
    validateOnChange = true,
    validateOnBlur = true
  } = config

  // 表单状态
  const values = reactive({ ...initialValues }) as Partial<T>
  const errors = ref<FormValidationError[]>([])
  const touched = reactive<Record<string, boolean>>({})
  const isSubmitting = ref(false)

  // 计算属性
  const isValid = computed(() => errors.value.length === 0)
  const isDirty = computed(() => {
    return Object.keys(values).some(key => {
      const initialValue = (initialValues as Partial<T>)[key as keyof T]
      const currentValue = values[key as keyof T]
      return initialValue !== undefined && currentValue !== initialValue
    })
  })

  // 验证单个字段
  const validateField = async (field: string): Promise<FormValidationResult> => {
    try {
      const fieldSchema = schema instanceof z.ZodObject ? schema.pick({ [field]: true } as Record<string, any>) : schema;
      await fieldSchema.parseAsync({ [field]: values[field as keyof T] })
      
      // 移除该字段的错误
      errors.value = errors.value.filter(error => error.field !== field)
      
      return {
        isValid: true,
        errors: []
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: FormValidationError[] = error.issues.map((err: z.core.$ZodIssue) => ({
          field,
          message: err.message,
          code: 'VALIDATION_ERROR'
        }))
        
        // 更新错误列表
        errors.value = [
          ...errors.value.filter(e => e.field !== field),
          ...fieldErrors
        ]
        
        return {
          isValid: false,
          errors: fieldErrors,
          firstError: fieldErrors[0]
        }
      }
      
      throw error
    }
  }

  // 验证整个表单
  const validateForm = async (): Promise<FormValidationResult> => {
    try {
      await schema.parseAsync(values)
      errors.value = []
      
      return {
        isValid: true,
        errors: []
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formErrors: FormValidationError[] = error.issues.map((err: z.core.$ZodIssue) => ({
          field: err.path.join('.'),
          message: err.message,
          code: 'VALIDATION_ERROR'
        }))
        
        errors.value = formErrors
        
        return {
          isValid: false,
          errors: formErrors,
          firstError: formErrors[0]
        }
      }
      
      throw error
    }
  }

  // 字段变更处理器
  const handleFieldChange = (field: string, value: any) => {
    values[field as keyof T] = value
    
    if (validateOnChange && touched[field]) {
      validateField(field)
    }
  }

  // 字段失焦处理器
  const handleFieldBlur = (field: string) => {
    touched[field] = true
    
    if (validateOnBlur) {
      validateField(field)
    }
  }

  // 重置表单
  const resetForm = () => {
    Object.keys(values).forEach(key => {
      const initialValue = (initialValues as Partial<T>)[key as keyof T]
      if (initialValue !== undefined) {
        values[key as keyof T] = initialValue
      }
    })
    errors.value = []
    Object.keys(touched).forEach(key => {
      touched[key] = false
    })
  }

  // 获取字段错误
  const getFieldError = (field: string): FormValidationError | undefined => {
    return errors.value.find(error => error.field === field)
  }

  // 获取字段错误消息
  const getFieldErrorMessage = (field: string): string | undefined => {
    return getFieldError(field)?.message
  }

  // 提交表单
  const submitForm = async (): Promise<{
    success: boolean
    data?: T
    errors?: FormValidationError[]
  }> => {
    isSubmitting.value = true
    
    try {
      // 标记所有字段为已触摸
      Object.keys(values).forEach(key => {
        touched[key] = true
      })
      
      const validationResult = await validateForm()
      
      if (!validationResult.isValid) {
        return {
          success: false,
          errors: validationResult.errors
        }
      }
      
      return {
        success: true,
        data: values as T
      }
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    // 状态
    values,
    errors: errors.value,
    touched,
    isValid,
    isDirty,
    isSubmitting,
    
    // 方法
    validateField,
    validateForm,
    handleFieldChange,
    handleFieldBlur,
    resetForm,
    getFieldError,
    getFieldErrorMessage,
    submitForm,
    
    // 工具函数
    hasErrors: computed(() => errors.value.length > 0),
    firstError: computed(() => errors.value[0])
  }
}

/**
 * 常用验证规则（客户端）
 */
export const clientValidators = {
  required: (message = '此字段为必填项') => 
    z.string().min(1, message),
  
  email: (message = '请输入有效的邮箱地址') =>
    z.string().email(message),
  
  minLength: (min: number, message?: string) =>
    z.string().min(min, message || `至少需要${min}个字符`),
  
  maxLength: (max: number, message?: string) =>
    z.string().max(max, message || `不能超过${max}个字符`),
  
  pattern: (regex: RegExp, message: string) =>
    z.string().regex(regex, message),
  
  number: (message = '请输入有效的数字') =>
    z.coerce.number().or(z.number()).refine(() => true, { message }),
  
  min: (min: number, message?: string) =>
    z.number().min(min, message || `不能小于${min}`),
  
  max: (max: number, message?: string) =>
    z.number().max(max, message || `不能大于${max}`),
  
  url: (message = '请输入有效的URL地址') =>
    z.string().url(message),
  
  phone: (message = '请输入有效的手机号码') =>
    z.string().regex(/^1[3-9]\d{9}$/, message)
}

/**
 * 创建表单验证模式
 */
export function createFormSchema<T>(definitions: {
  [K in keyof T]: z.ZodTypeAny
}): z.ZodObject<{ [K in keyof T]: z.ZodTypeAny }> {
  return z.object(definitions) as z.ZodObject<{ [K in keyof T]: z.ZodTypeAny }>
}

/**
 * 快速验证函数
 */
export async function validateInput(
  value: any,
  schema: z.ZodSchema<any>
): Promise<FormValidationResult> {
  try {
    await schema.parseAsync(value)
    return { isValid: true, errors: [] }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: FormValidationError[] = error.issues.map((err: z.core.$ZodIssue) => ({
        field: err.path.join('.'),
        message: err.message,
        code: 'VALIDATION_ERROR'
      }))
      
      return {
        isValid: false,
        errors,
        firstError: errors[0]
      }
    }
    
    throw error
  }
}


export default useFormValidation