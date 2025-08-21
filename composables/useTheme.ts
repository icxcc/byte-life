/**
 * 主题管理组合式函数 - 利用 Nuxt 4.0 的响应式特性
 */
export const useTheme = () => {
  const colorMode = useColorMode()
  
  const isDark = computed(() => colorMode.value === 'dark')
  
  const toggleTheme = () => {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
  
  const setTheme = (theme: 'light' | 'dark' | 'system') => {
    colorMode.preference = theme
  }
  
  return {
    isDark: readonly(isDark),
    colorMode: readonly(colorMode),
    toggleTheme,
    setTheme
  }
}