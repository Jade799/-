export const algorithmLabels = {
  single: '单选',
  multiple: '多选',
  weighted: '权重分配',
  borda: 'Borda 排序',
  scoring: '打分制'
}

export const algorithmColors = {
  single: '#409eff',
  multiple: '#67c23a',
  weighted: '#e6a23c',
  borda: '#f56c6c',
  scoring: '#909399'
}

export const algorithmIcons = {
  single: 'CircleCheck',
  multiple: 'Select',
  weighted: 'TrendCharts',
  borda: 'Sort',
  scoring: 'Star'
}

export const statusLabels = {
  pending: '待审核',
  active: '进行中',
  ended: '已结束'
}

export const statusTypes = {
  pending: 'info',
  active: 'success',
  ended: 'danger'
}

// 生成随机投票
const now = Date.now()
const DAY = 86400000

export const polls = [
  {
    id: 1,
    title: '2026年度最佳开源项目评选',
    description: '选出你心目中最优秀的开源项目，每个账号限投一次。',
    algorithm: 'single',
    status: 'active',
    createdAt: now - 3 * DAY,
    endAt: now + 7 * DAY,
    totalVotes: 3842,
    creator: '开源中国社区',
    options: [
      { id: 101, label: 'Vue.js', count: 1200 },
      { id: 102, label: 'React', count: 980 },
      { id: 103, label: 'Python', count: 760 },
      { id: 104, label: 'Rust', count: 520 },
      { id: 105, label: 'Go', count: 382 }
    ]
  },
  {
    id: 2,
    title: '公司年会节目投票（可多选）',
    description: '每人最多选3个你最喜欢的节目，得票最高的节目将获得特别奖励！',
    algorithm: 'multiple',
    status: 'active',
    createdAt: now - 5 * DAY,
    endAt: now + 14 * DAY,
    totalVotes: 1567,
    creator: '行政部',
    options: [
      { id: 201, label: '舞蹈《青春飞扬》', count: 523 },
      { id: 202, label: '小品《程序员的日常》', count: 412 },
      { id: 203, label: '合唱《明天会更好》', count: 338 },
      { id: 204, label: '魔术表演', count: 294 }
    ]
  },
  {
    id: 3,
    title: '新产品功能优先级权重投票',
    description: '请为以下功能分配权重，总分为100分，越重要的功能分配越多。',
    algorithm: 'weighted',
    status: 'active',
    createdAt: now - 2 * DAY,
    endAt: now + 21 * DAY,
    totalVotes: 892,
    creator: '产品部',
    options: [
      { id: 301, label: 'AI 智能推荐', count: 35 },
      { id: 302, label: '多语言支持', count: 25 },
      { id: 303, label: '暗黑模式', count: 15 },
      { id: 304, label: '离线模式', count: 15 },
      { id: 305, label: '社交分享', count: 10 }
    ]
  },
  {
    id: 4,
    title: '我最喜爱的编程语言（Borda排序）',
    description: '请将以下编程语言按你的喜好程度从高到低排序。',
    algorithm: 'borda',
    status: 'ended',
    createdAt: now - 30 * DAY,
    endAt: now - 2 * DAY,
    totalVotes: 2156,
    creator: '技术社区',
    options: [
      { id: 401, label: 'JavaScript', count: 4.2 },
      { id: 402, label: 'Python', count: 4.5 },
      { id: 403, label: 'Rust', count: 3.8 },
      { id: 404, label: 'TypeScript', count: 4.1 },
      { id: 405, label: 'Go', count: 3.5 }
    ]
  },
  {
    id: 5,
    title: '2026 新员工满意度打分',
    description: '请对以下各项进行1-10分打分，10分为非常满意。',
    algorithm: 'scoring',
    status: 'ended',
    createdAt: now - 60 * DAY,
    endAt: now - 5 * DAY,
    totalVotes: 342,
    creator: 'HR部门',
    options: [
      { id: 501, label: '入职培训体验', count: 8.5 },
      { id: 502, label: '办公环境', count: 7.2 },
      { id: 503, label: '团队协作氛围', count: 8.8 },
      { id: 504, label: '薪资福利', count: 6.5 },
      { id: 505, label: '职业发展机会', count: 7.8 }
    ]
  },
  {
    id: 6,
    title: '最佳团建活动方案征集',
    description: '选出你最喜欢的团建活动方案，我们将按投票结果安排。',
    algorithm: 'single',
    status: 'ended',
    createdAt: now - 45 * DAY,
    endAt: now - 10 * DAY,
    totalVotes: 789,
    creator: '行政部',
    options: [
      { id: 601, label: '户外拓展训练', count: 234 },
      { id: 602, label: '密室逃脱', count: 198 },
      { id: 603, label: '烧烤露营', count: 312 },
      { id: 604, label: '剧本杀', count: 45 }
    ]
  },
  {
    id: 7,
    title: '核心技术栈选型评估',
    description: '请为以下技术方案分配权重，总预算100%。',
    algorithm: 'weighted',
    status: 'ended',
    createdAt: now - 90 * DAY,
    endAt: now - 20 * DAY,
    totalVotes: 56,
    creator: '技术委员会',
    options: [
      { id: 701, label: 'Vue + Node.js', count: 40 },
      { id: 702, label: 'React + Go', count: 30 },
      { id: 703, label: 'Angular + Java', count: 15 },
      { id: 704, label: 'Svelte + Rust', count: 15 }
    ]
  },
  {
    id: 8,
    title: '部门季度之星评选',
    description: '从以下候选人中选出本季度的优秀员工，每人限投一票。',
    algorithm: 'single',
    status: 'pending',
    createdAt: now,
    endAt: now + 30 * DAY,
    totalVotes: 0,
    creator: '刘新宇',
    options: [
      { id: 801, label: '张三', count: 0 },
      { id: 802, label: '李四', count: 0 },
      { id: 803, label: '王五', count: 0 },
      { id: 804, label: '赵六', count: 0 }
    ]
  }
]

// 用户信息
export const currentUser = {
  id: 'u001',
  nickname: '刘新宇',
  avatar: '',
  isCertified: false,
  companyName: '',
  realName: ''
}
