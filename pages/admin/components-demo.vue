<template>
  <PageLayout
    page-title="组件演示"
    page-description="展示 Nuxt UI 组件的使用示例和最佳实践"
  >
    <div class="space-y-8">
      <!-- 按钮组件 -->
      <Card title="按钮组件" description="各种按钮样式和状态">
        <div class="space-y-4">
          <div class="flex flex-wrap gap-3">
            <UButton>默认按钮</UButton>
            <UButton color="primary">主要按钮</UButton>
            <UButton color="gray" variant="soft">次要按钮</UButton>
            <UButton color="red">危险按钮</UButton>
            <UButton variant="ghost">幽灵按钮</UButton>
            <UButton variant="outline">轮廓按钮</UButton>
          </div>
          
          <div class="flex flex-wrap gap-3">
            <UButton size="xs">超小</UButton>
            <UButton size="sm">小</UButton>
            <UButton size="md">中等</UButton>
            <UButton size="lg">大</UButton>
            <UButton size="xl">超大</UButton>
          </div>
          
          <div class="flex flex-wrap gap-3">
            <UButton icon="i-heroicons-plus">带图标</UButton>
            <UButton loading>加载中</UButton>
            <UButton disabled>禁用状态</UButton>
          </div>
        </div>
      </Card>

      <!-- 输入组件 -->
      <Card title="输入组件" description="表单输入控件">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UFormGroup label="基础输入" required>
            <UInput v-model="demoForm.name" placeholder="请输入姓名" />
          </UFormGroup>
          
          <UFormGroup label="邮箱输入">
            <UInput v-model="demoForm.email" type="email" placeholder="请输入邮箱" />
          </UFormGroup>
          
          <UFormGroup label="密码输入">
            <UInput v-model="demoForm.password" type="password" placeholder="请输入密码" />
          </UFormGroup>
          
          <UFormGroup label="选择器">
            <USelect 
              v-model="demoForm.role" 
              :options="roleOptions"
              placeholder="请选择角色"
            />
          </UFormGroup>
          
          <UFormGroup label="多行文本">
            <UTextarea v-model="demoForm.description" placeholder="请输入描述" />
          </UFormGroup>
          
          <UFormGroup label="开关">
            <UToggle v-model="demoForm.enabled" />
          </UFormGroup>
        </div>
      </Card>

      <!-- 数据展示 -->
      <Card title="数据展示" description="表格、列表和卡片">
        <div class="space-y-6">
          <!-- 表格 -->
          <div>
            <h4 class="text-lg font-medium mb-4">数据表格</h4>
            <UTable :rows="tableData" :columns="tableColumns">
              <template #status-data="{ row }">
                <UBadge 
                  :color="row.status === 'active' ? 'green' : 'gray'"
                  variant="soft"
                >
                  {{ row.status === 'active' ? '活跃' : '非活跃' }}
                </UBadge>
              </template>
              
              <template #actions-data="{ row }">
                <UDropdown :items="getTableActions(row)">
                  <UButton
                    color="gray"
                    variant="ghost"
                    icon="i-heroicons-ellipsis-horizontal-20-solid"
                    size="sm"
                  />
                </UDropdown>
              </template>
            </UTable>
          </div>
          
          <!-- 分页 -->
          <div class="flex justify-center">
            <UPagination v-model="currentPage" :page-count="10" :total="100" />
          </div>
        </div>
      </Card>

      <!-- 反馈组件 -->
      <Card title="反馈组件" description="通知、警告和确认">
        <div class="space-y-4">
          <div class="flex flex-wrap gap-3">
            <UButton @click="showSuccessToast">成功通知</UButton>
            <UButton color="red" @click="showErrorToast">错误通知</UButton>
            <UButton color="yellow" @click="showWarningToast">警告通知</UButton>
            <UButton color="blue" @click="showInfoToast">信息通知</UButton>
          </div>
          
          <div class="flex flex-wrap gap-3">
            <UButton @click="showModal = true">打开模态框</UButton>
            <UButton @click="showSlideOver = true">打开侧边栏</UButton>
          </div>
          
          <!-- 警告框 -->
          <UAlert
            icon="i-heroicons-exclamation-triangle"
            color="yellow"
            variant="soft"
            title="注意"
            description="这是一个警告信息示例"
          />
        </div>
      </Card>

      <!-- 导航组件 -->
      <Card title="导航组件" description="标签页、面包屑和菜单">
        <div class="space-y-6">
          <!-- 标签页 -->
          <div>
            <h4 class="text-lg font-medium mb-4">标签页</h4>
            <UTabs :items="tabItems" v-model="activeTab">
              <template #item="{ item }">
                <div class="p-4">
                  <p>{{ item.label }} 的内容</p>
                </div>
              </template>
            </UTabs>
          </div>
          
          <!-- 面包屑 -->
          <div>
            <h4 class="text-lg font-medium mb-4">面包屑导航</h4>
            <UBreadcrumb :links="breadcrumbLinks" />
          </div>
        </div>
      </Card>
    </div>

    <!-- 模态框 -->
    <UModal v-model="showModal">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">模态框标题</h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              class="-my-1"
              @click="showModal = false"
            />
          </div>
        </template>
        
        <p>这是模态框的内容区域。</p>
        
        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton color="gray" variant="soft" @click="showModal = false">
              取消
            </UButton>
            <UButton @click="showModal = false">
              确认
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- 侧边栏 -->
    <USlideover v-model="showSlideOver">
      <UCard class="flex flex-col flex-1">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">侧边栏标题</h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              class="-my-1"
              @click="showSlideOver = false"
            />
          </div>
        </template>
        
        <p>这是侧边栏的内容区域。</p>
      </UCard>
    </USlideover>
  </PageLayout>
