/**
 * SEO 优化组合式函数 - 利用 Nuxt 4.0 的 SEO 特性
 */
export const useSEO = (options: {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: string
}) => {
  const { title, description, image, url, type = 'website' } = options
  
  const route = useRoute()
  const config = useRuntimeConfig()
  
  const seoTitle = computed(() => title || '字节生活 - 个人网站')
  const seoDescription = computed(() => description || '个人网站，展示作品、博客和在线互动功能')
  const seoImage = computed(() => image || '/images/og-image.jpg')
  const seoUrl = computed(() => url || `${config.public.siteUrl}${route.path}`)
  
  useHead({
    title: seoTitle,
    meta: [
      { name: 'description', content: seoDescription },
      { property: 'og:title', content: seoTitle },
      { property: 'og:description', content: seoDescription },
      { property: 'og:image', content: seoImage },
      { property: 'og:url', content: seoUrl },
      { property: 'og:type', content: type },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: seoTitle },
      { name: 'twitter:description', content: seoDescription },
      { name: 'twitter:image', content: seoImage }
    ]
  })
  
  return {
    seoTitle: readonly(seoTitle),
    seoDescription: readonly(seoDescription),
    seoImage: readonly(seoImage),
    seoUrl: readonly(seoUrl)
  }
}