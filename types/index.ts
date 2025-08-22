// 基础类型定义
export interface BaseEntity {
  id: string
  created_at: string
  updated_at: string
}

// 栏目类型
export interface Channel extends BaseEntity {
  name: string
  slug: string
  description?: string
  parent_id?: string
  sort_order: number
  is_active: boolean
}

// 栏目表单类型
export interface ChannelForm {
  name: string
  slug: string
  description?: string
  parent_id?: string
  sort_order: number
  is_active: boolean
}

// 文章类型
export interface Article extends BaseEntity {
  title: string
  slug: string
  content?: string
  excerpt?: string
  channel_id?: string
  author_id?: string
  status: 'draft' | 'published' | 'archived'
  featured: boolean
  tags: string[]
  meta_title?: string
  meta_description?: string
  published_at?: string
}

// 文章表单类型
export interface ArticleForm {
  title: string
  slug: string
  content?: string
  excerpt?: string
  channel_id?: string
  status: 'draft' | 'published' | 'archived'
  featured: boolean
  tags: string[]
  meta_title?: string
  meta_description?: string
}

// 联系人类型
export interface Contact extends BaseEntity {
  name: string
  email: string
  message: string
  read: boolean
  ip_address?: string
  user_agent?: string
}

// 管理员用户类型
export interface AdminUser extends BaseEntity {
  username: string
  email: string
  password_hash: string
  role: string
  last_login?: string
}

// API 响应类型
export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
  error?: string
}

// 栏目API响应类型
export interface ChannelApiResponse extends ApiResponse {
  data: {
    channels: Channel[]
    total: number
  }
}

// 文章API响应类型
export interface ArticleApiResponse extends ApiResponse {
  data: {
    articles: Article[]
    total: number
  }
}

// 联系人API响应类型
export interface ContactApiResponse extends ApiResponse {
  data: {
    contacts: Contact[]
    total: number
  }
}

// 文章API响应类型
export interface ArticleApiResponse extends ApiResponse {
  data: {
    articles: Article[]
    total: number
  }
}

// 联系人API响应类型
export interface ContactApiResponse extends ApiResponse {
  data: {
    contacts: Contact[]
    total: number
  }
}

// 统计数据类型
export interface StatsData {
  total: number
  active?: number
  inactive?: number
  children?: number
  published?: number
  draft?: number
  featured?: number
}

// 分页参数类型
export interface PaginationParams {
  page?: number
  limit?: number
  search?: string
  sort?: string
  order?: 'asc' | 'desc'
}

// 表单验证错误类型
export interface ValidationError {
  field: string
  message: string
}

// 通用选项类型
export interface SelectOption {
  label: string
  value: string | number | boolean
  disabled?: boolean
}

// 菜单项类型
export interface MenuItem {
  name: string
  path: string
  icon?: string
  children?: MenuItem[]
  badge?: string | number
}

// 主题类型
export type Theme = 'light' | 'dark' | 'system'

// 状态类型
export type Status = 'loading' | 'success' | 'error' | 'idle'

// 通知类型
export interface NotificationOptions {
  title?: string
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}