import type { Channel, ChannelForm, ChannelApiResponse } from '~/types'
import { supabase } from '~/lib/supabase'

export const useChannels = () => {
  
  // 响应式数据
  const channels = ref<Channel[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // 统计数据
  const stats = computed(() => ({
    total: channels.value.length,
    active: channels.value.filter(c => c.is_active).length,
    inactive: channels.value.filter(c => !c.is_active).length,
    children: channels.value.filter(c => c.parent_id).length
  }))

  // 获取栏目列表
  const fetchChannels = async (): Promise<void> => {
    try {
      loading.value = true
      error.value = null
      
      const session = await supabase.auth.getSession()
      const response = await $fetch<ChannelApiResponse>('/api/admin/content/channels', {
        headers: {
          'Authorization': `Bearer ${session.data.session?.access_token}`
        }
      })
      
      channels.value = response.data.channels
    } catch (err) {
      error.value = '获取栏目列表失败'
      console.error('获取栏目失败:', err)
    } finally {
      loading.value = false
    }
  }

  // 创建栏目
  const createChannel = async (channelData: ChannelForm): Promise<void> => {
    const session = await supabase.auth.getSession()
    await $fetch('/api/admin/content/channels', {
      method: 'POST',
      body: channelData,
      headers: {
        'Authorization': `Bearer ${session.data.session?.access_token}`
      }
    })
    
    // 重新获取列表
    await fetchChannels()
  }

  // 更新栏目
  const updateChannel = async (id: string, channelData: ChannelForm): Promise<void> => {
    const session = await supabase.auth.getSession()
    await $fetch(`/api/admin/content/channels/${id}`, {
      method: 'PATCH',
      body: channelData,
      headers: {
        'Authorization': `Bearer ${session.data.session?.access_token}`
      }
    })
    
    // 重新获取列表
    await fetchChannels()
  }

  // 删除栏目
  const deleteChannel = async (id: string): Promise<void> => {
    const session = await supabase.auth.getSession()
    await $fetch(`/api/admin/content/channels/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${session.data.session?.access_token}`
      }
    })
    
    // 重新获取列表
    await fetchChannels()
  }

  // 获取父栏目名称
  const getParentName = (parentId: string | undefined): string | null => {
    if (!parentId) return null
    const parent = channels.value.find(channel => channel.id === parentId)
    return parent?.name || null
  }

  // 获取可选的父栏目（排除自己和子栏目）
  const getParentOptions = (excludeId?: string): Channel[] => {
    return channels.value.filter(channel => {
      if (excludeId && channel.id === excludeId) return false
      if (excludeId && channel.parent_id === excludeId) return false
      return true
    })
  }

  // 搜索栏目
  const searchChannels = (query: string): Channel[] => {
    if (!query.trim()) return channels.value
    
    const lowerQuery = query.toLowerCase()
    return channels.value.filter(channel =>
      channel.name.toLowerCase().includes(lowerQuery) ||
      channel.slug.toLowerCase().includes(lowerQuery) ||
      (channel.description && channel.description.toLowerCase().includes(lowerQuery))
    )
  }

  return {
    channels: readonly(channels),
    loading: readonly(loading),
    error: readonly(error),
    stats,
    fetchChannels,
    createChannel,
    updateChannel,
    deleteChannel,
    getParentName,
    getParentOptions,
    searchChannels
  }
}