import type { Channel } from '~/types'

export const useChannels = () => {
  const { data: channels, loading, error, get: fetchChannels } = useAdminApi<Channel[]>('/content/channels')
  
  // 统计数据 - 添加安全检查和类型检查
  const stats = computed(() => {
    const channelData = channels.value
    // 检查数据是否存在且是数组
    let channelList = []
    if (Array.isArray(channelData)) {
      channelList = channelData
    }
    
    return {
      total: channelList.length,
      active: channelList.filter(c => c.is_active).length,
      inactive: channelList.filter(c => !c.is_active).length,
      children: channelList.filter(c => c.parent_id).length
    }
  })

  const createChannel = async (channelData: Omit<Channel, 'id' | 'created_at' | 'updated_at'>) => {
    const { post } = useAdminApi('/content/channels')
    await post(channelData)
    await fetchChannels()
  }

  const updateChannel = async (id: number, channelData: Partial<Channel>) => {
    const { patch } = useAdminApi(`/content/channels/${id}`)
    await patch(channelData)
    await fetchChannels()
  }

  const deleteChannel = async (id: number) => {
    const { delete: del } = useAdminApi(`/content/channels/${id}`)
    await del()
    await fetchChannels()
  }

  // 获取标准化的频道列表
  const getChannelList = (): Channel[] => {
    const channelData = channels.value
    if (Array.isArray(channelData)) {
      return channelData
    } else if (channelData && Array.isArray(channelData.channels)) {
      return channelData.channels
    } else if (channelData && Array.isArray(channelData.data)) {
      return channelData.data
    }
    return []
  }

  // 获取父栏目名称
  const getParentName = (parentId: string | undefined): string | null => {
    if (!parentId) return null
    const channelList = getChannelList()
    const parent = channelList.find(channel => channel.id === parentId)
    return parent?.name || null
  }

  // 获取可选的父栏目（排除自己和子栏目）
  const getParentOptions = (excludeId?: string): Channel[] => {
    const channelList = getChannelList()
    return channelList.filter(channel => {
      if (excludeId && channel.id === excludeId) return false
      if (excludeId && channel.parent_id === excludeId) return false
      return true
    })
  }

  // 搜索栏目
  const searchChannels = (query: string): Channel[] => {
    const channelList = getChannelList()
    if (!query.trim()) return channelList
    
    const lowerQuery = query.toLowerCase()
    return channelList.filter(channel =>
      channel.name.toLowerCase().includes(lowerQuery) ||
      channel.slug.toLowerCase().includes(lowerQuery) ||
      (channel.description && channel.description.toLowerCase().includes(lowerQuery))
    )
  }

  return {
    channels,
    loading,
    error,
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
