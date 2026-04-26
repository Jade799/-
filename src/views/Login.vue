<template>
  <div class="register-wrapper">
    <el-card class="register-card">
      <h2 class="title">智选投票系统 - 注册</h2>
      
      <el-form :model="form" label-position="top">
        <el-form-item label="账号名称">
          <el-input v-model="form.username" placeholder="请输入手机号或邮箱" />
        </el-form-item>
        
        <el-form-item label="设置密码">
          <el-input v-model="form.password" type="password" show-password placeholder="请输入密码" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" class="w-full" @click="onRegister">立即注册</el-button>
        </el-form-item>
      </el-form>
      
      <div class="footer">
        已有账号？<el-link type="primary">去登录</el-link>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'

const form = reactive({
  username: '',
  password: ''
})

const onRegister = () => {
  if (form.username && form.password) {
    ElMessage.success('注册成功！欢迎加入投票平台')
    console.log('注册数据已准备好，等待后端接口:', form)
  } else {
    ElMessage.warning('请填写完整的账号和密码')
  }
}
</script>

<style scoped>
.register-wrapper {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}
.register-card {
  width: 380px;
  padding: 20px;
  border-radius: 12px;
}
.title {
  text-align: center;
  color: #409eff;
  margin-bottom: 30px;
}
.w-full {
  width: 100%;
}
.footer {
  text-align: center;
  margin-top: 15px;
  font-size: 14px;
}
</style>