# 内容管理系统文档

## 概述

本项目实现了一个完整的内容管理系统，基于 Nuxt.js 4.0 + Vue 3 + Supabase 构建，提供了文章管理、栏目管理、联系人管理等功能。

## 技术栈

### 前端
- **Nuxt.js 4.0**: 全栈 Vue 框架
- **Vue 3**: 渐进式 JavaScript 框架
- **TypeScript**: 类型安全的 JavaScript
- **Tailwind CSS**: 原子化 CSS 框架
- **Nuxt UI**: UI 组件库

### 后端
- **Supabase**: 后端即服务 (BaaS)
- **PostgreSQL**: 关系型数据库
- **Row Level Security (RLS)**: 数据安全策略

## 功能特性

### 1. 文章管理 (`/admin/content/articles`)
- ✅ 文章列表展示
- ✅ 创建新文章
- ✅ 编辑现有文章
- ✅ 删除文章
- ✅ 文章状态管理 (草稿/已发布/归档)
- ✅ 推荐文章设置
- ✅ 标签管理
- ✅ Markdown 编辑器
- ✅ 文章统计 (阅读时间、浏览量、点赞数)

### 2. 栏目管理 (`/admin/content/channels`)
- ✅ 栏目列表展示
- ✅ 创建新栏目
- ✅ 编辑栏目信息
- ✅ 删除栏目
- ✅ 层级栏目支持 (父子关系)
- ✅ 栏目排序
- ✅ 启用/禁用状态
- ✅ 栏目搜索

### 3. 联系人管理 (`/admin/system/messages`)
- ✅ 联系人消息列表
- ✅ 标记已读/未读
- ✅ 删除消息
- ✅ IP 地址和用户代理记录

### 4. 数据库管理 (`/admin/system/database`)
- ✅ 数据库连接状态检查
- ✅ 示例数据初始化
- ✅ 数据统计展示
- ✅ 数据库架构查看

## 文件结构

```
├── pages/admin/content/
│   ├── articles.vue          # 文章管理页面
│   └── channels.vue          # 栏目管理页面
├── pages/admin/system/
│   └── database.vue          # 数据库管理页面
├── server/api/admin/content/
│   ├── articles.get.ts       # 获取文章列表
│   ├── articles.post.ts      # 创建文章
│   ├── channels.get.ts       # 获取栏目列表
│   ├── channels.post.ts      # 创建栏目
│   ├── seed.post.ts          # 初始化示例数据
│   ├── articles/
│   │   ├── [id].patch.ts     # 更新文章
│   │   └── [id].delete.ts    # 删除文章
│   └── channels/
│       ├── [id].patch.ts     # 更新栏目
│       └── [id].delete.ts    # 删除栏目
├── composables/
│   ├── useArticles.ts        # 文章管理组合式函数
│   ├── useChannels.ts        # 栏目管理组合式函数
│   └── useApi.ts             # API 请求组合式函数
├── components/
│   ├── admin/
│   │   ├── ArticleEditor.vue # 文章编辑器组件
│   │   └── StatsCard.vue     # 统计卡片组件
│   └── ui/
│       ├── Modal.vue         # 模态框组件
│       └── LoadingSpinner.vue # 加载动画组件
├── types/
│   └── index.ts              # TypeScript 类型定义
└── docs/
    ├── database-schema.sql   # 数据库架构脚本
    └── content-management-system.md # 系统文档
```

## 数据库架构

### 表结构

