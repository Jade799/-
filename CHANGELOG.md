# Changelog

## [v0.1.0] - 2026-05-04

### ✨ 新增功能

- **页面布局重构**
  - 新增 `Navbar` 顶栏导航组件（Logo、导航菜单、搜索框、用户头像下拉菜单）
  - `App.vue` 拆分布局：登录页使用空白布局，其他页面使用主布局（含导航栏）
  - 页面标题自动跟随路由更新

- **投票广场（列表/搜索）**
  - 新增 `Home.vue` — 投票列表主页，卡片式网格布局
  - 搜索功能：支持按标题、描述、创建者实时搜索，URL 参数同步
  - 多维筛选：按状态（全部/进行中/已结束/待审核）× 算法类型
  - 三种排序：最新 / 最热 / 即将结束
  - 统计栏：显示匹配数、进行中数量、总票数
  - 分页组件
  - 新增 `PollCard.vue` — 投票卡片组件（状态标签、算法标签、进度预览）

- **结果展示**
  - 新增 `Results.vue` — 完整结果展示页
  - 集成 ECharts 图表（`ResultChart.vue`）
  - 5 种算法自适应图表：单选/多选（柱状图）、打分制（满分10分）、Borda（排名分数）、权重（百分比）
  - 详细数据表格：排名、选项、数值、占比进度条
  - 金/银/铜牌排名样式

- **投票交互**
  - 新增 `Vote.vue` — 5 种算法投票控件：
    - 单选（radio 卡片）
    - 多选（checkbox 卡片 + 已选计数）
    - 权重分配（+/- 按钮 + InputNumber + 进度条）
    - Borda 排序（上移/下移按钮 + 排名徽标）
    - 打分制（Element Plus Rate 组件，满分10分）
  - 表单校验，提交确认弹窗

- **我的投票 & 创建投票**
  - `MyPolls.vue` — 我创建的 / 我参与的 双 Tab 页面
  - `Create.vue` — 创建投票表单（标题、描述、算法选择卡片、截止时间、可选编辑）

- **Mock 数据**
  - 新增 `src/mock/polls.js` — 8 条投票 mock 数据，覆盖全部 5 种算法和 3 种状态

### 📦 依赖变更

- 新增 `echarts` — Apache ECharts 图表库
- 新增 `vue-echarts` — Vue 3 ECharts 绑定

### 🗺️ 路由变更

| 路由 | 页面 | 说明 |
|------|------|------|
| `/` | Home | 投票广场（默认首页） |
| `/vote/:id` | Vote | 参与投票 |
| `/results/:id` | Results | 结果展示 |
| `/create` | Create | 创建投票 |
| `/mypolls` | MyPolls | 我的投票 |
| `/profile` | Profile | 个人主页 |
| `/login` | Login | 登录/注册 |
| `/:pathMatch(.*)*` | — | 404 重定向至首页 |

### 🛠️ 技术栈

- Vue 3 + Vite 8 + Element Plus
- vue-router 4 路由
- ECharts + vue-echarts 图表渲染
