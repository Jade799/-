<template>
  <div class="enterprise-panel-container">
    <div class="info-content-box">
      <div class="display-vertical">
        <div class="info-item">
          <span class="label">当前昵称</span>
          <span class="value">{{ initialUserInfo.nickname }}</span>
        </div>
        <div class="info-item">
          <span class="label">认证状态</span>
          <span class="value">
            <el-tag :type="initialUserInfo.isCertified ? 'success' : 'info'" size="small" effect="plain">
              {{ initialUserInfo.isCertified ? '已完成企业认证' : '个人用户' }}
            </el-tag>
          </span>
        </div>
        <div class="info-item" v-if="initialUserInfo.isCertified">
          <span class="label">所属企业</span>
          <span class="value">{{ initialUserInfo.companyName }}</span>
        </div>
      </div>

      <div class="action-area">
        <el-button type="primary" @click="openDialog" class="edit-btn">
          <el-icon style="margin-right: 8px;"><Edit /></el-icon>
          编辑个人资料
        </el-button>
      </div>
    </div>

    <el-dialog v-model="dialogVisible" title="完善个人与企业信息" width="480px" append-to-body>
      <el-form :model="formData" :rules="rules" ref="formRef" label-position="top">
        
        <el-divider content-position="left">外观设置</el-divider>
        <div class="appearance-edit-section">
          <div class="upload-item">
            <div class="upload-label">更换头像</div>
            <div class="avatar-uploader" @click="triggerFileSelect('avatar')">
              <img v-if="formData.avatar" :src="formData.avatar" class="avatar-preview" />
              <div v-else class="upload-placeholder"><el-icon><Plus /></el-icon></div>
            </div>
          </div>
          
          <div class="upload-item">
            <div class="upload-label">更换背景</div>
            <div class="bg-uploader" @click="triggerFileSelect('bgImage')">
              <img v-if="formData.bgImage" :src="formData.bgImage" class="bg-preview" />
              <div v-else class="upload-placeholder"><el-icon><Plus /></el-icon></div>
            </div>
          </div>
        </div>

        <input type="file" ref="avatarInputRef" style="display: none" accept="image/*" @change="handleFileChange($event, 'avatar')" />
        <input type="file" ref="bgInputRef" style="display: none" accept="image/*" @change="handleFileChange($event, 'bgImage')" />

        <el-divider content-position="left">基本信息</el-divider>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="formData.nickname"></el-input>
        </el-form-item>
        <el-form-item label="修改密码">
          <el-input v-model="formData.password" type="password" placeholder="不修改请留空" show-password></el-input>
        </el-form-item>

        <el-divider content-position="left">企业认证（选填）</el-divider>
        <el-form-item label="公司全称">
          <el-input v-model="formData.companyName" placeholder="请输入公司全称"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名">
          <el-input v-model="formData.realName" placeholder="请输入真实姓名"></el-input>
        </el-form-item>
      </el-form> <template #footer>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">保存修改</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, defineProps, defineEmits } from 'vue'
import { ElMessage } from 'element-plus'
import { Edit, Plus } from '@element-plus/icons-vue'
import axios from 'axios'

const props = defineProps(['initialUserInfo'])
const emit = defineEmits(['update-user'])

const dialogVisible = ref(false)
const formRef = ref(null)
const avatarInputRef = ref(null)
const bgInputRef = ref(null)

const formData = reactive({ 
  nickname: '', 
  password: '', 
  companyName: '', 
  realName: '',
  avatar: '',
  bgImage: ''
})

const rules = {
  nickname: [{ required: true, message: '昵称不能为空', trigger: 'blur' }]
}

const openDialog = () => {
  formData.nickname = props.initialUserInfo.nickname || ''
  formData.companyName = props.initialUserInfo.companyName || ''
  formData.realName = props.initialUserInfo.realName || ''
  formData.avatar = props.initialUserInfo.avatar || ''
  formData.bgImage = props.initialUserInfo.bgImage || ''
  dialogVisible.value = true
}

const triggerFileSelect = (type) => {
  if (type === 'avatar') avatarInputRef.value.click()
  else bgInputRef.value.click()
}

const handleFileChange = (event, type) => {
  const file = event.target.files[0]
  if (!file) return
  if (file.size > 2 * 1024 * 1024) {
    ElMessage.warning('图片不能超过 2MB')
    return
  }
  const reader = new FileReader()
  reader.onload = (e) => {
    if (type === 'avatar') formData.avatar = e.target.result
    else formData.bgImage = e.target.result
  }
  reader.readAsDataURL(file)
}

const submitForm = async () => {
  const valid = await formRef.value.validate()
  if (!valid) return

  try {
    let isCertified = false
    if (formData.companyName && formData.realName) {
      const response = await axios.post('http://localhost:3000/api/verify-enterprise', {
        companyName: formData.companyName,
        realName: formData.realName
      })
      if (response.data.success) isCertified = true
    }

    const updatedData = {
      nickname: formData.nickname,
      companyName: formData.companyName,
      realName: formData.realName,
      avatar: formData.avatar,
      bgImage: formData.bgImage,
      isCertified: isCertified
    }

    emit('update-user', updatedData)
    ElMessage.success(isCertified ? '企业认证成功！' : '资料已同步更新')
    dialogVisible.value = false
  } catch (error) {
    const errorMsg = error.response?.data?.message || '认证失败，信息不匹配'
    ElMessage.error(errorMsg)
  }
}
</script>

<style scoped>
.enterprise-panel-container { background: #fff; border-radius: 16px; padding: 24px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); border: 1px solid #f0f2f5; }
.display-vertical { display: flex; flex-direction: column; gap: 18px; margin-bottom: 26px; }
.info-item { display: flex; justify-content: space-between; align-items: center; padding-bottom: 12px; border-bottom: 1px solid #f8fafc; }
.info-item .label { font-size: 13px; color: #64748b; font-weight: 500; }
.info-item .value { font-size: 14px; color: #0f172a; font-weight: 600; }
.action-area { border-top: 1px solid #f1f5f9; padding-top: 20px; }
.edit-btn { width: 100%; height: 42px; border-radius: 10px; font-weight: 600; background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); border: none; color: white; cursor: pointer; }
.appearance-edit-section { display: flex; gap: 30px; justify-content: center; margin-bottom: 20px; }
.upload-item { display: flex; flex-direction: column; align-items: center; gap: 8px; }
.upload-label { font-size: 12px; color: #94a3b8; }
.avatar-uploader, .bg-uploader { border: 1px dashed #d9d9d9; border-radius: 8px; cursor: pointer; background: #f8fafc; overflow: hidden; }
.avatar-uploader { width: 80px; height: 80px; }
.bg-uploader { width: 120px; height: 80px; }
.avatar-preview, .bg-preview { width: 100%; height: 100%; object-fit: cover; }
.upload-placeholder { display: flex; justify-content: center; align-items: center; height: 100%; color: #8c939d; font-size: 20px; }
:deep(.el-divider__text) { font-weight: bold; color: #4f46e5; }
</style>