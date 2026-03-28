'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function WelcomePage() {
  const router = useRouter()
  const [showHero, setShowHero] = useState(false)

  useEffect(() => {
    // Fade in hero image after entry animation completes (1.2s)
    const t = setTimeout(() => setShowHero(true), 1200)
    return () => clearTimeout(t)
  }, [])

  return (
    <main className="min-h-dvh flex flex-col overflow-hidden">

      {/* ── White section — phone clipped at bottom ── */}
      <div
        style={{
          position: 'relative',
          background: '#ebebeb',
          height: '57vh',
          flexShrink: 0,
          overflow: 'hidden',
          perspective: '1200px',   /* 3D perspective for child phone */
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

        {/* Float wrapper — handles continuous levitation after entry */}
        <div
          className="phone-float"
          style={{
            position: 'absolute',
            top: 10,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '75vw',
            maxWidth: 305,
            zIndex: 10,
          }}
        >
          {/* iPhone 17 — 3D entry animation */}
          <div
            className="phone-enter"
            style={{
              width: '100%',
              aspectRatio: '9 / 19.5',
              borderRadius: 50,
              border: '9px solid #c8c8c8',
              background: 'linear-gradient(145deg, #1e1e1e, #000)',
              boxShadow: [
                '0 0 0 1px #adadad',
                '0 0 0 2.5px #e0e0e0',
                'inset 0 0 0 1px rgba(255,255,255,0.05)',
                '0 30px 80px rgba(0,0,0,0.8)',
                '0 8px 24px rgba(0,0,0,0.5)',
              ].join(', '),
              overflow: 'hidden',
              position: 'relative',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Dynamic Island */}
            <div style={{
              position: 'absolute', top: 11, left: '50%',
              transform: 'translateX(-50%)',
              width: '33%', height: 28,
              background: '#000', borderRadius: 16, zIndex: 30,
            }}>
              {/* Camera dot */}
              <div style={{
                position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                width: 8, height: 8, borderRadius: '50%',
                background: 'radial-gradient(circle at 35% 35%, #2a2a2a, #0a0a0a)',
                boxShadow: '0 0 0 1px rgba(255,255,255,0.06)',
              }} />
            </div>

            {/* Left buttons — metallic */}
            <div style={{ position: 'absolute', left: -11, top: 76, width: 3.5, height: 30, background: 'linear-gradient(to right, #888, #bbb, #888)', borderRadius: 2 }} />
            <div style={{ position: 'absolute', left: -11, top: 116, width: 3.5, height: 50, background: 'linear-gradient(to right, #888, #bbb, #888)', borderRadius: 2 }} />
            <div style={{ position: 'absolute', left: -11, top: 174, width: 3.5, height: 50, background: 'linear-gradient(to right, #888, #bbb, #888)', borderRadius: 2 }} />
            {/* Right power button */}
            <div style={{ position: 'absolute', right: -11, top: 116, width: 3.5, height: 72, background: 'linear-gradient(to left, #888, #bbb, #888)', borderRadius: 2 }} />

            {/* Camera bump (top-left corner area) */}
            <div style={{
              position: 'absolute', top: 48, left: 12, zIndex: 6,
              width: 44, height: 44,
              background: 'radial-gradient(circle, #1a1a1a 60%, transparent 100%)',
              borderRadius: 14,
              boxShadow: '0 2px 8px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.06)',
            }}>
              {/* Lens */}
              <div style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 28, height: 28, borderRadius: '50%',
                background: 'radial-gradient(circle at 35% 35%, #2a3a4a, #080808)',
                boxShadow: '0 0 0 2px rgba(255,255,255,0.08), inset 0 0 6px rgba(0,0,0,0.8)',
              }} />
            </div>

            {/* Hero image — fades in after entry animation */}
            <div style={{
              position: 'absolute', inset: 0, zIndex: 4,
              backgroundImage: 'url(/hero.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center top',
              opacity: showHero ? 1 : 0,
              transition: 'opacity 0.9s ease',
            }} />

            {/* Dark fallback visible before hero loads */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)',
            }} />

            {/* Lighting reflection — top-left corner glint */}
            <div style={{
              position: 'absolute', inset: 0, zIndex: 8,
              background: 'linear-gradient(120deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.03) 25%, transparent 55%)',
              mixBlendMode: 'soft-light',
              pointerEvents: 'none',
              borderRadius: 41,
            }} />

            {/* Inner shadow frame */}
            <div style={{
              position: 'absolute', inset: 0, zIndex: 9,
              boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)',
              borderRadius: 41,
              pointerEvents: 'none',
            }} />
          </div>
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
        {/* Radial gray glow behind text */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse 120% 65% at 50% 35%, #3a3a3a 0%, #1c1c1c 40%, #000000 70%)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* Content above glow */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flex: 1 }}>
          <h1
            style={{
              fontSize: 'clamp(34px, 6vw, 44px)',
              fontWeight: 500,
              color: '#ffffff',
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              whiteSpace: 'nowrap',
              transform: 'translateY(-2px)',
              margin: '0 auto 14px',
            }}
          >
            Become Top-Tier
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
