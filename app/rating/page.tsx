'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { getState } from '@/lib/store'
import type { PhysiqueRating } from '@/lib/types'

const ROWS: { label: string; key: keyof PhysiqueRating }[] = [
  { label: 'Attractiveness', key: 'attractiveness' },
  { label: 'Physique',       key: 'physique' },
  { label: 'Body Ratios',    key: 'ratios' },
  { label: 'Shoulder Width', key: 'shoulderWidth' },
  { label: 'Potential',      key: 'potential' },
]

function scoreColor(v: number) {
  if (v > 7) return 'var(--green)'
  if (v >= 5) return 'var(--teal)'
  return 'var(--text-sub)'
}

function ScoreFill({ value, delay }: { value: number; delay: number }) {
  const [w, setW] = useState(0)
  useEffect(() => { const t = setTimeout(() => setW((value / 10) * 100), delay); return () => clearTimeout(t) }, [value, delay])
  return (
    <div className="score-track" style={{ flex: 1 }}>
      <div className="score-fill" style={{ width: `${w}%` }} />
    </div>
  )
}

export default function RatingPage() {
  const router = useRouter()
  const [rating, setRating] = useState<PhysiqueRating | null>(null)
  const [image, setImage] = useState<string | null>(null)
  const [ringAnimated, setRingAnimated] = useState(false)

  useEffect(() => {
    const s = getState()
    if (!s.uploadedImageDataUrl) { router.push('/'); return }
    setImage(s.uploadedImageDataUrl)
    setRating(s.rating)
    const t = setTimeout(() => setRingAnimated(true), 400)
    return () => clearTimeout(t)
  }, [router])

  if (!rating) {
    return (
      <main className="min-h-dvh radial-bg flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[var(--teal)] border-t-transparent animate-spin" />
      </main>
    )
  }

  const circumference = 283
  const targetOffset = circumference - (rating.overall / 10) * circumference
  const percentileLabel = `Top ${100 - rating.percentile}%`

  // Split overall into integer and decimal parts
  const overallStr = rating.overall.toFixed(1)
  const [intPart, decPart] = overallStr.split('.')

  return (
    <main className="min-h-dvh bg-black flex flex-col">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '40px 20px 16px' }}>
        <button
          onClick={() => router.push('/onboarding')}
          style={{ fontSize: 24, color: 'var(--text-sub)', background: 'none', border: 'none', cursor: 'pointer', padding: '0 8px 0 0' }}
        >
          ‹
        </button>
        <div style={{ flex: 1 }} />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 32px' }}>

        {/* Score ring + headline */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          style={{ textAlign: 'center', marginBottom: 28 }}
        >
          {/* SVG ring */}
          <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <svg width="120" height="120" viewBox="0 0 100 100">
              {/* Track */}
              <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
              {/* Fill */}
              <circle
                cx="50" cy="50" r="45" fill="none"
                stroke="url(#scoreGrad)" strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray="283"
                strokeDashoffset={ringAnimated ? targetOffset : circumference}
                style={{
                  transform: 'rotate(-90deg)',
                  transformOrigin: '50% 50%',
                  transition: 'stroke-dashoffset 1.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  filter: 'drop-shadow(0 0 6px rgba(92,224,208,0.6))',
                }}
              />
              <defs>
                <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#5ce0d0" />
                  <stop offset="100%" stopColor="#4ade80" />
                </linearGradient>
              </defs>
            </svg>
            {/* Score inside ring */}
            <div style={{ position: 'absolute', textAlign: 'center' }}>
              <span style={{ fontSize: 30, fontWeight: 800, color: '#fff', lineHeight: 1 }}>
                {intPart}
                <span style={{ color: 'var(--teal)' }}>.{decPart}</span>
              </span>
              <div style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 500 }}>/10</div>
            </div>
          </div>

          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Your Physique Score</h1>

          {/* Percentile badge */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
            <span className="teal-badge">{percentileLabel}</span>
          </div>
        </motion.div>

        {/* Photo + quote */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 20 }}
        >
          {image && (
            <div style={{
              flexShrink: 0, width: 72, height: 72,
              borderRadius: 16, overflow: 'hidden',
              border: '1.5px solid var(--teal)',
              boxShadow: '0 0 16px rgba(92,224,208,0.2)',
            }}>
              <img src={image} alt="Your photo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
          <div className="premium-card" style={{ flex: 1, padding: '14px 16px' }}>
            <p style={{ fontSize: 13, fontStyle: 'italic', color: 'var(--text-sub)', lineHeight: 1.55, maxWidth: 280 }}>
              &ldquo;{rating.summary}&rdquo;
            </p>
            <p style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 8 }}>
              Est. body fat: <span style={{ color: 'var(--teal)', fontWeight: 600 }}>{rating.bodyFatEstimate}</span>
            </p>
          </div>
        </motion.div>

        {/* Category scores */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          style={{ marginBottom: 24 }}
        >
          <p className="section-label" style={{ marginBottom: 12 }}>Detailed Analysis</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {ROWS.map((row, i) => {
              const val = rating[row.key] as number
              return (
                <div key={row.key} className="premium-card" style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{row.label}</span>
                    <span style={{ fontSize: 15, fontWeight: 700, color: scoreColor(val) }}>{val.toFixed(1)}</span>
                  </div>
                  <ScoreFill value={val} delay={500 + i * 140} />
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* 90-day plan CTA */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}>
          <p className="section-label" style={{ textAlign: 'center', marginBottom: 12 }}>Your 90-Day Plan</p>
          <div className="premium-card" style={{ textAlign: 'center', padding: '16px', marginBottom: 20 }}>
            <p style={{ fontSize: 13, color: 'var(--text-sub)', lineHeight: 1.55 }}>
              {rating.potential >= 8
                ? <>Your genetic potential is <span style={{ color: '#fff', fontWeight: 600 }}>exceptional</span>. You&apos;re closer to the top than you think.</>
                : <>With the right plan, you can reach the <span style={{ color: '#fff', fontWeight: 600 }}>top 20%</span> in 90 days.</>}
            </p>
          </div>
          <button onClick={() => router.push('/results')} className="btn-white">
            Reveal My Future Body
          </button>
          <button
            onClick={() => router.push('/plan')}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #38bdf8 0%, #5ce0d0 100%)',
              color: '#000',
              border: 'none',
              borderRadius: '16px',
              padding: '18px 24px',
              fontSize: '17px',
              fontWeight: 700,
              cursor: 'pointer',
              marginTop: '12px',
              transition: 'opacity 0.15s, transform 0.15s',
              letterSpacing: '-0.01em',
              fontFamily: 'inherit',
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            Get Personal Diet / Workout
          </button>
          <p style={{ textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginTop: '12px' }}>
            Powered by AI • Built for you
          </p>
        </motion.div>

      </div>
    </main>
  )
}
