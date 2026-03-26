'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'

interface Props {
  beforeUrl: string
  afterUrl: string
  isLocked?: boolean
}

export default function BeforeAfterSlider({ beforeUrl, afterUrl, isLocked = false }: Props) {
  const [position, setPosition] = useState(50) // percentage
  const containerRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const pct = Math.max(5, Math.min(95, (x / rect.width) * 100))
    setPosition(pct)
  }, [])

  const onMouseDown = useCallback(() => { dragging.current = true }, [])
  const onMouseUp = useCallback(() => { dragging.current = false }, [])
  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging.current) return
    updatePosition(e.clientX)
  }, [updatePosition])

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    updatePosition(e.touches[0].clientX)
  }, [updatePosition])

  useEffect(() => {
    window.addEventListener('mouseup', onMouseUp)
    return () => window.removeEventListener('mouseup', onMouseUp)
  }, [onMouseUp])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full select-none overflow-hidden rounded-2xl cursor-col-resize"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onTouchMove={onTouchMove}
      onTouchStart={(e) => updatePosition(e.touches[0].clientX)}
    >
      {/* After (right) — full width background */}
      <div className="absolute inset-0">
        <img
          src={afterUrl}
          alt="After transformation"
          className={`w-full h-full object-cover ${isLocked ? 'blur-locked' : ''}`}
          draggable={false}
        />
        {/* After label */}
        <div className="absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded-full bg-[#00ff88] text-black">
          AFTER
        </div>
      </div>

      {/* Before (left) — clipped */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${position}%` }}
      >
        <img
          src={beforeUrl}
          alt="Before"
          className="w-full h-full object-cover"
          style={{ width: `${100 / (position / 100)}%`, maxWidth: 'none' }}
          draggable={false}
        />
        {/* Before label */}
        <div className="absolute top-3 left-3 text-xs font-bold px-2 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm">
          BEFORE
        </div>
      </div>

      {/* Drag handle */}
      <motion.div
        className="absolute top-0 bottom-0 w-0.5 bg-white z-20"
        style={{ left: `${position}%` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-xl cursor-col-resize"
          style={{ boxShadow: '0 0 15px rgba(0,255,136,0.6)' }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M5 8L2 5M2 5L5 2M2 5H14M11 8L14 5M14 5L11 2M14 5H2M2 11L5 8M5 14L2 11M14 11L11 8M11 14L14 11" stroke="#000" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
      </motion.div>

      {/* Watermark */}
      <div className="absolute bottom-3 left-3 text-white/70 text-xs font-bold"
        style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
        NextBody
      </div>
    </div>
  )
}
