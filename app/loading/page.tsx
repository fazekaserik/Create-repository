'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { getState, setState } from '@/lib/store'
import type { BodyType, PhysiqueRating } from '@/lib/types'

const PHASES = [
  { text: 'Scanning your body…', duration: 1800 },
  { text: 'Analyzing physique & ratios…', duration: 2000 },
  { text: 'Calculating your potential…', duration: 1600 },
  { text: 'Generating your future physique…', duration: 2000 },
  { text: 'Almost ready…', duration: 800 },
]

export default function LoadingPage() {
  const router = useRouter()
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const processed = useRef(false)

  useEffect(() => {
    const total = PHASES.reduce((s, p) => s + p.duration, 0)
    const start = Date.now()
    const iv = setInterval(() => {
      setProgress(Math.min(((Date.now() - start) / total) * 100, 98))
    }, 60)
    return () => clearInterval(iv)
  }, [])

  useEffect(() => {
    let i = 0
    const next = () => {
      if (i >= PHASES.length - 1) return
      i++
      setPhaseIndex(i)
      setTimeout(next, PHASES[i].duration)
    }
    setTimeout(next, PHASES[0].duration)
  }, [])

  useEffect(() => {
    if (processed.current) return
    processed.current = true

    const run = async () => {
      const state = getState()
      if (!state.uploadedImageDataUrl || !state.goal) {
        router.push('/')
        return
      }

      try {
        // Run classify + rate in parallel first
        const [classifyRes, rateRes] = await Promise.all([
          fetch('/api/classify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageUrl: state.uploadedImageDataUrl }),
          }).then(r => r.json()),
          fetch('/api/rate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageUrl: state.uploadedImageDataUrl }),
          }).then(r => r.json()),
        ])

        const { bodyType, sex } = classifyRes
        setState({ bodyType: bodyType as BodyType, sex, rating: rateRes as PhysiqueRating })

        // Generate 1-month in background while user reads rating
        fetch('/api/transform', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageUrl: state.uploadedImageDataUrl,
            bodyType,
            goal: state.goal,
            period: '1month',
          }),
        }).then(r => r.json()).then(({ imageUrl }) => {
          setState({ transformations: { '1month': imageUrl } })
        })

        // Also kick off 3m and 6m in parallel
        fetch('/api/transform', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrl: state.uploadedImageDataUrl, bodyType, goal: state.goal, period: '3months' }),
        }).then(r => r.json()).then(({ imageUrl }) => {
          const s = getState()
          setState({ transformations: { ...s.transformations, '3months': imageUrl } })
        })

        fetch('/api/transform', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrl: state.uploadedImageDataUrl, bodyType, goal: state.goal, period: '6months' }),
        }).then(r => r.json()).then(({ imageUrl }) => {
          const s = getState()
          setState({ transformations: { ...s.transformations, '6months': imageUrl } })
        })

        setProgress(100)
        setTimeout(() => router.push('/rating'), 500)
      } catch (err) {
        console.error(err)
        setProgress(100)
        setTimeout(() => router.push('/rating'), 500)
      }
    }

    run()
  }, [router])

  return (
    <main className="min-h-screen radial-bg flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Floating particles */}
      {Array.from({ length: 16 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: 'var(--teal)',
            opacity: 0.2,
          }}
          animate={{ y: [0, -25, 0], opacity: [0.1, 0.35, 0.1] }}
          transition={{ duration: 2.5 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
        />
      ))}

      {/* Pulsing scan orb */}
      <motion.div
        className="relative mb-12"
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div
          className="w-36 h-36 rounded-full flex items-center justify-center"
          style={{
            background: 'radial-gradient(circle, rgba(92,224,208,0.25) 0%, rgba(92,224,208,0.04) 65%, transparent 100%)',
            boxShadow: '0 0 60px rgba(92,224,208,0.35), 0 0 120px rgba(92,224,208,0.1)',
          }}
        >
          <span style={{ fontSize: 52 }}>⚡</span>
        </div>
        {/* Scanning ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-[var(--teal)]"
          animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.div>

      {/* Phase text */}
      <div className="h-8 mb-10 text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={phaseIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="text-lg font-semibold text-white"
          >
            {PHASES[phaseIndex].text}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-xs">
        <div className="bar-track mb-2">
          <motion.div
            className="bar-fill-teal"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <div className="flex justify-between text-xs text-[var(--text-dim)]">
          <span>Analyzing</span>
          <span className="teal font-semibold">{Math.round(progress)}%</span>
        </div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-10 text-[var(--text-dim)] text-xs text-center"
      >
        Most users see visible results in 60–90 days
      </motion.p>
    </main>
  )
}
