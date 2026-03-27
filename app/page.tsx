'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function WelcomePage() {
  const router = useRouter()

  return (
    <main className="min-h-dvh flex flex-col bg-black overflow-hidden">
      {/* Top half — white bg with phone frame */}
      <div className="relative flex items-end justify-center bg-white" style={{ flex: '0 0 58%' }}>

        {/* Phone frame */}
        <div
          className="relative overflow-hidden"
          style={{
            width: 220,
            height: 440,
            borderRadius: 36,
            border: '7px solid #c0c0c0',
            boxShadow: '0 0 0 1.5px #999, 0 24px 60px rgba(0,0,0,0.35)',
            background: '#111',
            marginBottom: -20,
          }}
        >
          {/* Dynamic island */}
          <div style={{
            position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)',
            width: 80, height: 22, background: '#000', borderRadius: 11, zIndex: 10,
          }} />

          {/* Hero photo — replace /hero.jpg in /public with your own portrait */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'url(/hero.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center top',
              background: 'url(/hero.jpg) center top / cover no-repeat, linear-gradient(160deg, #2d2820 0%, #1e1e1e 40%, #111 100%)',
            }}
          />

          {/* Side buttons */}
          <div style={{ position: 'absolute', right: -9, top: 80, width: 5, height: 32, background: '#aaa', borderRadius: 3 }} />
          <div style={{ position: 'absolute', left: -9, top: 70, width: 5, height: 24, background: '#aaa', borderRadius: 3 }} />
          <div style={{ position: 'absolute', left: -9, top: 104, width: 5, height: 24, background: '#aaa', borderRadius: 3 }} />
        </div>
      </div>

      {/* Bottom half — black */}
      <div className="flex flex-col flex-1 px-6 pt-8 pb-10" style={{ background: '#000' }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <h1 className="text-4xl font-black text-white leading-tight mb-3">
            Become Top-Tier.
          </h1>
          <p className="text-base text-[var(--text-sub)] leading-relaxed mb-8">
            Get your attraction ratings, physique analysis &amp; transformation plan to ascend in{' '}
            <span className="teal font-semibold">90 days</span>
          </p>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push('/onboarding')}
            className="btn-white"
          >
            Get started
          </motion.button>
        </motion.div>
      </div>
    </main>
  )
}
