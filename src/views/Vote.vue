<template>
  <div class="vote-page" v-if="poll">
    <div class="vote-container">
      <div class="vote-header">
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
        <h1 class="vote-title">{{ poll.title }}</h1>
        <p class="vote-desc">{{ poll.description }}</p>
        <div class="vote-meta">
          <span>发起者：{{ poll.creator }}</span>
          <span v-if="poll.status === 'active'">截止时间：{{ formatDate(poll.endAt) }}</span>
          <span>{{ poll.totalVotes }} 人已参与</span>
        </div>
      </div>

      <div class="vote-body">
        <!-- 单选 -->
        <template v-if="poll.algorithm === 'single'">
          <el-radio-group v-model="singleValue" class="vote-options">
            <div
              v-for="opt in poll.options" :key="opt.id"
              class="vote-option-card" :class="{ selected: singleValue === opt.id }"
              @click="singleValue = opt.id"
            >
              <el-radio :value="opt.id" size="large">{{ opt.label }}</el-radio>
            </div>
          </el-radio-group>
        </template>

        <!-- 多选 -->
        <template v-if="poll.algorithm === 'multiple'">
          <el-checkbox-group v-model="multipleValues" class="vote-options">
            <div
              v-for="opt in poll.options" :key="opt.id"
              class="vote-option-card" :class="{ selected: multipleValues.includes(opt.id) }"
              @click="toggleMultiple(opt.id)"
            >
              <el-checkbox :value="opt.id" size="large">{{ opt.label }}</el-checkbox>
            </div>
          </el-checkbox-group>
          <div class="vote-hint">已选 {{ multipleValues.length }} 项</div>
        </template>

        <!-- 权重分配 -->
        <template v-if="poll.algorithm === 'weighted'">
          <div class="weighted-sum" :style="{ color: usedWeight > 100 ? '#f56c6c' : '#303133' }">
            {{ usedWeight }} / 100
          </div>
          <el-progress
            :percentage="Math.min(usedWeight, 100)"
            :color="usedWeight > 100 ? '#f56c6c' : '#67c23a'"
            :stroke-width="20" :text-inside="true" class="weight-progress"
          />
          <div class="vote-options weighted-list">
            <div v-for="opt in poll.options" :key="opt.id" class="weighted-item">
              <span class="weighted-label">{{ opt.label }}</span>
              <div class="weighted-control">
                <el-button size="small" circle :disabled="(weightValues[opt.id]||0)<=0" @click="adjustWeight(opt.id,-5)">-</el-button>
                <el-input-number v-model="weightValues[opt.id]" :min="0" :max="100" :step="5" size="small" controls-position="right" class="weight-input" />
                <el-button size="small" circle :disabled="(weightValues[opt.id]||0)>=100" @click="adjustWeight(opt.id,5)">+</el-button>
                <span class="weight-pct">{{ weightValues[opt.id] || 0 }}%</span>
              </div>
            </div>
          </div>
        </template>

        <!-- Borda 排序 -->
        <template v-if="poll.algorithm === 'borda'">
          <div class="vote-hint">拖拽选项排序（最上为最喜欢）</div>
          <div class="vote-options borda-list">
            <div v-for="(opt, idx) in bordaOrdered" :key="opt.id" class="borda-item">
              <span class="borda-rank">{{ idx + 1 }}</span>
              <span class="borda-label">{{ opt.label }}</span>
              <div class="borda-actions">
                <el-button size="small" :icon="Top" circle :disabled="idx===0" @click="moveBorda(idx,-1)" />
                <el-button size="small" :icon="Bottom" circle :disabled="idx===bordaOrdered.length-1" @click="moveBorda(idx,1)" />
              </div>
            </div>
          </div>
        </template>

        <!-- 打分制 -->
        <template v-if="poll.algorithm === 'scoring'">
          <div class="vote-options scoring-list">
            <div v-for="opt in poll.options" :key="opt.id" class="scoring-item">
              <span class="scoring-label">{{ opt.label }}</span>
              <el-rate v-model="scoreValues[opt.id]" :max="10" :colors="['#f56c6c','#e6a23c','#67c23a']" show-score score-template="{value} 分" class="scoring-rate" />
            </div>
          </div>
        </template>

        <!-- 已投票提示 -->
        <el-alert
          v-if="hasVoted"
          title="你已参与过此投票"
          type="success"
          show-icon
          :closable="false"
          style="margin-bottom: 16px"
        />

        <!-- 操作按钮 -->
        <div class="submit-area">
          <template v-if="poll.status === 'active' && !hasVoted">
            <el-button type="primary" size="large" :disabled="!canSubmit" :loading="submitting" @click="submitVote">
              <el-icon><Select /></el-icon>提交投票
            </el-button>
            <el-button size="large" @click="$router.push(`/results/${poll.id}`)">查看实时结果</el-button>
          </template>
          <template v-else>
            <el-button type="primary" size="large" @click="$router.push(`/results/${poll.id}`)">
              <el-icon><DataAnalysis /></el-icon>查看结果
            </el-button>
          </template>
        </div>
      </div>
    </div>
  </div>
  <el-empty v-else description="投票不存在" :image-size="120" />
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Select, DataAnalysis, Top, Bottom } from '@element-plus/icons-vue'
import { polls, algorithmLabels, algorithmColors, statusLabels, statusTypes } from '../mock/polls.js'

const route     = useRoute()
const router    = useRouter()
const poll      = computed(() => polls.find(p => p.id === Number(route.params.id)))
const submitting = ref(false)
const hasVoted   = ref(false)

