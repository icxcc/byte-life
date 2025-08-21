/**
 * 项目数据 API - 使用 Nuxt 4.0 的服务器 API
 */
export default defineEventHandler(async (event) => {
  // 模拟项目数据
  const projects = [
    {
      id: 1,
      title: 'Vue.js 管理系统',
      description: '基于 Vue 3 和 TypeScript 构建的现代化管理系统，具有完整的权限管理和数据可视化功能。',
      image: '/images/project-1.jpg',
      tags: ['Vue.js', 'TypeScript', 'Element Plus', 'Vite'],
      github: 'https://github.com/username/vue-admin',
      demo: 'https://vue-admin-demo.com',
      featured: true
    },
    {
      id: 2,
      title: 'React Native 移动应用',
      description: '跨平台移动应用，支持 iOS 和 Android，集成了地图、支付和社交功能。',
      image: '/images/project-2.jpg',
      tags: ['React Native', 'TypeScript', 'Redux', 'Firebase'],
      github: 'https://github.com/username/rn-app',
      demo: 'https://app-store-link.com',
      featured: true
    },
    {
      id: 3,
      title: 'Node.js API 服务',
      description: '高性能的 RESTful API 服务，支持微服务架构和容器化部署。',
      image: '/images/project-3.jpg',
      tags: ['Node.js', 'Express', 'MongoDB', 'Docker'],
      github: 'https://github.com/username/node-api',
      demo: 'https://api-docs.com',
      featured: false
    }
  ]

  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 100))

  return {
    success: true,
    data: projects,
    total: projects.length
  }
})