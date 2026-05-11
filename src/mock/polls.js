import { reactive } from 'vue'
// 导入默认图片资源
import defaultAvatar from '../assets/head_portrait.png'
import defaultBg from '../assets/backgroud.PNG'

// --- 投票相关配置（保持不变） ---
export const algorithmLabels = { single: '单选', multiple: '多选', weighted: '权重分配', borda: 'Borda 排序', scoring: '打分制' }
export const algorithmColors = { single: '#409eff', multiple: '#67c23a', weighted: '#e6a23c', borda: '#f56c6c', scoring: '#909399' }
export const algorithmIcons = { single: 'CircleCheck', multiple: 'Select', weighted: 'TrendCharts', borda: 'Sort', scoring: 'Star' }
export const statusLabels = { pending: '待审核', active: '进行中', ended: '已结束' }
export const statusTypes = { pending: 'info', active: 'success', ended: 'danger' }

const now = Date.now()
const DAY = 86400000

// --- 模拟投票数据 ---
export const polls = [
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
  // ... 其他数据可自行保留
]

// --- 🟢 核心修改：用户信息持久化 ---

// 1. 定义初始默认值
const DEFAULT_USER = {
  id: 'u001',
  nickname: '用户1004',
  avatar: defaultAvatar, // 初始头像不再为空
  bgImage: defaultBg,    // 初始背景图
  isCertified: false,
  companyName: '',
  realName: ''
}

// 2. 从本地存储加载数据
const getInitialUser = () => {
  const saved = localStorage.getItem('user_cache')
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch (e) {
      return DEFAULT_USER
    }
  }
  return DEFAULT_USER
}

// 3. 导出全局唯一的响应式对象
export const currentUser = reactive(getInitialUser())