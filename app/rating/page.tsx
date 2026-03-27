'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { getState } from '@/lib/store'
import type { PhysiqueRating } from '@/lib/types'

const ROWS: { label: string; key: keyof PhysiqueRating; teal?: boolean }[] = [
  { label: 'Attractiveness', key: 'attractiveness', teal: true },
  { label: 'Physique', key: 'physique' },
  { label: 'Body Ratios', key: 'ratios' },
  { label: 'Shoulder Width', key: 'shoulderWidth' },
  { label: 'Potential', key: 'potential', teal: true },
]

function ScoreBar({ label, value, teal, delay }: { label: string; value: number; teal?: boolean; delay: number }) {
  const [w, setW] = useState(0)
  useEffect(() => { const t = setTimeout(() => setW((value / 10) * 100), delay); return () => clearTimeout(t) }, [value, delay])
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className={`text-sm font-semibold shrink-0 ${teal ? 'teal' : 'text-white'}`} style={{ width: 120 }}>{label}</span>
      <div className="hbar-track flex-1">
        <div className={teal ? 'hbar-fill-teal' : 'hbar-fill-white'} style={{ width: `${w}%` }} />
      </div>
      <span className={`text-sm font-bold shrink-0 text-right ${teal ? 'teal' : 'text-white'}`} style={{ width: 32 }}>
        {value.toFixed(1)}
      </span>
    </div>
  )
}

export default function RatingPage() {
  const router = useRouter()
  const [rating, setRating] = useState<PhysiqueRating | null>(null)
  const [image, setImage] = useState<string | null>(null)

  useEffect(() => {
    const s = getState()
    if (!s.uploadedImageDataUrl) { router.push('/'); return }
    setImage(s.uploadedImageDataUrl)
    setRating(s.rating)
  }, [router])

  if (!rating) {
    return (
      <main className="min-h-dvh radial-bg flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[var(--teal)] border-t-transparent animate-spin" />
      </main>
    )
  }

  return (
    <main className="min-h-dvh bg-black flex flex-col">
      {/* Header */}
      <div className="flex items-center px-5 pt-10 pb-4">
        <button onClick={() => router.push('/onboarding')} className="text-[var(--text-sub)] text-lg">‹</button>
        <div className="flex-1" />
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-6">

        {/* Title */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="text-3xl font-black text-white mb-1">Your Physique Score</h1>
          <p className="text-[var(--text-sub)] text-sm mb-6">Honest. Accurate. Actionable.</p>
        </motion.div>

        {/* Overall score + photo row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="flex items-center gap-4 mb-5"
        >
          {image && (
            <div className="shrink-0 rounded-2xl overflow-hidden"
              style={{ width: 80, height: 80, border: '1.5px solid var(--teal)', boxShadow: '0 0 16px rgba(92,224,208,0.25)' }}>
              <img src={image} alt="Your photo" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex-1 dark-card p-4 flex items-center justify-between">
            <div>
              <p className="text-[var(--text-sub)] text-xs mb-1">Overall Score</p>
              <p className="text-4xl font-black teal">{rating.overall.toFixed(1)}<span className="text-lg text-[var(--text-sub)] font-normal">/10</span></p>
            </div>
            <div className="text-right">
              <p className="text-[var(--text-sub)] text-xs mb-1">Percentile</p>
              <p className="text-2xl font-black text-white">Top {100 - rating.percentile}%</p>
            </div>
          </div>
        </motion.div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="dark-card px-4 py-3 mb-5"
          style={{ borderColor: 'rgba(92,224,208,0.2)' }}
        >
          <p className="text-white text-sm font-medium leading-relaxed">"{rating.summary}"</p>
          <p className="text-[var(--text-dim)] text-xs mt-1">Estimated body fat: <span className="teal font-semibold">{rating.bodyFatEstimate}</span></p>
        </motion.div>

        {/* Score bars */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="dark-card px-5 py-5 mb-5"
        >
          <p className="text-[var(--text-sub)] text-xs font-bold uppercase tracking-widest mb-5">Detailed Analysis</p>
          {ROWS.map((row, i) => (
            <ScoreBar key={row.key} label={row.label} value={rating[row.key] as number} teal={row.teal} delay={500 + i * 140} />
          ))}
        </motion.div>

        {/* Callout */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          className="rounded-2xl px-4 py-3 mb-6 text-center"
          style={{ background: 'rgba(92,224,208,0.06)', border: '1px solid rgba(92,224,208,0.18)' }}
        >
          <p className="text-[var(--text-sub)] text-xs leading-relaxed">
            {rating.potential >= 8
              ? <>Your genetic potential is <span className="text-white font-semibold">exceptional</span>. You&apos;re closer to the top than you think.</>
              : <>With the right plan, you can reach the <span className="text-white font-semibold">top 20%</span> in 90 days.</>}
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }}>
          <button onClick={() => router.push('/results')} className="btn-white">
            Reveal My Future Body
          </button>
          <p className="text-center text-[var(--text-dim)] text-xs mt-3">See your 90-day transformation</p>
        </motion.div>
      </div>
    </main>
  )
}
