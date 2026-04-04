'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useAuth, signOut } from '@/lib/auth'
import { getState } from '@/lib/store'

/* âââ helpers âââââââââââââââââââââââââââââââââââââââââââââââ */
function greeting(name: string) {
  const h = new Date().getHours()
  const tod = h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening'
  return `Good ${tod}, ${name.split(' ')[0]}`
}

/* âââ sub-components ââââââââââââââââââââââââââââââââââââââââ */
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

/* âââ Dashboard âââââââââââââââââââââââââââââââââââââââââââââ */
function Dashboard({ name, email }: { name: string; email: string }) {
  const router = useRouter()
  const [avatarOpen, setAvatarOpen] = useState(false)
  const initial = name.charAt(0).toUpperCase()

  const appState = getState()
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })
  const todayWorkout = appState.workoutPlan?.schedule.find(d => d.day === today) ?? null
  const isRestDay = !todayWorkout && (appState.workoutPlan?.restDays.includes(today) ?? false)
  const todayMeals = appState.dietPlan?.meals ?? []
  const dailyCalories = appState.dietPlan?.calories ?? null

  const quickActions = [
    { label: 'Get my rating', href: '/onboarding' },
    { label: 'View diet plan', href: '/plan/diet' },
    { label: 'View workout plan', href: '/plan/workout' },
    { label: 'See results', href: '/results' },
  ]

  const startJourneyCard = (
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
        Get my rating â
      </button>
    </div>
  )

  const workoutCard = appState.workoutPlan ? (
    <div className="premium-card">
      <p className="section-label" style={{ marginBottom: 10 }}>TODAY&apos;S WORKOUT</p>
      {isRestDay ? (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>REST DAY â Recovery</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#000', background: 'var(--green)', padding: '2px 8px', borderRadius: 20 }}>REST</span>
          </div>
          {appState.workoutPlan.restDayTips[0] && (
            <p style={{ fontSize: 13, color: 'var(--text-sub)' }}>{appState.workoutPlan.restDayTips[0]}</p>
          )}
        </>
      ) : todayWorkout ? (
        <>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--teal)', marginBottom: 10 }}>
            {todayWorkout.day} â {todayWorkout.focus}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 12 }}>
            {todayWorkout.exercises.slice(0, 3).map((ex, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: '#fff' }}>â¢ {ex.name}</span>
                <span style={{ fontSize: 12, color: 'var(--teal)', fontWeight: 600 }}>{ex.sets}Ã{ex.reps}</span>
              </div>
            ))}
            {todayWorkout.exercises.length > 3 && (
              <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>+{todayWorkout.exercises.length - 3} more</span>
            )}
          </div>
        </>
      ) : (
        <p style={{ fontSize: 13, color: 'var(--text-sub)', marginBottom: 12 }}>No session scheduled for today</p>
      )}
      <button
        onClick={() => router.push('/plan/workout')}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--teal)', fontSize: 13, fontWeight: 600, padding: 0, fontFamily: 'inherit' }}
      >
        View Full Plan â
      </button>
    </div>
  ) : null

  const dietCard = appState.dietPlan ? (
    <div className="premium-card">
      <p className="section-label" style={{ marginBottom: 10 }}>TODAY&apos;S DIET</p>
      {dailyCalories && (
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>{dailyCalories.toLocaleString()} kcal</span>
          <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>
            Â· P: {appState.dietPlan.protein}g &nbsp;C: {appState.dietPlan.carbs}g &nbsp;F: {appState.dietPlan.fat}g
          </span>
        </div>
      )}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 10, marginBottom: 12 }}>
        {todayMeals.map((meal, i) => (
          <div key={i} style={{ marginBottom: i < todayMeals.length - 1 ? 10 : 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{meal.emoji} {meal.name}</span>
              <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>{meal.calories} kcal Â· {meal.time}</span>
            </div>
            {meal.items?.length > 0 && (
              <p style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2 }}>
                {meal.items.slice(0, 2).join(', ')}{meal.items.length > 2 ? 'â¦' : ''}
              </p>
            )}
          </div>
        ))}
      </div>
      <button
        onClick={() => router.push('/plan/diet')}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--teal)', fontSize: 13, fontWeight: 600, padding: 0, fontFamily: 'inherit' }}
      >
        View Full Plan â
      </button>
    </div>
  ) : null

  return (
    <main style={{
      minHeight: '100dvh', background: '#000',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
      paddingBottom: 40,
    }}>
      {/* ââ Top bar ââ */}
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
          }}>
            <img src="/logo.svg" alt="NextBody" style={{ width: 24, height: 24 }} />
          </div>
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

      {/* ââ Greeting ââ */}
      <div style={{ padding: '4px 20px 20px' }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', margin: 0 }}>
          {greeting(name)}
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
          Ready to level up today?
        </p>
      </div>

      {/* ââ Stats row ââ */}
      <div style={{ padding: '0 20px 20px', display: 'flex', gap: 10 }}>
        <StatCard label="Rating" value="â" sub="Not rated yet" />
        <StatCard label="Streak" value="0" sub="Days" />
        <StatCard label="Day" value={`${new Date().getDate()}`} />
      </div>

      {/* ââ Today's Focus ââ */}
      <div style={{ padding: '0 20px 20px' }}>
        <p className="section-label" style={{ marginBottom: 12 }}>TODAY&apos;S FOCUS</p>
        {workoutCard || dietCard ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {workoutCard ?? startJourneyCard}
            {dietCard ?? startJourneyCard}
          </div>
        ) : startJourneyCard}
      </div>

      {/* ââ My Plans ââ */}
      <div style={{ padding: '0 20px 20px' }}>
        <p className="section-label" style={{ marginBottom: 12 }}>MY PLANS</p>
        <div style={{ display: 'flex', gap: 12 }}>
          <PlanCard title="Diet Plan" subtitle="Personalized nutrition" href="/plan/diet" router={router} />
          <PlanCard title="Workout" subtitle="Custom training split" href="/plan/workout" router={router} />
        </div>
      </div>

      {/* ââ Quick Actions ââ */}
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
              <span style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.25)', fontSize: 16 }}>âº</span>
            </button>
          ))}
        </div>
      </div>
    </main>
  )
}

