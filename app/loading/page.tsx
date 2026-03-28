'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { getState, setState } from '@/lib/store'
import type { BodyType, PhysiqueRating } from '@/lib/types'

const PHASES = [
  { label: 'SCANNING',    text: 'Scanning your body…',              duration: 1800 },
  { label: 'ANALYZING',   text: 'Analyzing physique & ratios…',      duration: 2000 },
  { label: 'CALCULATING', text: 'Calculating your potential…',       duration: 1600 },
  { label: 'GENERATING',  text: 'Generating your transformation…',   duration: 2000 },
  { label: 'FINISHING',   text: 'Almost ready…',                     duration: 800  },
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

      {/* Scan ring */}
      <div className="relative mb-10" style={{ width: 120, height: 120 }}>
        {/* Radial glow behind ring */}
        <div style={{
          position: 'absolute', inset: 0,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(92,224,208,0.18) 0%, transparent 70%)',
        }} />
        {/* Outer pulse ring */}
        <motion.div
          style={{
            position: 'absolute', inset: 0,
            borderRadius: '50%',
            border: '2px solid var(--teal)',
            opacity: 0.5,
          }}
          animate={{ scale: [1, 1.55], opacity: [0.5, 0] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        />
        {/* Inner pulse ring */}
        <motion.div
          style={{
            position: 'absolute', inset: 12,
            borderRadius: '50%',
            border: '2px solid var(--teal)',
          }}
          animate={{ scale: [1, 1.45], opacity: [0.35, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, delay: 0.3 }}
        />
        {/* Center icon */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'rgba(92,224,208,0.10)',
            border: '1.5px solid var(--teal)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(92,224,208,0.2)',
          }}>
            <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
              <path d="M4 10V5h5M24 10V5h-5M4 18v5h5M24 18v5h-5" stroke="var(--teal)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="14" cy="14" r="4" stroke="var(--teal)" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>

      {/* Phase label + text */}
      <div style={{ height: 56, marginBottom: 32, textAlign: 'center' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={phaseIndex}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
          >
            <p className="section-label" style={{ color: 'var(--teal)', marginBottom: 8 }}>
              {PHASES[phaseIndex].label}
            </p>
            <p style={{ fontSize: 18, fontWeight: 600, color: '#fff', lineHeight: 1.3 }}>
              {PHASES[phaseIndex].text}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress bar */}
      <div style={{ width: '100%', maxWidth: 280 }}>
        <div style={{
          height: 3, borderRadius: 2,
          background: 'rgba(255,255,255,0.08)',
          overflow: 'hidden',
          marginBottom: 8,
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            borderRadius: 2,
            background: 'linear-gradient(90deg, #5ce0d0, #4ade80)',
            transition: 'width 0.4s ease',
            boxShadow: '0 0 8px rgba(92,224,208,0.5)',
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>Analyzing</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--teal)' }}>{Math.round(progress)}%</span>
        </div>
      </div>

      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}
        style={{
          position: 'absolute', bottom: 40,
          fontSize: 12, color: 'var(--text-dim)', textAlign: 'center',
        }}
      >
        Most users see visible results in 60–90 days
      </motion.p>
    </main>
  )
}
