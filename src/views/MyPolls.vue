<template>
  <div class="mypolls-page">
    <div class="page-header">
      <h1>我的投票</h1>
      <el-button type="primary" @click="$router.push('/create')">
        <el-icon><Plus /></el-icon>创建投票
      </el-button>
    </div>

    <el-tabs v-model="tab" class="polls-tabs">
      <el-tab-pane label="我创建的" name="created">
        <div v-if="createdPolls.length" class="poll-grid">
          <PollCard v-for="poll in createdPolls" :key="poll.id" :poll="poll" />
        </div>
        <el-empty v-else description="还没有创建过投票" :image-size="100" />
      </el-tab-pane>

      <el-tab-pane label="我参与的" name="voted">
        <div v-if="votedPolls.length" class="poll-grid">
          <PollCard v-for="poll in votedPolls" :key="poll.id" :poll="poll" />
        </div>
        <el-empty v-else description="还没有参与过投票" :image-size="100" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { polls, currentUser } from '../mock/polls.js'
import PollCard from '../components/PollCard.vue'

const tab = ref('created')

// 模拟：用户自己创建的投票（根据 creator 字段匹配）
const createdPolls = computed(() =>
  polls.filter(p => p.creator === currentUser.nickname)
)

// 模拟：已参与的投票（取前几个已结束的）
const votedPolls = computed(() =>
  polls.filter(p => p.status === 'ended').slice(0, 3)
)
</script>

<style scoped>
.mypolls-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.page-header h1 {
  margin: 0;
  font-size: 24px;
  color: #303133;
}
.poll-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 20px;
}
.polls-tabs :deep(.el-tabs__header) {
  margin-bottom: 20px;
}
</style>
