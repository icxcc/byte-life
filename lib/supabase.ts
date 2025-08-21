import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://feayjzwdcrycwqgsepuy.supabase.co'
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlYXlqendkY3J5Y3dxZ3NlcHV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2Nzc0MjcsImV4cCI6MjA3MTI1MzQyN30.u95db2_JaPcIZwUu488q130LckazEOYF3jYTWldHaW8'

// 客户端 Supabase 实例
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 服务端 Supabase 实例（需要 service role key）
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

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