import { defineStore } from 'pinia'
import { openDB } from 'idb'

// 初始化 IndexedDB
const dbPromise = openDB('sticker-app', 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('stickers')) {
      db.createObjectStore('stickers', { keyPath: 'id' })
    }
  }
})

export const useStickerStore = defineStore('sticker', {
  state: () => ({
    originalImage: null,
    convertedSticker: null,
    stickerHistory: []
  }),
  
  actions: {
    setOriginalImage(image) {
      this.originalImage = image
    },
    
    async setConvertedSticker(sticker) {
      this.convertedSticker = sticker
      
      try {
        const newSticker = {
          id: Date.now(),
          image: sticker,
          createdAt: new Date()
        }
        
        // 保存到 IndexedDB
        const db = await dbPromise
        await db.put('stickers', newSticker)
        
        // 更新內存中的歷史記錄
        await this.loadHistory()
      } catch (error) {
        console.error('添加貼紙失敗:', error)
        alert('保存失敗，請稍後再試')
      }
    },
    
    clearCurrentSticker() {
      this.originalImage = null
      this.convertedSticker = null
    },

    async deleteSticker(id) {
      try {
        const db = await dbPromise
        await db.delete('stickers', id)
        await this.loadHistory()
      } catch (error) {
        console.error('刪除貼紙失敗:', error)
      }
    },

    async clearHistory() {
      try {
        const db = await dbPromise
        await db.clear('stickers')
        this.stickerHistory = []
      } catch (error) {
        console.error('清空歷史記錄失敗:', error)
      }
    },

    // 從 IndexedDB 加載歷史記錄
    async loadHistory() {
      try {
        const db = await dbPromise
        const stickers = await db.getAll('stickers')
        // 只保留最新的 5 個
        this.stickerHistory = stickers
          .sort((a, b) => b.createdAt - a.createdAt)
          .slice(0, 5)
      } catch (error) {
        console.error('加載歷史記錄失敗:', error)
        this.stickerHistory = []
      }
    }
  }
}) 