// 单选
const singleValue = ref(null)
// 多选
const multipleValues = ref([])
const toggleMultiple = (id) => {
  const idx = multipleValues.value.indexOf(id)
  idx >= 0 ? multipleValues.value.splice(idx, 1) : multipleValues.value.push(id)
}
// 权重
const weightValues = reactive({})
const usedWeight = computed(() => Object.values(weightValues).reduce((s, v) => s + (v || 0), 0))
const adjustWeight = (id, delta) => {
  weightValues[id] = Math.max(0, Math.min(100, (weightValues[id] || 0) + delta))
}
// Borda
const bordaOrdered = ref([])
const moveBorda = (idx, dir) => {
  const arr = bordaOrdered.value, t = idx + dir
  if (t < 0 || t >= arr.length) return
  ;[arr[idx], arr[t]] = [arr[t], arr[idx]]
}
// 打分
const scoreValues = reactive({})

const canSubmit = computed(() => {
  if (!poll.value) return false
  switch (poll.value.algorithm) {
    case 'single':   return singleValue.value !== null
    case 'multiple': return multipleValues.value.length > 0
    case 'weighted': return Math.abs(usedWeight.value - 100) <= 5
    case 'borda':    return bordaOrdered.value.length === poll.value.options.length
    case 'scoring':  return poll.value.options.every(o => scoreValues[o.id] > 0)
    default: return false
  }
})

// ⭐ 提交时真正更新 polls 里的票数
const submitVote = async () => {
  submitting.value = true
  await new Promise(r => setTimeout(r, 1000))

  const p = poll.value
  const n = p.options.length

  if (p.algorithm === 'single') {
    const opt = p.options.find(o => o.id === singleValue.value)
    if (opt) opt.count++
    p.totalVotes++

  } else if (p.algorithm === 'multiple') {
    multipleValues.value.forEach(id => {
      const opt = p.options.find(o => o.id === id)
      if (opt) opt.count++
    })
    p.totalVotes++

  } else if (p.algorithm === 'weighted') {
    p.options.forEach(o => {
      const w = weightValues[o.id] || 0
      // 累计加权平均（简化：直接累加本次权重，取平均）
      o.count = Math.round(((o.count * p.totalVotes) + w) / (p.totalVotes + 1))
    })
    p.totalVotes++

  } else if (p.algorithm === 'borda') {
    bordaOrdered.value.forEach((opt, idx) => {
      const score = n - 1 - idx   // Borda 分值：第1名得 n-1 分
      const o = p.options.find(o => o.id === opt.id)
      if (o) {
        // 累计平均
        o.count = +((o.count * p.totalVotes + score) / (p.totalVotes + 1)).toFixed(2)
      }
    })
    p.totalVotes++

  } else if (p.algorithm === 'scoring') {
    p.options.forEach(o => {
      const s = scoreValues[o.id] || 0
      o.count = +((o.count * p.totalVotes + s) / (p.totalVotes + 1)).toFixed(1)
    })
    p.totalVotes++
  }

  hasVoted.value = true
  submitting.value = false
  ElMessage.success({ message: '投票成功！感谢你的参与 🎉', duration: 3000 })
  router.push(`/results/${p.id}`)
}

const formatDate = (ts) => {
  const d = new Date(ts)
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
}

onMounted(() => {
  if (poll.value) {
    bordaOrdered.value = [...poll.value.options]
    poll.value.options.forEach(o => { weightValues[o.id] = 0; scoreValues[o.id] = 0 })
  }
})
</script>

<style scoped>
.vote-page { max-width: 800px; margin: 0 auto; padding: 24px; }
.vote-container { background: #fff; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); overflow: hidden; }
.vote-header { padding: 32px 32px 24px; border-bottom: 1px solid #f0f0f0; }
.header-top { display: flex; gap: 8px; margin-bottom: 16px; }
.vote-title { margin: 0 0 8px; font-size: 24px; color: #303133; }
.vote-desc { margin: 0 0 16px; font-size: 14px; color: #606266; line-height: 1.6; }
.vote-meta { display: flex; gap: 24px; font-size: 13px; color: #909399; }
.vote-body { padding: 24px 32px 32px; }
.vote-options { display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px; }
.vote-option-card { display: flex; align-items: center; padding: 16px 20px; border: 2px solid #e4e7ed; border-radius: 10px; cursor: pointer; transition: all 0.2s; }
.vote-option-card:hover { border-color: #409eff; background: #ecf5ff; }
.vote-option-card.selected { border-color: #409eff; background: #ecf5ff; }
.vote-hint { font-size: 13px; color: #909399; margin-bottom: 12px; }
.weighted-sum { font-size: 36px; font-weight: 700; text-align: center; margin-bottom: 8px; }
.weight-progress { margin-bottom: 24px; }
.weighted-list { gap: 16px; }
.weighted-item { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: #fafafa; border-radius: 8px; }
.weighted-label { font-size: 15px; color: #303133; flex: 1; }
.weighted-control { display: flex; align-items: center; gap: 8px; }
.weight-input { width: 100px; }
.weight-pct { width: 40px; text-align: right; font-weight: 600; color: #409eff; }
.borda-list { gap: 8px; }
.borda-item { display: flex; align-items: center; padding: 12px 16px; background: #fafafa; border-radius: 8px; gap: 12px; }
.borda-rank { width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; background: #409eff; color: #fff; border-radius: 50%; font-size: 14px; font-weight: 600; flex-shrink: 0; }
.borda-label { flex: 1; font-size: 15px; }
.borda-actions { display: flex; gap: 4px; }
.scoring-list { gap: 20px; }
.scoring-item { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: #fafafa; border-radius: 8px; }
.scoring-label { font-size: 15px; color: #303133; }
.submit-area { display: flex; justify-content: center; gap: 16px; margin-top: 32px; padding-top: 24px; border-top: 1px solid #f0f0f0; }
</style>