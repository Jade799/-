<template>
  <div class="profile-page-wrapper">
    <nav class="mock-navbar">
      <div class="nav-content">
        <div class="nav-left">投票系统</div>
        <div class="nav-center">
          <span class="nav-link active">我的主页</span>
          <span class="nav-link">发现投票</span>
          <span class="nav-link">消息中心</span>
        </div>
        <div class="nav-right">
          <el-icon><Setting /></el-icon>
        </div>
      </div>
    </nav>

    <div class="profile-content-container">
      <section class="user-header-section">
        <UserInfoCard :nickname="globalUserInfo.nickname" />
      </section>

      <div class="content-grid">
        <aside class="sidebar-simple">
          <div class="menu-item active">个人资料</div>
          <div class="menu-item">账户安全</div>
          <div class="menu-item">隐私设置</div>
          <div class="menu-item">黑名单管理</div>
        </aside>

        <main class="main-panel">
          <div class="setting-card">
            <div class="card-header">
              <span class="blue-line"></span>
              <h3>账户设置</h3>
            </div>
            <EnterprisePanel 
              :initialUserInfo="globalUserInfo" 
              @update-user="handleUserUpdate" 
            />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import UserInfoCard from '../components/UserInfoCard.vue'
import EnterprisePanel from '../components/EnterprisePanel.vue'
import { Setting } from '@element-plus/icons-vue'

// 这里的对象包含所有需要同步的信息
const globalUserInfo = reactive({
  nickname: '用户1004',
  isCertified: false,
  companyName: '',
  realName: ''
})

// 处理子组件传回的更新
const handleUserUpdate = (newInfo) => {
  globalUserInfo.nickname = newInfo.nickname
  globalUserInfo.isCertified = newInfo.isCertified
  globalUserInfo.companyName = newInfo.companyName
  globalUserInfo.realName = newInfo.realName
}
</script>

<style scoped>
.profile-page-wrapper { background-color: #f7f9fc; min-height: 100vh; padding-bottom: 50px; }
.mock-navbar { background: #1e293b; color: #fff; height: 60px; display: flex; align-items: center; margin-bottom: 30px; }
.nav-content { width: 1100px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; padding: 0 20px; }
.nav-link { margin: 0 20px; opacity: 0.7; cursor: pointer; font-size: 14px; transition: 0.3s; }
.nav-link.active, .nav-link:hover { opacity: 1; }
.profile-content-container { max-width: 1100px; margin: 0 auto; display: flex; flex-direction: column; gap: 30px; padding: 0 20px; }
.content-grid { display: grid; grid-template-columns: 220px 1fr; gap: 30px; }
.sidebar-simple { display: flex; flex-direction: column; gap: 5px; }
.menu-item { padding: 12px 20px; border-radius: 10px; cursor: pointer; color: #64748b; transition: 0.3s; }
.menu-item.active { background: #e0e7ff; color: #4f46e5; font-weight: 600; }
.setting-card { background: #fff; border-radius: 20px; padding: 35px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); }
.card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 30px; }
.blue-line { width: 4px; height: 20px; background: #3b82f6; border-radius: 2px; }
.card-header h3 { margin: 0; font-size: 20px; color: #1e293b; }
</style>
