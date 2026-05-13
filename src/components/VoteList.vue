<template>
  <div class="vote-list-wrapper">
    <!-- 顶部工具栏 -->
    <div class="list-toolbar">
      <span class="list-count">共 <strong>{{ list.length }}</strong> 条记录</span>
      <el-select v-model="sortOrder" size="small" style="width: 120px">
        <el-option label="最新优先" value="newest" />
        <el-option label="票数最多" value="most" />
        <el-option label="即将结束" value="ending" />
      </el-select>
    </div>

    <!-- 列表为空时 -->
    <el-empty v-if="sortedList.length === 0" description="暂无投票记录" :image-size="80" />

    <!-- 投票记录列表 -->
    <transition-group name="list-fade" tag="div" class="vote-list">
      <div
        v-for="item in sortedList"
        :key="item.id"
        class="vote-item"
        :class="{ 'is-ended': item.status === 'ended', 'is-pending': item.status === 'pending' }"
      >
        <!-- 左侧状态条 -->
        <div class="status-stripe" :class="`stripe-${item.status}`"></div>

        <!-- 主体内容 -->
        <div class="item-body">
          <!-- 第一行：标题 + 状态标签 -->
          <div class="item-top">
            <span class="item-title">{{ item.title }}</span>
            <el-tag
              :type="statusTypes[item.status]"
              effect="light"
              size="small"
              round
              class="status-tag"
            >
              {{ statusLabels[item.status] }}
            </el-tag>
          </div>

          <!-- 第二行：算法标签 + 时间信息 -->
          <div class="item-meta">
            <el-tag
              :style="{
                background: algorithmColors[item.algorithm] + '18',
                color: algorithmColors[item.algorithm],
                borderColor: algorithmColors[item.algorithm] + '40'
              }"
              size="small"
              effect="plain"
            >
              {{ algorithmLabels[item.algorithm] }}
            </el-tag>
            <span class="meta-divider">·</span>
            <el-icon class="meta-icon"><Calendar /></el-icon>
            <span class="meta-text">创建于 {{ formatDate(item.createdAt) }}</span>
            <span class="meta-divider">·</span>
            <el-icon class="meta-icon"><Clock /></el-icon>
            <span class="meta-text" :class="{ 'text-warning': isUrgent(item) }">
              {{ getTimeInfo(item) }}
            </span>
          </div>

          <!-- 第三行：票数进度条 -->
          <div class="item-progress">
            <div class="progress-header">
              <div class="voter-info">
                <el-icon><User /></el-icon>
                <span>{{ item.totalVotes }} 人参与</span>
              </div>
              <div class="options-preview">
                <span
                  v-for="opt in item.options.slice(0, 3)"
                  :key="opt.id"
                  class="opt-chip"
                >
                  {{ opt.label }}
                  <strong>{{ opt.count }}</strong>
                </span>
                <span v-if="item.options.length > 3" class="opt-more">
                  +{{ item.options.length - 3 }} 项
                </span>
              </div>
            </div>

            <!-- 多段进度条：每个选项一段 -->
            <div class="multi-progress">
              <el-tooltip
                v-for="opt in item.options"
                :key="opt.id"
                :content="`${opt.label}：${opt.count} 票 (${getOptPct(item, opt)}%)`"
                placement="top"
              >
                <div
                  class="progress-seg"
                  :style="{
                    width: getOptPct(item, opt) + '%',
                    background: algorithmColors[item.algorithm],
                    opacity: 0.6 + (getOptPct(item, opt) / 100) * 0.4,
                    minWidth: opt.count > 0 ? '4px' : '0'
                  }"
                ></div>
              </el-tooltip>
              <div class="progress-bg"></div>
            </div>
          </div>
        </div>

        <!-- 右侧操作按钮 -->
        <div class="item-actions">
          <el-button
            type="primary"
            size="small"
            plain
            :icon="View"
            @click="handleView(item)"
          >
            查看详情
          </el-button>
          <el-popconfirm
            title="确认删除这条投票记录？"
            confirm-button-text="删除"
            cancel-button-text="取消"
            confirm-button-type="danger"
            :icon="WarningFilled"
            icon-color="#f56c6c"
            @confirm="handleDelete(item)"
          >
            <template #reference>
              <el-button
                type="danger"
                size="small"
                plain
                :icon="Delete"
              >
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  View, Delete, Calendar, Clock, User, WarningFilled
} from '@element-plus/icons-vue'
import {
  algorithmLabels,
  algorithmColors,
  statusLabels,
  statusTypes,
  polls
} from '../mock/polls.js'

// ---- Props：外部传入列表；不传则使用 mock 数据 ----
const props = defineProps({
  // 投票列表，每项与 polls.js 结构一致
  data: {
    type: Array,
    default: null
  }
})

const emit = defineEmits(['view', 'delete'])

const router = useRouter()

// 实际渲染的列表：优先使用 props.data，否则用全量 mock
const list = computed(() => props.data ?? polls)

// ---- 排序 ----
const sortOrder = ref('newest')

