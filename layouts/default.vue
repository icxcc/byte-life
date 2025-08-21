<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
    <TheHeader />
    <main>
      <slot />
    </main>
    <TheFooter />
  </div>
</template>

<script setup>
// 使用 Nuxt 4.0 的新特性
const { isDark } = useTheme()

// 监听主题变化并应用到 body
watchEffect(() => {
  if (process.client) {
    document.body.classList.toggle('dark', isDark.value)
  }
})

// 预加载关键资源
useHead({
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }
  ]
})
</script>
