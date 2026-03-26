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

const PERIODS: { value: TransformPeriod; label: string }[] = [
  { value: '1month', label: '1 Month' },
  { value: '3months', label: '3 Months' },
  { value: '6months', label: '6 Months' },
]

export default function ResultsPage() {
  const router = useRouter()
  const [revealed, setRevealed] = useState(false)
  const [activePeriod, setActivePeriod] = useState<TransformPeriod>('1month')
  const [showPaywall, setShowPaywall] = useState(false)
  const [state, setLocalState] = useState(getState())
  const revealTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const s = getState()
    if (!s.uploadedImageDataUrl) {
      router.push('/')
      return
    }
    setLocalState(s)
    setActivePeriod(s.activePeriod || '1month')

    // Trigger the wow reveal after a short delay
    revealTimerRef.current = setTimeout(() => setRevealed(true), 400)
    return () => { if (revealTimerRef.current) clearTimeout(revealTimerRef.current) }
  }, [router])

  const handlePeriodSelect = useCallback((period: TransformPeriod) => {
    if (period !== '1month' && state.tier === 'free') {
      setShowPaywall(true)
      return
    }
    setActivePeriod(period)
    setState({ activePeriod: period })
  }, [state.tier])

  const handlePaywallSuccess = useCallback((tier: 'weekly' | 'monthly') => {
    setState({ tier })
    setLocalState(getState())
    setShowPaywall(false)
    // Unlock 3-month by default after payment
    setActivePeriod('3months')
    setState({ activePeriod: '3months' })
  }, [])

  const currentImage = state.transformations?.[activePeriod]
  const isLocked = activePeriod !== '1month' && state.tier === 'free'
  const stats = state.goal ? STATS[state.goal as Goal]?.[activePeriod] : null

  return (
    <main className="min-h-screen bg-black flex flex-col pb-safe">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-6 pb-3">
        <button
          onClick={() => router.push('/')}
          className="text-white/40 text-sm hover:text-white/70 transition-colors"
        >
          ← Start over
        </button>
        <h1 className="text-base font-black neon-green">NextBody</h1>
        <div className="w-16" />
      </div>

      {/* WOW MOMENT: Split reveal */}
      <AnimatePresence>
        {!revealed ? (
          <motion.div
            key="loading-placeholder"
            className="flex-1 flex items-center justify-center"
            exit={{ opacity: 0 }}
          >
            <div className="text-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-5xl mb-4"
              >
                ⚡
              </motion.div>
              <p className="text-white/50 text-sm">Preparing your reveal…</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col flex-1"
          >
            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-center px-5 mb-4"
            >
              <h2 className="text-2xl font-black text-white leading-tight">
                {activePeriod === '1month' && 'Your first month result'}
                {activePeriod === '3months' && (
                  <span>This could be you in <span className="neon-green">90 days</span></span>
                )}
                {activePeriod === '6months' && (
                  <span>Your <span className="neon-green">6-month</span> potential</span>
                )}
              </h2>
              {stats && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex gap-3 justify-center mt-2"
                >
                  <span className="text-xs px-3 py-1 rounded-full bg-[rgba(0,255,136,0.12)] text-[#00ff88] font-semibold">
                    {stats.muscle}
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full bg-[rgba(0,212,255,0.12)] text-[#00d4ff] font-semibold">
                    {stats.fat}
                  </span>
                </motion.div>
              )}
            </motion.div>

            {/* Before / After slider */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="relative mx-4 rounded-2xl overflow-hidden"
              style={{ aspectRatio: '3/4' }}
            >
              {state.uploadedImageDataUrl && currentImage ? (
                <BeforeAfterSlider
                  beforeUrl={state.uploadedImageDataUrl}
                  afterUrl={currentImage}
                  isLocked={isLocked}
                />
              ) : (
                <div className="w-full h-full shimmer rounded-2xl" />
              )}

              {/* Locked overlay */}
              {isLocked && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-10"
                >
                  <div className="text-4xl mb-3">🔒</div>
                  <p className="text-white font-bold text-lg mb-1">Unlock your full transformation</p>
                  <p className="text-white/50 text-sm mb-5 text-center px-6">
                    See your {activePeriod === '3months' ? '3-month' : '6-month'} result
                  </p>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setShowPaywall(true)}
                    className="btn-neon px-8 py-3 rounded-2xl text-base font-bold pulse-glow"
                  >
                    Unlock Now
                  </motion.button>
                </motion.div>
              )}
            </motion.div>

            {/* Period selector */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex gap-2 mx-4 mt-4"
            >
              {PERIODS.map((p) => {
                const locked = p.value !== '1month' && state.tier === 'free'
                const isActive = activePeriod === p.value
                return (
                  <button
                    key={p.value}
                    onClick={() => handlePeriodSelect(p.value)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 relative
                      ${isActive
                        ? 'bg-[#00ff88] text-black shadow-lg'
                        : 'bg-white/[0.06] text-white/60 hover:bg-white/10'
                      }`}
                    style={isActive ? { boxShadow: '0 0 20px rgba(0,255,136,0.5)' } : {}}
                  >
                    {locked && <span className="mr-1">🔒</span>}
                    {p.label}
                    {p.value === '3months' && !locked && (
                      <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-[9px] bg-[#00ff88] text-black px-1.5 py-0.5 rounded-full font-bold whitespace-nowrap">
                        BEST
                      </span>
                    )}
                  </button>
                )
              })}
            </motion.div>

            {/* Psychological triggers */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mx-4 mt-4 p-4 rounded-2xl glass"
            >
              <p className="text-white/60 text-xs text-center leading-relaxed">
                <span className="text-[#00ff88]">✦</span> Most users see visible results in 60–90 days
                <br />
                <span className="text-[#00d4ff]">✦</span> You&apos;re closer than you think
              </p>
            </motion.div>

            {/* CTA section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="mx-4 mt-4 flex flex-col gap-3"
            >
              {state.tier === 'free' ? (
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowPaywall(true)}
                  className="btn-neon w-full py-4 rounded-2xl text-base font-bold pulse-glow"
                >
                  Unlock Full Transformation →
                </motion.button>
              ) : (
                <ShareButton
                  beforeUrl={state.uploadedImageDataUrl || ''}
                  afterUrl={currentImage || ''}
                />
              )}
            </motion.div>

            <div className="h-8" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Paywall Modal */}
      <AnimatePresence>
        {showPaywall && (
          <PaywallModal
            previewImageUrl={state.transformations?.['3months']}
            onClose={() => setShowPaywall(false)}
            onSuccess={handlePaywallSuccess}
          />
        )}
      </AnimatePresence>
    </main>
  )
}
