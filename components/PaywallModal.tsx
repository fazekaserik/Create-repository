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
    original: null,
    badge: null,
    features: ['1-month + 3-month results', 'Template transformation', 'Share your results'],
  },
  {
    id: 'monthly' as const,
    label: 'Monthly',
    price: '$14.99',
    period: '/month',
    original: null,
    badge: '🔥 BEST VALUE',
    features: ['All time periods unlocked', 'AI-generated transformation', 'Priority processing', 'Download HD results'],
  },
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
        body: JSON.stringify({ plan: selected, userId: 'anonymous' }),
      })
      const { url, error } = await res.json()

      if (error || !url) {
        // Stripe not configured yet — simulate success for demo
        onSuccess(selected)
        return
      }

      window.location.href = url
    } catch {
      // Stripe not configured — simulate success
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
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="w-full max-w-sm rounded-t-3xl sm:rounded-3xl overflow-hidden"
        style={{ background: '#111' }}
      >
        {/* Preview teaser */}
        {previewImageUrl && (
          <div className="relative h-40 overflow-hidden">
            <img
              src={previewImageUrl}
              alt="Preview"
              className="w-full h-full object-cover"
              style={{ filter: 'blur(16px) brightness(0.7)', transform: 'scale(1.1)' }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-3xl mb-2">🔒</div>
              <p className="text-white font-bold text-sm">Your 3-month transformation awaits</p>
            </div>
            {/* Gradient overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#111] to-transparent" />
          </div>
        )}

        <div className="p-5">
          <h2 className="text-xl font-black text-white text-center mb-1">
            Unlock Your Full Transformation
          </h2>
          <p className="text-white/40 text-sm text-center mb-5">
            See exactly what you can achieve
          </p>

          {/* Plan cards */}
          <div className="flex flex-col gap-3 mb-5">
            {PLANS.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelected(plan.id)}
                className={`relative w-full p-4 rounded-2xl text-left transition-all duration-200
                  ${selected === plan.id
                    ? 'border-2 border-[#00ff88] bg-[rgba(0,255,136,0.06)]'
                    : 'border border-white/10 bg-white/[0.03]'
                  }`}
              >
                {plan.badge && (
                  <div className="absolute -top-2.5 left-4 text-[10px] font-black px-2 py-0.5 rounded-full bg-[#00ff88] text-black">
                    {plan.badge}
                  </div>
                )}
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="font-bold text-white">{plan.label}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-white">{plan.price}</span>
                    <span className="text-white/40 text-xs">{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-1">
                  {plan.features.map((f) => (
                    <li key={f} className="text-xs text-white/60 flex items-center gap-1.5">
                      <span className="text-[#00ff88] text-[10px]">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                {selected === plan.id && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#00ff88] flex items-center justify-center">
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
            className="btn-neon w-full py-4 rounded-2xl text-base font-black pulse-glow disabled:opacity-60"
          >
            {loading ? 'Processing…' : `Start ${selected === 'monthly' ? 'Monthly' : 'Weekly'} Plan →`}
          </motion.button>

          <p className="text-white/25 text-[10px] text-center mt-3">
            Cancel anytime · Secure payment · No hidden fees
          </p>

          <button
            onClick={onClose}
            className="w-full text-white/30 text-xs text-center mt-3 hover:text-white/50 transition-colors py-2"
          >
            Not now
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
