# 字节生活 (Byte Life) - 个人网站

这是一个使用现代技术栈构建的个人网站项目，旨在展示个人作品、博客和提供在线互动功能。

## 技术栈

- **前端框架**: Vue 3 + Nuxt.js 4.0
- **构建工具**: Vite
- **CSS框架**: Tailwind CSS
- **后端服务**: Supabase (认证、数据库、存储)
- **部署平台**: Vercel

## 主要依赖及版本

### 核心框架
| 依赖包 | 版本 | 说明 |
|--------|------|------|
| Nuxt.js | `^4.0.3` | 全栈 Vue.js 框架 |
| Vue.js | `^3.5.18` | 渐进式 JavaScript 框架 |
| Vue Router | `^4.5.1` | Vue.js 官方路由管理器 |
| TypeScript | `^5.9.2` | JavaScript 的超集，提供静态类型检查 |

### UI 与样式
| 依赖包 | 版本 | 说明 |
|--------|------|------|
| Tailwind CSS | `^3.4.17` | 实用优先的 CSS 框架 |
| @nuxt/ui | `3.3.2` | Nuxt UI 组件库 |
| @nuxt/icon | `^2.0.0` | 图标系统 |
| @nuxtjs/color-mode | `^3.5.2` | 颜色模式切换（暗色/亮色主题） |
| PostCSS | `^8.5.6` | CSS 后处理器 |
| Autoprefixer | `^10.4.21` | CSS 自动添加浏览器前缀 |

### 功能模块
| 依赖包 | 版本 | 说明 |
|--------|------|------|
| @nuxt/content | `3.6.3` | 内容管理系统，支持 Markdown |
| @nuxt/image | `1.11.0` | 图片优化和处理 |
| @nuxt/fonts | `^0.11.4` | 字体优化 |
| @nuxt/scripts | `0.11.10` | 脚本管理 |
| @unhead/vue | `^2.0.14` | 文档头部管理 |

### 开发工具
| 依赖包 | 版本 | 说明 |
|--------|------|------|
| @nuxt/eslint | `1.9.0` | ESLint 配置 |
| @nuxt/test-utils | `3.19.2` | 测试工具 |
| vue-tsc | `^3.0.6` | Vue TypeScript 编译器 |
| ESLint | `^9.33.0` | JavaScript/TypeScript 代码检查工具 |

### 数据库
| 依赖包 | 版本 | 说明 |
|--------|------|------|
| Better SQLite3 | `^12.2.0` | 轻量级 SQLite 数据库 |

### 包管理器
| 工具 | 版本 | 说明 |
|------|------|------|
| pnpm | `10.14.0` | 快速、节省磁盘空间的包管理器 |

## Nuxt 4.0 新特性

本项目充分利用了 Nuxt 4.0 的最新特性：

- ✅ **View Transitions API** - 页面切换动画
- ✅ **Typed Pages** - 类型安全的路由
- ✅ **新目录结构** - 支持 `app/` 目录
- ✅ **性能优化** - 更快的构建和运行时性能
- ✅ **实验性特性** - 启用最新的实验性功能

## 项目规划

### 第一阶段：基础搭建 (1-2周)
- 项目初始化与配置
- 页面布局与导航设计
- 响应式设计实现
- 暗黑模式支持

### 第二阶段：核心功能开发 (2-3周)
- 个人简介页面
- 作品集展示
- 博客系统
- 联系表单

### 第三阶段：后端服务开发 (3-4周)
- **数据库设计与搭建**
  - 用户表、文章表、项目表、评论表设计
  - 数据库迁移和种子数据
  - 数据关系建立和索引优化
- **API 接口开发**
  - RESTful API 设计
  - 用户认证与授权 (JWT)
  - 文章 CRUD 操作
  - 项目管理接口
  - 评论系统接口
  - 文件上传接口
- **用户认证系统**
  - 用户注册与登录
  - 密码加密与验证
  - 邮箱验证
  - 密码重置功能
- **内容管理系统**
  - 管理员后台界面
  - 文章发布与编辑
  - 项目管理
  - 用户管理
  - 数据统计与分析

### 第四阶段：高级功能 (2-3周)
- **实时功能**
  - WebSocket 连接
  - 实时评论通知
  - 在线状态显示
  - 实时访客统计
- **搜索与推荐**
  - 全文搜索功能
  - 文章推荐算法
  - 标签云和分类
  - 相关内容推荐
- **社交功能**
  - 评论与回复系统
  - 点赞和收藏
  - 分享到社交媒体
  - 订阅通知
- **扩展功能**
  - 在线简历生成器
  - 代码片段分享
  - 技术文档系统
  - API 文档生成

### 第五阶段：优化与部署 (2-3周)
- **性能优化**
  - 数据库查询优化
  - 缓存策略 (Redis)
  - CDN 配置
  - 图片压缩与懒加载
- **安全加固**
  - SQL 注入防护
  - XSS 攻击防护
  - CSRF 保护
  - 接口限流
- **监控与日志**
  - 错误监控系统
  - 性能监控
  - 访问日志分析
  - 健康检查接口

## 功能清单

### 1. 用户界面
- [x] 响应式导航栏
- [x] 首页设计
- [x] 页脚组件
- [x] 暗黑/明亮模式切换
- [x] 多语言支持 (中/英)

### 2. 个人展示
- [x] 关于我页面
- [x] 技能展示
- [x] 教育与工作经历时间线
- [x] 可下载简历

### 3. 作品集
- [x] 项目展示卡片
- [x] 项目详情页
- [x] 项目分类与筛选
- [x] 项目搜索功能

### 4. 博客系统
- [x] 文章列表页
- [x] 文章详情页
- [x] 文章分类与标签
- [x] 相关文章推荐
- [x] Markdown支持

### 5. 互动功能
- [x] 评论系统
- [x] 点赞功能
- [x] 分享到社交媒体
- [x] 订阅通知

### 6. 管理功能
- [x] 内容管理系统
- [x] 用户管理
- [x] 数据分析与统计
- [x] SEO设置

## 数据模型

### 用户 (users)
- id: UUID (主键)
- email: String
- username: String
- avatar_url: String
- created_at: Timestamp
- updated_at: Timestamp

### 文章 (articles)
- id: UUID (主键)
- title: String
- slug: String
- content: Text
- excerpt: String
- cover_image: String
- published: Boolean
- published_at: Timestamp
- author_id: UUID (外键 -> users.id)
- created_at: Timestamp
- updated_at: Timestamp

### 项目 (projects)
- id: UUID (主键)
- title: String
- slug: String
- description: Text
- cover_image: String
- project_url: String
- github_url: String
- technologies: Array
- featured: Boolean
- created_at: Timestamp
- updated_at: Timestamp

### 评论 (comments)
- id: UUID (主键)
- content: Text
- user_id: UUID (外键 -> users.id)
- article_id: UUID (外键 -> articles.id)
- parent_id: UUID (自引用，用于嵌套评论)
- created_at: Timestamp
- updated_at: Timestamp

## 开发环境设置

```bash
# 克隆仓库
git clone https://github.com/icxcc/byte-life.git
cd byte-life

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 部署

项目配置为使用Vercel进行自动部署。每次推送到主分支时，将自动触发新的部署。

## 贡献指南

1. Fork 该仓库
2. 创建你的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启一个 Pull Request

## 许可证

MIT