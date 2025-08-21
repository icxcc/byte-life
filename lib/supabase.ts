import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://feayjzwdcrycwqgsepuy.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlYXlqendkY3J5Y3dxZ3NlcHV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2Nzc0MjcsImV4cCI6MjA3MTI1MzQyN30.u95db2_JaPcIZwUu488q130LckazEOYF3jYTWldHaW8'

// 使用 Symbol 作为全局存储的 key，避免命名冲突
const SUPABASE_CLIENT_KEY = Symbol.for('supabase.client')
const SUPABASE_ADMIN_KEY = Symbol.for('supabase.admin')

// 扩展全局对象类型
declare global {
  var __supabaseClient: any
  var __supabaseAdmin: any
}

// 获取或创建 Supabase 客户端实例
function getSupabaseClient() {
  if (!globalThis.__supabaseClient) {
    globalThis.__supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: typeof window !== 'undefined',
        autoRefreshToken: typeof window !== 'undefined',
        detectSessionInUrl: typeof window !== 'undefined'
      }
    })
  }
  return globalThis.__supabaseClient
}

// 获取或创建 Supabase 管理员客户端实例
function getSupabaseAdminClient() {
  if (!globalThis.__supabaseAdmin) {
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey
    globalThis.__supabaseAdmin = createClient(supabaseUrl, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  }
  return globalThis.__supabaseAdmin
}

// 导出单例实例
export const supabase = getSupabaseClient()
export const supabaseAdmin = getSupabaseAdminClient()

// 数据库表类型定义
export interface Contact {
  id?: number
  name: string
  email: string
  message: string
  read?: boolean
  created_at?: string
  ip_address?: string
  user_agent?: string
}

export interface Project {
  id?: number
  title: string
  description: string
  tech: string[]
  status: string
  category: string
  github?: string
  demo?: string
  image?: string
  featured?: boolean
  created_at?: string
  updated_at?: string
}

export interface BlogPost {
  id?: number
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  status: string
  featured?: boolean
  read_time?: number
  views?: number
  likes?: number
  author: string
  published_at?: string
  created_at?: string
  updated_at?: string
}

export interface AdminUser {
  id?: number
  username: string
  email: string
  role: string
  created_at?: string
  last_login?: string
}