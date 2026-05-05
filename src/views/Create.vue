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
            <div
              v-for="(opt, idx) in form.options"
              :key="idx"
              class="option-row"
            >
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
import { ElMessage } from 'element-plus'
import { Plus, Delete, CircleCheck } from '@element-plus/icons-vue'
import {
  CircleCheck as IconCheck,
  Select as IconSelect,
  TrendCharts as IconTrend,
  Sort as IconSort,
  Star as IconStar
} from '@element-plus/icons-vue'
import { algorithmLabels, algorithmColors } from '../mock/polls.js'

const router = useRouter()

const icons = {
  single: 'CircleCheck',
  multiple: 'Select',
  weighted: 'TrendCharts',
  borda: 'Sort',
  scoring: 'Star'
}

const getIcon = (key) => {
  const map = {
    single: IconCheck,
    multiple: IconSelect,
    weighted: IconTrend,
    borda: IconSort,
    scoring: IconStar
  }
  return map[key] || IconCheck
}

const algoDescriptions = {
  single: '每人限选一项',
  multiple: '每人可选多项',
  weighted: '分配权重总分100',
  borda: '按喜好排序',
  scoring: '每项1-10分打分'
}

const form = reactive({
  title: '',
  description: '',
  algorithm: 'single',
  endAt: '',
  options: [{ label: '' }, { label: '' }]
})

const canCreate = computed(() =>
  form.title.trim() &&
  form.algorithm &&
  form.endAt &&
  form.options.every(o => o.label.trim()) &&
  form.options.length >= 2
)

const disabledDate = (time) => time.getTime() < Date.now() - 86400000

const onCreate = () => {
  if (!canCreate.value) return
  ElMessage.success('投票已提交审核，请等待管理员审核通过。')
  router.push('/mypolls')
}
</script>

<style scoped>
.create-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
}
.create-container {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  padding: 32px;
}
.page-title {
  margin: 0 0 32px;
  font-size: 24px;
  color: #303133;
  text-align: center;
}
.algo-radio-group {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
  width: 100%;
}
.algo-radio-card {
  flex: none !important;
  margin-right: 0 !important;
  height: 100%;
}
.algo-radio-card :deep(.el-radio__label) {
  display: block;
  width: 100%;
  padding: 0;
}
.algo-radio-card :deep(.el-radio) {
  display: flex;
  align-items: flex-start;
  height: 100%;
}
.algo-card-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 16px 12px;
  border: 2px solid #e4e7ed;
  border-radius: 10px;
  transition: all 0.2s;
  text-align: center;
  min-width: 120px;
}
.algo-radio-card.is-checked .algo-card-inner {
  border-color: #409eff;
  background: #ecf5ff;
}
.algo-name {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}
.algo-desc {
  font-size: 11px;
  color: #909399;
}
.options-editor {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.option-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.option-index {
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #409eff;
  color: #fff;
  border-radius: 50%;
  font-size: 13px;
  font-weight: 600;
  flex-shrink: 0;
}
</style>
