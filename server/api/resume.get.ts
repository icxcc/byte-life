export default defineEventHandler(async (event) => {
  try {
    // 这里可以返回简历文件的下载链接或生成PDF
    // 目前返回一个模拟的简历数据
    const resumeData = {
      personalInfo: {
        name: '张三',
        title: '全栈开发工程师',
        email: 'contact@example.com',
        phone: '+86 123 4567 8910',
        location: '北京市朝阳区',
        website: 'https://byte-life.vercel.app'
      },
      summary: '拥有5年以上Web开发经验的全栈工程师，专注于现代前端技术和后端架构设计。',
      skills: {
        frontend: ['Vue.js', 'React', 'TypeScript', 'Tailwind CSS', 'Nuxt.js'],
        backend: ['Node.js', 'Express', 'Python', 'SQL', 'MongoDB'],
        tools: ['Git', 'Docker', 'CI/CD', 'AWS', 'Vercel']
      },
      experience: [
        {
          company: '某科技公司',
          position: '高级前端开发工程师',
          period: '2023 - 至今',
          description: '负责公司核心产品的前端开发，使用Vue.js和Tailwind CSS构建高性能、响应式的用户界面。'
        },
        {
          company: '某互联网公司',
          position: 'Web开发工程师',
          period: '2020 - 2023',
          description: '参与多个Web应用项目的开发，使用React和Node.js构建全栈应用。'
        }
      ],
      education: [
        {
          school: '某知名大学',
          degree: '计算机科学学士',
          period: '2016 - 2020',
          description: '主修计算机科学，专注于Web开发和软件工程。'
        }
      ]
    }

    // 设置响应头，表示这是一个JSON文件下载
    setHeader(event, 'Content-Type', 'application/json')
    setHeader(event, 'Content-Disposition', 'attachment; filename="resume.json"')
    
    return resumeData
    
  } catch (error) {
    console.error('简历下载错误:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: '简历下载失败，请稍后重试'
    })
  }
})