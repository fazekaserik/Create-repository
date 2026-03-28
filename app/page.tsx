'use client'

import { useRouter } from 'next/navigation'

export default function WelcomePage() {
  const router = useRouter()

  return (
    <main
      style={{
        minHeight: '100dvh',
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        overflow: 'hidden',
        position: 'relative',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Arial, sans-serif',
      }}
    >
      {/* ── Teal radial background glow ── */}
      <div
        className="bg-glow-in"
        style={{
          position: 'absolute', inset: 0, zIndex: 0,
          background: 'radial-gradient(ellipse 70% 50% at 50% 55%, #0d211d 0%, transparent 70%)',
        }}
      />

      {/* ── Film grain texture ── */}
      <div
        style={{
          position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
          backgroundImage: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/></filter><rect width='180' height='180' filter='url(%23n)' opacity='1'/></svg>")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '180px',
          opacity: 0.04,
        }}
      />

      {/* ── Language selector — glassmorphism ── */}
      <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 20 }}>
        <button
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(255,255,255,0.10)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.14)',
            borderRadius: 24, padding: '7px 14px',
            fontSize: 14, fontWeight: 500, color: '#fff',
            cursor: 'pointer',
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

      {/* ── Upper section — phone centered ── */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          paddingTop: '3rem',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Brand splash — fades in then out before phone appears */}
        <div
          className="brand-splash"
          style={{
            position: 'absolute',
            textAlign: 'center',
            pointerEvents: 'none',
            zIndex: 5,
          }}
        >
          <p style={{
            margin: 0,
            fontSize: 22,
            fontWeight: 200,
            color: '#fff',
            textTransform: 'uppercase',
          }}>
            NextBody
          </p>
        </div>

        {/*
          Phone wrapper — both animations on same element:
          reveal (scale+fade) then float (infinite levitation)
        */}
        <div
          style={{
            position: 'relative',
            animation: 'phoneReveal 1.4s cubic-bezier(0.34,1.56,0.64,1) 0.8s both, phoneFloat 4s ease-in-out 2.2s infinite',
            filter: 'drop-shadow(0 30px 60px rgba(92,224,208,0.15)) drop-shadow(0 10px 30px rgba(0,0,0,0.6))',
          }}
        >
          {/* iPhone frame */}
          <div
            style={{
              height: 'min(52dvh, 430px)',
              aspectRatio: '9 / 19.5',
              borderRadius: 50,
              border: '9px solid #c6c6c6',
              position: 'relative',
              overflow: 'hidden',
              background: '#0a0a0a',
              boxShadow: '0 0 0 1px #ababab, 0 0 0 2.5px #e0e0e0',
            }}
          >
            {/* Dynamic Island */}
            <div style={{
              position: 'absolute', top: 11, left: '50%',
              transform: 'translateX(-50%)',
              width: '33%', height: 26,
              background: '#000', borderRadius: 14, zIndex: 20,
            }} />

            {/* Side buttons */}
            <div style={{ position:'absolute', left:-11, top:70,  width:3.5, height:28, background:'linear-gradient(90deg,#999,#ccc,#999)', borderRadius:2 }} />
            <div style={{ position:'absolute', left:-11, top:108, width:3.5, height:46, background:'linear-gradient(90deg,#999,#ccc,#999)', borderRadius:2 }} />
            <div style={{ position:'absolute', left:-11, top:162, width:3.5, height:46, background:'linear-gradient(90deg,#999,#ccc,#999)', borderRadius:2 }} />
            <div style={{ position:'absolute', right:-11,top:108, width:3.5, height:66, background:'linear-gradient(90deg,#ccc,#999,#ccc)', borderRadius:2 }} />

            {/* Hero image */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'url(/hero.jpg) center top / cover no-repeat, linear-gradient(180deg,#1e1e1e,#0a0a0a)',
            }} />

            {/* Corner ambient light */}
            <div style={{
              position: 'absolute', inset: 0, zIndex: 8,
              background: 'linear-gradient(120deg, rgba(255,255,255,0.09) 0%, transparent 45%)',
              pointerEvents: 'none', borderRadius: 41,
            }} />

            {/* Glint overlay */}
            <div
              style={{
                position: 'absolute', top: '-10%', left: 0,
                width: '30%', height: '120%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.38), transparent)',
                animation: 'glint 1s ease 2.4s both',
                opacity: 0,
                pointerEvents: 'none',
                zIndex: 9,
              }}
            />

            {/* Inner shadow */}
            <div style={{
              position: 'absolute', inset: 0, zIndex: 10,
              boxShadow: 'inset 0 0 22px rgba(0,0,0,0.45)',
              borderRadius: 41, pointerEvents: 'none',
            }} />
          </div>
        </div>
      </div>

      {/* ── Bottom content — headline + CTA ── */}
      <div
        style={{
          width: '100%',
          padding: '0 24px 44px',
          textAlign: 'center',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <h1
          style={{
            animation: 'fadeSlideUp 0.7s cubic-bezier(0.25,0.46,0.45,0.94) 1.5s both',
            fontSize: 'clamp(30px, 8vw, 42px)',
            fontWeight: 500,
            color: '#fff',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            marginBottom: 12,
            whiteSpace: 'nowrap',
          }}
        >
          Become Top-Tier
        </h1>

        <p
          style={{
            animation: 'fadeSlideUp 0.7s cubic-bezier(0.25,0.46,0.45,0.94) 1.8s both',
            fontSize: 16,
            fontWeight: 400,
            color: 'rgba(255,255,255,0.62)',
            lineHeight: 1.55,
            maxWidth: 300,
            margin: '0 auto 32px',
          }}
        >
          Get your attraction ratings, routine, products &amp; more to ascend in{' '}
          <span style={{ color: '#5CE0D0', fontWeight: 500 }}>90 days</span>
        </p>

        <button
          style={{
            animation: 'fadeSlideUp 0.7s cubic-bezier(0.25,0.46,0.45,0.94) 2.1s both',
            display: 'block', width: '100%',
            padding: '20px 24px',
            background: '#fff', color: '#000',
            fontSize: 17, fontWeight: 500,
            border: 'none', borderRadius: 18,
            cursor: 'pointer',
            transition: 'transform 0.15s ease',
          }}
          onTouchStart={e => { e.currentTarget.style.transform = 'scale(0.97)' }}
          onTouchEnd={e => { e.currentTarget.style.transform = 'scale(1)' }}
          onClick={() => router.push('/onboarding')}
        >
          Get started
        </button>
      </div>
    </main>
  )
}
