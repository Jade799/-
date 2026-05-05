<template>
  <div class="profile-container">
    <h1>个人主页</h1>
    <p>欢迎回来，这是你的投票系统管理后台。</p>
    
    <EnterprisePanel />
    
  </div>
</template>

<script setup>
// 告诉当前页面，去哪里找到我们的组件代码
import EnterprisePanel from '../components/EnterprisePanel.vue'
</script>