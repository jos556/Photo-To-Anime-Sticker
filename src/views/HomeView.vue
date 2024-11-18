<template>
  <div class="home">
    <div class="content-wrapper">
      <ImageUploader />
      <StyleSelector v-if="store.originalImage" />
      <StickerPreview v-if="store.convertedSticker" />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import ImageUploader from '../components/ImageUploader.vue'
import StyleSelector from '../components/StyleSelector.vue'
import StickerPreview from '../components/StickerPreview.vue'
import { useStickerStore } from '../stores/stickerStore'

const store = useStickerStore()

onMounted(async () => {
  await store.loadHistory()
})
</script>

<style scoped>
.home {
  min-height: calc(100vh - 200px);
}

.content-wrapper {
  max-width: 800px;
  margin: 0 auto;
}
</style> 