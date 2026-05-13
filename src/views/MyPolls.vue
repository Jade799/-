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
        <VoteList :data="createdPolls" @delete="handleDelete" />
      </el-tab-pane>

      <el-tab-pane label="我参与的" name="voted">
        <VoteList :data="votedPolls" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { polls, currentUser } from '../mock/polls.js'
import VoteList from '../components/VoteList.vue'

const tab = ref('created')

const createdPolls = computed(() =>
  polls.filter(p => p.creator === currentUser.nickname)
)

const votedPolls = computed(() =>
  polls.filter(p => p.status === 'ended').slice(0, 4)
)

// ⭐ 真正从响应式数组中删除
const handleDelete = (item) => {
  const idx = polls.findIndex(p => p.id === item.id)
  if (idx !== -1) polls.splice(idx, 1)
}
</script>

<style scoped>
.mypolls-page { max-width: 1200px; margin: 0 auto; padding: 24px; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.page-header h1 { margin: 0; font-size: 24px; color: #303133; }
.polls-tabs :deep(.el-tabs__header) { margin-bottom: 20px; }
</style>