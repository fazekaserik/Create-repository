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
  { value: '1month',  label: '1 Month'  },
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

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center',
        padding: '44px 20px 12px',
      }}>
        <button
          onClick={() => router.push('/rating')}
          style={{ fontSize: 24, color: 'var(--text-sub)', background: 'none', border: 'none', cursor: 'pointer', padding: '0 8px 0 0', lineHeight: 1 }}
        >
          ‹
        </button>
        <h1 style={{ flex: 1, textAlign: 'center', fontSize: 18, fontWeight: 600, color: '#fff' }}>
          Your Transformation
        </h1>
        <div style={{ width: 32 }}>
          {appState.tier !== 'free' && (
            <ShareButton beforeUrl={appState.uploadedImageDataUrl || ''} afterUrl={currentImage || ''} />
          )}
        </div>
      </div>

      <AnimatePresence>
        {!revealed ? (
          <motion.div key="wait" exit={{ opacity: 0 }} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="w-8 h-8 rounded-full border-2 border-[var(--teal)] border-t-transparent animate-spin" />
          </motion.div>
        ) : (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', flex: 1, paddingBottom: 48 }}>

            {/* Headline + stats */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ padding: '0 20px 12px' }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 8 }}>
                {activePeriod === '1month' && 'Your first month result'}
                {activePeriod === '3months' && <>This could be you in <span style={{ color: 'var(--teal)' }}>90 days</span></>}
                {activePeriod === '6months' && <>Your <span style={{ color: 'var(--teal)' }}>6-month</span> potential</>}
              </h2>
              {stats && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} style={{ display: 'flex', gap: 8 }}>
                  <span className="teal-badge">{stats.muscle}</span>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 20, padding: '4px 12px',
                    fontSize: 12, fontWeight: 600, color: 'var(--text-sub)',
                  }}>{stats.fat}</span>
                </motion.div>
              )}
            </motion.div>

            {/* Before/After slider */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
              style={{ position: 'relative', margin: '0 20px', borderRadius: 24, overflow: 'hidden', aspectRatio: '3/4' }}
            >
              {appState.uploadedImageDataUrl && currentImage ? (
                <BeforeAfterSlider beforeUrl={appState.uploadedImageDataUrl} afterUrl={currentImage} isLocked={isLocked} />
              ) : (
                <div className="w-full h-full shimmer rounded-3xl" />
              )}
              {isLocked && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{
                    position: 'absolute', inset: 0, zIndex: 10,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(0,0,0,0.55)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    padding: '0 32px',
                  }}
                >
                  <div style={{ marginBottom: 16 }} />
                  <p style={{ fontSize: 22, fontWeight: 700, color: '#fff', textAlign: 'center', marginBottom: 8 }}>
                    Unlock Results
                  </p>
                  <p style={{ fontSize: 14, color: 'var(--text-sub)', textAlign: 'center', marginBottom: 24, lineHeight: 1.5 }}>
                    See your {activePeriod === '3months' ? '3-month' : '6-month'} transformation
                  </p>
                  <button onClick={() => setShowPaywall(true)} className="btn-white" style={{ width: 'auto', padding: '14px 40px', borderRadius: 14 }}>
                    Get Full Access
                  </button>
                </motion.div>
              )}
            </motion.div>

            {/* Period tabs — pill container */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
              style={{ margin: '16px 20px 0', padding: 4, background: '#141414', borderRadius: 50, display: 'flex', gap: 0 }}
            >
              {PERIODS.map((p) => {
                const locked = p.value !== '1month' && appState.tier === 'free'
                const active = activePeriod === p.value
                return (
                  <button
                    key={p.value}
                    onClick={() => handlePeriod(p.value)}
                    style={{
                      flex: 1, padding: '11px 0',
                      borderRadius: 46,
                      fontSize: 14, fontWeight: 600,
                      background: active ? '#fff' : 'transparent',
                      color: active ? '#000' : 'rgba(255,255,255,0.45)',
                      border: 'none', cursor: 'pointer',
                      transition: 'background 0.2s, color 0.2s',
                      position: 'relative',
                    }}
                  >
                    {locked && <span style={{ fontSize: 11, marginRight: 4, opacity: 0.6 }}>&#128274;</span>}
                    {p.label}
                    {p.value === '3months' && !locked && (
                      <span style={{
                        position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)',
                        fontSize: 9, padding: '2px 6px', borderRadius: 20, fontWeight: 800,
                        background: 'var(--teal)', color: '#000', whiteSpace: 'nowrap',
                      }}>BEST</span>
                    )}
                  </button>
                )
              })}
            </motion.div>

            {/* Social proof copy */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
              style={{
                margin: '12px 20px 0',
                padding: '12px 16px',
                borderRadius: 16,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                textAlign: 'center',
              }}
            >
              <p style={{ fontSize: 12, color: 'var(--text-sub)', lineHeight: 1.6 }}>
                Most users see visible results in 60–90 days &nbsp;·&nbsp; You&apos;re closer than you think
              </p>
            </motion.div>

            {/* CTA */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} style={{ margin: '16px 20px 0' }}>
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
