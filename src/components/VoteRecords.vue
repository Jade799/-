<template>
  <div class="vote-records-list">
    <div v-for="item in voteList" :key="item.id" class="vote-item">
      <div class="item-info">
        <div class="item-title">
          <span class="index">{{ item.id }}.</span>
          <span class="text">{{ item.title }}</span>
        </div>
        <div class="item-time">{{ item.time }}</div>
      </div>
      <div class="item-status">
        <el-tag :type="item.status" size="small" effect="plain">
          {{ item.statusLabel }}
        </el-tag>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 模拟投票记录数据
const voteList = ref([
  { id: 1, title: '社区公园翻新', time: '2 days ago', status: 'warning', statusLabel: '待定' },
  { id: 2, title: '董事会成员选举', time: '2 weeks ago', status: 'success', statusLabel: '已完成' }
])
</script>

<style scoped>
.vote-records-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.vote-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f1f5f9;
}

.vote-item:last-child {
  border-bottom: none;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item-title {
  display: flex;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
}

.item-title .index {
  color: #64748b;
}

.item-time {
  font-size: 12px;
  color: #94a3b8;
  padding-left: 20px;
}

.item-status :deep(.el-tag) {
  border-radius: 6px;
  font-weight: 600;
}
</style>