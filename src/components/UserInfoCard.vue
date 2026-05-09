<template>
  <div class="user-header-card">
    <div class="full-cover-bg" :style="{ backgroundImage: `url(${coverImg})` }">
      <div class="glass-mask"></div>
    </div>

    <div class="content-overlay">
      <div class="avatar-wrapper">
        <img :src="avatarImg" class="avatar-main" />
        <div class="vip-badge">VIP</div>
      </div>
      
      <div class="user-info-text">
        <div class="name-row">
          <span class="nickname">{{ nickname }}</span>
        </div>
        <p class="signature">个性签名：我们存在于一生仅此一次的当下</p>
      </div>

      <div class="stats-panel">
        <div class="stat-item"><strong>3698</strong><span>投票</span></div>
        <div class="divider"></div>
        <div class="stat-item"><strong>255</strong><span>关注中</span></div>
        <div class="divider"></div>
        <div class="stat-item"><strong>73</strong><span>关注者</span></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import coverImg from '../assets/backgroud.PNG'
import avatarImg from '../assets/head_portrait.png'

defineProps({
  nickname: String
})
</script>

<style scoped>
/* 此处保留之前所有的精美 CSS，确保不缩水 */
.user-header-card { position: relative; width: 100%; height: 420px; border-radius: 24px; overflow: hidden; display: flex; flex-direction: column; justify-content: flex-end; box-shadow: 0 12px 40px rgba(0,0,0,0.15); }
.full-cover-bg { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-size: cover; background-position: center; z-index: 1; }
.glass-mask { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%); }
.content-overlay { position: relative; z-index: 2; text-align: center; padding-bottom: 30px; color: #ffffff; }
.avatar-wrapper { position: relative; display: inline-block; margin-bottom: 15px; }
.avatar-main { width: 110px; height: 110px; border-radius: 50%; border: 4px solid rgba(255, 255, 255, 0.4); object-fit: cover; }
.vip-badge { position: absolute; bottom: 5px; right: 5px; background: #fadb14; color: #000; font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 5px; }
.nickname { font-size: 26px; font-weight: 600; text-shadow: 0 2px 10px rgba(0,0,0,0.3); }
.signature { font-size: 14px; opacity: 0.9; margin: 10px 0 25px; }
.stats-panel { display: inline-flex; align-items: center; gap: 40px; background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(10px); padding: 15px 40px; border-radius: 50px; border: 1px solid rgba(255, 255, 255, 0.2); }
.stat-item { display: flex; flex-direction: column; }
.stat-item strong { font-size: 18px; }
.stat-item span { font-size: 12px; opacity: 0.7; }
.divider { width: 1px; height: 25px; background: rgba(255, 255, 255, 0.3); }
</style>