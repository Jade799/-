<template>
  <div class="results-page" v-if="poll">
    <div class="results-container">
      <!-- 头部 -->
      <div class="results-header">
        <div class="header-top">
          <el-tag :type="statusTypes[poll.status]" effect="dark" size="small">
            {{ statusLabels[poll.status] }}
          </el-tag>
          <el-tag
            :style="{ background: algorithmColors[poll.algorithm] + '20', color: algorithmColors[poll.algorithm], borderColor: algorithmColors[poll.algorithm] }"
            size="small"
          >
            {{ algorithmLabels[poll.algorithm] }}
          </el-tag>
        </div>
        <h1 class="results-title">{{ poll.title }}</h1>
        <p class="results-desc">{{ poll.description }}</p>
        <div class="results-meta">
          <span>发起者：{{ poll.creator }}</span>
          <span>总参与：{{ poll.totalVotes }} 人</span>
          <span v-if="poll.status === 'ended'">已结束于 {{ formatDate(poll.endAt) }}</span>
        </div>
      </div>

      <!-- 结果图表 -->
      <div class="chart-section">
        <h2 class="section-title">
          <el-icon><DataAnalysis /></el-icon>
          投票结果
        </h2>
        <ResultChart :poll="poll" />
      </div>

      <!-- 详细数据表格 -->
      <div class="data-section">
        <h2 class="section-title">
          <el-icon><List /></el-icon>
          详细数据
        </h2>
        <el-table :data="tableData" stripe style="width: 100%" class="results-table">
          <el-table-column type="index" label="排名" width="70" align="center">
            <template #default="{ $index }">
              <span class="rank-badge" :class="rankClass($index)">{{ $index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="label" label="选项" min-width="160" />
          <el-table-column :label="valueLabel" width="150" align="center">
            <template #default="{ row }">
              <span class="value-cell">{{ formatValue(row.count) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="占比" width="200" align="center">
            <template #default="{ row }">
              <div class="pct-cell">
                <el-progress
                  :percentage="row.pct"
                  :color="algorithmColors[poll.algorithm]"
                  :stroke-width="16"
                  :text-inside="true"
                />
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 操作 -->
      <div class="results-actions">
        <el-button
          v-if="poll.status === 'active'"
          type="primary"
          size="large"
          @click="$router.push(`/vote/${poll.id}`)"
        >
          <el-icon><Select /></el-icon>
          去投票
        </el-button>
        <el-button size="large" @click="$router.push('/')">
          <el-icon><Back /></el-icon>
          返回列表
        </el-button>
      </div>
    </div>
  </div>

  <el-empty v-else description="投票不存在" :image-size="120" />
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { DataAnalysis, List, Select, Back } from '@element-plus/icons-vue'
import { polls, algorithmColors, algorithmLabels, statusLabels, statusTypes } from '../mock/polls.js'
import ResultChart from '../components/ResultChart.vue'

const route = useRoute()
const router = useRouter()

const poll = computed(() => polls.find(p => p.id === Number(route.params.id)))

const valueLabel = computed(() => {
  if (!poll.value) return ''
  switch (poll.value.algorithm) {
    case 'scoring': return '平均分'
    case 'borda': return 'Borda 分数'
    case 'weighted': return '平均权重'
    default: return '得票数'
  }
})

const tableData = computed(() => {
  if (!poll.value) return []
  const total = poll.value.algorithm === 'weighted'
    ? poll.value.options.reduce((s, o) => s + o.count, 0)
    : poll.value.totalVotes
  const sorted = [...poll.value.options].sort((a, b) => b.count - a.count)

  if (poll.value.algorithm === 'weighted') {
    // 权重：显示百分比
    return sorted.map(o => ({
      label: o.label,
      count: ((o.count / total) * 100).toFixed(1),
      pct: Math.round((o.count / total) * 100)
    }))
  }
  if (poll.value.algorithm === 'scoring') {
    // 打分：满分 10 分
    return sorted.map(o => ({
      label: o.label,
      count: o.count.toFixed(1),
      pct: Math.round((o.count / 10) * 100)
    }))
  }
  if (poll.value.algorithm === 'borda') {
    return sorted.map(o => ({
      label: o.label,
      count: o.count.toFixed(2),
      pct: Math.round((o.count / 5) * 100) // 假设满分5
    }))
  }
  // 单选/多选：票数
  return sorted.map(o => ({
    label: o.label,
    count: o.count,
    pct: total > 0 ? Math.round((o.count / total) * 100) : 0
  }))
})

const formatValue = (v) => {
  if (typeof v === 'number') {
    return Number.isInteger(v) ? v.toString() : v.toFixed(1)
  }
  return v
}

const rankClass = (idx) => {
  if (idx === 0) return 'rank-gold'
  if (idx === 1) return 'rank-silver'
  if (idx === 2) return 'rank-bronze'
  return ''
}

const formatDate = (ts) => {
  const d = new Date(ts)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
</script>

<style scoped>
.results-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
}
.results-container {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  overflow: hidden;
}
.results-header {
  padding: 32px 32px 24px;
  border-bottom: 1px solid #f0f0f0;
}
.header-top {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}
.results-title {
  margin: 0 0 8px;
  font-size: 24px;
  color: #303133;
}
.results-desc {
  margin: 0 0 16px;
  font-size: 14px;
  color: #606266;
}
.results-meta {
  display: flex;
  gap: 24px;
  font-size: 13px;
  color: #909399;
}
.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  color: #303133;
  margin: 0 0 16px;
}
.chart-section {
  padding: 32px;
  border-bottom: 1px solid #f0f0f0;
}
.data-section {
  padding: 32px;
}
.results-table :deep(.el-table__cell) {
  padding: 12px 0;
}
.rank-badge {
  display: inline-flex;
  width: 26px;
  height: 26px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 13px;
  font-weight: 700;
  background: #f0f0f0;
  color: #909399;
}
.rank-gold {
  background: #fff7e6;
  color: #faad14;
}
.rank-silver {
  background: #f5f5f5;
  color: #8c8c8c;
}
.rank-bronze {
  background: #fff2e8;
  color: #d46b08;
}
.value-cell {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}
.pct-cell {
  padding: 0 16px;
}
.results-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 24px 32px 32px;
  border-top: 1px solid #f0f0f0;
}
</style>
