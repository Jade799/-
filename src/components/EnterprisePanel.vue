<template>
  <div class="enterprise-panel-container">
    <div class="info-content-box">
      <div class="display-grid">
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
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">保存修改</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, defineProps, defineEmits } from 'vue'
import { ElMessage } from 'element-plus'
import { Edit } from '@element-plus/icons-vue'

const props = defineProps(['initialUserInfo'])
const emit = defineEmits(['update-user'])

const dialogVisible = ref(false)
const formRef = ref(null)
const formData = reactive({ nickname: '', password: '', companyName: '', realName: '' })

const rules = {
  nickname: [{ required: true, message: '昵称不能为空', trigger: 'blur' }]
}

const openDialog = () => {
  formData.nickname = props.initialUserInfo.nickname
  formData.companyName = props.initialUserInfo.companyName
  formData.realName = props.initialUserInfo.realName
  dialogVisible.value = true
}

const submitForm = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      const updatedData = {
        nickname: formData.nickname,
        companyName: formData.companyName,
        realName: formData.realName,
        isCertified: !!(formData.companyName && formData.realName)
      }
      // 这里的 emit 会同步到父组件，再同步给 UserInfoCard
      emit('update-user', updatedData)
      ElMessage.success('资料同步更新成功')
      dialogVisible.value = false
    }
  })
}
</script>

<style scoped>
.enterprise-panel-container { width: 100%; }
.display-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 30px; }
.info-item { display: flex; flex-direction: column; gap: 8px; }
.info-item .label { font-size: 13px; color: #909399; }
.info-item .value { font-size: 16px; color: #303133; font-weight: 600; }
.action-area { border-top: 1px solid #f0f2f5; padding-top: 25px; }
.edit-btn { padding: 12px 24px; border-radius: 10px; font-weight: 600; }
</style>