'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  previewImageUrl?: string
  onClose: () => void
  onSuccess: (tier: 'weekly' | 'monthly') => void
}

function Countdown() {
  const [secs, setSecs] = useState(15 * 60)
  useEffect(() => {
    const iv = setInterval(() => setSecs(s => (s > 0 ? s - 1 : 0)), 1000)
    return () => clearInterval(iv)
  }, [])
  const m = String(Math.floor(secs / 60)).padStart(2, '0')
  const s = String(secs % 60).padStart(2, '0')
  return (
    <div style={{ textAlign: 'center', marginBottom: 20 }}>
      <p style={{ fontSize: 10, fontWeight: 700, color: '#f97316', letterSpacing: '0.12em', marginBottom: 4 }}>LIMITED TIME</p>
      <p style={{ fontSize: 15, fontWeight: 700, color: '#f97316' }}>Offer expires in {m}:{s}</p>
    </div>
  )
}

const FEATURES = [
  'Unlock 3-month & 6-month AI results',
  'Personalized diet & workout plan',
  'HD transformation download',
]

const PLANS = [
  {
    id: 'weekly' as const,
    label: 'Weekly',
    price: '$4.99',
    period: '/week',
    badge: null,
    popular: false,
    subPrice: null,
    saving: 'vs $19.96/mo billed weekly',
    features: ['7-day access', 'All AI results'],
  },
  {
    id: 'monthly' as const,
    label: 'Monthly',
    price: '$14.99',
    period: '/month',
    badge: 'BEST VALUE',
    popular: true,
    subPrice: '= $3.37/week',
    saving: null,
    features: ['30-day access', 'All AI results', 'Priority processing'],
  },
]

