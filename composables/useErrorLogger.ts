import { ref } from 'vue'

/**
 * 错误日志接口
 */
export interface ErrorLog {
  id: string
  timestamp: Date
  type: 'error' | 'warning' | 'info'
  message: string
  details?: any
  stack?: string
  component?: string
  route?: string
  userAgent?: string
  userId?: string
}

/**
 * 错误日志配置
 */
export interface ErrorLoggerConfig {
  maxLogs: number
  persist: boolean
  consoleOutput: boolean
  serverEndpoint?: string
}

/**
 * 错误日志记录器组合式函数
 */
export function useErrorLogger(config: Partial<ErrorLoggerConfig> = {}) {
  const logs = ref<ErrorLog[]>([])
  
  const defaultConfig: ErrorLoggerConfig = {
    maxLogs: 1000,
    persist: true,
    consoleOutput: true,
    serverEndpoint: '/api/logs/errors'
  }
  
  const mergedConfig = { ...defaultConfig, ...config }
  
  // 从本地存储加载日志（如果启用持久化）
  if (mergedConfig.persist && typeof window !== 'undefined') {
    const savedLogs = localStorage.getItem('errorLogs')
    if (savedLogs) {
      try {
        const parsedLogs = JSON.parse(savedLogs).map((log: any) => ({
          ...log,
          timestamp: new Date(log.timestamp)
        }))
        logs.value = parsedLogs
      } catch (error) {
        console.error('Failed to parse error logs from localStorage:', error)
      }
    }
  }
  
  /**
   * 记录错误
   */
  const logError = (
    message: string,
    details?: any,
    type: ErrorLog['type'] = 'error',
    component?: string
  ) => {
    const errorLog: ErrorLog = {
      id: generateId(),
      timestamp: new Date(),
      type,
      message,
      details,
      stack: new Error().stack,
      component,
      route: typeof window !== 'undefined' ? window.location.pathname : undefined,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined
    }
    
    // 添加到日志数组
    logs.value.unshift(errorLog)
    
    // 限制日志数量
    if (logs.value.length > mergedConfig.maxLogs) {
      logs.value = logs.value.slice(0, mergedConfig.maxLogs)
    }
    
    // 控制台输出
    if (mergedConfig.consoleOutput) {
      const consoleMethod = type === 'error' ? 'error' : 
                           type === 'warning' ? 'warn' : 'log'
      
      console[consoleMethod](`[${type.toUpperCase()}] ${message}`, details)
    }
    
    // 持久化到本地存储
    if (mergedConfig.persist && typeof window !== 'undefined') {
      try {
        localStorage.setItem('errorLogs', JSON.stringify(logs.value))
      } catch (error) {
        console.error('Failed to persist error logs to localStorage:', error)
      }
    }
    
    // 发送到服务器（如果配置了端点）
    if (mergedConfig.serverEndpoint) {
      sendToServer(errorLog).catch(console.error)
    }
    
    return errorLog
  }
  
  /**
   * 发送错误日志到服务器
   */
  const sendToServer = async (errorLog: ErrorLog) => {
    try {
      const response = await fetch(mergedConfig.serverEndpoint!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...errorLog,
          // 转换为可序列化的格式
          timestamp: errorLog.timestamp.toISOString()
        })
      })
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`)
      }
    } catch (error) {
      console.error('Failed to send error log to server:', error)
    }
  }
  
  /**
   * 清除所有错误日志
   */
  const clearLogs = () => {
    logs.value = []
    
    if (mergedConfig.persist && typeof window !== 'undefined') {
      localStorage.removeItem('errorLogs')
    }
  }
  
  /**
   * 获取错误统计信息
   */
  const getStats = () => {
    const total = logs.value.length
    const errors = logs.value.filter(log => log.type === 'error').length
    const warnings = logs.value.filter(log => log.type === 'warning').length
    const infos = logs.value.filter(log => log.type === 'info').length
    
    return {
      total,
      errors,
      warnings,
      infos,
      errorRate: total > 0 ? (errors / total) * 100 : 0
    }
  }
  
  /**
   * 按时间范围过滤日志
   */
  const filterByTimeRange = (start: Date, end: Date = new Date()) => {
    return logs.value.filter(log => 
      log.timestamp >= start && log.timestamp <= end
    )
  }
  
  /**
   * 按类型过滤日志
   */
  const filterByType = (type: ErrorLog['type']) => {
    return logs.value.filter(log => log.type === type)
  }
  
  /**
   * 按组件过滤日志
   */
  const filterByComponent = (component: string) => {
    return logs.value.filter(log => log.component === component)
  }
  
  /**
   * 导出日志为 JSON
   */
  const exportLogs = () => {
    const data = JSON.stringify(logs.value, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.href = url
    a.download = `error-logs-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
  
  /**
   * 生成唯一 ID
   */
  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }
  
  return {
    logs,
    logError,
    clearLogs,
    getStats,
    filterByTimeRange,
    filterByType,
    filterByComponent,
    exportLogs
  }
}

/**
 * 全局错误处理器
 */
export function setupGlobalErrorHandler(config?: Partial<ErrorLoggerConfig>) {
  const { logError } = useErrorLogger(config)
  
  // 捕获未处理的 Promise 拒绝
  if (typeof window !== 'undefined') {
    window.addEventListener('unhandledrejection', (event) => {
      logError(
        'Unhandled Promise Rejection',
        {
          reason: event.reason,
          promise: event.promise
        },
        'error'
      )
    })
    
    // 捕获未处理的错误
    window.addEventListener('error', (event) => {
      logError(
        'Unhandled Error',
        {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        },
        'error'
      )
    })
    
    // 捕获 Vue 错误
    if (typeof window !== 'undefined' && (window as any).Vue) {
      const Vue = (window as any).Vue
      Vue.config.errorHandler = (error: Error, vm: any, info: string) => {
        logError(
          'Vue Error',
          {
            error: error.message,
            stack: error.stack,
            component: vm?.$options?.name,
            info
          },
          'error'
        )
      }
    }
  }
  
  return { logError }
}