interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

interface UseAdminApiReturn<T> {
  data: Ref<T | null>
  loading: Ref<boolean>
  error: Ref<string | null>
  get: () => Promise<T>
  post: (body: any) => Promise<T>
  patch: (body: any) => Promise<T>
  delete: () => Promise<void>
}

export const useAdminApi = <T = any>(endpoint: string): UseAdminApiReturn<T> => {
  const data = ref<T | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const baseUrl = '/api/admin'
  const fullUrl = `${baseUrl}${endpoint}`

  // GET 请求
  const get = async (): Promise<T> => {
    loading.value = true
    error.value = null
    
    try {
      const response = await $fetch<ApiResponse<T>>(fullUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${useCookie('admin-token').value || ''}`
        }
      })

      if (response.success && response.data) {
        data.value = response.data
        return response.data
      } else {
        throw new Error(response.error || '请求失败')
      }
    } catch (err: any) {
      error.value = err.message || '网络请求失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // POST 请求
  const post = async (body: any): Promise<T> => {
    loading.value = true
    error.value = null
    
    try {
      const response = await $fetch<ApiResponse<T>>(fullUrl, {
        method: 'POST',
        body,
        headers: {
          'Authorization': `Bearer ${useCookie('admin-token').value || ''}`
        }
      })

      if (response.success) {
        if (response.data) {
          return response.data
        }
        return {} as T
      } else {
        throw new Error(response.error || '创建失败')
      }
    } catch (err: any) {
      error.value = err.message || '网络请求失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // PATCH 请求
  const patch = async (body: any): Promise<T> => {
    loading.value = true
    error.value = null
    
    try {
      const response = await $fetch<ApiResponse<T>>(fullUrl, {
        method: 'PATCH',
        body,
        headers: {
          'Authorization': `Bearer ${useCookie('admin-token').value || ''}`
        }
      })

      if (response.success) {
        if (response.data) {
          return response.data
        }
        return {} as T
      } else {
        throw new Error(response.error || '更新失败')
      }
    } catch (err: any) {
      error.value = err.message || '网络请求失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // DELETE 请求
  const deleteRequest = async (): Promise<void> => {
    loading.value = true
    error.value = null
    
    try {
      const response = await $fetch<ApiResponse>(fullUrl, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${useCookie('admin-token').value || ''}`
        }
      })

      if (!response.success) {
        throw new Error(response.error || '删除失败')
      }
    } catch (err: any) {
      error.value = err.message || '网络请求失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    data,
    loading,
    error,
    get,
    post,
    patch,
    delete: deleteRequest
  }
}