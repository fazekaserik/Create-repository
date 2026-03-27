'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { getState, setState } from '@/lib/store'
import { STATS } from '@/lib/templates'
import type { TransformPeriod, Goal } from '@/lib/types'
import PaywallModal from '@/components/PaywallModal'
import BeforeAfterSlider from '@/components/BeforeAfterSlider'
import ShareButton from '@/components/ShareButton'

const PERIODS: { value: TransformPeriod; label: string; short: string }[] = [
  { value: '1month', label: '1 Month', short: '1M' },
  { value: '3months', label: '3 Months', short: '3M' },
  { value: '6months', label: '6 Months', short: '6M' },
]

export default function ResultsPage() {
  const router = useRouter()
  const [revealed, setRevealed] = useState(false)
  const [activePeriod, setActivePeriod] = useState<TransformPeriod>('1month')
  const [showPaywall, setShowPaywall] = useState(false)
  const [appState, setAppState] = useState(getState())
  const revealRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const s = getState()
    if (!s.uploadedImageDataUrl) { router.push('/'); return }
    setAppState(s)
    setActivePeriod(s.activePeriod || '1month')
    revealRef.current = setTimeout(() => setRevealed(true), 500)
    return () => { if (revealRef.current) clearTimeout(revealRef.current) }
  }, [router])

  const handlePeriodSelect = useCallback((period: TransformPeriod) => {
    if (period !== '1month' && appState.tier === 'free') {
      setShowPaywall(true)
      return
    }
    setActivePeriod(period)
    setState({ activePeriod: period })
  }, [appState.tier])

  const handlePaywallSuccess = useCallback((tier: 'weekly' | 'monthly') => {
    setState({ tier })
    const s = getState()
    setAppState(s)
    setShowPaywall(false)
    setActivePeriod('3months')
    setState({ activePeriod: '3months' })
  }, [])

  const currentImage = appState.transformations?.[activePeriod]
  const isLocked = activePeriod !== '1month' && appState.tier === 'free'
  const stats = appState.goal ? STATS[appState.goal as Goal]?.[activePeriod] : null

  return (
    <main className="min-h-screen radial-bg flex flex-col pb-10">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-6 pb-3">
        <button onClick={() => router.push('/rating')} className="text-[var(--text-muted)] text-sm">‹ Back</button>
        <h1 className="text-base font-black teal">NextBody</h1>
        <div className="w-16" />
      </div>

      <AnimatePresence>
        {!revealed ? (
          <motion.div key="placeholder" exit={{ opacity: 0 }} className="flex-1 flex items-center justify-center">
            <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 1, repeat: Infinity }}>
              <span style={{ fontSize: 52 }}>⚡</span>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="flex flex-col flex-1">

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="text-center px-5 mb-4"
            >
              <h2 className="text-2xl font-black text-white leading-tight">
                {activePeriod === '1month' && 'Your first month result'}
                {activePeriod === '3months' && <>This could be you in <span className="teal-glow">90 days</span></>}
                {activePeriod === '6months' && <>Your <span className="teal-glow">6-month</span> potential</>}
              </h2>
              {stats && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex gap-2 justify-center mt-2"
                >
                  <span className="text-xs px-3 py-1 rounded-full font-semibold teal"
                    style={{ background: 'rgba(92,224,208,0.12)' }}>
                    {stats.muscle}
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full font-semibold text-white"
                    style={{ background: 'rgba(255,255,255,0.08)' }}>
                    {stats.fat}
                  </span>
                </motion.div>
              )}
            </motion.div>

            {/* Before/After slider */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="relative mx-4 rounded-3xl overflow-hidden"
              style={{ aspectRatio: '3/4' }}
            >
              {appState.uploadedImageDataUrl && currentImage ? (
                <BeforeAfterSlider
                  beforeUrl={appState.uploadedImageDataUrl}
                  afterUrl={currentImage}
                  isLocked={isLocked}
                />
              ) : (
                <div className="w-full h-full shimmer rounded-3xl" />
              )}

              {isLocked && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 flex flex-col items-center justify-center z-10"
                  style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}
                >
                  <div className="text-4xl mb-3">🔒</div>
                  <p className="text-white font-bold text-lg mb-1">Unlock full transformation</p>
                  <p className="text-[var(--text-muted)] text-sm mb-5 text-center px-8">
                    See your {activePeriod === '3months' ? '3-month' : '6-month'} physique result
                  </p>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setShowPaywall(true)}
                    className="btn-primary px-8 py-3 pulse-teal"
                    style={{ fontSize: 15 }}
                  >
                    Unlock Now →
                  </motion.button>
                </motion.div>
              )}
            </motion.div>

            {/* Period selector */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="flex gap-2 mx-4 mt-4"
            >
              {PERIODS.map((p) => {
                const locked = p.value !== '1month' && appState.tier === 'free'
                const isActive = activePeriod === p.value
                return (
                  <button
                    key={p.value}
                    onClick={() => handlePeriodSelect(p.value)}
                    className="flex-1 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 relative"
                    style={{
                      background: isActive ? 'var(--teal)' : 'rgba(255,255,255,0.06)',
                      color: isActive ? '#000' : 'rgba(255,255,255,0.55)',
                      boxShadow: isActive ? '0 0 20px rgba(92,224,208,0.5)' : 'none',
                    }}
                  >
                    {locked && <span className="mr-1 text-xs">🔒</span>}
                    {p.label}
                    {p.value === '3months' && !locked && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] px-1.5 py-0.5 rounded-full font-black whitespace-nowrap"
                        style={{ background: 'var(--teal)', color: '#000' }}>
                        BEST
                      </span>
                    )}
                  </button>
                )
              })}
            </motion.div>

            {/* Psychological trigger */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mx-4 mt-4 p-4 rounded-2xl text-center"
              style={{ background: 'rgba(92,224,208,0.05)', border: '1px solid rgba(92,224,208,0.15)' }}
            >
              <p className="text-[var(--text-muted)] text-xs leading-relaxed">
                <span className="teal font-semibold">✦</span> Most users see visible results in 60–90 days<br />
                <span className="teal font-semibold">✦</span> You&apos;re closer than you think
              </p>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="mx-4 mt-4"
            >
              {appState.tier === 'free' ? (
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowPaywall(true)}
                  className="btn-primary w-full py-4 pulse-teal"
                >
                  Unlock Full Transformation →
                </motion.button>
              ) : (
                <ShareButton
                  beforeUrl={appState.uploadedImageDataUrl || ''}
                  afterUrl={currentImage || ''}
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPaywall && (
          <PaywallModal
            previewImageUrl={appState.transformations?.['3months']}
            onClose={() => setShowPaywall(false)}
            onSuccess={handlePaywallSuccess}
          />
        )}
      </AnimatePresence>
    </main>
  )
}
