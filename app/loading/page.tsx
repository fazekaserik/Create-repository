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
  { text: 'Generating your transformation…', duration: 2000 },
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
    const iv = setInterval(() => setProgress(Math.min(((Date.now() - start) / total) * 100, 98)), 60)
    return () => clearInterval(iv)
  }, [])

  useEffect(() => {
    let i = 0
    const next = () => { if (i >= PHASES.length - 1) return; i++; setPhaseIndex(i); setTimeout(next, PHASES[i].duration) }
    setTimeout(next, PHASES[0].duration)
  }, [])

  useEffect(() => {
    if (processed.current) return
    processed.current = true
    const run = async () => {
      const state = getState()
      if (!state.uploadedImageDataUrl || !state.goal) { router.push('/'); return }
      try {
        const [classifyRes, rateRes] = await Promise.all([
          fetch('/api/classify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ imageUrl: state.uploadedImageDataUrl }) }).then(r => r.json()),
          fetch('/api/rate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ imageUrl: state.uploadedImageDataUrl }) }).then(r => r.json()),
        ])
        setState({ bodyType: classifyRes.bodyType as BodyType, sex: classifyRes.sex, rating: rateRes as PhysiqueRating })

        const periods = ['1month', '3months', '6months'] as const
        periods.forEach(period => {
          fetch('/api/transform', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ imageUrl: state.uploadedImageDataUrl, bodyType: classifyRes.bodyType, goal: state.goal, period }) })
            .then(r => r.json())
            .then(({ imageUrl }) => { const s = getState(); setState({ transformations: { ...s.transformations, [period]: imageUrl } }) })
        })

        setProgress(100)
        setTimeout(() => router.push('/rating'), 500)
      } catch {
        setProgress(100)
        setTimeout(() => router.push('/rating'), 500)
      }
    }
    run()
  }, [router])

  return (
    <main className="min-h-dvh radial-bg flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Scan animation */}
      <div className="relative mb-10">
        <motion.div
          className="w-32 h-32 rounded-full border border-[var(--teal)]"
          style={{ opacity: 0.6 }}
          animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        />
        <motion.div
          className="absolute inset-4 rounded-full border border-[var(--teal)]"
          animate={{ scale: [1, 1.4], opacity: [0.4, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, delay: 0.3 }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(92,224,208,0.12)', border: '1.5px solid var(--teal)' }}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M4 10V5h5M24 10V5h-5M4 18v5h5M24 18v5h-5" stroke="var(--teal)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="14" cy="14" r="4" stroke="var(--teal)" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>

      <div className="h-7 mb-8 text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={phaseIndex}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="text-base font-semibold text-white"
          >
            {PHASES[phaseIndex].text}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="w-full max-w-xs">
        <div className="hbar-track mb-2">
          <div className="hbar-fill-teal" style={{ width: `${progress}%`, transition: 'width 0.4s' }} />
        </div>
        <div className="flex justify-between text-xs text-[var(--text-dim)]">
          <span>Analyzing</span>
          <span className="teal font-semibold">{Math.round(progress)}%</span>
        </div>
      </div>

      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}
        className="absolute bottom-10 text-[var(--text-dim)] text-xs text-center"
      >
        Most users see visible results in 60–90 days
      </motion.p>
    </main>
  )
}
