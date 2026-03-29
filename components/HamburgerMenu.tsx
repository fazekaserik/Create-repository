'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_ITEMS = [
  { emoji: '🏠', label: 'Home',          href: '/' },
  { emoji: '📊', label: 'My Rating',     href: '/rating' },
  { emoji: '🥗', label: 'Diet Plan',     href: '/plan/diet' },
  { emoji: '💪', label: 'Workout Plan',  href: '/plan/workout' },
  { emoji: '⚙️', label: 'Settings',      href: '/settings' },
]

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const navigate = (href: string) => {
    setOpen(false)
    router.push(href)
  }

  return (
    <>
      {/* Trigger button — fixed top-left */}
      <button
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed', top: 16, left: 16, zIndex: 100,
          width: 40, height: 40,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5,
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.10)',
          borderRadius: 10,
          cursor: 'pointer',
          padding: 0,
        }}
        aria-label="Open menu"
      >
        {[0, 1, 2].map(i => (
          <span key={i} style={{ display: 'block', width: 18, height: 1.5, background: '#fff', borderRadius: 1 }} />
        ))}
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              style={{
                position: 'fixed', inset: 0, zIndex: 200,
                background: 'rgba(0,0,0,0.70)',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
              }}
            />

            {/* Drawer */}
            <motion.div
              key="drawer"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              style={{
                position: 'fixed', top: 0, left: 0, bottom: 0,
                width: 280, zIndex: 300,
                background: '#0d0d0d',
                borderRight: '1px solid rgba(255,255,255,0.08)',
                display: 'flex', flexDirection: 'column',
                overflowY: 'auto',
              }}
            >
              {/* Top bar — logo + close */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 20px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: '#000',
                    border: '1px solid rgba(92,224,208,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 800, color: 'var(--teal)',
                    letterSpacing: '-0.03em',
                  }}>NB</div>
                  <span style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>NextBody</span>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'var(--text-sub)', fontSize: 18, lineHeight: 1,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                  aria-label="Close menu"
                >✕</button>
              </div>

              {/* Account section */}
              <div style={{ padding: '24px 20px 0' }}>
                <p className="section-label" style={{ marginBottom: 12 }}>ACCOUNT</p>
                <button
                  onClick={() => {}}
                  style={{
                    width: '100%', padding: '12px 20px',
                    background: '#fff', color: '#000',
                    fontSize: 15, fontWeight: 600,
                    border: 'none', borderRadius: 12,
                    cursor: 'pointer', textAlign: 'center',
                    fontFamily: 'inherit',
                    marginBottom: 10,
                  }}
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/onboarding')}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--teal)', fontSize: 13, fontWeight: 500,
                    padding: 0, fontFamily: 'inherit',
                  }}
                >
                  New here? Get started →
                </button>
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '20px 20px 0' }} />

              {/* Nav items */}
              <div style={{ padding: '16px 12px 0' }}>
                <p className="section-label" style={{ marginBottom: 8, paddingLeft: 8 }}>NAVIGATE</p>
                {NAV_ITEMS.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <button
                      key={item.href}
                      onClick={() => navigate(item.href)}
                      style={{
                        width: '100%', height: 48,
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '0 12px',
                        borderRadius: 10,
                        background: 'none',
                        border: 'none',
                        borderLeft: isActive ? '2px solid var(--teal)' : '2px solid transparent',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'none' }}
                    >
                      <span style={{ fontSize: 18, color: isActive ? 'var(--teal)' : 'var(--text-sub)', width: 24, textAlign: 'center' }}>
                        {item.emoji}
                      </span>
                      <span style={{ fontSize: 15, fontWeight: 500, color: isActive ? 'var(--teal)' : '#fff' }}>
                        {item.label}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* Spacer */}
              <div style={{ flex: 1 }} />

              {/* Footer */}
              <div style={{
                padding: '16px 20px 32px',
                borderTop: '1px solid rgba(255,255,255,0.07)',
              }}>
                <div style={{ display: 'flex', gap: 16, marginBottom: 8 }}>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: 'var(--text-dim)', padding: 0, fontFamily: 'inherit' }}>Privacy Policy</button>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: 'var(--text-dim)', padding: 0, fontFamily: 'inherit' }}>Terms</button>
                </div>
                <p style={{ fontSize: 11, color: 'var(--text-dim)' }}>v1.0</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
