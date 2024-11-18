<template>
  <div class="style-selector">
    <h3 class="title">選擇動漫風格</h3>
    <div class="styles-container">
      <div
        v-for="style in animeStyles"
        :key="style.id"
        class="style-card"
        :class="{ active: selectedStyle === style.id }"
        @click="selectStyle(style.id)"
      >
        <img :src="style.preview" :alt="style.name" class="style-preview">
        <div class="style-info">
          <h4>{{ style.name }}</h4>
          <p>{{ style.description }}</p>
        </div>
      </div>
    </div>

    <div class="style-options" v-if="selectedStyle">
      <div class="strength-slider">
        <label>轉換強度: {{ strength }}%</label>
        <p class="strength-hint">值越大，動漫風格越明顯</p>
        <input
          type="range"
          v-model="strength"
          min="20"
          max="100"
          step="5"
          class="slider"
        >
      </div>
      <button
        class="convert-button"
        @click="handleConvert"
        :disabled="!canConvert || isConverting"
      >
        {{ isConverting ? '轉換中...' : '轉換圖片' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStickerStore } from '../stores/stickerStore'
import { convertImageToAnime } from '../services/api'

const store = useStickerStore()
const selectedStyle = ref(null)
const strength = ref(75)
const isConverting = ref(false)

const animeStyles = [
  {
    id: 'anime_basic',
    name: '基本動漫風格',
    description: '經典日本動漫風格',
    preview: '/styles/anime_basic.png'
  },
  {
    id: 'ghibli',
    name: 'ghibli風格',
    description: '溫暖細膩的ghibli動畫風格',
    preview: '/styles/ghibli.png'
  },
  {
    id: 'chibi',
    name: 'Q版可愛風',
    description: '可愛萌系角色風格',
    preview: '/styles/chibi.png'
  },
  {
    id: 'sketch',
    name: '手繪素描風',
    description: '黑白素描動漫風格',
    preview: '/styles/sketch.png'
  }
]

const canConvert = computed(() => {
  return selectedStyle.value && store.originalImage
})

const selectStyle = (styleId) => {
  selectedStyle.value = styleId
}

const handleConvert = async () => {
  if (!canConvert.value || isConverting.value) return
  
  try {
    isConverting.value = true
    const convertedImage = await convertImageToAnime(
      store.originalImage,
      selectedStyle.value,
      strength.value
    )
    store.setConvertedSticker(convertedImage)
  } catch (error) {
    alert(error.message)
  } finally {
    isConverting.value = false
  }
}
</script>

<style scoped>
.style-selector {
  margin: 0.5rem 0;
}

.title {
  font-size: 1.2rem;
  margin-bottom: 0.8rem;
  color: #2c3e50;
}

.styles-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-bottom: 1rem;
}

.style-card {
  flex: 1;
  min-width: 200px;
  max-width: calc(50% - 0.4rem);
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.style-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.style-card.active {
  border-color: #42b983;
  background-color: #f0faf5;
}

.style-preview {
  width: 100%;
  height: 100px;
  object-fit: cover;
}

.style-info {
  padding: 0.6rem;
}

.style-info h4 {
  margin: 0 0 0.2rem 0;
  color: #2c3e50;
  font-size: 1rem;
}

.style-info p {
  font-size: 0.8rem;
  color: #666;
  margin: 0;
  line-height: 1.2;
}

.style-options {
  background-color: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
  margin-top: 0.8rem;
}

.strength-slider {
  margin-bottom: 1rem;
}

.strength-slider label {
  display: block;
  margin-bottom: 0.3rem;
  color: #2c3e50;
  font-size: 0.9rem;
}

.strength-hint {
  font-size: 0.8rem;
  color: #666;
  margin: 0.2rem 0 0.4rem;
}

.slider {
  width: 100%;
  height: 8px;
  border-radius: 4px;
  -webkit-appearance: none;
  background: #ddd;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  background: #42b983;
  border-radius: 50%;
  cursor: pointer;
}

.convert-button {
  width: 100%;
  padding: 0.8rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.convert-button:hover:not(:disabled) {
  background-color: #3aa876;
}

.convert-button:disabled {
  background-color: #a8a8a8;
  cursor: not-allowed;
  opacity: 0.7;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.7; }
  100% { opacity: 1; }
}

.convert-button:disabled:not(:empty) {
  animation: pulse 1.5s infinite;
}
</style> 