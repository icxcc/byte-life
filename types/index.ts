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
  parent_id?: string | null
  sort_order: number
  is_active: boolean
}

// 文章类型 - 严格按照数据库表结构 (docs/database-schema.sql)
export interface Article extends BaseEntity {
  title: string                    // VARCHAR(500) NOT NULL
  slug: string                     // VARCHAR(500) UNIQUE NOT NULL
  content?: string                 // TEXT
  excerpt?: string                 // TEXT
  cover_image?: string             // TEXT
  channel_id?: string              // UUID REFERENCES channels(id) ON DELETE SET NULL
  author?: string                  // VARCHAR(255)
  status: 'draft' | 'published' | 'archived'  // VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived'))
  featured: boolean                // BOOLEAN DEFAULT false
  tags: string[]                   // TEXT[] DEFAULT '{}'
  meta_title?: string              // VARCHAR(255)
  meta_description?: string        // TEXT
  read_time: number                // INTEGER DEFAULT 0
  views: number                    // INTEGER DEFAULT 0
  likes: number                    // INTEGER DEFAULT 0
  published_at?: string            // TIMESTAMP WITH TIME ZONE
}

// 文章表单类型 - 严格按照数据库表结构
export interface ArticleForm {
  title: string
  slug: string
  content?: string
  excerpt?: string
  cover_image?: string
  channel_id?: string
  author?: string
  status: 'draft' | 'published' | 'archived'
  featured: boolean
  tags: string[]
  meta_title?: string
  meta_description?: string
  read_time: number
  views: number
  likes: number
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
  statusCode?: number
}

// 分页响应类型
export interface PaginatedResponse<T> extends ApiResponse {
  data: {
    items: T[]
    total: number
    page: number
    limit: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// 统计响应类型
export interface StatsResponse<T> extends ApiResponse {
  data: {
    items: T[]
    stats: {
      total: number
      active: number
      inactive: number
      children: number
      published: number
      draft: number
      featured: number
      [key: string]: number
    }
  }
}

// 单条数据响应类型
export interface SingleResponse<T> extends ApiResponse {
  data: T
}

// 具体API端点响应类型
// 栏目相关响应
export interface ChannelsResponse extends StatsResponse<Channel> {}

export interface ChannelResponse extends SingleResponse<Channel> {}

// 文章相关响应
export interface ArticlesResponse extends StatsResponse<Article> {}

export interface ArticleResponse extends SingleResponse<Article> {}

// 联系人相关响应
export interface ContactsResponse extends StatsResponse<Contact> {}

export interface ContactResponse extends SingleResponse<Contact> {}

// 博客相关响应
export interface BlogPostsResponse extends ApiResponse {
  data: Article[]
}

// 项目相关响应
export interface ProjectsResponse extends ApiResponse {
  data: Project[]
}

// 项目类型
export interface Project extends BaseEntity {
  title: string
  description: string
  tech: string[]
  status: 'active' | 'completed' | 'archived'
  category: string
  github?: string
  demo?: string
  image?: string
  featured: boolean
}

// 错误响应类型
export interface ErrorResponse {
  success: false
  error: string
  statusCode: number
  message?: string
  details?: ValidationError[]
}

// 认证响应类型
export interface AuthResponse extends ApiResponse {
  data: {
    user: AdminUser
    token: string
    expiresIn: number
  }
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