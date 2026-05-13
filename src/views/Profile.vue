<template>
  <div class="profile-page-wrapper">
    <div class="profile-content-container">
      <section class="user-header-section">
        <UserInfoCard 
          :nickname="globalUserInfo.nickname" 
          :signature="globalUserInfo.signature"
          :avatar="globalUserInfo.avatar"
          :bgImage="globalUserInfo.bgImage"
          :isCertified="globalUserInfo.isCertified"
        />
      </section>

      <div class="content-grid">
        <aside class="sidebar-simple">
          <div class="menu-item active">个人资料</div>
          <div class="menu-item">账户安全</div>
          <div class="menu-item">隐私设置</div>
          <div class="menu-item">黑名单管理</div>
        </aside>

        <main class="dashboard-grid">
          
          <div class="left-content-stack">
            
            <div class="top-row-split">
              <section class="module-card">
                <div class="module-header">
                  <span class="blue-line"></span>
                  <h3>账户设置</h3>
                </div>
                <EnterprisePanel 
                  :initialUserInfo="globalUserInfo" 
                  @update-user="handleUserUpdate" 
                />
              </section>

              <section class="module-card">
                <div class="module-header">
                  <span class="blue-line"></span>
                  <h3>投票记录 (最近6个月)</h3>
                </div>
                <VoteRecords />
              </section>
            </div>

            <section class="module-card stats-overview-module">
              <div class="module-header">
                <span class="blue-line"></span>
                <h3>投票统计概览</h3>
              </div>
              <div class="stats-data-row">
                <div class="stat-card">
                  <span class="stat-value">100</span>
                  <span class="stat-label">已投票 (最近6个月)</span>
                </div>
                <div class="stat-card">
                  <span class="stat-value">25</span>
                  <span class="stat-label">已关注民调</span>
                </div>
                <div class="stat-card">
                  <span class="stat-value">13</span>
                  <span class="stat-label">已关闭民调</span>
                </div>
              </div>
            </section>
          </div>

          <section class="module-card right-activity-column">
            <div class="module-header">
              <span class="blue-line"></span>
              <h3>我的活动</h3>
            </div>
            <ActivityTimeline />
          </section>

        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import UserInfoCard from '../components/UserInfoCard.vue'
import EnterprisePanel from '../components/EnterprisePanel.vue'
import VoteRecords from '../components/VoteRecords.vue'
import ActivityTimeline from '../components/ActivityTimeline.vue'
import { currentUser } from '../mock/polls.js'

const globalUserInfo = currentUser 

const handleUserUpdate = (newInfo) => {
  currentUser.nickname = newInfo.nickname
  currentUser.avatar = newInfo.avatar
  currentUser.bgImage = newInfo.bgImage
  currentUser.signature = newInfo.signature
  currentUser.isCertified = newInfo.isCertified
  currentUser.companyName = newInfo.companyName
  currentUser.realName = newInfo.realName
  localStorage.setItem('user_cache', JSON.stringify(currentUser))
}
</script>

<style scoped>
.profile-page-wrapper { background-color: #f7f9fc; min-height: 100vh; padding: 20px 0 50px; }
.profile-content-container { max-width: 1400px; margin: 0 auto; display: flex; flex-direction: column; gap: 30px; padding: 0 20px; }

.content-grid { display: grid; grid-template-columns: 200px 1fr; gap: 25px; }

/* 🟢 Dashboard 整体网格 */
.dashboard-grid {
  display: grid;
  grid-template-columns: 2fr 1fr; /* 左侧占 2 份宽，右侧活动占 1 份宽 */
  gap: 20px;
  align-items: stretch; /* 确保左右高度对齐 */
}

/* 左侧堆叠区域 */
.left-content-stack {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 左侧第一行双列 */
.top-row-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

/* 右侧活动列高度自适应 */
.right-activity-column {
  height: 100%;
}

/* 统计概览样式 */
.stats-data-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 10px 0;
}
.stat-card {
  background: #f8fafc;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  transition: 0.3s;
}
.stat-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
.stat-value { display: block; font-size: 28px; font-weight: 700; color: #1e293b; }
.stat-label { font-size: 13px; color: #64748b; margin-top: 5px; }

/* 通用样式 */
.module-card { background: #fff; border-radius: 16px; padding: 24px; box-shadow: 0 4px 15px rgba(0,0,0,0.03); border: 1px solid #edf2f7; }
.module-header { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
.blue-line { width: 4px; height: 16px; background: #3b82f6; border-radius: 2px; }
.module-header h3 { margin: 0; font-size: 16px; color: #1e293b; font-weight: 600; }

.sidebar-simple { display: flex; flex-direction: column; gap: 5px; }
.menu-item { padding: 12px 20px; border-radius: 10px; cursor: pointer; color: #64748b; font-size: 14px; }
.menu-item.active { background: #e0e7ff; color: #4f46e5; font-weight: 600; }
</style>