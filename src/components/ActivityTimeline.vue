<template>
  <div class="activity-timeline">
    <el-timeline>
      <el-timeline-item
        v-for="(activity, index) in activities"
        :key="index"
        :type="activity.type"
        :hollow="true"
        :timestamp="activity.timestamp"
      >
        <div class="activity-content">
          <div class="activity-name">{{ activity.content }}</div>
          <div class="activity-desc">{{ activity.desc }}</div>
        </div>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script setup>
const activities = [
  {
    content: '社区公园翻新',
    timestamp: '提交于 2 天前',
    desc: '状态：待定',
    type: 'primary'
  },
  {
    content: '董事会成员选举',
    timestamp: '提交于 2 周前',
    desc: '状态：已完成',
    type: 'success'
  }
]
</script>

<style scoped>
.activity-timeline {
  padding-left: 5px;
  padding-top: 10px;
}

.activity-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.activity-name {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.activity-desc {
  font-size: 12px;
  color: #94a3b8;
}

/* 调整 Element Plus 时间轴样式以符合截图 */
:deep(.el-timeline-item__node) {
  background-color: #fff;
  border: 2px solid #6366f1;
}

:deep(.el-timeline-item__timestamp) {
  font-size: 11px;
  color: #94a3b8;
  margin-bottom: 8px;
}
</style>