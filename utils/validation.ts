/**
 * 类型验证工具函数
 * 用于运行时类型检查和 Props 验证
 */

/**
 * 验证是否为有效字符串
 * @param value - 要验证的值
 * @returns 是否为非空字符串
 */
export const isValidString = (value: unknown): value is string => {
  return typeof value === 'string' && value.trim().length > 0
}

/**
 * 验证是否为有效数字
 * @param value - 要验证的值
 * @returns 是否为有效数字
 */
export const isValidNumber = (value: unknown): value is number => {
  return typeof value === 'number' && !isNaN(value) && isFinite(value)
}

/**
 * 验证是否为有效布尔值
 * @param value - 要验证的值
 * @returns 是否为布尔值
 */
export const isValidBoolean = (value: unknown): value is boolean => {
  return typeof value === 'boolean'
}

/**
 * 验证是否为有效数组
 * @param value - 要验证的值
 * @param itemValidator - 数组项验证函数（可选）
 * @returns 是否为非空数组
 */
export const isValidArray = <T>(
  value: unknown,
  itemValidator?: (item: unknown) => item is T
): value is T[] => {
  if (!Array.isArray(value) || value.length === 0) {
    return false
  }
  
  if (itemValidator) {
    return value.every(item => itemValidator(item))
  }
  
  return true
}

/**
 * 验证是否为有效对象
 * @param value - 要验证的值
 * @returns 是否为非空对象
 */
export const isValidObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * 验证枚举值
 * @param value - 要验证的值
 * @param validValues - 有效的枚举值数组
 * @returns 是否为有效枚举值
 */
export const isValidEnum = <T extends string>(
  value: unknown,
  validValues: T[]
): value is T => {
  return typeof value === 'string' && validValues.includes(value as T)
}

/**
 * 验证是否为有效日期
 * @param value - 要验证的值
 * @returns 是否为有效日期
 */
export const isValidDate = (value: unknown): value is Date => {
  return value instanceof Date && !isNaN(value.getTime())
}

/**
 * 验证是否为有效电子邮件
 * @param value - 要验证的值
 * @returns 是否为有效电子邮件格式
 */
export const isValidEmail = (value: unknown): value is string => {
  if (!isValidString(value)) return false
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(value)
}

/**
 * 验证是否为有效URL
 * @param value - 要验证的值
 * @returns 是否为有效URL格式
 */
export const isValidUrl = (value: unknown): value is string => {
  if (!isValidString(value)) return false
  
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

/**
 * Props 验证器
 * 用于组件 Props 的运行时验证
 */
export class PropsValidator {
  /**
   * 验证必需属性
   * @param props - 组件 Props 对象
   * @param propName - 属性名称
   * @param validator - 验证函数
   * @throws 如果验证失败则抛出错误
   */
  static validateRequired<T>(
    props: Record<string, unknown>,
    propName: string,
    validator: (value: unknown) => value is T
  ): void {
    if (!(propName in props)) {
      throw new Error(`必需属性 ${propName} 缺失`)
    }
    
    if (!validator(props[propName])) {
      throw new Error(`属性 ${propName} 类型验证失败`)
    }
  }

  /**
   * 验证可选属性
   * @param props - 组件 Props 对象
   * @param propName - 属性名称
   * @param validator - 验证函数
   * @returns 验证后的值或 undefined
   */
  static validateOptional<T>(
    props: Record<string, unknown>,
    propName: string,
    validator: (value: unknown) => value is T
  ): T | undefined {
    if (!(propName in props) || props[propName] === undefined) {
      return undefined
    }
    
    if (!validator(props[propName])) {
      console.warn(`可选属性 ${propName} 类型验证失败，使用默认值`)
      return undefined
    }
    
    return props[propName] as T
  }

  /**
   * 批量验证 Props
   * @param props - 组件 Props 对象
   * @param validations - 验证配置数组
   */
  static validateAll(
    props: Record<string, unknown>,
    validations: Array<{
      name: string
      required?: boolean
      validator: (value: unknown) => boolean
      defaultValue?: unknown
    }>
  ): void {
    for (const validation of validations) {
      if (validation.required) {
        this.validateRequired(props, validation.name, createTypeGuard(validation.validator))
      } else if (validation.name in props) {
        if (!validation.validator(props[validation.name])) {
          console.warn(`属性 ${validation.name} 类型验证失败`)
        }
      }
    }
  }
}

/**
 * 创建类型保护函数
 * 用于创建自定义类型验证器
 */
export const createTypeGuard = <T>(
  validator: (value: unknown) => boolean
): ((value: unknown) => value is T) => {
  return (value: unknown): value is T => validator(value)
}

/**
 * 常用验证器
 */
export const Validators = {
  /** 字符串验证器 */
  string: createTypeGuard<string>(isValidString),
  
  /** 数字验证器 */
  number: createTypeGuard<number>(isValidNumber),
  
  /** 布尔值验证器 */
  boolean: createTypeGuard<boolean>(isValidBoolean),
  
  /** 数组验证器 */
  array: createTypeGuard<unknown[]>(value => Array.isArray(value)),
  
  /** 对象验证器 */
  object: createTypeGuard<Record<string, unknown>>(isValidObject),
  
  /** 枚举验证器工厂 */
  enum: <T extends string>(validValues: T[]) => 
    createTypeGuard<T>(value => isValidEnum(value, validValues)),
  
  /** 电子邮件验证器 */
  email: createTypeGuard<string>(isValidEmail),
  
  /** URL 验证器 */
  url: createTypeGuard<string>(isValidUrl),
  
  /** 日期验证器 */
  date: createTypeGuard<Date>(isValidDate)
}

/**
 * 验证工具函数使用示例：
 * 
 * // 基本类型验证
 * if (isValidString(props.title)) {
 *   // 安全使用 title
 * }
 * 
 * // 使用验证器类
 * PropsValidator.validateRequired(props, 'title', Validators.string)
 * 
 * // 使用类型保护
 * const title = PropsValidator.validateOptional(props, 'subtitle', Validators.string)
 */

export default {
  isValidString,
  isValidNumber,
  isValidBoolean,
  isValidArray,
  isValidObject,
  isValidEnum,
  isValidEmail,
  isValidUrl,
  isValidDate,
  PropsValidator,
  Validators,
  createTypeGuard
}