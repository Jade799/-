<template>
  <el-card class="poll-card" shadow="hover" @click="$router.push(link)">
    <div class="card-header">
      <el-tag
        :type="statusTypes[poll.status]"
        size="small"
        effect="dark"
        class="status-tag"
      >
        {{ statusLabels[poll.status] }}
      </el-tag>
      <el-tag
        :style="{ background: algorithmColors[poll.algorithm] + '20', color: algorithmColors[poll.algorithm], borderColor: algorithmColors[poll.algorithm] }"
        size="small"
        effect="plain"
      >
        {{ algorithmLabels[poll.algorithm] }}
      </el-tag>
    </div>

    <h3 class="poll-title">{{ poll.title }}</h3>
    <p class="poll-desc">{{ poll.description }}</p>

    <div class="card-footer">
      <div class="meta">
        <span class="meta-item">
          <el-icon><User /></el-icon>
          {{ poll.creator }}
        </span>
        <span class="meta-item" v-if="poll.totalVotes">
          <el-icon><ChatDotSquare /></el-icon>
          {{ poll.totalVotes }} 票
        </span>
      </div>
      <div class="meta">
        <span class="meta-item" v-if="poll.status === 'active'">
          <el-icon><Clock /></el-icon>
          {{ timeLeft }}
        </span>
        <span class="meta-item" v-else-if="poll.status === 'ended'">
          <el-icon><CircleCheck /></el-icon>
          已结束
        </span>
        <span class="meta-item" v-else>
          <el-icon><InfoFilled /></el-icon>
          待审核
        </span>
      </div>
    </div>

    <div class="options-preview">
      <el-progress
        v-for="opt in topOptions"
        :key="opt.id"
        :percentage="opt.pct"
        :color="algorithmColors[poll.algorithm]"
        :stroke-width="6"
        :show-text="false"
        class="option-bar"
      />
    </div>
  </el-card>
</template>

<script setup>
import { computed } from 'vue'
import {
  User, ChatDotSquare, Clock, CircleCheck, InfoFilled
} from '@element-plus/icons-vue'
import {
  algorithmLabels, algorithmColors, statusLabels, statusTypes
} from '../mock/polls.js'

const props = defineProps({
  poll: { type: Object, required: true }
})

const now = Date.now()
const DAY = 86400000

const link = computed(() => {
  if (props.poll.status === 'ended') return `/results/${props.poll.id}`
  if (props.poll.status === 'active') return `/vote/${props.poll.id}`
  return `/vote/${props.poll.id}`
})

const timeLeft = computed(() => {
  const diff = props.poll.endAt - now
  if (diff <= 0) return '已结束'
  const days = Math.floor(diff / DAY)
  const hours = Math.floor((diff % DAY) / 3600000)
  if (days > 0) return `剩余 ${days} 天`
  return `剩余 ${hours} 小时`
})

const topOptions = computed(() => {
  const maxCount = Math.max(...props.poll.options.map(o => o.count), 1)
  return props.poll.options.slice(0, 3).map(o => ({
    ...o,
    pct: Math.round((o.count / maxCount) * 100)
  }))
})
</script>

<style scoped>
.poll-card {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  border-radius: 12px;
  overflow: hidden;
}
.poll-card:hover {
  transform: translateY(-4px);
}
.card-header {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}
.poll-title {
  margin: 0 0 8px;
  font-size: 17px;
  color: #303133;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.poll-desc {
  margin: 0 0 16px;
  font-size: 13px;
  color: #909399;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 12px;
  color: #909399;
}
.meta {
  display: flex;
  gap: 12px;
}
.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}
.options-preview {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.option-bar {
  opacity: 0.5;
}
</style>
