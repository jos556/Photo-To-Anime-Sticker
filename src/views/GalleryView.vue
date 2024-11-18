<template>
  <div class="gallery">
    <h2 class="gallery-title">貼紙作品集</h2>
    
    <div v-if="store.stickerHistory.length === 0" class="empty-state">
      <div class="empty-icon">🖼️</div>
      <p>還沒有任何作品</p>
      <router-link to="/" class="create-button">
        立即創建
      </router-link>
    </div>

    <div v-else>
      <div class="gallery-actions">
        <button class="clear-button" @click="confirmClearHistory">
          清空歷史記錄
        </button>
      </div>

      <div class="gallery-grid">
        <div v-for="sticker in sortedStickers" 
             :key="sticker.id" 
             class="gallery-item"
        >
          <div class="sticker-card">
            <img :src="sticker.image" 
                 :alt="formatDate(sticker.createdAt)" 
                 class="sticker-image"
                 @click="previewSticker(sticker)"
            >
            <div class="sticker-info">
              <span class="date">{{ formatDate(sticker.createdAt) }}</span>
              <div class="actions">
                <button class="action-btn" @click="downloadSticker(sticker)">
                  <span class="icon">💾</span>
                </button>
                <button class="action-btn delete" @click="deleteSticker(sticker.id)">
                  <span class="icon">🗑️</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 預覽模態框 -->
    <div v-if="previewImage" 
         class="modal-overlay"
         @click="closePreview"
    >
      <div class="modal-content" @click.stop>
        <img :src="previewImage" alt="預覽" class="preview-image">
        <button class="close-button" @click="closePreview">×</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useStickerStore } from '../stores/stickerStore'

const store = useStickerStore()
const previewImage = ref(null)

onMounted(async () => {
  await store.loadHistory()
})

// 根據創建時間排序貼紙
const sortedStickers = computed(() => {
  return [...store.stickerHistory].sort((a, b) => b.createdAt - a.createdAt)
})

// 格式化日期
const formatDate = (date) => {
  return new Date(date).toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 下載貼紙
const downloadSticker = (sticker) => {
  const link = document.createElement('a')
  link.href = sticker.image
  link.download = `anime-sticker-${sticker.id}.png`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// 刪除貼紙
const deleteSticker = (id) => {
  if (confirm('確定要刪除這個貼紙嗎？')) {
    store.deleteSticker(id)
  }
}

// 預覽貼紙
const previewSticker = (sticker) => {
  previewImage.value = sticker.image
}

// 關閉預覽
const closePreview = () => {
  previewImage.value = null
}

// 添加清空歷史記錄的方法
const confirmClearHistory = () => {
  if (confirm('確定要清空所有歷史記錄嗎？此操作無法撤銷。')) {
    store.clearHistory()
  }
}
</script>

<style scoped>
.gallery {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.gallery-title {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2rem;
}

.empty-state {
  text-align: center;
  padding: 4rem 1rem;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.create-button {
  display: inline-block;
  padding: 0.8rem 2rem;
  background-color: #42b983;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  margin-top: 1rem;
  transition: background-color 0.3s ease;
}

.create-button:hover {
  background-color: #3aa876;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.gallery-item {
  break-inside: avoid;
}

.sticker-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.sticker-card:hover {
  transform: translateY(-4px);
}

.sticker-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  cursor: pointer;
}

.sticker-info {
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.date {
  font-size: 0.9rem;
  color: #666;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.action-btn:hover {
  background-color: #f0f0f0;
}

.action-btn.delete:hover {
  background-color: #ffe0e0;
}

/* 模態框樣式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
}

.preview-image {
  max-width: 100%;
  max-height: 90vh;
  border-radius: 8px;
}

.close-button {
  position: absolute;
  top: -40px;
  right: 0;
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  padding: 0.5rem;
}

/* 響應式設計 */
@media (max-width: 640px) {
  .gallery-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}

.gallery-actions {
  margin-bottom: 1.5rem;
  text-align: right;
}

.clear-button {
  padding: 0.5rem 1rem;
  background-color: #ff4444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.clear-button:hover {
  background-color: #cc3333;
}
</style> 