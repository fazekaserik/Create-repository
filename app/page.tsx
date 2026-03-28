'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function WelcomePage() {
  const router = useRouter()

  return (
    <main className="min-h-dvh flex flex-col overflow-hidden">

      {/* ── White section — phone clipped at bottom ── */}
      <div
        style={{
          position: 'relative',
          background: '#ebebeb',
          height: '57vh',
          flexShrink: 0,
          overflow: 'hidden',   /* clips phone bottom cleanly */
        }}
      >
        {/* Language selector */}
        <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 20 }}>
          <button
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: '#fff', border: 'none',
              borderRadius: 24, padding: '8px 15px',
              fontSize: 15, fontWeight: 500, color: '#000',
              boxShadow: '0 2px 12px rgba(0,0,0,0.16)', cursor: 'pointer',
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

        {/* iPhone 17 frame — wide, anchored from top, clipped at bottom */}
        <div
          style={{
            position: 'absolute',
            top: 10,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '75vw',
            maxWidth: 305,
            aspectRatio: '9 / 19.5',   /* iPhone 17 proportions */
            borderRadius: 52,
            border: '9px solid #c4c4c4',
            boxShadow: [
              '0 0 0 1px #a8a8a8',
              '0 0 0 2.5px #dedede',
              'inset 0 0 0 1px rgba(0,0,0,0.1)',
              '0 24px 64px rgba(0,0,0,0.22)',
              '0 4px 16px rgba(0,0,0,0.1)',
            ].join(', '),
            background: '#0a0a0a',
            overflow: 'hidden',
            zIndex: 10,
          }}
        >
          {/* Dynamic island */}
          <div style={{
            position: 'absolute', top: 11, left: '50%',
            transform: 'translateX(-50%)',
            width: '33%', height: 28,
            background: '#000', borderRadius: 16, zIndex: 30,
          }}>
            <div style={{
              position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
              width: 8, height: 8, borderRadius: '50%', background: '#1a1a1a',
            }} />
          </div>

          {/* Left side buttons */}
          <div style={{ position: 'absolute', left: -11, top: 76, width: 3, height: 30, background: '#aaa', borderRadius: 2 }} />
          <div style={{ position: 'absolute', left: -11, top: 116, width: 3, height: 48, background: '#aaa', borderRadius: 2 }} />
          <div style={{ position: 'absolute', left: -11, top: 172, width: 3, height: 48, background: '#aaa', borderRadius: 2 }} />
          {/* Right side button */}
          <div style={{ position: 'absolute', right: -11, top: 116, width: 3, height: 70, background: '#aaa', borderRadius: 2 }} />

          {/* Hero image — place portrait at /public/hero.jpg */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'url(/hero.jpg) center top / cover no-repeat, linear-gradient(180deg, #2a2520 0%, #1a1a1a 50%, #0d0d0d 100%)',
          }} />

          {/* Inner shadow overlay */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 5, borderRadius: 43,
            boxShadow: 'inset 0 0 22px rgba(0,0,0,0.45)',
            pointerEvents: 'none',
          }} />
        </div>
      </div>

      {/* ── Black section ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col flex-1"
        style={{
          position: 'relative',
          background: '#000',
          paddingTop: 36,
          paddingLeft: 24,
          paddingRight: 24,
          paddingBottom: 40,
          textAlign: 'center',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Arial, sans-serif',
          overflow: 'hidden',
        }}
      >
        {/* Diffused glow blob — sits behind text, blurred for softness */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: '5%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '160%',
            height: '70%',
            background: 'radial-gradient(ellipse at center, rgba(80,80,80,0.55) 0%, rgba(30,30,30,0.3) 40%, transparent 70%)',
            filter: 'blur(48px)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* Content sits above the glow */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flex: 1 }}>
          <h1
            style={{
              fontSize: 42,
              fontWeight: 700,
              color: '#ffffff',
              lineHeight: 1.08,
              letterSpacing: '-0.025em',
              marginBottom: 14,
            }}
          >
            Become Top-Tier.
          </h1>

          <p
            style={{
              fontSize: 16,
              fontWeight: 400,
              color: 'rgba(255,255,255,0.68)',
              lineHeight: 1.55,
              maxWidth: 300,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Get your attraction ratings, routine,{' '}
            products &amp; more to ascend in{' '}
            <span
              style={{
                background: 'linear-gradient(90deg, #4FD1C5, #81E6D9)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 500,
              }}
            >
              90 days
            </span>
          </p>

          <div style={{ flex: 1 }} />

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push('/onboarding')}
            style={{
              display: 'block', width: '100%',
              padding: '20px 24px',
              background: '#fff', color: '#000',
              fontSize: 18, fontWeight: 500,
              border: 'none', borderRadius: 18,
              cursor: 'pointer',
              marginTop: 28,
              fontFamily: 'inherit',
            }}
          >
            Get started
          </motion.button>
        </div>
      </motion.div>
    </main>
  )
}
