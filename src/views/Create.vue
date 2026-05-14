<template>
  <div class="create-page">
    <div class="create-container">
      <h1 class="page-title">创建投票</h1>

      <el-form :model="form" label-width="100px" class="create-form">
        <el-form-item label="投票标题" required>
          <el-input v-model="form.title" placeholder="请输入投票标题" maxlength="100" show-word-limit />
        </el-form-item>

        <el-form-item label="投票描述">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请描述投票的目的和规则（选填）"
          />
        </el-form-item>

        <el-form-item label="投票算法" required>
          <el-radio-group v-model="form.algorithm" class="algo-radio-group">
            <el-radio
              v-for="(label, key) in algorithmLabels"
              :key="key"
              :value="key"
              class="algo-radio-card"
            >
              <div class="algo-card-inner">
                <el-icon :size="24" :color="algorithmColors[key]">
                  <component :is="getIcon(key)" />
                </el-icon>
                <span class="algo-name">{{ label }}</span>
                <span class="algo-desc">{{ algoDescriptions[key] }}</span>
              </div>
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="截止时间" required>
          <el-date-picker
            v-model="form.endAt"
            type="datetime"
            placeholder="选择截止时间"
            :disabled-date="disabledDate"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="投票选项" required>
          <div class="options-editor">
            <div v-for="(opt, idx) in form.options" :key="idx" class="option-row">
              <span class="option-index">{{ idx + 1 }}</span>
              <el-input v-model="opt.label" :placeholder="'选项 ' + (idx + 1)" />
              <el-button
                type="danger"
                :icon="Delete"
                circle
                size="small"
                :disabled="form.options.length <= 2"
                @click="form.options.splice(idx, 1)"
              />
            </div>
            <el-button
              type="primary"
              link
              :icon="Plus"
              @click="form.options.push({ label: '' })"
              :disabled="form.options.length >= 20"
            >
              添加选项（{{ form.options.length }}/20）
            </el-button>
          </div>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="large" @click="onCreate" :disabled="!canCreate">
            <el-icon><CircleCheck /></el-icon>
            提交审核
          </el-button>
          <el-button size="large" @click="$router.push('/')">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElLoading } from 'element-plus' // 引入 Loading 组件
import { Plus, Delete, CircleCheck } from '@element-plus/icons-vue'
import {
  CircleCheck as IconCheck,
  Select as IconSelect,
  TrendCharts as IconTrend,
  Sort as IconSort,
  Star as IconStar
} from '@element-plus/icons-vue'
import { algorithmLabels, algorithmColors, polls, currentUser } from '../mock/polls.js'
// 💡 导入你之前创建的审核工具函数
import { checkTextSafe } from '../utils/audit.js' 

const router = useRouter()

const getIcon = (key) => ({
  single: IconCheck, multiple: IconSelect,
  weighted: IconTrend, borda: IconSort, scoring: IconStar
}[key] || IconCheck)

const algoDescriptions = {
  single: '每人限选一项', multiple: '每人可选多项',
  weighted: '分配权重总分100', borda: '按喜好排序', scoring: '每项1-10分打分'
}

const form = reactive({
  title: '', description: '', algorithm: 'single',
  endAt: '', options: [{ label: '' }, { label: '' }]
})

const canCreate = computed(() =>
  form.title.trim() && form.algorithm && form.endAt &&
  form.options.every(o => o.label.trim()) && form.options.length >= 2
)

const disabledDate = (time) => time.getTime() < Date.now() - 86400000

// ⭐ 重点修改：改为 async 异步函数以支持审核调用
const onCreate = async () => {
  if (!canCreate.value) return

  // 1. 全屏或区域加载提示，增加仪式感
  const loading = ElLoading.service({
    lock: true,
    text: '智选 AI 正在审核内容安全...',
    background: 'rgba(255, 255, 255, 0.8)'
  })

  try {
    // 2. 汇总所有文本进行一次性审核，节省百度云 QPS 额度
    const contentToAudit = [
      form.title,
      form.description,
      ...form.options.map(o => o.label)
    ].join(' | ')

    // 调用你配置了 API Key 的审核函数
    const audit = await checkTextSafe(contentToAudit)

    if (!audit.safe) {
      // 如果审核不通过，直接拦截并提示原因
      ElMessage.error({
        message: `审核未通过：${audit.msg}`,
        duration: 5000,
        showClose: true
      })
      return 
    }

    // 3. 审核通过，执行原有的创建逻辑
    const newPoll = {
      id: Date.now(),
      title: form.title.trim(),
      description: form.description.trim() || '暂无描述',
      algorithm: form.algorithm,
      status: 'active', // 既然通过了 AI 实时审核，状态可以直接设为进行中
      createdAt: Date.now(),
      endAt: new Date(form.endAt).getTime(),
      totalVotes: 0,
      creator: currentUser.nickname,
      options: form.options.map((o, i) => ({
        id: Date.now() + i + 1,
        label: o.label.trim(),
        count: 0
      }))
    }

    polls.unshift(newPoll) // 插入到响应式数组头部

    ElMessage.success({
      message: '投票已通过 AI 安全审核并成功发布 🎉',
      duration: 3000
    })
    router.push('/mypolls')

  } catch (error) {
    console.error('审核过程发生错误:', error)
    ElMessage.error('安全审核服务响应超时，请重试')
  } finally {
    // 无论成功失败都关闭加载状态
    loading.close()
  }
}
</script>

<style scoped>
.create-page { max-width: 800px; margin: 0 auto; padding: 24px; }
.create-container { background: #fff; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); padding: 32px; }
.page-title { margin: 0 0 32px; font-size: 24px; color: #303133; text-align: center; }
.algo-radio-group { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; width: 100%; }
.algo-radio-card { flex: none !important; margin-right: 0 !important; height: 100%; }
.algo-radio-card :deep(.el-radio__label) { display: block; width: 100%; padding: 0; }
.algo-card-inner { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 16px 12px; border: 2px solid #e4e7ed; border-radius: 10px; transition: all 0.2s; text-align: center; min-width: 120px; }
.algo-radio-card.is-checked .algo-card-inner { border-color: #409eff; background: #ecf5ff; }
.algo-name { font-size: 14px; font-weight: 600; color: #303133; }
.algo-desc { font-size: 11px; color: #909399; }
.options-editor { display: flex; flex-direction: column; gap: 10px; }
.option-row { display: flex; align-items: center; gap: 10px; }
.option-index { width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; background: #409eff; color: #fff; border-radius: 50%; font-size: 13px; font-weight: 600; flex-shrink: 0; }
</style>