<template>
  <div class="profile-page-wrapper">
    <div class="profile-content-container">
      <section class="user-header-section">
        <UserInfoCard 
          :nickname="globalUserInfo.nickname" 
          :avatar="globalUserInfo.avatar"
          :bgImage="globalUserInfo.bgImage"
        />
      </section>

      <div class="content-grid">
        <aside class="sidebar-simple">
          <div class="menu-item active">个人资料</div>
          <div class="menu-item">账户安全</div>
          <div class="menu-item">隐私设置</div>
          <div class="menu-item">黑名单管理</div>
        </aside>

        <main class="three-column-layout">
          
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

          <section class="module-card main-module">
            <div class="module-header">
              <span class="blue-line"></span>
              <h3>投票记录 (最近6个月)</h3>
            </div>
            <VoteRecords />
          </section>

          <section class="module-card">
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

// 直接从 mock 文件引入响应式对象
import { currentUser } from '../mock/polls.js'

// 让 globalUserInfo 指向全局对象，确保响应式一致性
const globalUserInfo = currentUser 

// 处理子组件传回的更新
const handleUserUpdate = (newInfo) => {
  // 🟢 建议使用 Object.assign 或直接批量赋值，确保所有字段同步
  currentUser.nickname = newInfo.nickname
  currentUser.avatar = newInfo.avatar      // 同步更新头像数据
  currentUser.bgImage = newInfo.bgImage    // 同步更新背景图数据
  currentUser.isCertified = newInfo.isCertified
  currentUser.companyName = newInfo.companyName
  currentUser.realName = newInfo.realName
  
  // 如果你希望刷新页面后修改还在，可以取消下面这行的注释（存入浏览器缓存）
  // localStorage.setItem('user_cache', JSON.stringify(currentUser))
}
</script>

<style scoped>
/* 你的 CSS 部分保持不变，非常完美 */
.profile-page-wrapper { background-color: #f7f9fc; min-height: 100vh; padding-bottom: 50px; padding-top: 20px; }
.profile-content-container { max-width: 1200px; margin: 0 auto; display: flex; flex-direction: column; gap: 30px; padding: 0 20px; }
.content-grid { display: grid; grid-template-columns: 200px 1fr; gap: 25px; }
.sidebar-simple { display: flex; flex-direction: column; gap: 5px; }
.menu-item { padding: 12px 20px; border-radius: 10px; cursor: pointer; color: #64748b; transition: 0.3s; font-size: 14px; }
.menu-item.active { background: #e0e7ff; color: #4f46e5; font-weight: 600; }
.three-column-layout { display: grid; grid-template-columns: 280px 1fr 280px; gap: 20px; align-items: start; }
.module-card { background: #fff; border-radius: 16px; padding: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.03); border: 1px solid #edf2f7; }
.module-header { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
.blue-line { width: 4px; height: 16px; background: #3b82f6; border-radius: 2px; }
.module-header h3 { margin: 0; font-size: 16px; color: #1e293b; font-weight: 600; }
.main-module { min-width: 350px; }
</style>