export default function PaywallModal({ onClose, onSuccess }: Props) {
  const [selected, setSelected] = useState<'weekly' | 'monthly'>('monthly')
  const [loading, setLoading] = useState(false)

  const handleSubscribe = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: selected }),
      })
      const { url, error } = await res.json()
      if (!error && url) {
        window.location.href = url
      } else {
        onSuccess(selected)
      }
    } catch {
      onSuccess(selected)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
        style={{
          width: '100%', maxWidth: 480,
          background: '#000',
          borderRadius: '28px 28px 0 0',
          overflow: 'hidden',
          maxHeight: '96dvh',
          overflowY: 'auto',
        }}
      >
        {/* Drag handle + X */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', paddingTop: 12, paddingBottom: 4 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.18)' }} />
          <button
            onClick={onClose}
            style={{
              position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.08)', border: 'none', cursor: 'pointer',
              width: 28, height: 28, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'rgba(255,255,255,0.5)', fontSize: 14, fontFamily: 'inherit',
            }}
          >✕</button>
        </div>

        {/* Urgency banner */}
        <div style={{
          margin: '12px 20px',
          background: 'var(--teal)',
          borderRadius: 12,
          padding: '10px 16px',
          textAlign: 'center',
        }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#000' }}>🔥 47 people unlocked today</span>
        </div>

        <div style={{ padding: '0 20px 32px' }}>

          {/* Headline */}
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#fff', textAlign: 'center', marginBottom: 8, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
            Your 3-Month Body Is Ready
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-sub)', textAlign: 'center', marginBottom: 24 }}>
            See exactly how you&apos;ll look in 90 days
          </p>

          {/* Before → After teaser */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
            {/* NOW */}
            <div style={{
              flex: 1, borderRadius: 16, overflow: 'hidden',
              background: 'var(--surface-2)', border: '1px solid var(--border)',
              aspectRatio: '3/4', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              <svg width="36" height="48" viewBox="0 0 36 48" fill="none">
                <ellipse cx="18" cy="11" rx="8" ry="8" fill="rgba(255,255,255,0.18)" />
                <path d="M4 44c0-8.837 6.268-16 14-16s14 7.163 14 16" stroke="rgba(255,255,255,0.18)" strokeWidth="3" strokeLinecap="round" />
              </svg>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em' }}>NOW</span>
            </div>

            {/* Arrow */}
            <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: 18, color: 'var(--teal)', fontWeight: 700 }}>→</span>
            </div>

            {/* 90 DAYS — locked */}
            <div style={{
              flex: 1, borderRadius: 16, overflow: 'hidden',
              background: 'rgba(92,224,208,0.06)',
              border: '1.5px solid var(--teal)',
              aspectRatio: '3/4',
              position: 'relative',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              <svg width="36" height="48" viewBox="0 0 36 48" fill="none">
                <ellipse cx="18" cy="11" rx="8" ry="8" fill="rgba(92,224,208,0.5)" />
                <path d="M4 44c0-8.837 6.268-16 14-16s14 7.163 14 16" stroke="rgba(92,224,208,0.5)" strokeWidth="3" strokeLinecap="round" />
              </svg>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--teal)', letterSpacing: '0.08em' }}>90 DAYS</span>
              {/* Blur + lock overlay */}
              <div style={{
                position: 'absolute', inset: 0,
                backdropFilter: 'blur(8px)',
                background: 'rgba(0,0,0,0.45)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'rgba(92,224,208,0.15)',
                  border: '1.5px solid var(--teal)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="11" width="18" height="11" rx="2" stroke="var(--teal)" strokeWidth="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="var(--teal)" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Countdown */}
          <Countdown />

          {/* Plan cards — stacked */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
            {PLANS.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelected(plan.id)}
                style={{
                  position: 'relative',
                  width: '100%',
                  padding: plan.popular ? '18px 16px' : '14px 16px',
                  borderRadius: 18,
                  background: selected === plan.id
                    ? (plan.popular ? 'rgba(92,224,208,0.08)' : 'rgba(255,255,255,0.04)')
                    : 'rgba(255,255,255,0.03)',
                  border: selected === plan.id
                    ? (plan.popular ? '1.5px solid var(--teal)' : '1.5px solid rgba(255,255,255,0.4)')
                    : '1px solid rgba(255,255,255,0.1)',
                  boxShadow: selected === plan.id && plan.popular ? '0 0 24px rgba(92,224,208,0.18)' : 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'border-color 0.15s, background 0.15s, box-shadow 0.15s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                }}
              >
                {/* Radio */}
                <div style={{
                  width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                  border: selected === plan.id
                    ? (plan.popular ? '2px solid var(--teal)' : '2px solid #fff')
                    : '2px solid rgba(255,255,255,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'border-color 0.15s',
                }}>
                  {selected === plan.id && (
                    <div style={{
                      width: 10, height: 10, borderRadius: '50%',
                      background: plan.popular ? 'var(--teal)' : '#fff',
                    }} />
                  )}
                </div>

                {/* Text */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{plan.label}</span>
                    {plan.popular && (
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#000', background: 'var(--teal)', padding: '2px 7px', borderRadius: 20, letterSpacing: '0.06em' }}>MOST POPULAR</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {plan.features.map(f => (
                      <span key={f} style={{ fontSize: 11, color: 'var(--text-dim)' }}>{f}</span>
                    ))}
                  </div>
                </div>

                {/* Price + badge */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  {plan.badge && (
                    <div style={{ fontSize: 9, fontWeight: 800, color: 'var(--teal)', letterSpacing: '0.08em', marginBottom: 2 }}>{plan.badge}</div>
                  )}
                  {plan.saving && (
                    <div style={{ fontSize: 10, color: '#f97316', fontWeight: 600, marginBottom: 2, textDecoration: 'line-through', opacity: 0.7 }}>{plan.saving}</div>
                  )}
                  <div>
                    <span style={{ fontSize: 20, fontWeight: 800, color: plan.popular ? 'var(--teal)' : '#fff' }}>{plan.price}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>{plan.period}</span>
                  </div>
                  {plan.subPrice && (
                    <div style={{ fontSize: 11, color: 'var(--teal)', fontWeight: 600, marginTop: 2 }}>{plan.subPrice}</div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Feature bullets */}
          <div style={{ marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {FEATURES.map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ color: 'var(--teal)', fontSize: 14, fontWeight: 700, flexShrink: 0 }}>✓</span>
                <span style={{ fontSize: 14, color: '#fff' }}>{f}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleSubscribe}
            disabled={loading}
            className="pulse-teal"
            style={{
              width: '100%',
              padding: '17px 0',
              borderRadius: 18,
              border: 'none',
              cursor: loading ? 'default' : 'pointer',
              background: 'linear-gradient(90deg, #5ce0d0, #4ade80)',
              color: '#000',
              fontSize: 16,
              fontWeight: 800,
              fontFamily: 'inherit',
              letterSpacing: '-0.01em',
              opacity: loading ? 0.7 : 1,
              marginBottom: 14,
              boxShadow: '0 0 24px rgba(92,224,208,0.35)',
            }}
          >
            {loading ? 'Processing…' : 'Unlock My Transformation →'}
          </motion.button>

          {/* Trust line */}
          <p style={{ fontSize: 12, color: 'var(--text-dim)', textAlign: 'center', marginBottom: 12 }}>
            🔒 Secure · Cancel anytime · No hidden fees
          </p>

          {/* Not now */}
          <button
            onClick={onClose}
            style={{
              display: 'block', width: '100%', background: 'none', border: 'none',
              cursor: 'pointer', color: 'var(--text-dim)', fontSize: 12,
              textAlign: 'center', fontFamily: 'inherit', padding: '6px 0',
            }}
          >
            Not now
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
