<template>
  <div class="sticker-preview">
    <h3 class="title">轉換結果</h3>
    
    <div class="preview-container">
      <div class="image-comparison">
        <div class="image-wrapper">
          <h4>原始圖片</h4>
          <img :src="store.originalImage" alt="原始圖片" class="preview-image">
        </div>
        <div class="image-wrapper">
          <h4>轉換結果</h4>
          <img :src="store.convertedSticker" alt="轉換結果" class="preview-image">
        </div>
      </div>

      <div class="actions">
        <button class="action-button download" @click="downloadSticker">
          <span class="icon">💾</span> 下載貼紙
        </button>
        <button class="action-button retry" @click="handleRetry">
          <span class="icon">🔄</span> 重新轉換
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStickerStore } from '../stores/stickerStore'

const store = useStickerStore()

const downloadSticker = () => {
  // 創建一個臨時的 a 標籤來下載圖片
  const link = document.createElement('a')
  link.href = store.convertedSticker
  link.download = `anime-sticker-${Date.now()}.png`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const handleRetry = () => {
  store.clearCurrentSticker()
}
</script>

<style scoped>
.sticker-preview {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.title {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

.preview-container {
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 1.5rem;
}

.image-comparison {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

@media (max-width: 640px) {
  .image-comparison {
    grid-template-columns: 1fr;
  }
}

.image-wrapper {
  text-align: center;
}

.image-wrapper h4 {
  margin-bottom: 1rem;
  color: #2c3e50;
}

.preview-image {
  max-width: 100%;
  max-height: 300px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1.5rem;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-button.download {
  background-color: #42b983;
  color: white;
}

.action-button.download:hover {
  background-color: #3aa876;
}

.action-button.retry {
  background-color: #666;
  color: white;
}

.action-button.retry:hover {
  background-color: #555;
}

.icon {
  font-size: 1.2rem;
}

/* 添加動畫效果 */
.sticker-preview {
  animation: slideUp 0.5s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 添加懸停效果 */
.preview-image {
  transition: transform 0.3s ease;
}

.preview-image:hover {
  transform: scale(1.02);
}
</style> 