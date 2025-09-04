// 生产环境移除console和debugger的插件
export default defineNuxtPlugin(() => {
  // 只在生产环境执行
  if (process.env.NODE_ENV === 'production') {
    // 重写console方法为空函数
    const noop = () => {}
    
    // 保留console.error和console.warn用于错误追踪
    const originalError = console.error
    const originalWarn = console.warn
    
    // 重写其他console方法
    console.log = noop
    console.info = noop
    console.debug = noop
    console.trace = noop
    console.table = noop
    console.group = noop
    console.groupEnd = noop
    console.groupCollapsed = noop
    console.time = noop
    console.timeEnd = noop
    console.timeLog = noop
    console.count = noop
    console.countReset = noop
    console.clear = noop
    console.dir = noop
    console.dirxml = noop
    
    // 保留重要的错误和警告方法
    console.error = originalError
    console.warn = originalWarn
    
    // 移除debugger语句的处理（通过构建工具处理更有效）
    // 这里主要是运行时的console处理
  }
})