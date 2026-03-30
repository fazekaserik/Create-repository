'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useAuth, signOut } from '@/lib/auth'

/* ─── helpers ─────────────────────────────────────────────── */
function greeting(name: string) {
  const h = new Date().getHours()
  const tod = h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening'
  return `Good ${tod}, ${name.split(' ')[0]}`
}

/* ─── sub-components ──────────────────────────────────────── */
function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div style={{
      flex: 1,
      background: '#141414',
      borderRadius: 14,
      padding: '14px 10px',
      textAlign: 'center',
      border: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>{value}</div>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--teal)', marginTop: 3 }}>{sub}</div>}
    </div>
  )
}

function PlanCard({ title, subtitle, href, router }: { title: string; subtitle: string; href: string; router: ReturnType<typeof useRouter> }) {
  return (
    <button
      onClick={() => router.push(href)}
      style={{
        flex: 1,
        background: '#141414',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 16,
        padding: '18px 14px',
        cursor: 'pointer',
        textAlign: 'left',
        fontFamily: 'inherit',
        transition: 'background 0.15s',
      }}
      onTouchStart={e => { (e.currentTarget as HTMLButtonElement).style.background = '#1d1d1d' }}
      onTouchEnd={e => { (e.currentTarget as HTMLButtonElement).style.background = '#141414' }}
    >
      <div style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>{title}</div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{subtitle}</div>
    </button>
  )
}

