<template>
  <div class="uploader">
    <div
      class="upload-area"
      @drop.prevent="handleDrop"
      @dragover.prevent
      @click="triggerFileInput"
    >
      <input
        type="file"
        ref="fileInput"
        @change="handleFileChange"
        accept="image/*"
        class="hidden"
      >
      <div v-if="!preview" class="upload-prompt">
        <i class="upload-icon">📸</i>
        <p>點擊或拖放圖片到這裡</p>
      </div>
      <img v-else :src="preview" class="preview-image" alt="預覽圖">
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useStickerStore } from '../stores/stickerStore'

const store = useStickerStore()
const fileInput = ref(null)
const preview = ref(null)

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    processImage(file)
  }
}

const handleDrop = (event) => {
  const file = event.dataTransfer.files[0]
  if (file && file.type.startsWith('image/')) {
    processImage(file)
  }
}

const processImage = (file) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    preview.value = e.target.result
    store.setOriginalImage(e.target.result)
  }
  reader.readAsDataURL(file)
}
</script>

<style scoped>
.uploader {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

.upload-area {
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-area:hover {
  border-color: #42b983;
}

.upload-prompt {
  padding: 40px 0;
}

.upload-icon {
  font-size: 48px;
  margin-bottom: 10px;
}

.hidden {
  display: none;
}

.preview-image {
  max-width: 100%;
  max-height: 300px;
  border-radius: 4px;
}
</style> 