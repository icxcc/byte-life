// 使用 Nuxt UI 的 Toast 系统
export const useNotification = () => {
  const toast = useToast()

  const success = (message: string, title?: string) => {
    toast.add({
      title: title || '成功',
      description: message,
      color: 'green',
      icon: 'i-heroicons-check-circle'
    })
  }

  const error = (message: string, title?: string) => {
    toast.add({
      title: title || '错误',
      description: message,
      color: 'red',
      icon: 'i-heroicons-x-circle'
    })
  }

  const warning = (message: string, title?: string) => {
    toast.add({
      title: title || '警告',
      description: message,
      color: 'yellow',
      icon: 'i-heroicons-exclamation-triangle'
    })
  }

  const info = (message: string, title?: string) => {
    toast.add({
      title: title || '信息',
      description: message,
      color: 'blue',
      icon: 'i-heroicons-information-circle'
    })
  }

  return {
    success,
    error,
    warning,
    info,
    // 直接暴露 toast 实例以便更灵活的使用
    toast
  }
}