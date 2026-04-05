'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { generateShareCard } from '@/lib/watermark'

interface Props {
  beforeUrl: string
  afterUrl: string
}

export default function ShareButton({ beforeUrl, afterUrl }: Props) {
  const [state, setState] = useState<'idle' | 'generating' | 'ready' | 'shared'>('idle')
  const [shareUrl, setShareUrl] = useState<string | null>(null)

  const handleGenerate = async () => {
    setState('generating')
    try {
      const card = await generateShareCard(beforeUrl, afterUrl)
      setShareUrl(card)
      setState('ready')
    } catch {
      setState('idle')
    }
  }

  const handleShare = async () => {
    if (!shareUrl) return

    // Convert data URL to blob for Web Share API
    const res = await fetch(shareUrl)
    const blob = await res.blob()
    const file = new File([blob], 'nextbody-transformation.jpg', { type: 'image/jpeg' })

    if (navigator.share && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: '90 Day Transformation — NextBody',
          text: 'Look what NextBody showed me — nextbody.app',
        })
        setState('shared')
      } catch {
        // User cancelled
      }
    } else {
      // Fallback: download
      const a = document.createElement('a')
      a.href = shareUrl
      a.download = 'nextbody-transformation.jpg'
      a.click()
      setState('shared')
    }
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      <AnimatePresence mode="wait">
        {state === 'idle' && (
          <motion.button
            key="generate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleGenerate}
            className="w-full py-4 rounded-2xl text-base font-bold border border-[#00ff88] text-[#00ff88] hover:bg-[rgba(0,255,136,0.1)] transition-all duration-200"
          >
            Share Your Transformation
          </motion.button>
        )}

        {state === 'generating' && (
          <motion.div
            key="generating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full py-4 rounded-2xl text-base font-bold border border-white/20 text-white/50 text-center"
          >
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              Creating your share card…
            </motion.span>
          </motion.div>
        )}

        {state === 'ready' && shareUrl && (
          <motion.div
            key="ready"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-3"
          >
            {/* Preview of share card */}
            <div className="rounded-2xl overflow-hidden border border-[#00ff88]/30">
              <img src={shareUrl} alt="Share preview" className="w-full" />
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleShare}
              className="btn-neon w-full py-4 rounded-2xl text-base font-bold pulse-glow"
            >
              Share to TikTok / Instagram
            </motion.button>

            <p className="text-white/30 text-xs text-center">
              Vertical 9:16 format · Optimized for social media
            </p>
          </motion.div>
        )}

        {state === 'shared' && (
          <motion.div
            key="shared"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-4"
          >
            <p className="text-[#00ff88] font-bold">Shared! Tag us @NextBody</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
