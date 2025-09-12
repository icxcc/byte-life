-- 内容管理系统数据库架构
-- 适用于 Supabase PostgreSQL

-- 1. 栏目表 (channels)
CREATE TABLE IF NOT EXISTS channels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES channels(id) ON DELETE SET NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 文章表 (articles)
CREATE TABLE IF NOT EXISTS articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  cover_image TEXT,
  channel_id UUID REFERENCES channels(id) ON DELETE SET NULL,
  author VARCHAR(255),
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
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

-- 3. 联系人表 (contacts)
CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 管理员用户表 (admin_users) - 可选，如果不使用 Supabase Auth
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_channels_parent_id ON channels(parent_id);
CREATE INDEX IF NOT EXISTS idx_channels_slug ON channels(slug);
CREATE INDEX IF NOT EXISTS idx_channels_is_active ON channels(is_active);

CREATE INDEX IF NOT EXISTS idx_articles_channel_id ON articles(channel_id);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_featured ON articles(featured);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at);
CREATE INDEX IF NOT EXISTS idx_articles_tags ON articles USING GIN(tags);

CREATE INDEX IF NOT EXISTS idx_contacts_read ON contacts(read);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at);

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 为所有表添加更新时间触发器
CREATE TRIGGER update_channels_updated_at BEFORE UPDATE ON channels
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 插入示例数据

-- 示例栏目数据
INSERT INTO channels (name, slug, description, sort_order, is_active) VALUES
('技术博客', 'tech', '分享技术相关的文章和教程', 1, true),
('生活随笔', 'life', '记录生活中的点点滴滴', 2, true),
('项目展示', 'projects', '展示个人或团队项目', 3, true),
('学习笔记', 'notes', '学习过程中的笔记和总结', 4, true)
ON CONFLICT (slug) DO NOTHING;

-- 获取栏目ID用于文章插入
DO $$
DECLARE
  tech_id UUID;
  life_id UUID;
  projects_id UUID;
  notes_id UUID;