/* ─── Dashboard ───────────────────────────────────────────── */
function Dashboard({ name, email }: { name: string; email: string }) {
  const router = useRouter()
  const [avatarOpen, setAvatarOpen] = useState(false)
  const initial = name.charAt(0).toUpperCase()

  const quickActions = [
    { label: 'Get my rating', href: '/onboarding' },
    { label: 'View diet plan', href: '/plan/diet' },
    { label: 'View workout plan', href: '/plan/workout' },
    { label: 'See results', href: '/results' },
  ]

  return (
    <main style={{
      minHeight: '100dvh', background: '#000',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
      paddingBottom: 40,
    }}>
      {/* ── Top bar ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '56px 20px 16px',
        position: 'relative',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: '#000', border: '1px solid rgba(92,224,208,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 800, color: 'var(--teal)',
          }}>NB</div>
          <span style={{ fontSize: 17, fontWeight: 700, color: '#fff' }}>NextBody</span>
        </div>

        {/* Avatar */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setAvatarOpen(v => !v)}
            style={{
              width: 38, height: 38, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--teal), #38bdf8)',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 15, fontWeight: 700, color: '#000',
            }}
          >
            {initial}
          </button>

          {/* Dropdown */}
          {avatarOpen && (
            <>
              <div onClick={() => setAvatarOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 50 }} />
              <div style={{
                position: 'absolute', right: 0, top: 46, zIndex: 60,
                background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 14, minWidth: 180, overflow: 'hidden',
                boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
              }}>
                <div style={{ padding: '14px 16px 10px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{name}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{email}</div>
                </div>
                <button
                  onClick={() => { setAvatarOpen(false); signOut() }}
                  style={{
                    width: '100%', padding: '13px 16px',
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: 14, color: '#f87171', textAlign: 'left',
                    fontFamily: 'inherit',
                  }}
                >
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Greeting ── */}
      <div style={{ padding: '4px 20px 20px' }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', margin: 0 }}>
          {greeting(name)}
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
          Ready to level up today?
        </p>
      </div>

      {/* ── Stats row ── */}
      <div style={{ padding: '0 20px 20px', display: 'flex', gap: 10 }}>
        <StatCard label="Rating" value="—" sub="Not rated yet" />
        <StatCard label="Streak" value="0" sub="Days" />
        <StatCard label="Day" value={`${new Date().getDate()}`} />
      </div>

      {/* ── Today's Focus ── */}
      <div style={{ padding: '0 20px 20px' }}>
        <p className="section-label" style={{ marginBottom: 12 }}>TODAY&apos;S FOCUS</p>
        <div style={{
          background: 'linear-gradient(135deg, #0d211d 0%, #0a1a2e 100%)',
          border: '1px solid rgba(92,224,208,0.15)',
          borderRadius: 18, padding: '20px 18px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12,
              background: 'rgba(92,224,208,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20,
            }} />
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>Start your journey</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>Get your AI body analysis first</div>
            </div>
          </div>
          <button
            onClick={() => router.push('/onboarding')}
            className="btn-teal"
            style={{ padding: '13px 20px', fontSize: 14 }}
          >
            Get my rating →
          </button>
        </div>
      </div>

      {/* ── My Plans ── */}
      <div style={{ padding: '0 20px 20px' }}>
        <p className="section-label" style={{ marginBottom: 12 }}>MY PLANS</p>
        <div style={{ display: 'flex', gap: 12 }}>
          <PlanCard title="Diet Plan" subtitle="Personalized nutrition" href="/plan/diet" router={router} />
          <PlanCard title="Workout" subtitle="Custom training split" href="/plan/workout" router={router} />
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div style={{ padding: '0 20px' }}>
        <p className="section-label" style={{ marginBottom: 12 }}>QUICK ACTIONS</p>
        <div style={{
          background: '#141414',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 16, overflow: 'hidden',
        }}>
          {quickActions.map((a, i) => (
            <button
              key={a.href}
              onClick={() => router.push(a.href)}
              style={{
                width: '100%', height: 52,
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '0 16px',
                background: 'none', border: 'none',
                borderTop: i > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                cursor: 'pointer', fontFamily: 'inherit',
                transition: 'background 0.15s',
              }}
              onTouchStart={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)' }}
              onTouchEnd={e => { (e.currentTarget as HTMLButtonElement).style.background = 'none' }}
            >
              <span style={{ fontSize: 15, color: '#fff', fontWeight: 500 }}>{a.label}</span>
              <span style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.25)', fontSize: 16 }}>›</span>
            </button>
          ))}
        </div>
      </div>
    </main>
  )
}

/* ─── Welcome / Landing ───────────────────────────────────── */
function WelcomePage() {
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
        {/* Brand splash */}
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

        {/* Phone wrapper */}
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
              border: '8px solid #1a1a1a',
              position: 'relative',
              overflow: 'hidden',
              background: '#000',
              boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.06), 0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
            }}
          >
            {/* Dynamic Island */}
            <div style={{
              position: 'absolute', top: 11, left: '50%',
              transform: 'translateX(-50%)',
              width: '33%', height: 26,
              background: '#111', borderRadius: 14, zIndex: 20,
            }} />

            {/* Side buttons */}
            <div style={{ position:'absolute', left:-9, top:70,  width:3, height:28, background:'#2a2a2a', borderRadius:2 }} />
            <div style={{ position:'absolute', left:-9, top:108, width:3, height:46, background:'#2a2a2a', borderRadius:2 }} />
            <div style={{ position:'absolute', left:-9, top:162, width:3, height:46, background:'#2a2a2a', borderRadius:2 }} />
            <div style={{ position:'absolute', right:-9, top:108, width:3, height:66, background:'#2a2a2a', borderRadius:2 }} />

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

      {/* ── Bottom content — headline + CTAs ── */}
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

        {/* Sign In ghost button */}
        <button
          style={{
            animation: 'fadeSlideUp 0.7s cubic-bezier(0.25,0.46,0.45,0.94) 2.1s both',
            display: 'block', width: '100%',
            marginTop: 12,
            padding: '18px 24px',
            background: 'transparent', color: '#fff',
            fontSize: 17, fontWeight: 500,
            border: '1.5px solid rgba(255,255,255,0.7)',
            borderRadius: 18,
            cursor: 'pointer',
            transition: 'transform 0.15s ease',
            fontFamily: 'inherit',
          }}
          onTouchStart={e => { e.currentTarget.style.transform = 'scale(0.97)' }}
          onTouchEnd={e => { e.currentTarget.style.transform = 'scale(1)' }}
          onClick={() => router.push('/signin')}
        >
          Sign In
        </button>
      </div>
    </main>
  )
}

/* ─── Root page ───────────────────────────────────────────── */
export default function Page() {
  const { user, isLoggedIn, mounted } = useAuth()

  // Prevent SSR/hydration flash
  if (!mounted) {
    return <main style={{ minHeight: '100dvh', background: '#000' }} />
  }

  if (isLoggedIn && user) {
    return <Dashboard name={user.name} email={user.email} />
  }

  return <WelcomePage />
}
