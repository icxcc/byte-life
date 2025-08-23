# 组件 Props 类型验证规范

## 概述
本文档定义了 ByteLife 项目中 Vue 组件 Props 的类型验证最佳实践和统一规范。

## 基础规范

### 1. 接口定义
所有组件 Props 必须使用 TypeScript 接口定义：

```typescript
interface Props {
  // 必需属性
  title: string
  // 可选属性
  description?: string
  // 带默认值的可选属性
  variant?: 'default' | 'outline' | 'elevated'
}
```

### 2. Props 声明
使用 `defineProps` 和接口：

```typescript
const props = defineProps<Props>()
```

### 3. 默认值设置
使用 `withDefaults` 为可选属性设置默认值：

```typescript
const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  description: ''
})
```

## 类型验证模式

### 1. 字符串类型
```typescript
interface Props {
  // 必需字符串
  title: string
  // 可选字符串
  subtitle?: string
  // 带枚举值的字符串
  status?: 'active' | 'inactive' | 'pending'
}
```

### 2. 数字类型
```typescript
interface Props {
  // 必需数字
  count: number
  // 可选数字
  maxItems?: number
  // 带默认值的数字
  delay?: number
}

const props = withDefaults(defineProps<Props>(), {
  delay: 300
})
```

### 3. 布尔类型
```typescript
interface Props {
  // 必需布尔值
  disabled: boolean
  // 可选布尔值
  loading?: boolean
  // 带默认值的布尔值
  expanded?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  expanded: false
})
```

### 4. 数组和对象类型
```typescript
interface Props {
  // 数组类型
  items: string[]
  // 对象数组
  users: Array<{ id: number; name: string }>
  // 复杂对象
  config: {
    theme: 'light' | 'dark'
    locale: string
  }
}
```

### 5. 函数类型
```typescript
interface Props {
  // 事件处理函数
  onClick?: (event: MouseEvent) => void
  // 数据变更回调
  onChange?: (value: string, oldValue: string) => boolean
  // 异步操作回调
  onSave?: (data: FormData) => Promise<void>
}
```

## 现有组件 Props 分析

### 1. LoadingSpinner 组件
```typescript
interface Props {
  text?: string
}
```

**优化建议**: 添加更多控制选项
```typescript
interface Props {
  text?: string
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'secondary' | 'success' | 'danger'
  show?: boolean
}
```

### 2. StatsCard 组件
```typescript
interface Props {
  title: string
  value: string | number
  icon: string
  color?: 'blue' | 'green' | 'red' | 'purple' | 'yellow' | 'indigo'
}
```

**最佳实践示例**: 定义完整，包含枚举值和默认值

### 3. Card 组件
```typescript
interface Props {
  title?: string
  description?: string
  variant?: 'default' | 'outline' | 'elevated'
  size?: 'sm' | 'md' | 'lg'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}
```

**最佳实践示例**: 多枚举类型，良好的默认值设置

### 4. ArticleEditor 组件
```typescript
interface Props {
  article?: Article | null
  isEdit?: boolean
}
```

**复杂类型示例**: 使用自定义接口类型

## 验证规则

### 1. 必需属性验证
- 必需属性不应使用 `?` 可选标记
- 必需属性不应设置默认值
- 模板中应对必需属性进行空值检查

### 2. 可选属性验证
- 可选属性必须使用 `?` 标记
- 应提供合理的默认值
- 使用前应检查属性是否存在

### 3. 枚举类型验证
- 使用字符串字面量联合类型
- 提供完整的枚举值列表
- 设置合理的默认枚举值

### 4. 复杂类型验证
- 为复杂对象定义独立接口
- 使用 TypeScript 泛型提高复用性
- 避免使用 `any` 类型

## 最佳实践

### 1. 接口命名规范
- Props 接口统一命名为 `Props`
- 复杂类型接口使用 PascalCase
- 避免使用泛型名称如 `T`, `U`

### 2. 文档注释
为每个 Props 属性添加注释：

```typescript
interface Props {
  /**
   * 组件标题
   * @default '默认标题'
   */
  title?: string
  
  /**
   * 是否禁用组件
   * @default false
   */
  disabled?: boolean
}
```

### 3. 类型复用
在 `types/index.ts` 中定义共享类型：

```typescript
// 共享类型定义
export type ButtonVariant = 'primary' | 'secondary' | 'outline'
export type Size = 'sm' | 'md' | 'lg'
```

### 4. 运行时验证
对于来自外部数据源的 Props，添加运行时验证：

```typescript
import { isString, isNumber } from '@/utils/validation'

const props = defineProps<Props>()

// 运行时类型检查
if (!isString(props.title)) {
  console.warn('title must be a string')
}
```

## 常见错误

### 1. 缺少类型定义
```typescript
// 错误: 缺少类型定义
const props = defineProps({
  title: String
})

// 正确: 使用接口定义
interface Props {
  title: string
}
const props = defineProps<Props>()
```

### 2. 混合使用新旧语法
```typescript
// 错误: 混合语法
const props = defineProps<Props>({
  title: { type: String, required: true }
})

// 正确: 统一使用新语法
interface Props {
  title: string
}
const props = defineProps<Props>()
```

### 3. 缺少默认值
```typescript
// 错误: 可选属性缺少默认值
interface Props {
  size?: 'sm' | 'md' | 'lg'
}
// 使用时需要手动检查
const actualSize = props.size || 'md'

// 正确: 设置默认值
const props = withDefaults(defineProps<Props>(), {
  size: 'md'
})
```

## 工具函数

在 `utils/validation.ts` 中添加 Props 验证工具：

```typescript
// 验证是否为有效字符串
export const isValidString = (value: unknown): value is string => {
  return typeof value === 'string' && value.trim().length > 0
}

// 验证是否为有效数字
export const isValidNumber = (value: unknown): value is number => {
  return typeof value === 'number' && !isNaN(value)
}

// 验证枚举值
export const isValidEnum = <T extends string>(
  value: unknown, 
  validValues: T[]
): value is T => {
  return typeof value === 'string' && validValues.includes(value as T)
}
```

## 总结

通过遵循这些规范，可以确保：

1. **类型安全**: 所有 Props 都有明确的类型定义
2. **代码可读性**: 清晰的接口定义和文档注释
3. **开发效率**: 智能提示和自动补全
4. **维护性**: 统一的编码风格和模式
5. **运行时安全**: 可选的数据验证机制

所有新组件必须遵循此规范，现有组件应逐步迁移到此规范。