/* 卡片整体样式：渐变背景、阴影、圆角，保证视觉层次感 */
.user-info-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
  color: #fff;
  max-width: 400px;
  box-sizing: border-box;
}

/* 头像区域：固定大小，不随内容拉伸 */
.avatar-section {
  flex-shrink: 0;
}

.avatar-wrapper {
  position: relative;
  width: 88px;
  height: 88px;
}

/* 头像样式：圆形、边框、hover动画，默认白色背景（适配头像地址解析失败场景） */
.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.4);
  background: #fff;
  object-fit: cover;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 0 16px rgba(255, 255, 255, 0.5);
}

/* 头像VIP角标：定位在头像右下角，突出标识 */
.avatar-badge {
  position: absolute;
  bottom: 4px;
  right: 4px;
  background: #ffd700;
  color: #333;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: bold;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.badge-text {
  line-height: 1.2;
}

/* 用户信息区域：占满剩余空间，垂直排列 */
.info-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.user-name-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* 用户名样式：加粗、阴影，提升辨识度 */
.username {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

/* 角色标签：区分管理员和普通用户样式 */
.role-tag {
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.role-tag.admin {
  background: rgba(255, 215, 0, 0.9);
  color: #333;
}

.role-tag.normal {
  background: rgba(255, 255, 255, 0.3);
  color: #fff;
}

/* 个性签名样式：浅透明，换行适配 */
.signature {
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
  opacity: 0.9;
  word-break: break-all;
}

/* 响应式适配：移动端变为上下布局，居中显示 */
@media (max-width: 480px) {
  .user-info-card {
    flex-direction: column;
    text-align: center;
    gap: 16px;
    padding: 20px;
  }

  .user-name-row {
    justify-content: center;
  }
}