</template>

<script setup lang="ts">
// 页面元数据
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

// 通知系统
const { success, error, warning, info } = useNotification()

// 表单数据
const demoForm = reactive({
  name: '',
  email: '',
  password: '',
  role: '',
  description: '',
  enabled: false
})

const roleOptions = [
  { label: '管理员', value: 'admin' },
  { label: '编辑者', value: 'editor' },
  { label: '查看者', value: 'viewer' }
]

// 表格数据
const tableColumns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: '姓名' },
  { key: 'email', label: '邮箱' },
  { key: 'status', label: '状态' },
  { key: 'actions', label: '操作' }
]

const tableData = [
  { id: 1, name: '张三', email: 'zhangsan@example.com', status: 'active' },
  { id: 2, name: '李四', email: 'lisi@example.com', status: 'inactive' },
  { id: 3, name: '王五', email: 'wangwu@example.com', status: 'active' }
]

const currentPage = ref(1)

// 标签页
const tabItems = [
  { key: 'tab1', label: '标签一' },
  { key: 'tab2', label: '标签二' },
  { key: 'tab3', label: '标签三' }
]

const activeTab = ref('tab1')

// 面包屑
const breadcrumbLinks = [
  { label: '首页', to: '/admin' },
  { label: '组件', to: '/admin/components' },
  { label: '演示', to: '/admin/components-demo' }
]

// 模态框和侧边栏
const showModal = ref(false)
const showSlideOver = ref(false)

// 方法
const showSuccessToast = () => {
  success('操作成功完成！')
}

const showErrorToast = () => {
  error('操作失败，请重试')
}

const showWarningToast = () => {
  warning('请注意检查输入内容')
}

const showInfoToast = () => {
  info('这是一条信息提示')
}

const getTableActions = (row: any) => [
  {
    label: '编辑',
    icon: 'i-heroicons-pencil-square-20-solid',
    click: () => console.log('编辑', row)
  },
  {
    label: '删除',
    icon: 'i-heroicons-trash-20-solid',
    click: () => console.log('删除', row)
  }
]

useHead({ title: '组件演示 - ByteLife' })
</script>