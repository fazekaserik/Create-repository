'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function WelcomePage() {
  const router = useRouter()

  return (
    <main className="min-h-dvh flex flex-col overflow-hidden">

      {/* ── White section ── */}
      <div
        className="relative overflow-visible"
        style={{ background: '#fff', height: '56vh', flexShrink: 0 }}
      >
        {/* Language selector */}
        <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 20 }}>
          <button
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: '#fff', border: '1px solid rgba(0,0,0,0.1)',
              borderRadius: 22, padding: '7px 13px',
              fontSize: 14, fontWeight: 600, color: '#000',
              boxShadow: '0 2px 10px rgba(0,0,0,0.13)', cursor: 'pointer',
            }}
          >
            <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
              <rect width="20" height="14" rx="2" fill="#B22234"/>
              <rect y="1.08" width="20" height="1.08" fill="white"/>
              <rect y="3.23" width="20" height="1.08" fill="white"/>
              <rect y="5.38" width="20" height="1.08" fill="white"/>
              <rect y="7.54" width="20" height="1.08" fill="white"/>
              <rect y="9.69" width="20" height="1.08" fill="white"/>
              <rect y="11.85" width="20" height="1.08" fill="white"/>
              <rect width="8" height="7.54" fill="#3C3B6E"/>
            </svg>
            EN
          </button>
        </div>

        {/* Phone — anchored from TOP so the top is always visible */}
        <div
          style={{
            position: 'absolute',
            top: 16,                  /* small gap from top — keeps top of phone in view */
            left: '50%',
            transform: 'translateX(-50%)',
            width: '62vw',
            maxWidth: 248,
            height: '54vh',           /* explicit height, not aspect-ratio derived */
            borderRadius: 40,
            border: '7px solid #c2c2c2',
            boxShadow: [
              '0 0 0 1px #aaa',
              '0 0 0 2.5px #d8d8d8',
              'inset 0 0 0 1px rgba(0,0,0,0.12)',
              '0 28px 70px rgba(0,0,0,0.18)',
              '0 4px 16px rgba(0,0,0,0.1)',
            ].join(', '),
            background: '#0a0a0a',
            overflow: 'hidden',
            zIndex: 10,
          }}
        >
          {/* Dynamic island */}
          <div style={{
            position: 'absolute', top: 10, left: '50%',
            transform: 'translateX(-50%)',
            width: '36%', height: 24,
            background: '#000', borderRadius: 12, zIndex: 30,
          }}>
            <div style={{
              position: 'absolute', right: 7, top: '50%', transform: 'translateY(-50%)',
              width: 7, height: 7, borderRadius: '50%', background: '#1c1c1c',
            }} />
          </div>

          {/* Side buttons */}
          <div style={{ position: 'absolute', left: -9, top: 68, width: 3, height: 26, background: '#b4b4b4', borderRadius: 2 }} />
          <div style={{ position: 'absolute', left: -9, top: 104, width: 3, height: 42, background: '#b4b4b4', borderRadius: 2 }} />
          <div style={{ position: 'absolute', left: -9, top: 154, width: 3, height: 42, background: '#b4b4b4', borderRadius: 2 }} />
          <div style={{ position: 'absolute', right: -9, top: 104, width: 3, height: 60, background: '#b4b4b4', borderRadius: 2 }} />

          {/* Inner screen shadow */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 5, borderRadius: 33,
            boxShadow: 'inset 0 0 24px rgba(0,0,0,0.55)',
            pointerEvents: 'none',
          }} />

          {/* Hero image — add /public/hero.jpg to fill phone with a portrait */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'url(/hero.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            background: 'url(/hero.jpg) center top / cover no-repeat, linear-gradient(175deg, #2c2a24 0%, #1a1a1a 45%, #0d0d0d 100%)',
          }} />
        </div>
      </div>

      {/* ── Black section ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
        className="flex flex-col flex-1"
        style={{
          background: '#000',
          paddingTop: 28,
          paddingLeft: 24,
          paddingRight: 24,
          paddingBottom: 36,
        }}
      >
        <h1
          style={{
            fontSize: 'clamp(44px, 12vw, 58px)',
            fontWeight: 600,           /* matches the reference — not ultra-bold */
            color: '#fff',
            lineHeight: 1.1,
            letterSpacing: '-0.025em',
            marginBottom: 14,
          }}
        >
          Become Top-Tier.
        </h1>

        <p
          style={{
            fontSize: 17,
            color: 'rgba(255,255,255,0.62)',
            lineHeight: 1.55,
            marginBottom: 32,
          }}
        >
          Get your attraction ratings, routine,<br />
          products &amp; more to ascend in{' '}
          <span style={{ color: 'var(--teal)', fontWeight: 600 }}>90 days</span>
        </p>

        <div style={{ flex: 1 }} />

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => router.push('/onboarding')}
          style={{
            display: 'block', width: '100%',
            padding: '20px 24px',
            background: '#fff', color: '#000',
            fontSize: 17, fontWeight: 500,
            border: 'none', borderRadius: 16,
            cursor: 'pointer', letterSpacing: '-0.01em',
          }}
        >
          Get started
        </motion.button>
      </motion.div>
    </main>
  )
}
