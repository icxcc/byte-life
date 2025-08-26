import type { Channel } from '~/types'

export const usePublicChannels = () => {
  const { data: channels, pending: loading, error, refresh } = useLazyFetch<{
    success: boolean
    data: Channel[]
  }>('/api/public/channels', {
    default: () => ({ success: false, data: [] }),
    server: false
  })

  // 获取栏目列表
  const channelList = computed(() => {
    return channels.value?.data || []
  })

  // 获取顶级栏目（用于导航）
  const topLevelChannels = computed(() => {
    return channelList.value.filter(channel => !channel.parent_id)
  })

  // 获取子栏目
  const getChildChannels = (parentId: string) => {
    return channelList.value.filter(channel => channel.parent_id === parentId)
  }

  // 根据slug查找栏目
  const findChannelBySlug = (slug: string) => {
    return channelList.value.find(channel => channel.slug === slug)
  }

  return {
    channels: channelList,
    topLevelChannels,
    loading,
    error,
    refresh,
    getChildChannels,
    findChannelBySlug
  }
}