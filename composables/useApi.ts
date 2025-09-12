import { supabase } from '~/lib/supabase'
import type { ApiResponse } from '~/types'

interface UseApiOptions {
  immediate?: boolean
  onSuccess?: (data: any) => void
  onError?: (error: any) => void
}

export const useApi = <T = any>(url: string, options: UseApiOptions = {}) => {
  const { immediate = false, onSuccess, onError } = options
  
  const data = ref<T | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const getAuthHeaders = async () => {
    const session = await supabase.auth.getSession()
    return {
      'Authorization': `Bearer ${session.data.session?.access_token}`
    }
  }

  const execute = async (fetchOptions: any = {}) => {
    try {
      loading.value = true
      error.value = null
      
      const headers = await getAuthHeaders()
      const response = await $fetch<ApiResponse<T>>(url, {
        ...fetchOptions,
        headers: {
          ...headers,
          ...fetchOptions.headers
        }
      })
      
      if (response.success) {
        data.value = response.data
        onSuccess?.(response.data)
      } else {
        throw new Error((response as any).error || '请求失败')
      }
      
      return response
    } catch (err: any) {
      const errorMessage = err.data?.error || err.message || '请求失败'
      error.value = errorMessage
      onError?.(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const get = () => execute({ method: 'GET' })
  const post = (body: any) => execute({ method: 'POST', body })
  const patch = (body: any) => execute({ method: 'PATCH', body })
  const del = () => execute({ method: 'DELETE' })

  if (immediate) {
    get()
  }

  return {
    data: readonly(data),
    loading: readonly(loading),
    error: readonly(error),
    execute,
    get,
    post,
    patch,
    delete: del,
    refresh: get
  }
}

// 专门用于管理后台的API请求
export const useAdminApi = <T = any>(endpoint: string, options: UseApiOptions = {}) => {
  return useApi<T>(`/api/admin${endpoint}`, options)
}

// 专门用于公开API的请求
export const usePublicApi = <T = any>(endpoint: string, options: UseApiOptions = {}) => {
  return useApi<T>(`/api/public${endpoint}`, options)
}