#### 1. channels (栏目表)
```sql
CREATE TABLE channels (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES channels(id),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 2. articles (文章表)
```sql
CREATE TABLE articles (
  id UUID PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  cover_image TEXT,
  channel_id UUID REFERENCES channels(id),
  author VARCHAR(255),
  status VARCHAR(20) DEFAULT 'draft',
  featured BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  meta_title VARCHAR(255),
  meta_description TEXT,
  read_time INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 3. contacts (联系人表)
```sql
CREATE TABLE contacts (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## API 接口

### 文章管理 API

#### 获取文章列表
```
GET /api/admin/content/articles
```

#### 创建文章
```
POST /api/admin/content/articles
Body: {
  title: string,
  slug: string,
  content: string,
  excerpt?: string,
  coverImage?: string,
  category?: string,
  tags?: string[],
  published?: boolean,
  featured?: boolean
}
```

#### 更新文章
```
PATCH /api/admin/content/articles/[id]
Body: Partial<Article>
```

#### 删除文章
```
DELETE /api/admin/content/articles/[id]
```

### 栏目管理 API

#### 获取栏目列表
```
GET /api/admin/content/channels
```

#### 创建栏目
```
POST /api/admin/content/channels
Body: {
  name: string,
  slug: string,
  description?: string,
  parent_id?: string,
  sort_order?: number,
  is_active?: boolean
}
```

#### 更新栏目
```
PATCH /api/admin/content/channels/[id]
Body: Partial<Channel>
```

#### 删除栏目
```
DELETE /api/admin/content/channels/[id]
```

### 数据初始化 API

#### 创建示例数据
```
POST /api/admin/content/seed
```

## 组合式函数

### useArticles()
提供文章管理的所有功能：
- `articles`: 文章列表
- `loading`: 加载状态
- `stats`: 统计数据
- `fetchArticles()`: 获取文章
- `createArticle()`: 创建文章
- `updateArticle()`: 更新文章
- `deleteArticle()`: 删除文章
- `searchArticles()`: 搜索文章
- `formatDate()`: 格式化日期

### useChannels()
提供栏目管理的所有功能：
- `channels`: 栏目列表
- `loading`: 加载状态
- `stats`: 统计数据
- `fetchChannels()`: 获取栏目
- `createChannel()`: 创建栏目
- `updateChannel()`: 更新栏目
- `deleteChannel()`: 删除栏目
- `searchChannels()`: 搜索栏目
- `getParentOptions()`: 获取父栏目选项

### useApi()
提供通用的 API 请求功能：
- `data`: 响应数据
- `loading`: 加载状态
- `error`: 错误信息
- `get()`: GET 请求
- `post()`: POST 请求
- `patch()`: PATCH 请求
- `delete()`: DELETE 请求

## 使用指南

### 1. 数据库初始化

首先需要在 Supabase 中执行数据库架构脚本：

1. 登录 Supabase 控制台
2. 进入 SQL Editor
3. 执行 `docs/database-schema.sql` 中的脚本

### 2. 示例数据创建

访问 `/admin/system/database` 页面，点击"初始化数据"按钮创建示例数据。

### 3. 栏目管理

1. 访问 `/admin/content/channels`
2. 点击"新建栏目"创建栏目
3. 可以设置父栏目创建层级结构
4. 支持拖拽排序和状态切换

### 4. 文章管理

1. 访问 `/admin/content/articles`
2. 点击"新建文章"创建文章
3. 使用内置的 Markdown 编辑器编写内容
4. 可以设置分类、标签、发布状态等

### 5. 联系人管理

1. 访问 `/admin/system/messages`
2. 查看用户提交的联系表单
3. 可以标记已读和删除消息

## 安全特性

### 1. 认证授权
- 基于 Supabase Auth 的用户认证
- JWT Token 验证
- 管理员权限检查

### 2. 数据安全
- Row Level Security (RLS) 策略
- SQL 注入防护
- XSS 攻击防护

### 3. 输入验证
- 前端表单验证
- 后端数据验证
- 类型安全检查

## 性能优化

### 1. 数据库优化
- 合理的索引设计
- 查询优化
- 分页加载

### 2. 前端优化
- 组件懒加载
- 图片优化
- 缓存策略

### 3. 服务端优化
- SSR 渲染
- API 缓存
- 压缩传输

## 扩展功能

### 计划中的功能
- [ ] 文章评论系统
- [ ] 全文搜索
- [ ] 文件上传管理
- [ ] 多语言支持
- [ ] 主题定制
- [ ] 数据导入导出
- [ ] 定时发布
- [ ] 访问统计
- [ ] SEO 优化工具
- [ ] 备份恢复

### 自定义扩展
系统采用模块化设计，可以轻松扩展新功能：

1. 添加新的数据表
2. 创建对应的 API 接口
3. 开发管理页面
4. 编写组合式函数
5. 更新类型定义

## 故障排除

### 常见问题

#### 1. 数据库连接失败
- 检查 Supabase 配置
- 验证环境变量
- 确认网络连接

#### 2. 认证失败
- 检查 JWT Token
- 验证用户权限
- 确认 Supabase Auth 配置

#### 3. 数据加载失败
- 检查 API 接口
- 验证数据格式
- 查看控制台错误

### 调试技巧

1. 使用浏览器开发者工具
2. 查看 Nuxt.js 服务端日志
3. 检查 Supabase 日志
4. 使用 TypeScript 类型检查

## 贡献指南

### 开发环境设置

1. 克隆项目
2. 安装依赖：`pnpm install`
3. 配置环境变量
4. 启动开发服务器：`pnpm dev`

### 代码规范

- 使用 TypeScript
- 遵循 Vue 3 组合式 API 规范
- 使用 ESLint 和 Prettier
- 编写单元测试

### 提交规范

- 使用语义化提交信息
- 编写清晰的 PR 描述
- 确保测试通过
- 更新相关文档

## 许可证

MIT License

## 联系方式

如有问题或建议，请通过以下方式联系：

- GitHub Issues
- 邮箱：admin@example.com
- 官方网站：https://example.com