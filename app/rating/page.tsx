'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { getState } from '@/lib/store'
import type { PhysiqueRating } from '@/lib/types'

interface ScoreRow {
  label: string
  key: keyof PhysiqueRating
  teal?: boolean
}

const ROWS: ScoreRow[] = [
  { label: 'Attractiveness', key: 'attractiveness', teal: true },
  { label: 'Physique', key: 'physique' },
  { label: 'Body Ratios', key: 'ratios' },
  { label: 'Shoulder Width', key: 'shoulderWidth' },
  { label: 'Potential', key: 'potential', teal: true },
]

function ScoreBar({ label, value, teal, delay }: { label: string; value: number; teal?: boolean; delay: number }) {
  const [width, setWidth] = useState(0)
  const pct = (value / 10) * 100

  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), delay)
    return () => clearTimeout(t)
  }, [pct, delay])

  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="text-white font-semibold text-sm w-32 shrink-0">{label}</span>
      <div className="flex-1 bar-track">
        <div
          className={teal ? 'bar-fill-teal' : 'bar-fill-white'}
          style={{ width: `${width}%`, transition: 'width 1s cubic-bezier(0.25,0.46,0.45,0.94)' }}
        />
      </div>
      <span className={`text-sm font-bold w-10 text-right ${teal ? 'teal' : 'text-white'}`}>
        {value.toFixed(1)}
      </span>
    </div>
  )
}

function CircleScore({ value, percentile }: { value: number; percentile: number }) {
  const [progress, setProgress] = useState(0)
  const radius = 52
  const circ = 2 * Math.PI * radius
  const dash = (progress / 10) * circ

  useEffect(() => {
    const t = setTimeout(() => setProgress(value), 300)
    return () => clearTimeout(t)
  }, [value])

  return (
    <div className="relative flex items-center justify-center w-36 h-36">
      <svg width="144" height="144" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="72" cy="72" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
        <circle
          cx="72" cy="72" r={radius}
          fill="none"
          stroke="var(--teal)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(0.25,0.46,0.45,0.94)', filter: 'drop-shadow(0 0 6px rgba(92,224,208,0.7))' }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-3xl font-black teal-glow">{progress.toFixed(1)}</div>
        <div className="text-xs text-[var(--text-muted)] mt-0.5">Top {100 - percentile}%</div>
      </div>
    </div>
  )
}

export default function RatingPage() {
  const router = useRouter()
  const [rating, setRating] = useState<PhysiqueRating | null>(null)
  const [image, setImage] = useState<string | null>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const state = getState()
    if (!state.uploadedImageDataUrl) { router.push('/'); return }
    setImage(state.uploadedImageDataUrl)
    setRating(state.rating)
    const t = setTimeout(() => setRevealed(true), 200)
    return () => clearTimeout(t)
  }, [router])

  if (!rating || !revealed) {
    return (
      <main className="min-h-screen radial-bg flex items-center justify-center">
        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1, repeat: Infinity }}>
          <span style={{ fontSize: 48 }}>⚡</span>
        </motion.div>
      </main>
    )
  }

  return (
    <main className="min-h-screen radial-bg flex flex-col px-5 pb-10">
      {/* Header */}
      <div className="flex items-center pt-6 pb-4">
        <button onClick={() => router.push('/')} className="text-[var(--text-muted)] text-sm">‹ Start over</button>
        <h1 className="flex-1 text-center text-base font-black teal">NextBody</h1>
        <div className="w-20" />
      </div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-6"
      >
        <h2 className="text-2xl font-black text-white">Your Physique Analysis</h2>
        <p className="text-[var(--text-muted)] text-sm mt-1">Honest. Brutal. Accurate.</p>
      </motion.div>

      {/* Photo + overall score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="flex gap-4 items-center mb-6"
      >
        {image && (
          <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-[var(--teal)] shrink-0"
            style={{ boxShadow: '0 0 20px rgba(92,224,208,0.3)' }}>
            <img src={image} alt="Your photo" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex-1">
          <CircleScore value={rating.overall} percentile={rating.percentile} />
        </div>
      </motion.div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="card p-4 mb-6 text-center"
        style={{ borderColor: 'rgba(92,224,208,0.2)' }}
      >
        <p className="text-white font-semibold text-sm leading-relaxed">"{rating.summary}"</p>
        <p className="text-[var(--text-dim)] text-xs mt-2">Body fat estimate: <span className="teal font-bold">{rating.bodyFatEstimate}</span></p>
      </motion.div>

      {/* Score bars */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="card p-5 mb-6"
      >
        <h3 className="text-white font-bold text-sm mb-5 uppercase tracking-widest opacity-60">Detailed Scores</h3>
        {ROWS.map((row, i) => (
          <ScoreBar
            key={row.key}
            label={row.label}
            value={rating[row.key] as number}
            teal={row.teal}
            delay={500 + i * 150}
          />
        ))}
      </motion.div>

      {/* Percentile callout */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="card p-4 mb-8 text-center"
        style={{ background: 'rgba(92,224,208,0.06)', borderColor: 'rgba(92,224,208,0.2)' }}
      >
        <p className="text-[var(--text-muted)] text-xs leading-relaxed">
          You are currently in the <span className="text-white font-bold">top {100 - rating.percentile}%</span> physically.
          {rating.potential >= 8
            ? ' Your genetic potential is exceptional — you\'re closer than you think.'
            : ' With the right plan, you can reach the top 20% in 90 days.'}
        </p>
      </motion.div>

      {/* CTA — reveal transformation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
      >
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => router.push('/results')}
          className="btn-primary w-full py-4 pulse-teal"
          style={{ fontSize: 17 }}
        >
          Reveal My Future Body →
        </motion.button>
        <p className="text-center text-[var(--text-dim)] text-xs mt-3">
          See your 90-day transformation
        </p>
      </motion.div>
    </main>
  )
}
