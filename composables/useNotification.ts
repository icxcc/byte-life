export interface NotificationOptions {
  title?: string
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

export const useNotification = () => {
  const notifications = ref<Array<NotificationOptions & { id: string }>>([])

  const show = (options: NotificationOptions) => {
    const id = Date.now().toString()
    const notification = {
      id,
      type: 'info' as const,
      duration: 3000,
      ...options
    }
    
    notifications.value.push(notification)
    
    // 自动移除通知
    setTimeout(() => {
      remove(id)
    }, notification.duration)
    
    return id
  }

  const remove = (id: string) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  const success = (message: string, title?: string) => {
    return show({ message, title, type: 'success' })
  }

  const error = (message: string, title?: string) => {
    return show({ message, title, type: 'error', duration: 5000 })
  }

  const warning = (message: string, title?: string) => {
    return show({ message, title, type: 'warning' })
  }

  const info = (message: string, title?: string) => {
    return show({ message, title, type: 'info' })
  }

  return {
    notifications: readonly(notifications),
    show,
    remove,
    success,
    error,
    warning,
    info
  }
}