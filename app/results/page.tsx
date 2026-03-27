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
  const [appState, setAppState] = useState(getState())
  const t = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const s = getState()
    if (!s.uploadedImageDataUrl) { router.push('/'); return }
    setAppState(s)
    setActivePeriod(s.activePeriod || '1month')
    t.current = setTimeout(() => setRevealed(true), 400)
    return () => { if (t.current) clearTimeout(t.current) }
  }, [router])

  const handlePeriod = useCallback((period: TransformPeriod) => {
    if (period !== '1month' && appState.tier === 'free') { setShowPaywall(true); return }
    setActivePeriod(period)
    setState({ activePeriod: period })
  }, [appState.tier])

  const handlePaywallSuccess = useCallback((tier: 'weekly' | 'monthly') => {
    setState({ tier })
    setAppState(getState())
    setShowPaywall(false)
    setActivePeriod('3months')
    setState({ activePeriod: '3months' })
  }, [])

  const currentImage = appState.transformations?.[activePeriod]
  const isLocked = activePeriod !== '1month' && appState.tier === 'free'
  const stats = appState.goal ? STATS[appState.goal as Goal]?.[activePeriod] : null

  return (
    <main className="min-h-dvh bg-black flex flex-col">
      <div className="flex items-center px-5 pt-10 pb-3">
        <button onClick={() => router.push('/rating')} className="text-[var(--text-sub)] text-lg">‹</button>
        <h1 className="flex-1 text-center text-sm font-bold teal tracking-wider">NEXTBODY</h1>
        <div style={{ width: 24 }} />
      </div>

      <AnimatePresence>
        {!revealed ? (
          <motion.div key="wait" exit={{ opacity: 0 }} className="flex-1 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-[var(--teal)] border-t-transparent animate-spin" />
          </motion.div>
        ) : (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col flex-1 pb-8">

            {/* Headline */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="px-5 mb-3">
              <h2 className="text-2xl font-black text-white">
                {activePeriod === '1month' && 'Your first month result'}
                {activePeriod === '3months' && <>This could be you in <span className="teal">90 days</span></>}
                {activePeriod === '6months' && <>Your <span className="teal">6-month</span> potential</>}
              </h2>
              {stats && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex gap-2 mt-2">
                  <span className="text-xs px-3 py-1 rounded-full teal font-semibold" style={{ background: 'rgba(92,224,208,0.1)' }}>{stats.muscle}</span>
                  <span className="text-xs px-3 py-1 rounded-full text-white font-semibold" style={{ background: 'rgba(255,255,255,0.07)' }}>{stats.fat}</span>
                </motion.div>
              )}
            </motion.div>

            {/* Before/After slider */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
              className="relative mx-5 rounded-3xl overflow-hidden"
              style={{ aspectRatio: '3/4' }}
            >
              {appState.uploadedImageDataUrl && currentImage ? (
                <BeforeAfterSlider beforeUrl={appState.uploadedImageDataUrl} afterUrl={currentImage} isLocked={isLocked} />
              ) : (
                <div className="w-full h-full shimmer rounded-3xl" />
              )}
              {isLocked && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="absolute inset-0 flex flex-col items-center justify-center z-10"
                  style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
                >
                  <p className="text-white font-bold text-lg mb-1">Unlock full transformation</p>
                  <p className="text-[var(--text-sub)] text-sm mb-5 text-center px-8">
                    See your {activePeriod === '3months' ? '3-month' : '6-month'} result
                  </p>
                  <button onClick={() => setShowPaywall(true)} className="btn-teal" style={{ width: 'auto', padding: '14px 32px' }}>
                    Unlock Now
                  </button>
                </motion.div>
              )}
            </motion.div>

            {/* Period tabs */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex gap-2 mx-5 mt-4">
              {PERIODS.map((p) => {
                const locked = p.value !== '1month' && appState.tier === 'free'
                const active = activePeriod === p.value
                return (
                  <button key={p.value} onClick={() => handlePeriod(p.value)}
                    className="flex-1 py-3 rounded-2xl text-sm font-semibold relative transition-all duration-150"
                    style={{
                      background: active ? 'var(--teal)' : 'rgba(255,255,255,0.06)',
                      color: active ? '#000' : 'rgba(255,255,255,0.5)',
                    }}
                  >
                    {locked && <span className="text-xs mr-1 opacity-60">&#128274;</span>}
                    {p.label}
                    {p.value === '3months' && !locked && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] px-2 py-0.5 rounded-full font-black"
                        style={{ background: 'var(--teal)', color: '#000', whiteSpace: 'nowrap' }}>BEST</span>
                    )}
                  </button>
                )
              })}
            </motion.div>

            {/* Trigger copy */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
              className="mx-5 mt-3 px-4 py-3 rounded-2xl text-center"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <p className="text-[var(--text-sub)] text-xs leading-relaxed">
                Most users see visible results in 60–90 days &nbsp;·&nbsp; You&apos;re closer than you think
              </p>
            </motion.div>

            {/* CTA */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="mx-5 mt-4">
              {appState.tier === 'free' ? (
                <button onClick={() => setShowPaywall(true)} className="btn-teal">Unlock Full Transformation</button>
              ) : (
                <ShareButton beforeUrl={appState.uploadedImageDataUrl || ''} afterUrl={currentImage || ''} />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPaywall && (
          <PaywallModal previewImageUrl={appState.transformations?.['3months']} onClose={() => setShowPaywall(false)} onSuccess={handlePaywallSuccess} />
        )}
      </AnimatePresence>
    </main>
  )
}
