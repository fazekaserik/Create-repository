'use client'

// Adds "NextBody" watermark to a canvas image
export async function addWatermark(imageUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')!

      ctx.drawImage(img, 0, 0)

      // Watermark style
      const fontSize = Math.max(16, img.width * 0.04)
      ctx.font = `bold ${fontSize}px Inter, sans-serif`
      ctx.fillStyle = 'rgba(255,255,255,0.75)'
      ctx.shadowColor = 'rgba(0,0,0,0.8)'
      ctx.shadowBlur = 6

      const padding = fontSize * 0.5
      const text = 'NextBody'
      const textWidth = ctx.measureText(text).width

      // Bottom-left watermark
      ctx.fillText(text, padding, img.height - padding)

      // Top-right small watermark
      ctx.font = `${fontSize * 0.7}px Inter, sans-serif`
      ctx.fillStyle = 'rgba(255,255,255,0.5)'
      ctx.fillText('nextbody.app', img.width - textWidth - padding, fontSize * 1.2)

      resolve(canvas.toDataURL('image/jpeg', 0.92))
    }
    img.onerror = reject
    img.src = imageUrl
  })
}

// Generate 9:16 vertical share card (TikTok optimized)
export async function generateShareCard(
  beforeUrl: string,
  afterUrl: string,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const W = 1080
    const H = 1920
    const canvas = document.createElement('canvas')
    canvas.width = W
    canvas.height = H
    const ctx = canvas.getContext('2d')!

    // Black background
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, W, H)

    const loadImage = (url: string): Promise<HTMLImageElement> =>
      new Promise((res, rej) => {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => res(img)
        img.onerror = rej
        img.src = url
      })

    Promise.all([loadImage(beforeUrl), loadImage(afterUrl)])
      .then(([before, after]) => {
        const imageH = H * 0.75
        const imageW = W / 2 - 10

        // Before photo (left)
        const beforeAspect = before.naturalWidth / before.naturalHeight
        const beforeDrawH = imageW / beforeAspect
        const beforeOffsetY = (imageH - beforeDrawH) / 2 + H * 0.1

        ctx.save()
        ctx.beginPath()
        ctx.rect(0, H * 0.1, imageW, imageH)
        ctx.clip()
        ctx.drawImage(before, 0, beforeOffsetY, imageW, beforeDrawH)
        ctx.restore()

        // After photo (right)
        const afterAspect = after.naturalWidth / after.naturalHeight
        const afterDrawH = imageW / afterAspect
        const afterOffsetY = (imageH - afterDrawH) / 2 + H * 0.1

        ctx.save()
        ctx.beginPath()
        ctx.rect(imageW + 20, H * 0.1, imageW, imageH)
        ctx.clip()
        ctx.drawImage(after, imageW + 20, afterOffsetY, imageW, afterDrawH)
        ctx.restore()

        // Divider line (neon green)
        ctx.strokeStyle = '#00ff88'
        ctx.lineWidth = 4
        ctx.beginPath()
        ctx.moveTo(W / 2, H * 0.08)
        ctx.lineTo(W / 2, H * 0.88)
        ctx.stroke()

        // Labels
        ctx.font = 'bold 48px Inter, sans-serif'
        ctx.fillStyle = 'rgba(255,255,255,0.7)'
        ctx.textAlign = 'center'
        ctx.fillText('BEFORE', W * 0.25, H * 0.09)
        ctx.fillStyle = '#00ff88'
        ctx.fillText('AFTER', W * 0.75, H * 0.09)

        // Main headline
        ctx.font = 'bold 72px Inter, sans-serif'
        ctx.fillStyle = '#ffffff'
        ctx.textAlign = 'center'
        ctx.shadowColor = '#00ff88'
        ctx.shadowBlur = 20
        ctx.fillText('90 Day Transformation', W / 2, H * 0.9)

        // App name
        ctx.font = 'bold 52px Inter, sans-serif'
        ctx.fillStyle = '#00ff88'
        ctx.shadowColor = '#00ff88'
        ctx.shadowBlur = 30
        ctx.fillText('NextBody', W / 2, H * 0.95)

        resolve(canvas.toDataURL('image/jpeg', 0.95))
      })
      .catch(reject)
  })
}