BEGIN
  SELECT id INTO tech_id FROM channels WHERE slug = 'tech';
  SELECT id INTO life_id FROM channels WHERE slug = 'life';
  SELECT id INTO projects_id FROM channels WHERE slug = 'projects';
  SELECT id INTO notes_id FROM channels WHERE slug = 'notes';

  -- 示例文章数据
  INSERT INTO articles (title, slug, content, excerpt, channel_id, author, status, featured, tags, read_time, published_at) VALUES
  (
    'Vue 3 组合式 API 完全指南',
    'vue3-composition-api-guide',
    '# Vue 3 组合式 API 完全指南

Vue 3 引入了组合式 API，这是一个全新的 API 风格，让我们能够更好地组织和复用代码逻辑。

## 什么是组合式 API？

组合式 API 是一套基于函数的 API，让我们能够更灵活地组织组件逻辑。与选项式 API 不同，组合式 API 将相关的逻辑组织在一起。

## 基本用法

```javascript
import { ref, computed, onMounted } from ''vue''

export default {
  setup() {
    const count = ref(0)
    const doubleCount = computed(() => count.value * 2)
    
    const increment = () => {
      count.value++
    }
    
    onMounted(() => {
      console.log(''组件已挂载'')
    })
    
    return {
      count,
      doubleCount,
      increment
    }
  }
}
```

## 优势

1. **更好的逻辑复用**：通过组合函数可以轻松复用逻辑
2. **更好的类型推导**：TypeScript 支持更好
3. **更灵活的代码组织**：相关逻辑可以组织在一起

这只是组合式 API 的冰山一角，还有更多强大的功能等待探索！',
    'Vue 3 组合式 API 是一个革命性的功能，让我们能够更好地组织和复用代码逻辑。本文将详细介绍其用法和优势。',
    tech_id,
    'admin@example.com',
    'published',
    true,
    ARRAY['Vue3', 'JavaScript', '前端开发', '组合式API'],
    8,
    NOW() - INTERVAL '2 days'
  ),
  (
    'Nuxt.js 4.0 新特性解析',
    'nuxtjs-4-new-features',
    '# Nuxt.js 4.0 新特性解析

Nuxt.js 4.0 带来了许多令人兴奋的新特性和改进，让全栈开发变得更加简单和高效。

## 主要新特性

### 1. 改进的服务端渲染
- 更快的冷启动时间
- 优化的内存使用
- 更好的错误处理

### 2. 新的文件系统路由
- 支持嵌套路由
- 动态路由改进
- 更灵活的路由配置

### 3. 内置的状态管理
- 无需额外配置
- 类型安全
- 服务端和客户端同步

## 迁移指南

从 Nuxt 3 迁移到 Nuxt 4 相对简单，主要需要注意以下几点：

1. 更新依赖版本
2. 检查配置文件
3. 测试现有功能

总的来说，Nuxt.js 4.0 是一个值得升级的版本！',
    'Nuxt.js 4.0 发布了！本文详细解析了新版本的主要特性和改进，以及从旧版本的迁移指南。',
    tech_id,
    'admin@example.com',
    'published',
    false,
    ARRAY['Nuxt.js', 'Vue.js', '全栈开发', 'SSR'],
    6,
    NOW() - INTERVAL '1 day'
  ),
  (
    '我的编程学习之路',
    'my-programming-journey',
    '# 我的编程学习之路

回顾自己的编程学习历程，从最初的懵懂无知到现在能够独立开发项目，这一路走来充满了挑战和收获。

## 起步阶段

最开始接触编程是在大学时期，第一门语言是 C++。那时候对指针、内存管理等概念完全摸不着头脑，经常为了一个小 bug 调试到深夜。

## 转向 Web 开发

后来发现了 Web 开发的魅力，开始学习 HTML、CSS 和 JavaScript。第一次看到自己写的代码在浏览器中运行时，那种成就感至今难忘。

## 框架学习

随着项目复杂度的增加，开始学习各种框架：
- React：组件化思想的启蒙
- Vue：渐进式框架的优雅
- Node.js：全栈开发的可能

## 持续学习

编程是一个需要持续学习的领域，技术更新很快，但基础知识是不变的。保持好奇心和学习热情是最重要的。

希望我的经历能给正在学习编程的朋友一些启发！',
    '分享我从编程小白到能够独立开发项目的学习历程，希望能给正在学习编程的朋友一些启发和帮助。',
    life_id,
    'admin@example.com',
    'published',
    false,
    ARRAY['编程学习', '个人成长', '经验分享'],
    5,
    NOW() - INTERVAL '3 days'
  ),
  (
    '个人博客系统开发记录',
    'personal-blog-development',
    '# 个人博客系统开发记录

最近完成了一个基于 Nuxt.js 的个人博客系统，记录一下开发过程中的一些思考和技术选择。

## 技术栈选择

### 前端
- **Nuxt.js 4.0**：全栈框架，支持 SSR
- **Vue 3**：响应式框架
- **Tailwind CSS**：原子化 CSS 框架
- **TypeScript**：类型安全

### 后端
- **Supabase**：后端即服务，提供数据库和认证
- **PostgreSQL**：关系型数据库

## 主要功能

1. **文章管理**：支持 Markdown 编辑
2. **分类管理**：层级分类系统
3. **用户认证**：基于 Supabase Auth
4. **响应式设计**：适配各种设备

## 开发心得

1. **组件化开发**：将 UI 拆分成可复用的组件
2. **类型安全**：TypeScript 帮助减少运行时错误
3. **性能优化**：利用 Nuxt.js 的 SSR 和缓存机制

## 后续计划

- 添加评论系统
- 集成搜索功能
- 优化 SEO
- 添加数据分析

这个项目让我对全栈开发有了更深的理解！',
    '记录个人博客系统的开发过程，包括技术选择、主要功能实现和开发心得，以及后续的优化计划。',
    projects_id,
    'admin@example.com',
    'draft',
    false,
    ARRAY['Nuxt.js', '全栈开发', '博客系统', 'Supabase'],
    7,
    NULL
  );
END $$;

-- 示例联系人数据
INSERT INTO contacts (name, email, message, read) VALUES
('张三', 'zhangsan@example.com', '你好，我对你的博客很感兴趣，希望能够交流学习。', false),
('李四', 'lisi@example.com', '看了你的 Vue 3 文章，写得很好！有个问题想请教一下。', true),
('王五', 'wangwu@example.com', '希望能够合作开发一个项目，请联系我。', false)
ON CONFLICT DO NOTHING;

-- 设置 RLS (Row Level Security) 策略
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- 创建策略：允许认证用户读取已发布的内容
CREATE POLICY "Allow public read access to published articles" ON articles
  FOR SELECT USING (status = 'published');

CREATE POLICY "Allow public read access to active channels" ON channels
  FOR SELECT USING (is_active = true);

-- 创建策略：允许认证用户管理所有内容
CREATE POLICY "Allow authenticated users full access to articles" ON articles
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users full access to channels" ON channels
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users full access to contacts" ON contacts
  FOR ALL USING (auth.role() = 'authenticated');

-- 创建策略：允许匿名用户创建联系人
CREATE POLICY "Allow anonymous users to create contacts" ON contacts
  FOR INSERT WITH CHECK (true);