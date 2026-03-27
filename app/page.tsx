'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function WelcomePage() {
  const router = useRouter()

  return (
    <main className="min-h-dvh flex flex-col overflow-hidden" style={{ background: '#000' }}>

      {/* ── White section with phone ── */}
      <div
        className="relative flex items-center justify-center"
        style={{
          background: '#fff',
          height: '58vh',
          overflow: 'visible',
        }}
      >
        {/* Language selector — top right */}
        <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 20 }}>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: '#fff',
              border: '1px solid rgba(0,0,0,0.1)',
              borderRadius: 20,
              padding: '6px 12px',
              fontSize: 14,
              fontWeight: 600,
              color: '#000',
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
              cursor: 'pointer',
            }}
          >
            {/* Mini flag SVG */}
            <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="20" height="14" rx="2" fill="#B22234"/>
              <rect y="1.08" width="20" height="1.08" fill="white"/>
              <rect y="3.23" width="20" height="1.08" fill="white"/>
              <rect y="5.38" width="20" height="1.08" fill="white"/>
              <rect y="7.54" width="20" height="1.08" fill="white"/>
              <rect y="9.69" width="20" height="1.08" fill="white"/>
              <rect y="11.85" width="20" height="1.08" fill="white"/>
              <rect width="8" height="7.54" rx="0" fill="#3C3B6E"/>
            </svg>
            EN
          </button>
        </div>

        {/* Phone frame */}
        <div
          style={{
            position: 'absolute',
            bottom: -36,        /* bleeds into black section */
            left: '50%',
            transform: 'translateX(-50%)',
            width: '68vw',
            maxWidth: 268,
            aspectRatio: '9/19.5',
            borderRadius: 42,
            /* Layered silver border */
            border: '8px solid',
            borderColor: '#c8c8c8',
            boxShadow: [
              '0 0 0 1px #b0b0b0',
              '0 0 0 2px #d8d8d8',
              'inset 0 0 0 1px rgba(0,0,0,0.15)',
              '0 30px 80px rgba(0,0,0,0.22)',
              '0 6px 20px rgba(0,0,0,0.12)',
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
            width: '34%', height: 26,
            background: '#000', borderRadius: 14, zIndex: 30,
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)',
          }}>
            {/* Camera dot */}
            <div style={{
              position: 'absolute', right: 8, top: '50%',
              transform: 'translateY(-50%)',
              width: 7, height: 7, borderRadius: '50%',
              background: '#1a1a1a',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.05)',
            }} />
          </div>

          {/* Side buttons left */}
          <div style={{ position: 'absolute', left: -10, top: 72, width: 3, height: 28, background: '#b8b8b8', borderRadius: 2 }} />
          <div style={{ position: 'absolute', left: -10, top: 110, width: 3, height: 44, background: '#b8b8b8', borderRadius: 2 }} />
          <div style={{ position: 'absolute', left: -10, top: 162, width: 3, height: 44, background: '#b8b8b8', borderRadius: 2 }} />
          {/* Side button right */}
          <div style={{ position: 'absolute', right: -10, top: 110, width: 3, height: 64, background: '#b8b8b8', borderRadius: 2 }} />

          {/* Screen inner shadow */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 5,
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)',
            borderRadius: 34,
            pointerEvents: 'none',
          }} />

          {/* Hero image — replace /hero.jpg in /public with your portrait photo */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'url(/hero.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            background: 'url(/hero.jpg) center top / cover no-repeat, linear-gradient(175deg, #2c2520 0%, #1a1a1a 50%, #0d0d0d 100%)',
          }} />
        </div>
      </div>

      {/* ── Black section with text + CTA ── */}
      <div
        className="flex flex-col flex-1"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, #1a1a1a 0%, #000 55%)',
          paddingTop: 60,   /* clears the phone bleed */
          paddingLeft: 24,
          paddingRight: 24,
          paddingBottom: 40,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col flex-1"
        >
          <h1
            style={{
              fontSize: 'clamp(42px, 11vw, 56px)',
              fontWeight: 800,
              color: '#fff',
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              textAlign: 'center',
              marginBottom: 16,
            }}
          >
            Become Top-Tier.
          </h1>

          <p
            style={{
              fontSize: 17,
              color: 'rgba(255,255,255,0.7)',
              textAlign: 'center',
              lineHeight: 1.55,
              marginBottom: 36,
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
              display: 'block',
              width: '100%',
              padding: '20px 24px',
              background: '#fff',
              color: '#000',
              fontSize: 17,
              fontWeight: 600,
              border: 'none',
              borderRadius: 16,
              cursor: 'pointer',
              letterSpacing: '-0.01em',
            }}
          >
            Get started
          </motion.button>
        </motion.div>
      </div>
    </main>
  )
}
