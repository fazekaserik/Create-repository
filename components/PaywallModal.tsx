'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface Props {
  previewImageUrl?: string
  onClose: () => void
  onSuccess: (tier: 'weekly' | 'monthly') => void
}

const PLANS = [
  {
    id: 'weekly' as const,
    label: 'Weekly',
    price: '$4.99',
    period: '/week',
    badge: null,
    features: ['1-month + 3-month results', 'Template transformation', 'Share your results'],
  },
  {
    id: 'monthly' as const,
    label: 'Monthly',
    price: '$14.99',
    period: '/month',
    badge: 'BEST VALUE',
    features: ['All periods unlocked', 'AI-powered transformation', 'HD download', 'Priority processing'],
  },
]

const FEATURE_LIST = [
  'Unlock 3-Month & 6-Month Results',
  'AI Physique Transformation',
  'Personalized Training Plan',
  'Elite Body Optimization',
  'Unlimited Progress Tracking',
]

export default function PaywallModal({ previewImageUrl, onClose, onSuccess }: Props) {
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
        onSuccess(selected) // Stripe not configured — simulate
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
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(10px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
        className="w-full max-w-sm rounded-t-3xl sm:rounded-3xl overflow-hidden"
        style={{ background: '#111' }}
      >
        {/* Blurred preview */}
        {previewImageUrl && (
          <div className="relative h-36 overflow-hidden">
            <img
              src={previewImageUrl}
              alt="Preview"
              className="w-full h-full object-cover"
              style={{ filter: 'blur(18px) brightness(0.6)', transform: 'scale(1.15)' }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-3xl mb-2">🔒</div>
              <p className="text-white font-bold text-sm">Your transformation is ready</p>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#111] to-transparent" />
          </div>
        )}

        <div className="px-5 pb-6 pt-2">
          <h2 className="text-xl font-black text-white text-center mb-1">Unlock Your Transformation</h2>
          <p className="text-[var(--text-muted)] text-sm text-center mb-4">Join 10,000+ users transforming their bodies</p>

          {/* Features */}
          <div className="space-y-2 mb-5">
            {FEATURE_LIST.map((f) => (
              <div key={f} className="flex items-center gap-2.5">
                <span className="teal font-bold">✓</span>
                <span className="text-white text-sm">{f}</span>
              </div>
            ))}
          </div>

          {/* Plan selector */}
          <div className="flex gap-3 mb-5">
            {PLANS.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelected(plan.id)}
                className="relative flex-1 p-4 rounded-2xl text-left transition-all duration-200"
                style={{
                  background: selected === plan.id ? 'rgba(92,224,208,0.07)' : 'rgba(255,255,255,0.04)',
                  border: selected === plan.id ? '1.5px solid var(--teal)' : '1px solid rgba(255,255,255,0.1)',
                  boxShadow: selected === plan.id ? '0 0 20px rgba(92,224,208,0.15)' : 'none',
                }}
              >
                {plan.badge && (
                  <div className="absolute -top-2.5 left-3 text-[10px] font-black px-2 py-0.5 rounded-full"
                    style={{ background: 'var(--teal)', color: '#000' }}>
                    {plan.badge}
                  </div>
                )}
                <div className="text-[var(--text-muted)] text-xs mb-1">{plan.label}</div>
                <div className="text-white font-black text-xl">{plan.price}</div>
                <div className="text-[var(--text-dim)] text-xs">{plan.period}</div>
                {selected === plan.id && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: 'var(--teal)' }}>
                    <span className="text-black text-[10px] font-black">✓</span>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* CTA */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleSubscribe}
            disabled={loading}
            className="btn-primary w-full py-4 pulse-teal disabled:opacity-50"
          >
            {loading ? 'Processing…' : 'No Commitment. Cancel Anytime →'}
          </motion.button>

          <p className="text-[var(--text-dim)] text-[10px] text-center mt-3">
            Secure payment · Cancel anytime · No hidden fees
          </p>

          <button onClick={onClose} className="w-full text-[var(--text-dim)] text-xs text-center mt-2 py-2 hover:text-[var(--text-muted)] transition-colors">
            Not now
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
