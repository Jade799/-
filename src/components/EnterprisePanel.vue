<template>
  <div class="enterprise-panel">
    <div class="profile-header">
      <h2>个人主页</h2>
      <el-tag 
        v-if="userInfo.isCertified" 
        type="success" 
        effect="dark" 
        class="cert-badge"
      >
        <el-icon><Check /></el-icon> 企业认证
      </el-tag>
    </div>

    <div class="user-info">
      <p><strong>昵称：</strong> {{ userInfo.nickname || '未设置' }}</p>
      <p v-if="userInfo.isCertified"><strong>所属企业：</strong> {{ userInfo.companyName }}</p>
      <p v-if="userInfo.isCertified"><strong>真实姓名：</strong> {{ userInfo.realName }}</p>
    </div>

    <el-button type="primary" @click="openDialog">修改完善资料</el-button>

    <el-dialog 
      v-model="dialogVisible" 
      title="修改完善资料" 
      width="500px"
      destroy-on-close
    >
      <el-form :model="formData" :rules="rules" ref="formRef" label-width="90px">
        
        <el-divider content-position="left">基本信息</el-divider>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="formData.nickname" placeholder="请输入您的昵称"></el-input>
        </el-form-item>
        <el-form-item label="修改密码" prop="password">
          <el-input 
            v-model="formData.password" 
            type="password" 
            placeholder="请输入新密码（留空则不修改）" 
            show-password
          ></el-input>
        </el-form-item>

        <el-divider content-position="left">企业认证（选填）</el-divider>
        <el-form-item label="公司全称" prop="companyName">
          <el-input v-model="formData.companyName" placeholder="请输入公司全称进行认证"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="formData.realName" placeholder="请输入您的真实姓名"></el-input>
        </el-form-item>

      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Check } from '@element-plus/icons-vue'

// 模拟当前用户的状态（实际项目中应从 Vuex/Pinia 或 API 获取）
const userInfo = reactive({
  nickname: '刘新宇',
  isCertified: false, // 初始未认证
  companyName: '',
  realName: ''
})

// 控制对话框显隐的变量
const dialogVisible = ref(false)
const formRef = ref(null)

// 绑定在表单上的数据对象
const formData = reactive({
  nickname: '',
  password: '',
  companyName: '',
  realName: ''
})

// 表单校验规则（可根据需求扩展）
const rules = reactive({
  nickname: [
    { required: true, message: '昵称不能为空', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ]
})

// 打开对话框时，将现有信息回显到表单中
const openDialog = () => {
  formData.nickname = userInfo.nickname
  formData.password = '' // 出于安全考虑，通常不回显密码
  formData.companyName = userInfo.companyName
  formData.realName = userInfo.realName
  dialogVisible.value = true
}

// 提交表单事件
const submitForm = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      // 1. 更新基本信息（昵称和密码）
      userInfo.nickname = formData.nickname
      if (formData.password) {
        // 这里可以执行发送新密码到后端的逻辑
        console.log('密码已更新为:', formData.password)
      }

      // 2. 检查企业认证逻辑（必须同时填写公司全称和真实姓名）
      const hasCompany = formData.companyName && formData.companyName.trim() !== ''
      const hasRealName = formData.realName && formData.realName.trim() !== ''

      if (hasCompany && hasRealName) {
        // 认证成功，更新企业资料并点亮企业认证标志
        userInfo.companyName = formData.companyName
        userInfo.realName = formData.realName
        userInfo.isCertified = true
        ElMessage.success('资料修改成功！已为您完成企业认证。')
      } else if (hasCompany || hasRealName) {
        // 填写了其中一项但未填另一项
        ElMessage.warning('资料已更新！若需完成企业认证，请同时填写“公司全称”和“真实姓名”。')
        // 如果原本不是认证状态，就不予以认证
      } else {
        // 未填写企业信息，仅更新普通资料
        ElMessage.success('个人资料修改成功！')
      }

      // 关闭对话框
      dialogVisible.value = false
    } else {
      ElMessage.error('请检查表单输入是否有误')
      return false
    }
  })
}
</script>

<style scoped>
.enterprise-panel {
  padding: 30px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  max-width: 600px;
  margin: 20px auto;
}

.profile-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.profile-header h2 {
  margin: 0;
  margin-right: 15px;
  color: #303133;
  font-size: 24px;
}

.cert-badge {
  font-size: 14px;
  padding: 0 10px;
  height: 28px;
  line-height: 26px;
}

.user-info {
  margin-bottom: 25px;
  font-size: 15px;
  color: #606266;
  line-height: 1.8;
}

.user-info strong {
  color: #303133;
}
</style>