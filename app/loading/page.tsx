'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { getState, setState } from '@/lib/store'
import type { BodyType } from '@/lib/types'

const LOADING_PHASES = [
  { text: 'Analyzing your body…', duration: 1800 },
  { text: 'Matching your body type…', duration: 1600 },
  { text: 'Generating your future physique…', duration: 2000 },
  { text: 'Optimizing your potential…', duration: 1600 },
  { text: 'Almost ready…', duration: 1000 },
]

export default function LoadingPage() {
  const router = useRouter()
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [particles, setParticles] = useState<{ x: number; y: number; id: number }[]>([])
  const processedRef = useRef(false)

  // Animate progress bar
  useEffect(() => {
    const totalDuration = LOADING_PHASES.reduce((s, p) => s + p.duration, 0)
    const start = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - start
      setProgress(Math.min((elapsed / totalDuration) * 100, 99))
    }, 50)
    return () => clearInterval(interval)
  }, [])

  // Cycle through phase text
  useEffect(() => {
    let idx = 0
    const advance = () => {
      if (idx >= LOADING_PHASES.length - 1) return
      idx++
      setPhaseIndex(idx)
      setTimeout(advance, LOADING_PHASES[idx].duration)
    }
    setTimeout(advance, LOADING_PHASES[0].duration)
  }, [])

  // Random floating particles
  useEffect(() => {
    const pts = Array.from({ length: 20 }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      id: i,
    }))
    setParticles(pts)
  }, [])

  // Trigger API calls
  useEffect(() => {
    if (processedRef.current) return
    processedRef.current = true

    const run = async () => {
      const state = getState()
      if (!state.uploadedImageDataUrl || !state.goal) {
        router.push('/')
        return
      }

      try {
        // 1. Classify body type
        const classifyRes = await fetch('/api/classify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrl: state.uploadedImageDataUrl }),
        })
        const { bodyType, sex } = await classifyRes.json()
        setState({ bodyType: bodyType as BodyType, sex })

        // 2. Generate 1-month transformation (free tier — always runs)
        const transform1m = await fetch('/api/transform', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageUrl: state.uploadedImageDataUrl,
            bodyType,
            goal: state.goal,
            period: '1month',
          }),
        })
        const { imageUrl: url1m } = await transform1m.json()

        setState({
          transformations: { '1month': url1m },
          activePeriod: '1month',
        })

        // 3. Fire off 3-month and 6-month in parallel (blurred until paid)
        const [t3m, t6m] = await Promise.all([
          fetch('/api/transform', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              imageUrl: state.uploadedImageDataUrl,
              bodyType,
              goal: state.goal,
              period: '3months',
            }),
          }).then((r) => r.json()),
          fetch('/api/transform', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              imageUrl: state.uploadedImageDataUrl,
              bodyType,
              goal: state.goal,
              period: '6months',
            }),
          }).then((r) => r.json()),
        ])

        setState({
          transformations: {
            '1month': url1m,
            '3months': t3m.imageUrl,
            '6months': t6m.imageUrl,
          },
        })

        setProgress(100)
        setTimeout(() => router.push('/results'), 600)
      } catch (err) {
        console.error(err)
        // Even on error, navigate to results with what we have
        setProgress(100)
        setTimeout(() => router.push('/results'), 600)
      }
    }

    run()
  }, [router])

  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center px-5 relative overflow-hidden">
      {/* Background particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-1 h-1 rounded-full bg-[#00ff88]"
          style={{ left: `${p.x}%`, top: `${p.y}%`, opacity: 0.3 }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{
            duration: 2 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Pulsing orb */}
      <motion.div
        className="relative mb-12"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div
          className="w-32 h-32 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0,255,136,0.3) 0%, rgba(0,255,136,0.05) 60%, transparent 100%)',
            boxShadow: '0 0 60px rgba(0,255,136,0.4), 0 0 120px rgba(0,255,136,0.15)',
          }}
        />
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ fontSize: 48 }}
        >
          ⚡
        </div>
      </motion.div>

      {/* Phase text */}
      <div className="h-8 mb-10 text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={phaseIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="text-lg font-semibold text-white/90"
          >
            {LOADING_PHASES[phaseIndex].text}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-xs">
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #00ff88, #00d4ff)' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-white/30">
          <span>Analyzing</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Social proof */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-12 text-white/30 text-xs text-center"
      >
        Most users see visible results in 60–90 days
      </motion.p>
    </main>
  )
}
