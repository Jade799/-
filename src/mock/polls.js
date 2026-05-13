import { reactive } from 'vue'
import defaultAvatar from '../assets/head_portrait.png'
import defaultBg from '../assets/backgroud.PNG'

export const algorithmLabels = { single: '单选', multiple: '多选', weighted: '权重分配', borda: 'Borda 排序', scoring: '打分制' }
export const algorithmColors = { single: '#409eff', multiple: '#67c23a', weighted: '#e6a23c', borda: '#f56c6c', scoring: '#909399' }
export const algorithmIcons  = { single: 'CircleCheck', multiple: 'Select', weighted: 'TrendCharts', borda: 'Sort', scoring: 'Star' }
export const statusLabels    = { pending: '待审核', active: '进行中', ended: '已结束' }
export const statusTypes     = { pending: 'info', active: 'success', ended: 'danger' }

const now = Date.now()
const DAY = 86400000

// ⭐ 改为 reactive 数组，任何组件的增删改都会同步到全局
export const polls = reactive([
  {
    id: 1,
    title: '2024年度最佳编程语言',
    description: '投票选出你心目中最喜欢的编程语言',
    algorithm: 'single',
    status: 'active',
    createdAt: now - 2 * DAY,
    endAt: now + 5 * DAY,
    totalVotes: 128,
    creator: '张三',
    options: [
      { id: 101, label: 'Python',     count: 52 },
      { id: 102, label: 'JavaScript', count: 38 },
      { id: 103, label: 'Go',         count: 24 },
      { id: 104, label: 'Rust',       count: 14 }
    ]
  },
  {
    id: 2,
    title: '团队下午茶选择',
    description: '本周五下午茶，大家来投票决定吃什么，可多选',
    algorithm: 'multiple',
    status: 'active',
    createdAt: now - 1 * DAY,
    endAt: now + 2 * DAY,
    totalVotes: 23,
    creator: '李四',
    options: [
      { id: 201, label: '奶茶', count: 18 },
      { id: 202, label: '咖啡', count: 12 },
      { id: 203, label: '蛋糕', count: 9  },
      { id: 204, label: '水果', count: 6  }
    ]
  },
  {
    id: 3,
    title: '新版UI方案评选',
    description: '请为三套设计方案打分，满分10分',
    algorithm: 'scoring',
    status: 'ended',
    createdAt: now - 10 * DAY,
    endAt: now - 1 * DAY,
    totalVotes: 56,
    creator: '王五',
    options: [
      { id: 301, label: '方案A（深色系）', count: 8.2 },
      { id: 302, label: '方案B（清新风）', count: 7.5 },
      { id: 303, label: '方案C（商务风）', count: 6.9 }
    ]
  },
  {
    id: 4,
    title: '部门预算分配',
    description: '请将100分预算按优先级分配给各项目',
    algorithm: 'weighted',
    status: 'active',
    createdAt: now - 3 * DAY,
    endAt: now + 7 * DAY,
    totalVotes: 15,
    creator: '赵六',
    options: [
      { id: 401, label: '产品研发', count: 40 },
      { id: 402, label: '市场推广', count: 25 },
      { id: 403, label: '人员培训', count: 20 },
      { id: 404, label: '基础设施', count: 15 }
    ]
  },
  {
    id: 5,
    title: '年会节目排名投票',
    description: '按喜好对节目进行排序，帮助我们安排年会流程',
    algorithm: 'borda',
    status: 'ended',
    createdAt: now - 15 * DAY,
    endAt: now - 5 * DAY,
    totalVotes: 89,
    creator: '陈七',
    options: [
      { id: 501, label: '魔术表演', count: 4.2 },
      { id: 502, label: '歌舞节目', count: 3.8 },
      { id: 503, label: '小品相声', count: 3.1 },
      { id: 504, label: '乐器演奏', count: 2.5 }
    ]
  },
  {
    id: 6,
    title: '办公室零食采购',
    description: '投票决定本月零食采购清单',
    algorithm: 'multiple',
    status: 'active',
    createdAt: now - 4 * DAY,
    endAt: now + 3 * DAY,
    totalVotes: 42,
    creator: '孙八',
    options: [
      { id: 601, label: '薯片',   count: 30 },
      { id: 602, label: '坚果',   count: 25 },
      { id: 603, label: '饼干',   count: 18 },
      { id: 604, label: '糖果',   count: 10 },
      { id: 605, label: '巧克力', count: 22 }
    ]
  },
  {
    id: 7,
    title: '团队建设活动选择',
    description: '下个季度团建活动，请大家投票',
    algorithm: 'single',
    status: 'ended',
    createdAt: now - 20 * DAY,
    endAt: now - 3 * DAY,
    totalVotes: 67,
    creator: '周九',
    options: [
      { id: 701, label: '户外拓展', count: 28 },
      { id: 702, label: '密室逃脱', count: 19 },
      { id: 703, label: '桌游竞技', count: 12 },
      { id: 704, label: '烹饪课程', count: 8  }
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
    creator: '用户1004',
    options: [
      { id: 801, label: '张三', count: 0 },
      { id: 802, label: '李四', count: 0 }
    ]
  }
])

<<<<<<< HEAD
// --- 用户信息 ---
const DEFAULT_USER = {
  id: 'u001',
  nickname: '用户1004',
  avatar: defaultAvatar,
  bgImage: defaultBg,
=======
// --- 用户信息持久化 ---

// 1. 定义初始默认值
const DEFAULT_USER = {
  id: 'u001',
  nickname: '用户1004',
  signature: '我们存在于一生仅此一次的当下',
  avatar: defaultAvatar, // 初始头像不再为空
  bgImage: defaultBg,    // 初始背景图
>>>>>>> c0cf92f6bfe91cd9ae8996d51293bf14a4dc2e07
  isCertified: false,
  companyName: '',
  realName: ''
}

const getInitialUser = () => {
  const saved = localStorage.getItem('user_cache')
  if (saved) {
    try { return JSON.parse(saved) } catch (e) { return DEFAULT_USER }
  }
  return DEFAULT_USER
}

export const currentUser = reactive(getInitialUser())