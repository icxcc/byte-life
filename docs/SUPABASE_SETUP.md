# Supabase 邮件回调配置指南

## 问题说明

在使用 Supabase Authentication 时，注册和密码重置邮件中的回调链接默认指向本地开发环境，这会导致线上用户无法正确完成邮箱验证和密码重置。

## 解决方案

### 1. 环境变量配置

在生产环境中设置正确的站点URL：

```bash
# .env 或部署平台的环境变量
SITE_URL=https://yourdomain.com
```

### 2. Supabase 控制台配置

登录 [Supabase 控制台](https://supabase.com/dashboard)，进入项目设置：

1. **Authentication > URL Configuration**
   - Site URL: `https://yourdomain.com`
   - Redirect URLs: 添加以下URL
     - `https://yourdomain.com/admin/auth/callback`
     - `https://yourdomain.com/admin/reset-password`

2. **Authentication > Email Templates**
   - 确认邮件模板中的链接使用 `{{ .SiteURL }}`
   - 密码重置邮件模板中的链接使用 `{{ .SiteURL }}`

### 3. 代码实现

项目中已经实现了动态回调URL配置：

#### 注册页面 (`pages/admin/register.vue`)
```typescript
// 获取当前域名作为回调地址
const { $config } = useNuxtApp()
const baseUrl = process.client ? window.location.origin : ($config.public.siteUrl || 'http://localhost:3000')

const { data, error } = await supabase.auth.signUp({
  email: registerForm.value.email,
  password: registerForm.value.password,
  options: {
    emailRedirectTo: `${baseUrl}/admin/auth/callback`, // 动态回调地址
    data: {
      role: 'admin'
    }
  }
})
```

#### 忘记密码页面 (`pages/admin/forgot-password.vue`)
```typescript
// 获取当前域名作为回调地址
const { $config } = useNuxtApp()
const baseUrl = process.client ? window.location.origin : ($config.public.siteUrl || 'http://localhost:3000')

const { error } = await supabase.auth.resetPasswordForEmail(email.value, {
  redirectTo: `${baseUrl}/admin/reset-password` // 动态回调地址
})
```

#### 邮箱验证回调页面 (`pages/admin/auth/callback.vue`)
处理邮箱验证成功后的跳转和状态显示。

### 4. 部署检查清单

部署到生产环境时，请确保：

- [ ] 设置了正确的 `SITE_URL` 环境变量
- [ ] 在 Supabase 控制台中配置了正确的 Site URL
- [ ] 在 Supabase 控制台中添加了回调 URL 到白名单
- [ ] 测试注册邮件中的链接是否指向正确的域名
- [ ] 测试密码重置邮件中的链接是否指向正确的域名

### 5. 常见问题

**Q: 邮件中的链接还是指向 localhost**
A: 检查 Supabase 控制台中的 Site URL 配置，确保设置为生产域名。

**Q: 点击邮件链接后显示 "Invalid redirect URL"**
A: 在 Supabase 控制台的 Redirect URLs 中添加回调地址到白名单。

**Q: 开发环境和生产环境如何区分**
A: 代码会自动根据 `SITE_URL` 环境变量或当前域名来设置回调地址。

### 6. 测试步骤

1. 在生产环境注册新账户
2. 检查收到的邮件中的验证链接域名
3. 点击链接确认能正确跳转到验证页面
4. 测试忘记密码功能的邮件链接