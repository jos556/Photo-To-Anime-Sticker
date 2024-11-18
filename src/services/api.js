import axios from 'axios'

const STABLE_DIFFUSION_API_KEY = import.meta.env.VITE_STABLE_DIFFUSION_API_KEY
const API_URL = 'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/image-to-image'

// 調整圖片尺寸的輔助函數
const resizeImage = (base64Image, targetWidth = 1024, targetHeight = 1024) => {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = targetWidth
      canvas.height = targetHeight
      const ctx = canvas.getContext('2d')
      
      // 使用白色背景
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, targetWidth, targetHeight)
      
      // 計算縮放和位置以保持圖片比例
      const scale = Math.min(targetWidth / img.width, targetHeight / img.height)
      const x = (targetWidth - img.width * scale) / 2
      const y = (targetHeight - img.height * scale) / 2
      
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale)
      resolve(canvas.toDataURL('image/png'))
    }
    img.src = base64Image
  })
}

export const convertImageToAnime = async (imageBase64, styleId, strength) => {
  try {
    const resizedImage = await resizeImage(imageBase64)
    const base64Image = resizedImage.split(',')[1]
    const binaryData = atob(base64Image)
    const byteArray = new Uint8Array(binaryData.length)
    for (let i = 0; i < binaryData.length; i++) {
      byteArray[i] = binaryData.charCodeAt(i)
    }

    const formData = new FormData()
    const imageBlob = new Blob([byteArray], { type: 'image/png' })
    formData.append('init_image', imageBlob)

    // 更新風格提示詞，使其更具體和強調
    const stylePrompts = {
      anime_basic: "masterpiece, best quality, highly detailed anime style, anime key visual, vibrant colors, clean lines, anime illustration, professional anime artwork",
      ghibli: "studio ghibli style, Hayao Miyazaki, painted animation, soft watercolor, detailed backgrounds, warm lighting, ghibli aesthetic, natural atmosphere",
      chibi: "chibi style, super deformed, kawaii, cute anime character, big eyes, simple shapes, pastel colors, adorable, playful anime style",
      sketch: "monochrome anime sketch, detailed line art, manga style drawing, black and white, pencil drawing style, clean linework, artistic anime sketch"
    }

    const prompt = stylePrompts[styleId] || stylePrompts.anime_basic

    // 調整參數以獲得更明顯的風格轉換效果
    formData.append('init_image_mode', 'IMAGE_STRENGTH')
    // 反轉 strength 值，使滑桿值越大，轉換效果越強
    formData.append('image_strength', (1 - (strength / 100)).toString())
    formData.append('steps', '40') // 增加步數
    formData.append('cfg_scale', '12') // 增加提示詞引導強度
    formData.append('samples', '1')
    
    // 添加正面提示詞
    formData.append('text_prompts[0][text]', prompt)
    formData.append('text_prompts[0][weight]', '1')
    
    // 添加負面提示詞以避免不想要的元素
    formData.append('text_prompts[1][text]', 'bad quality, low resolution, worst quality, jpeg artifacts, blurry, distorted, deformed, disfigured, text, watermark, signature')
    formData.append('text_prompts[1][weight]', '-1')

    const response = await axios({
      method: 'post',
      url: API_URL,
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${STABLE_DIFFUSION_API_KEY}`
      },
      data: formData
    })

    return `data:image/png;base64,${response.data.artifacts[0].base64}`
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message)
    throw new Error(error.response?.data?.message || '圖片轉換失敗，請稍後再試')
  }
} 