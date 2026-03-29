'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

const FEATURES = [
  'Built from your goal & gym access',
  'Adjusted for your body metrics',
  'Updated weekly as you progress',
  'Backed by sports science',
]

const PLAN_CARDS = [
  {
    emoji: '🥗',
    title: 'Personal Diet Plan',
    subtitle: 'Daily calorie targets, macro splits, meal timing & weekly meal plans',
    tags: ['🔥 Calories', '💊 Macros', '🥩 Meals'],
    href: '/plan/diet',
  },
  {
    emoji: '💪',
    title: 'Personal Workout Plan',
    subtitle: 'Weekly training splits, exercises, sets/reps, rest days & progression',
    tags: ['🏋️ Training Split', '📈 Progression', '🧘 Recovery'],
    href: '/plan/workout',
  },
]

export default function PlanPage() {
  const router = useRouter()

  return (
    <main style={{ minHeight: '100dvh', background: '#000', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '44px 20px 12px' }}>
        <button
          onClick={() => router.back()}
          style={{ fontSize: 24, color: 'var(--text-sub)', background: 'none', border: 'none', cursor: 'pointer', padding: '0 8px 0 0', lineHeight: 1 }}
        >‹</button>
        <h1 style={{ flex: 1, textAlign: 'center', fontSize: 18, fontWeight: 600, color: '#fff' }}>Your AI Plan</h1>
        <div style={{ width: 32 }} />
      </div>

      <div style={{ flex: 1, padding: '0 24px 48px', overflowY: 'auto' }}>
        {/* Section label */}
        <p className="section-label" style={{ textAlign: 'center', marginTop: 32, marginBottom: 24, color: 'var(--teal)' }}>
          PERSONALIZED FOR YOU
        </p>

        {/* Plan cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 36 }}>
          {PLAN_CARDS.map((card, i) => (
            <motion.button
              key={card.href}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push(card.href)}
              className="premium-card"
              style={{
                display: 'flex', alignItems: 'center', gap: 16,
                cursor: 'pointer', textAlign: 'left',
                width: '100%', padding: 20,
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--teal)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)' }}
            >
              <div style={{ fontSize: 48, flexShrink: 0, lineHeight: 1 }}>{card.emoji}</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{card.title}</p>
                <p style={{ fontSize: 14, color: 'var(--text-sub)', lineHeight: 1.5, marginBottom: 12 }}>{card.subtitle}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {card.tags.map(tag => (
                    <span key={tag} className="teal-badge" style={{ fontSize: 11 }}>{tag}</span>
                  ))}
                </div>
              </div>
              <div style={{ fontSize: 20, color: 'var(--text-dim)', flexShrink: 0 }}>→</div>
            </motion.button>
          ))}
        </div>

        {/* What's included */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <p className="section-label" style={{ marginBottom: 16 }}>WHAT&apos;S INCLUDED</p>
          <div className="premium-card" style={{ padding: '16px 20px' }}>
            {FEATURES.map((f) => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <span style={{ color: 'var(--green)', fontSize: 16, fontWeight: 700, flexShrink: 0 }}>✓</span>
                <span style={{ fontSize: 14, color: '#fff' }}>{f}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Trust badges */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-dim)', marginTop: 24 }}
        >
          🔒 Secure &nbsp;·&nbsp; ⚡ Instant &nbsp;·&nbsp; 🎯 Personalized
        </motion.p>
      </div>
    </main>
  )
}
