'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { getState, setState } from '@/lib/store'
import type { Goal, DietType } from '@/lib/types'

interface Meal {
  name: string
  emoji: string
  calories: number
  items: string[]
  time: string
}

interface WeekDay {
  day: string
  meals: string[]
}

interface DietPlan {
  calories: number
  protein: number
  carbs: number
  fat: number
  meals: Meal[]
  weeklyPlan: WeekDay[]
  tips: string[]
}

type PageView = 'wizard' | 'loading' | 'paywall' | 'plan'

const WEEKLY_PRICES = { weekly: '$4.99', monthly: '$14.99' }

const MACRO_COLORS = {
  protein: 'var(--teal)',
  carbs: '#38bdf8',
  fat: 'var(--gold)',
}

/* ── Copied exactly from onboarding ── */
function PillToggle<T extends string>({ options, value, onChange }: { options: { label: string; value: T }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div style={{ display: 'flex', gap: 0, padding: 4, background: '#141414', borderRadius: 50, marginBottom: 20 }}>
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          style={{
            flex: 1, padding: '10px 0',
            borderRadius: 46,
            fontSize: 14, fontWeight: 600,
            background: value === opt.value ? '#fff' : 'transparent',
            color: value === opt.value ? '#000' : 'rgba(255,255,255,0.45)',
            border: 'none', cursor: 'pointer',
            transition: 'background 0.2s, color 0.2s',
            fontFamily: 'inherit',
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

function BackBtn({ onBack }: { onBack: () => void }) {
  return (
    <button
      onClick={onBack}
      style={{ fontSize: 22, color: 'var(--text-sub)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 16, alignSelf: 'flex-start', lineHeight: 1 }}
    >‹</button>
  )
}

function WizardProgress({ current, total }: { current: number; total: number }) {
  return (
    <div className="progress-bar">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`progress-seg ${i <= current ? 'active' : ''}`} />
      ))}
    </div>
  )
}

const GOALS: { value: Goal; label: string; desc: string }[] = [
  { value: 'cut',   label: 'Get Lean',     desc: 'Lose fat, keep muscle'    },
  { value: 'build', label: 'Build Muscle', desc: 'Lean muscle gains'        },
  { value: 'bulk',  label: 'Get Big',      desc: 'Maximum size & strength'  },
]

const DIETS: { value: DietType; label: string }[] = [
  { value: 'standard',  label: 'Standard'  },
  { value: 'keto',      label: 'Keto'      },
  { value: 'vegan',     label: 'Vegan'     },
  { value: 'carnivore', label: 'Carnivore' },
]

/* ── */

function MacroBar({ label, grams, total, color }: { label: string; grams: number; total: number; color: string }) {
  const [w, setW] = useState(0)
  useEffect(() => { const t = setTimeout(() => setW(Math.min((grams / total) * 100, 100)), 400); return () => clearTimeout(t) }, [grams, total])
  return (
    <div style={{ flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color }}>{grams}g</span>
      </div>
      <div style={{ height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        <div style={{ height: '100%', borderRadius: 3, background: color, width: `${w}%`, transition: 'width 1s ease' }} />
      </div>
    </div>
  )
}

export default function DietPlanPage() {
  const router = useRouter()
  const [view, setView] = useState<PageView>('loading')
  const [wizardStep, setWizardStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [plan, setPlan] = useState<DietPlan | null>(null)
  const appState = useRef(getState())
  const ran = useRef(false)

  /* ── Wizard state ── */
  const [age, setAge] = useState<number | ''>('')
  const [weight, setWeight] = useState<number | ''>('')
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg')
  const [height, setHeight] = useState<number | ''>('')
  const [heightUnit, setHeightUnit] = useState<'cm' | 'ft'>('cm')
  const [goal, setGoal] = useState<Goal | null>(null)

  const startFetch = () => {
    if (ran.current) return
    ran.current = true

    const s = appState.current
    let planData: DietPlan | null = null

    const fallback: DietPlan = {
      calories: 2200, protein: 180, carbs: 240, fat: 65,
      meals: [
        { name: 'Breakfast', emoji: '', calories: 500, items: ['Oats with berries', 'Greek yogurt', 'Black coffee'], time: '7:00 AM' },
        { name: 'Lunch',     emoji: '', calories: 700, items: ['Grilled chicken breast', 'Brown rice', 'Side salad'], time: '12:30 PM' },
        { name: 'Dinner',    emoji: '', calories: 650, items: ['Salmon fillet', 'Sweet potato', 'Broccoli'], time: '7:00 PM' },
        { name: 'Snack',     emoji: '', calories: 350, items: ['Protein shake', 'Banana', 'Almonds'], time: '3:30 PM' },
      ],
      weeklyPlan: [
        { day: 'Monday',    meals: ['Oats & eggs', 'Chicken & rice', 'Beef & veggies'] },
        { day: 'Tuesday',   meals: ['Smoothie bowl', 'Tuna wrap', 'Pasta & chicken'] },
        { day: 'Wednesday', meals: ['Eggs & toast', 'Salmon salad', 'Steak & potato'] },
        { day: 'Thursday',  meals: ['Oats & berries', 'Turkey sandwich', 'Shrimp & rice'] },
        { day: 'Friday',    meals: ['Protein pancakes', 'Chicken wrap', 'Lean burgers'] },
        { day: 'Saturday',  meals: ['Full breakfast', 'Pasta bolognese', 'Grilled fish'] },
        { day: 'Sunday',    meals: ['Smoothie', 'Meal prep salad', 'Roast chicken'] },
      ],
      tips: [
        'Drink at least 3L of water daily — especially around workouts',
        'Eat your largest meal within 2 hours post-workout for muscle recovery',
        'Prep meals on Sunday to stay consistent throughout the week',
      ],
    }

    const apiPromise = fetch('/api/generate-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'diet',
        goal: s.goal,
        gymType: s.gymType,
        dietType: s.dietType,
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
  }

  useEffect(() => {
    const s = getState()
    if (!s.age || !s.weight || !s.height || !s.goal || !s.dietType) {
      setView('wizard')
      return
    }
    startFetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDemo = () => {
    setState({ demoMode: true })
    setView('plan')
  }

  const handleBuy = (planType: 'weekly' | 'monthly') => {
    window.location.href = `/api/checkout?plan=${planType}`
  }

  const slide = {
    initial: { opacity: 0, x: 28 },
    animate: { opacity: 1, x: 0 },
    exit:    { opacity: 0, x: -28 },
    transition: { duration: 0.22 },
  }
  const colStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', minHeight: '100dvh', padding: '48px 24px 0' }

  const handleWizardBack = () => {
    if (wizardStep > 0) setWizardStep(s => s - 1)
    else router.push('/plan')
  }

  const handleWizardNext = () => setWizardStep(s => s + 1)

  /* ── Wizard ── */
  if (view === 'wizard') {
    return (
      <main style={{ minHeight: '100dvh', background: '#000', display: 'flex', flexDirection: 'column' }}>
        <AnimatePresence mode="wait">

          {/* Step 0 — Age */}
          {wizardStep === 0 && (
            <motion.div key="age" {...slide} style={colStyle}>
              <BackBtn onBack={handleWizardBack} />
              <WizardProgress current={0} total={5} />
              <h1 style={{ fontSize: 32, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: 8 }}>How old are you?</h1>
              <p style={{ fontSize: 14, color: 'var(--text-sub)', marginBottom: 32 }}>Helps us calculate your exact calorie targets</p>
              <input
                type="number"
                value={age}
                onChange={e => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Your age"
                min={13}
                max={80}
                className="premium-input"
                style={{ marginBottom: 16 }}
              />
              <div style={{ flex: 1 }} />
              <button
                onClick={handleWizardNext}
                disabled={age === ''}
                className="btn-white"
                style={{ marginBottom: 48 }}
              >
                Next
              </button>
            </motion.div>
          )}

          {/* Step 1 — Weight */}
          {wizardStep === 1 && (
            <motion.div key="weight" {...slide} style={colStyle}>
              <BackBtn onBack={handleWizardBack} />
              <WizardProgress current={1} total={5} />
              <h1 style={{ fontSize: 32, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: 8 }}>What&apos;s your weight?</h1>
              <p style={{ fontSize: 14, color: 'var(--text-sub)', marginBottom: 24 }}>Used to calculate your calorie and macro targets</p>
              <PillToggle
                options={[{ label: 'KG', value: 'kg' }, { label: 'LBS', value: 'lbs' }]}
                value={weightUnit}
                onChange={setWeightUnit}
              />
              <input
                type="number"
                value={weight}
                onChange={e => setWeight(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder={weightUnit === 'kg' ? 'e.g. 75' : 'e.g. 165'}
                className="premium-input"
                style={{ marginBottom: 16 }}
              />
              <div style={{ flex: 1 }} />
              <button
                onClick={handleWizardNext}
                disabled={weight === ''}
                className="btn-white"
                style={{ marginBottom: 48 }}
              >
                Next
              </button>
            </motion.div>
          )}

          {/* Step 2 — Height */}
          {wizardStep === 2 && (
            <motion.div key="height" {...slide} style={colStyle}>
              <BackBtn onBack={handleWizardBack} />
              <WizardProgress current={2} total={5} />
              <h1 style={{ fontSize: 32, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: 8 }}>What&apos;s your height?</h1>
              <p style={{ fontSize: 14, color: 'var(--text-sub)', marginBottom: 24 }}>Fine-tunes your BMR and body composition analysis</p>
              <PillToggle
                options={[{ label: 'CM', value: 'cm' }, { label: 'FT', value: 'ft' }]}
                value={heightUnit}
                onChange={setHeightUnit}
              />
              <input
                type="number"
                value={height}
                onChange={e => setHeight(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder={heightUnit === 'cm' ? 'e.g. 178' : 'e.g. 5.9'}
                className="premium-input"
                style={{ marginBottom: 16 }}
              />
              <div style={{ flex: 1 }} />
              <button
                onClick={handleWizardNext}
                disabled={height === ''}
                className="btn-white"
                style={{ marginBottom: 48 }}
              >
                Next
              </button>
            </motion.div>
          )}

          {/* Step 3 — Goal */}
          {wizardStep === 3 && (
            <motion.div key="goal" {...slide} style={colStyle}>
              <BackBtn onBack={handleWizardBack} />
              <WizardProgress current={3} total={5} />
              <h1 style={{ fontSize: 32, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: 8 }}>Your fitness goal?</h1>
              <p style={{ fontSize: 14, color: 'var(--text-sub)', marginBottom: 24 }}>We&apos;ll tailor your transformation preview</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {GOALS.map((g) => (
                  <motion.button
                    key={g.value}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => { setGoal(g.value); setTimeout(() => setWizardStep(4), 180) }}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      width: '100%', padding: '16px 20px',
                      background: goal === g.value ? 'rgba(92,224,208,0.08)' : 'var(--surface-2)',
                      border: goal === g.value ? '1.5px solid var(--teal)' : '1px solid var(--border)',
                      borderRadius: 20, textAlign: 'left', cursor: 'pointer',
                      transition: 'border-color 0.15s, background 0.15s',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 600, color: goal === g.value ? 'var(--teal)' : '#fff', marginBottom: 2 }}>{g.label}</div>
                      <div style={{ fontSize: 13, color: 'var(--text-sub)' }}>{g.desc}</div>
                    </div>
                    <div style={{ fontSize: 18, color: 'var(--text-dim)' }}>›</div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 4 — Diet preference */}
          {wizardStep === 4 && (
            <motion.div key="diet" {...slide} style={colStyle}>
              <BackBtn onBack={handleWizardBack} />
              <WizardProgress current={4} total={5} />
              <h1 style={{ fontSize: 32, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: 8 }}>Diet preference?</h1>
              <p style={{ fontSize: 14, color: 'var(--text-sub)', marginBottom: 24 }}>Last step before your plan</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {DIETS.map((d) => (
                  <motion.button
                    key={d.value}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      const selectedDiet = d.value
                      const currentGoal = goal!
                      setState({
                        age: age as number,
                        weight: weight as number,
                        weightUnit,
                        height: height as number,
                        heightUnit,
                        goal: currentGoal,
                        dietType: selectedDiet,
                      })
                      appState.current = getState()
                      setTimeout(() => {
                        setView('loading')
                        startFetch()
                      }, 180)
                    }}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      padding: '32px 0',
                      background: 'var(--surface-2)',
                      border: '1px solid var(--border)',
                      borderRadius: 20, cursor: 'pointer',
                      fontSize: 15, fontWeight: 600, color: '#fff',
                      transition: 'border-color 0.15s',
                    }}
                  >
                    {d.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    )
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
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(92,224,208,0.10)', border: '1.5px solid var(--teal)' }} />
          </div>
        </div>

        <p className="section-label" style={{ color: 'var(--teal)', marginBottom: 8 }}>BUILDING YOUR PLAN</p>
        <p style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 36, textAlign: 'center' }}>Calculating your macros…</p>

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
            <h1 style={{ fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Your Plan is Ready</h1>
            <p style={{ fontSize: 14, color: 'var(--text-sub)' }}>Unlock your personalized diet plan</p>
          </div>

          <div className="premium-card" style={{ position: 'relative', marginBottom: 24, overflow: 'hidden', padding: '20px' }}>
            <div style={{ filter: 'blur(6px)', pointerEvents: 'none', userSelect: 'none' }}>
              <div style={{ height: 16, background: 'rgba(255,255,255,0.12)', borderRadius: 4, marginBottom: 12, width: '70%' }} />
              <div style={{ height: 12, background: 'rgba(255,255,255,0.08)', borderRadius: 4, marginBottom: 8, width: '90%' }} />
              <div style={{ height: 12, background: 'rgba(255,255,255,0.08)', borderRadius: 4, width: '60%' }} />
            </div>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(2px)' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginBottom: 6, letterSpacing: '0.08em' }}>LOCKED</span>
              <span style={{ fontSize: 13, color: 'var(--text-sub)', fontWeight: 500 }}>Unlock to see</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
            <div className="premium-card">
              <p className="section-label" style={{ marginBottom: 8 }}>WEEKLY</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 12 }}>
                <span style={{ fontSize: 32, fontWeight: 700, color: '#fff' }}>$4.99</span>
                <span style={{ fontSize: 16, color: 'var(--text-sub)' }}>/week</span>
              </div>
              {['Full diet plan', 'Weekly meal plans', 'Macro calculator', 'Cancel anytime'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ color: 'var(--green)', fontSize: 13 }}>✓</span>
                  <span style={{ fontSize: 13, color: 'var(--text-sub)' }}>{f}</span>
                </div>
              ))}
              <button onClick={() => handleBuy('weekly')} className="btn-white" style={{ marginTop: 16 }}>
                Start Weekly — $4.99
              </button>
            </div>
            <div className="premium-card" style={{ borderColor: 'var(--teal)', background: 'rgba(92,224,208,0.04)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 16, right: 16 }}>
                <span className="teal-badge">BEST VALUE</span>
              </div>
              <p className="section-label" style={{ marginBottom: 8 }}>MONTHLY</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 12 }}>
                <span style={{ fontSize: 32, fontWeight: 700, color: '#fff' }}>$14.99</span>
                <span style={{ fontSize: 16, color: 'var(--text-sub)' }}>/month</span>
              </div>
              {['Full diet plan', 'Weekly meal plans', 'Macro calculator', 'Cancel anytime', 'Save 57% vs weekly'].map(f => (
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
            Secure checkout · Cancel anytime · Instant access
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
  const totalMacroG = (p.protein ?? 0) + (p.carbs ?? 0) + (p.fat ?? 0)

  return (
    <main style={{ minHeight: '100dvh', background: '#000', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '44px 20px 12px' }}>
        <button onClick={() => router.push('/plan')} style={{ fontSize: 24, color: 'var(--text-sub)', background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1 }}>‹</button>
        <h1 style={{ flex: 1, textAlign: 'center', fontSize: 18, fontWeight: 600, color: '#fff' }}>Your Diet Plan</h1>
        <div style={{ width: 32 }} />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 48px' }}>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 8 }}>
            {s.name ? `${s.name}'s Plan` : 'Your Plan'}
          </h2>
          <span className="teal-badge">{goalLabel}</span>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="premium-card" style={{ marginBottom: 16 }}>
          <p className="section-label" style={{ marginBottom: 16 }}>DAILY OVERVIEW</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 20 }}>
            <span style={{ fontSize: 44, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{(p.calories ?? 0).toLocaleString()}</span>
            <span style={{ fontSize: 15, color: 'var(--text-sub)' }}>kcal/day</span>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <MacroBar label="Protein" grams={p.protein ?? 0} total={totalMacroG} color={MACRO_COLORS.protein} />
            <MacroBar label="Carbs"   grams={p.carbs ?? 0}   total={totalMacroG} color={MACRO_COLORS.carbs} />
            <MacroBar label="Fat"     grams={p.fat ?? 0}     total={totalMacroG} color={MACRO_COLORS.fat} />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ marginBottom: 16 }}>
          <p className="section-label" style={{ marginBottom: 12 }}>MEAL SCHEDULE</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(p.meals ?? []).map((meal, i) => (
              <div key={i} className="premium-card" style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <span style={{ fontSize: 28 }}>{meal.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>{meal.name}</span>
                      <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>{meal.time}</span>
                    </div>
                    <span style={{ fontSize: 13, color: 'var(--teal)', fontWeight: 600 }}>{meal.calories} kcal</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {(meal.items ?? []).map((item, j) => (
                    <span key={j} style={{ fontSize: 12, color: 'var(--text-sub)', background: 'rgba(255,255,255,0.05)', padding: '3px 8px', borderRadius: 20 }}>{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="premium-card" style={{ marginBottom: 16 }}>
          <p className="section-label" style={{ marginBottom: 14 }}>WEEKLY OVERVIEW</p>
          {(p.weeklyPlan ?? []).map((day, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, marginBottom: i < (p.weeklyPlan?.length ?? 0) - 1 ? 12 : 0, paddingBottom: i < (p.weeklyPlan?.length ?? 0) - 1 ? 12 : 0, borderBottom: i < (p.weeklyPlan?.length ?? 0) - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--teal)', width: 88, flexShrink: 0 }}>{day.day}</span>
              <div>
                {(day.meals ?? []).map((m, j) => (
                  <p key={j} style={{ fontSize: 12, color: 'var(--text-sub)', marginBottom: 2 }}>{m}</p>
                ))}
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="premium-card" style={{ marginBottom: 16 }}>
          <p className="section-label" style={{ marginBottom: 14 }}>TIPS FOR YOU</p>
          {(p.tips ?? []).map((tip, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: i < (p.tips?.length ?? 0) - 1 ? 12 : 0 }}>
              <span style={{ color: 'var(--teal)', fontSize: 14, fontWeight: 700, flexShrink: 0 }}>→</span>
              <p style={{ fontSize: 13, color: 'var(--text-sub)', lineHeight: 1.55 }}>{tip}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </main>
  )
}