const sortedList = computed(() => {
  const arr = [...list.value]
  if (sortOrder.value === 'newest') {
    return arr.sort((a, b) => b.createdAt - a.createdAt)
  } else if (sortOrder.value === 'most') {
    return arr.sort((a, b) => b.totalVotes - a.totalVotes)
  } else {
    // 即将结束：已结束的排后面，活跃的按 endAt 升序
    return arr.sort((a, b) => {
      if (a.status === 'ended' && b.status !== 'ended') return 1
      if (a.status !== 'ended' && b.status === 'ended') return -1
      return a.endAt - b.endAt
    })
  }
})

// ---- 工具函数 ----
const formatDate = (ts) => {
  const d = new Date(ts)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const getTimeInfo = (item) => {
  if (item.status === 'ended') return '已结束'
  if (item.status === 'pending') return '待审核'
  const diff = item.endAt - Date.now()
  if (diff <= 0) return '已结束'
  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  if (days > 0) return `剩余 ${days} 天`
  return `剩余 ${hours} 小时`
}

// 不足 1 天时标为紧急
const isUrgent = (item) =>
  item.status === 'active' && (item.endAt - Date.now()) < 86400000

// 每个选项占总票数百分比（用于进度条分段）
const getOptPct = (item, opt) => {
  const total = item.totalVotes || 1
  return Math.round((opt.count / total) * 100)
}

// ---- 操作 ----
const handleView = (item) => {
  emit('view', item)
  if (item.status === 'ended') {
    router.push(`/results/${item.id}`)
  } else {
    router.push(`/vote/${item.id}`)
  }
}

const handleDelete = (item) => {
  emit('delete', item)
  ElMessage.success(`已删除：${item.title}`)
}
</script>

<style scoped>
/* ===== 容器 ===== */
.vote-list-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* ===== 工具栏 ===== */
.list-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2px 4px;
}
.list-count {
  font-size: 13px;
  color: #909399;
}
.list-count strong {
  color: #303133;
  font-weight: 700;
}

/* ===== 列表过渡动画 ===== */
.list-fade-enter-active {
  transition: all 0.3s ease;
}
.list-fade-leave-active {
  transition: all 0.25s ease;
}
.list-fade-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}
.list-fade-leave-to {
  opacity: 0;
  transform: translateX(16px);
}

/* ===== 每一行 ===== */
.vote-item {
  display: flex;
  align-items: stretch;
  background: #fff;
  border-radius: 10px;
  border: 1px solid #ebeef5;
  overflow: hidden;
  transition: box-shadow 0.2s, border-color 0.2s;
}
.vote-item:hover {
  border-color: #c6e0ff;
  box-shadow: 0 4px 16px rgba(64, 158, 255, 0.1);
}
.vote-item.is-ended {
  opacity: 0.75;
}
.vote-item.is-pending {
  border-style: dashed;
}

/* ===== 左侧状态条 ===== */
.status-stripe {
  width: 4px;
  flex-shrink: 0;
}
.stripe-active  { background: #67c23a; }
.stripe-ended   { background: #dcdfe6; }
.stripe-pending { background: #e6a23c; }

/* ===== 主体 ===== */
.item-body {
  flex: 1;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0; /* 防止文字溢出 */
}

/* 标题行 */
.item-top {
  display: flex;
  align-items: center;
  gap: 10px;
}
.item-title {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a2e;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}
.status-tag {
  flex-shrink: 0;
}

/* meta 行 */
.item-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}
.meta-divider {
  color: #dcdfe6;
  font-size: 12px;
}
.meta-icon {
  font-size: 12px;
  color: #c0c4cc;
}
.meta-text {
  font-size: 12px;
  color: #909399;
}
.text-warning {
  color: #e6a23c;
  font-weight: 600;
}

/* 进度区域 */
.item-progress {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.progress-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 6px;
}
.voter-info {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #606266;
}
.voter-info .el-icon {
  font-size: 12px;
  color: #c0c4cc;
}
.options-preview {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}
.opt-chip {
  font-size: 11px;
  color: #909399;
  background: #f5f7fa;
  padding: 2px 7px;
  border-radius: 10px;
  border: 1px solid #e4e7ed;
}
.opt-chip strong {
  color: #303133;
  margin-left: 3px;
}
.opt-more {
  font-size: 11px;
  color: #c0c4cc;
}

/* 多段进度条 */
.multi-progress {
  position: relative;
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  background: #f5f7fa;
  display: flex;
}
.progress-seg {
  height: 100%;
  transition: width 0.6s ease;
  border-radius: 0;
}
.progress-seg:first-child {
  border-radius: 4px 0 0 4px;
}
.progress-seg:last-child {
  border-radius: 0 4px 4px 0;
}
.progress-seg:only-child {
  border-radius: 4px;
}
.progress-bg {
  flex: 1;
  background: transparent;
}

/* ===== 操作按钮区 ===== */
.item-actions {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  padding: 14px 16px;
  border-left: 1px solid #f5f7fa;
  flex-shrink: 0;
}
.item-actions .el-button {
  width: 96px;
  justify-content: center;
}
</style>