/* âââ Welcome / Landing âââââââââââââââââââââââââââââââââââââ */
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
      {/* ââ Teal radial background glow ââ */}
      <div
        className="bg-glow-in"
        style={{
          position: 'absolute', inset: 0, zIndex: 0,
          background: 'radial-gradient(ellipse 70% 50% at 50% 55%, #0d211d 0%, transparent 70%)',
        }}
      />

      {/* ââ Film grain texture ââ */}
      <div
        style={{
          position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
          backgroundImage: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/></filter><rect width='180' height='180' filter='url(%23n)' opacity='1'/></svg>")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '180px',
          opacity: 0.04,
        }}
      />

      {/* ââ Language selector â glassmorphism ââ */}
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

      {/* ââ Upper section â phone centered ââ */}
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
          <img src="/logo.svg" alt="NextBody" style={{ width: 70, height: 70, opacity: 0.9 }} />
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
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#0d1a17,#080808)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'absolute', top: '35%', left: '50%', transform: 'translate(-50%,-50%)', width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(92,224,208,0.2) 0%, transparent 70%)', filter: 'blur(16px)' }} />
              <svg width="140" height="220" viewBox="0 0 100 160" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'relative', zIndex: 2, marginTop: 16, filter: 'drop-shadow(0 0 10px rgba(92,224,208,0.55))' }}>
                <circle cx="50" cy="12" r="9" stroke="#5ce0d0" strokeWidth="1.8" fill="none"/>
                <line x1="50" y1="21" x2="50" y2="28" stroke="#5ce0d0" strokeWidth="1.8" strokeLinecap="round"/>
                <path d="M24 32 C24 32 18 36 17 46 C16 54 18 60 22 64 C18 66 14 72 13 82 L87 82 C86 72 82 66 78 64 C82 60 84 54 83 46 C82 36 76 32 76 32 C70 27 60 24 50 24 C40 24 30 27 24 32 Z" stroke="#5ce0d0" strokeWidth="1.8" fill="rgba(92,224,208,0.04)" strokeLinejoin="round"/>
                <path d="M34 58 C38 63 44 65 50 65 C56 65 62 63 66 58" stroke="#5ce0d0" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
                <line x1="44" y1="68" x2="44" y2="80" stroke="#5ce0d0" strokeWidth="1.2" strokeLinecap="round"/>
                <line x1="56" y1="68" x2="56" y2="80" stroke="#5ce0d0" strokeWidth="1.2" strokeLinecap="round"/>
                <line x1="35" y1="72" x2="65" y2="72" stroke="#5ce0d0" strokeWidth="1" strokeLinecap="round"/>
                <line x1="35" y1="78" x2="65" y2="78" stroke="#5ce0d0" strokeWidth="1" strokeLinecap="round"/>
                <path d="M17 46 C14 54 13 66 15 76 C16 82 18 86 20 88" stroke="#5ce0d0" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
                <path d="M83 46 C86 54 87 66 85 76 C84 82 82 86 80 88" stroke="#5ce0d0" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
                <path d="M13 82 C12 96 13 110 16 124 C18 132 22 140 26 148" stroke="#5ce0d0" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
                <path d="M87 82 C88 96 87 110 84 124 C82 132 78 140 74 148" stroke="#5ce0d0" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
                <path d="M2 20 L2 2 L20 2" stroke="rgba(92,224,208,0.45)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M80 2 L98 2 L98 20" stroke="rgba(92,224,208,0.45)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 138 L2 158 L20 158" stroke="rgba(92,224,208,0.45)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M80 158 L98 158 L98 138" stroke="rgba(92,224,208,0.45)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

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

      {/* ââ Bottom content â headline + CTAs ââ */}
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

/* âââ Root page âââââââââââââââââââââââââââââââââââââââââââââ */
export default function Page() {
  const { user, isLoggedIn, mounted } = useAuth()

  // Prevent SSR/hydration flashh
  if (!mounted) {
    return <main style={{ minHeight: '100dvh', background: '#000' }} />
  }

  if (isLoggedIn && user) {
    return <Dashboard name={user.name} email={user.email} />
  }

  return <WelcomePage />
}
