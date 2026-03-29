'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { getState, setState } from '@/lib/store'

interface Exercise {
  name: string
  sets: number
  reps: string
  rest: string
  muscle: string
}

interface WorkoutDay {
  day: string
  focus: string
  exercises: Exercise[]
}

interface WorkoutPlan {
  daysPerWeek: number
  splitType: string
  schedule: WorkoutDay[]
  restDays: string[]
  restDayTips: string[]
  progressionNotes: string
  tips: string[]
}

type PageView = 'loading' | 'paywall' | 'plan'

export default function WorkoutPlanPage() {
  const router = useRouter()
  const [view, setView] = useState<PageView>('loading')
  const [progress, setProgress] = useState(0)
  const [plan, setPlan] = useState<WorkoutPlan | null>(null)
  const appState = useRef(getState())
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) return
    ran.current = true

    const s = appState.current
    let planData: WorkoutPlan | null = null

    const fallback: WorkoutPlan = {
      daysPerWeek: 5,
      splitType: 'Push / Pull / Legs',
      schedule: [
        { day: 'Monday', focus: 'Push — Chest / Shoulders / Triceps', exercises: [
          { name: 'Bench Press',           sets: 4, reps: '8-10',  rest: '90s', muscle: 'Chest' },
          { name: 'Overhead Press',        sets: 3, reps: '10-12', rest: '75s', muscle: 'Shoulders' },
          { name: 'Incline DB Press',      sets: 3, reps: '10-12', rest: '60s', muscle: 'Upper Chest' },
          { name: 'Lateral Raises',        sets: 3, reps: '15-20', rest: '45s', muscle: 'Lateral Delts' },
          { name: 'Tricep Pushdowns',      sets: 3, reps: '12-15', rest: '45s', muscle: 'Triceps' },
        ]},
        { day: 'Tuesday', focus: 'Pull — Back / Biceps', exercises: [
          { name: 'Pull-Ups',              sets: 4, reps: '6-10',  rest: '90s', muscle: 'Back' },
          { name: 'Barbell Row',           sets: 4, reps: '8-10',  rest: '90s', muscle: 'Back' },
          { name: 'Cable Row',             sets: 3, reps: '12-15', rest: '60s', muscle: 'Back' },
          { name: 'Face Pulls',            sets: 3, reps: '15-20', rest: '45s', muscle: 'Rear Delts' },
          { name: 'Barbell Curl',          sets: 3, reps: '10-12', rest: '60s', muscle: 'Biceps' },
        ]},
        { day: 'Wednesday', focus: 'Legs — Quads / Hamstrings / Glutes', exercises: [
          { name: 'Squat',                 sets: 4, reps: '8-10',  rest: '120s', muscle: 'Quads' },
          { name: 'Romanian Deadlift',     sets: 3, reps: '10-12', rest: '90s',  muscle: 'Hamstrings' },
          { name: 'Leg Press',             sets: 3, reps: '12-15', rest: '75s',  muscle: 'Quads' },
          { name: 'Leg Curl',              sets: 3, reps: '12-15', rest: '60s',  muscle: 'Hamstrings' },
          { name: 'Calf Raises',           sets: 4, reps: '15-20', rest: '45s',  muscle: 'Calves' },
        ]},
        { day: 'Friday', focus: 'Push — Chest / Shoulders / Triceps', exercises: [
          { name: 'Incline Bench Press',   sets: 4, reps: '8-10',  rest: '90s', muscle: 'Upper Chest' },
          { name: 'DB Shoulder Press',     sets: 3, reps: '10-12', rest: '75s', muscle: 'Shoulders' },
          { name: 'Cable Flyes',           sets: 3, reps: '12-15', rest: '60s', muscle: 'Chest' },
          { name: 'Arnold Press',          sets: 3, reps: '10-12', rest: '60s', muscle: 'Shoulders' },
          { name: 'Skull Crushers',        sets: 3, reps: '10-12', rest: '60s', muscle: 'Triceps' },
        ]},
        { day: 'Saturday', focus: 'Pull + Legs — Back / Biceps / Glutes', exercises: [
          { name: 'Deadlift',              sets: 4, reps: '5-8',   rest: '120s', muscle: 'Back' },
          { name: 'Lat Pulldown',          sets: 3, reps: '10-12', rest: '75s',  muscle: 'Lats' },
          { name: 'Lunges',                sets: 3, reps: '12/leg', rest: '60s', muscle: 'Glutes' },
          { name: 'Hammer Curls',          sets: 3, reps: '12-15', rest: '45s',  muscle: 'Biceps' },
        ]},
      ],
      restDays: ['Thursday', 'Sunday'],
      restDayTips: [
        'Light walking 20-30 min to stay active',
        'Foam rolling & dynamic stretching for recovery',
        'Stay hydrated — aim for 3L of water',
      ],
      progressionNotes: 'Add 2.5 kg to compound lifts each week. If you fail to complete all reps, hold the weight until you can before increasing.',
      tips: [
        'Warm up with 5-10 min light cardio before every session',
        'Track your lifts — progressive overload is the key to growth',
        'Sleep 7-9 hours — 80% of muscle growth happens during sleep',
      ],
    }

    const apiPromise = fetch('/api/generate-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'workout',
        goal: s.goal,
        gymType: s.gymType,
        age: s.age,
        weight: s.weight,
        weightUnit: s.weightUnit,
        height: s.height,
        heightUnit: s.heightUnit,
        name: s.name,
      }),
    })
      .then(r => r.json())
      .then(data => { planData = data.plan ?? fallback })
      .catch(() => { planData = fallback })

    const start = Date.now()
    const iv = setInterval(() => {
      setProgress(Math.min(((Date.now() - start) / 2500) * 98, 98))
    }, 40)

    Promise.all([apiPromise, new Promise(r => setTimeout(r, 2500))]).then(() => {
      clearInterval(iv)
      setProgress(100)
      setPlan(planData)
      const fresh = getState()
      if (fresh.tier !== 'free' || fresh.demoMode) {
        setView('plan')
      } else {
        setView('paywall')
      }
    })

    return () => clearInterval(iv)
  }, [])

  const handleDemo = () => {
    setState({ demoMode: true })
    setView('plan')
  }

  const handleBuy = (planType: 'weekly' | 'monthly') => {
    window.location.href = `/api/checkout?plan=${planType}`
  }

  /* ── Loading ── */
  if (view === 'loading') {
    return (
      <main style={{ minHeight: '100dvh', background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>
        <div style={{ position: 'relative', width: 120, height: 120, marginBottom: 40 }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'radial-gradient(circle, rgba(92,224,208,0.15) 0%, transparent 70%)' }} />
          <div className="scan-ring" style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid var(--teal)', opacity: 0.5 }} />
          <div className="scan-ring" style={{ position: 'absolute', inset: 14, borderRadius: '50%', border: '2px solid var(--teal)', opacity: 0.35, animationDelay: '0.4s' }} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(92,224,208,0.10)', border: '1.5px solid var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
              💪
            </div>
          </div>
        </div>

        <p className="section-label" style={{ color: 'var(--teal)', marginBottom: 8 }}>BUILDING YOUR PLAN</p>
        <p style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 36, textAlign: 'center' }}>Designing your training split…</p>

        <div style={{ width: '100%', maxWidth: 280 }}>
          <div style={{ height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.08)', overflow: 'hidden', marginBottom: 8 }}>
            <div style={{
              height: '100%', borderRadius: 2,
              background: 'linear-gradient(90deg, #5ce0d0, #4ade80)',
              width: `${progress}%`,
              transition: 'width 0.4s ease',
              boxShadow: '0 0 8px rgba(92,224,208,0.5)',
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>Processing</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--teal)' }}>{Math.round(progress)}%</span>
          </div>
        </div>
      </main>
    )
  }

  /* ── Paywall ── */
  if (view === 'paywall') {
    return (
      <main style={{ minHeight: '100dvh', background: '#000', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', padding: '44px 20px 12px' }}>
          <button onClick={() => router.push('/plan')} style={{ fontSize: 24, color: 'var(--text-sub)', background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1 }}>‹</button>
          <div style={{ flex: 1 }} />
        </div>

        <div style={{ flex: 1, padding: '0 24px 48px', overflowY: 'auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Your Plan is Ready 🎉</h1>
            <p style={{ fontSize: 14, color: 'var(--text-sub)' }}>Unlock your personalized workout plan</p>
          </div>

          {/* Blurred preview */}
          <div className="premium-card" style={{ position: 'relative', marginBottom: 24, overflow: 'hidden', padding: '20px' }}>
            <div style={{ filter: 'blur(6px)', pointerEvents: 'none', userSelect: 'none' }}>
              <div style={{ height: 16, background: 'rgba(255,255,255,0.12)', borderRadius: 4, marginBottom: 12, width: '70%' }} />
              <div style={{ height: 12, background: 'rgba(255,255,255,0.08)', borderRadius: 4, marginBottom: 8, width: '90%' }} />
              <div style={{ height: 12, background: 'rgba(255,255,255,0.08)', borderRadius: 4, width: '60%' }} />
            </div>
            <div style={{
              position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(2px)',
            }}>
              <span style={{ fontSize: 22, marginBottom: 6 }}>🔒</span>
              <span style={{ fontSize: 13, color: 'var(--text-sub)', fontWeight: 500 }}>Unlock to see</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
            {/* Weekly */}
            <div className="premium-card">
              <p className="section-label" style={{ marginBottom: 8 }}>WEEKLY</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 12 }}>
                <span style={{ fontSize: 32, fontWeight: 700, color: '#fff' }}>$4.99</span>
                <span style={{ fontSize: 16, color: 'var(--text-sub)' }}>/week</span>
              </div>
              {['Full workout plan', 'Daily exercise lists', 'Sets & reps guide', 'Cancel anytime'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ color: 'var(--green)', fontSize: 13 }}>✓</span>
                  <span style={{ fontSize: 13, color: 'var(--text-sub)' }}>{f}</span>
                </div>
              ))}
              <button onClick={() => handleBuy('weekly')} className="btn-white" style={{ marginTop: 16 }}>
                Start Weekly — $4.99
              </button>
            </div>

            {/* Monthly */}
            <div className="premium-card" style={{ borderColor: 'var(--teal)', background: 'rgba(92,224,208,0.04)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 16, right: 16 }}>
                <span className="teal-badge">BEST VALUE</span>
              </div>
              <p className="section-label" style={{ marginBottom: 8 }}>MONTHLY</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 12 }}>
                <span style={{ fontSize: 32, fontWeight: 700, color: '#fff' }}>$14.99</span>
                <span style={{ fontSize: 16, color: 'var(--text-sub)' }}>/month</span>
              </div>
              {['Full workout plan', 'Daily exercise lists', 'Sets & reps guide', 'Cancel anytime', 'Save 57% vs weekly'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ color: 'var(--green)', fontSize: 13 }}>✓</span>
                  <span style={{ fontSize: 13, color: f.includes('Save') ? 'var(--teal)' : 'var(--text-sub)' }}>{f}</span>
                </div>
              ))}
              <button onClick={() => handleBuy('monthly')} className="btn-teal" style={{ marginTop: 16 }}>
                Start Monthly — $14.99
              </button>
            </div>
          </div>

          <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-dim)', marginBottom: 16 }}>
            🔒 Secure checkout · Cancel anytime · Instant access
          </p>
          <button
            onClick={handleDemo}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)', fontSize: 13, textAlign: 'center', width: '100%', fontFamily: 'inherit', padding: '8px 0' }}
          >
            Demo: view plan without paying →
          </button>
        </div>
      </main>
    )
  }

  /* ── Plan ── */
  const p = plan
  if (!p) {
    return (
      <main style={{ minHeight: '100dvh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="w-8 h-8 rounded-full border-2 border-[var(--teal)] border-t-transparent animate-spin" />
      </main>
    )
  }

  const s = appState.current
  const goalLabel = s.goal === 'cut' ? 'Fat Loss' : s.goal === 'build' ? 'Muscle Gain' : s.goal === 'bulk' ? 'Bulk' : 'Fitness'

  return (
    <main style={{ minHeight: '100dvh', background: '#000', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '44px 20px 12px' }}>
        <button onClick={() => router.push('/plan')} style={{ fontSize: 24, color: 'var(--text-sub)', background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1 }}>‹</button>
        <h1 style={{ flex: 1, textAlign: 'center', fontSize: 18, fontWeight: 600, color: '#fff' }}>Your Workout Plan</h1>
        <div style={{ width: 32 }} />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 48px' }}>
        {/* Name + goal badge */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 8 }}>
            {s.name ? `${s.name}'s Plan` : 'Your Plan'}
          </h2>
          <span className="teal-badge">{goalLabel}</span>
        </motion.div>

        {/* Weekly split card */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="premium-card" style={{ marginBottom: 16 }}>
          <p className="section-label" style={{ marginBottom: 14 }}>WEEKLY SPLIT</p>
          <div style={{ display: 'flex', gap: 20 }}>
            <div>
              <p style={{ fontSize: 36, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{p.daysPerWeek ?? 5}</p>
              <p style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 2 }}>days/week</p>
            </div>
            <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: 20 }}>
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--teal)', marginBottom: 4 }}>{p.splitType ?? 'Custom Split'}</p>
              <p style={{ fontSize: 13, color: 'var(--text-sub)' }}>
                Rest: {(p.restDays ?? []).join(', ')}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Daily workouts */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ marginBottom: 16 }}>
          <p className="section-label" style={{ marginBottom: 12 }}>DAILY WORKOUTS</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(p.schedule ?? []).map((day, i) => (
              <div key={i} className="premium-card" style={{ padding: '14px 16px' }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{day.day}</p>
                <p style={{ fontSize: 13, color: 'var(--teal)', marginBottom: 12, fontWeight: 500 }}>{day.focus}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {(day.exercises ?? []).map((ex, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{ex.name}</span>
                        <span style={{ fontSize: 11, color: 'var(--text-dim)', marginLeft: 8 }}>{ex.muscle}</span>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--teal)' }}>{ex.sets}×{ex.reps}</p>
                        <p style={{ fontSize: 11, color: 'var(--text-dim)' }}>rest {ex.rest}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Progression card */}
        {p.progressionNotes && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="premium-card" style={{ marginBottom: 16 }}>
            <p className="section-label" style={{ marginBottom: 10 }}>PROGRESSION</p>
            <p style={{ fontSize: 14, color: 'var(--text-sub)', lineHeight: 1.6 }}>{p.progressionNotes}</p>
          </motion.div>
        )}

        {/* Recovery / rest day card */}
        {(p.restDayTips ?? []).length > 0 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="premium-card" style={{ marginBottom: 16 }}>
            <p className="section-label" style={{ marginBottom: 12 }}>REST DAY</p>
            {(p.restDayTips ?? []).map((tip, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: i < p.restDayTips.length - 1 ? 10 : 0 }}>
                <span style={{ color: 'var(--green)', fontSize: 13, flexShrink: 0 }}>✓</span>
                <p style={{ fontSize: 13, color: 'var(--text-sub)' }}>{tip}</p>
              </div>
            ))}
          </motion.div>
        )}

        {/* Tips */}
        {(p.tips ?? []).length > 0 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="premium-card">
            <p className="section-label" style={{ marginBottom: 14 }}>TIPS FOR YOU</p>
            {(p.tips ?? []).map((tip, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: i < p.tips.length - 1 ? 12 : 0 }}>
                <span style={{ color: 'var(--teal)', fontSize: 14, fontWeight: 700, flexShrink: 0 }}>→</span>
                <p style={{ fontSize: 13, color: 'var(--text-sub)', lineHeight: 1.55 }}>{tip}</p>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </main>
  )
}
