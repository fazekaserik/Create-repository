'use client'
import { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { setState } from '@/lib/store'
import type { Goal, GymType } from '@/lib/types'

/* ─────────────────────────────────────────────
   Step definitions — Cal.ai-inspired onboarding
   for NextBody fitness transformation app
───────────────────────────────────────────── */
type Step =
  | 'goal'
  | 'sex'
  | 'age'
  | 'weight'
  | 'height'
  | 'gym'
  | 'name'
  | 'upload'

const ALL_STEPS: Step[] = ['goal', 'sex', 'age', 'weight', 'height', 'gym', 'name', 'upload']

/* ─── Pill toggle (kg/lbs, cm/ft) ─── */
function UnitToggle({
  options,
  value,
  onChange,
}: {
  options: [string, string]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div style={{
      display: 'inline-flex',
      background: 'rgba(255,255,255,0.07)',
      border: '1px solid rgba(255,255,255,0.10)',
      borderRadius: 100,
      padding: 3,
      gap: 2,
    }}>
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          style={{
            padding: '7px 18px',
            borderRadius: 100,
            border: 'none',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'all 0.2s cubic-bezier(0.25,0.46,0.45,0.94)',
            background: value === opt ? '#fff' : 'transparent',
            color: value === opt ? '#000' : 'rgba(255,255,255,0.45)',
            boxShadow: value === opt ? '0 2px 8px rgba(0,0,0,0.4)' : 'none',
          }}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

/* ─── Number scroll picker ─── */
function NumericPicker({
  value,
  onChange,
  min,
  max,
  unit,
}: {
  value: number
  onChange: (v: number) => void
  min: number
  max: number
  unit: string
}) {
  const increment = () => onChange(Math.min(max, value + 1))
  const decrement = () => onChange(Math.max(min, value - 1))

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, margin: '0 auto' }}>
      <button
        onClick={decrement}
        style={{
          width: 52, height: 52, borderRadius: '50%',
          background: 'rgba(255,255,255,0.07)',
          border: '1px solid rgba(255,255,255,0.12)',
          color: '#fff', fontSize: 26, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.15s',
          fontFamily: 'inherit',
        }}
        onTouchStart={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.14)' }}
        onTouchEnd={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.07)' }}
      >
        −
      </button>
      <div style={{ textAlign: 'center', minWidth: 120 }}>
        <span style={{
          fontSize: 72,
          fontWeight: 800,
          color: '#fff',
          letterSpacing: '-0.04em',
          lineHeight: 1,
          display: 'block',
        }}>
          {value}
        </span>
        <span style={{ fontSize: 16, color: 'var(--teal)', fontWeight: 600, marginTop: 4, display: 'block' }}>
          {unit}
        </span>
      </div>
      <button
        onClick={increment}
        style={{
          width: 52, height: 52, borderRadius: '50%',
          background: 'rgba(255,255,255,0.07)',
          border: '1px solid rgba(255,255,255,0.12)',
          color: '#fff', fontSize: 26, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.15s',
          fontFamily: 'inherit',
        }}
        onTouchStart={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.14)' }}
        onTouchEnd={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.07)' }}
      >
        +
      </button>
    </div>
  )
}

/* ─── Step progress dots ─── */
function StepDots({ current }: { current: Step }) {
  const idx = ALL_STEPS.indexOf(current)
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      {ALL_STEPS.map((_, i) => (
        <div
          key={i}
          style={{
            width: i === idx ? 22 : 7,
            height: 7,
            borderRadius: 4,
            background: i === idx ? '#fff' : i < idx ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.12)',
            transition: 'all 0.3s cubic-bezier(0.25,0.46,0.45,0.94)',
          }}
        />
      ))}
    </div>
  )
}

/* ─── Back button ─── */
function BackBtn({ onBack }: { onBack: () => void }) {
  return (
    <button
      onClick={onBack}
      style={{
        width: 40, height: 40,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.07)',
        border: '1px solid rgba(255,255,255,0.10)',
        color: '#fff', fontSize: 20,
        cursor: 'pointer', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        lineHeight: 1, transition: 'background 0.15s',
        flexShrink: 0,
      }}
    >
      ‹
    </button>
  )
}

/* ─── Step header row ─── */
function StepHeader({ step, onBack }: { step: Step; onBack: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
      <BackBtn onBack={onBack} />
      <StepDots current={step} />
      <div style={{ width: 40 }} />
    </div>
  )
}

/* ─── Selection card ─── */
function SelectCard({
  icon, title, subtitle, selected, onClick,
}: {
  icon: string; title: string; subtitle?: string; selected: boolean; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        background: selected ? 'rgba(92,224,208,0.08)' : 'rgba(255,255,255,0.03)',
        border: `1.5px solid ${selected ? 'var(--teal)' : 'rgba(255,255,255,0.08)'}`,
        borderRadius: 20,
        padding: '18px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        cursor: 'pointer',
        textAlign: 'left',
        fontFamily: 'inherit',
        transition: 'all 0.2s cubic-bezier(0.25,0.46,0.45,0.94)',
        boxShadow: selected ? '0 0 0 1px rgba(92,224,208,0.2), 0 4px 24px rgba(92,224,208,0.08)' : 'none',
      }}
    >
      <span style={{ fontSize: 28, flexShrink: 0 }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: selected ? '#fff' : 'rgba(255,255,255,0.85)' }}>
          {title}
        </div>
        {subtitle && (
          <div style={{ fontSize: 13, color: selected ? 'var(--teal)' : 'rgba(255,255,255,0.4)', marginTop: 2 }}>
            {subtitle}
          </div>
        )}
      </div>
      <div style={{
        width: 22, height: 22, borderRadius: '50%',
        border: `2px solid ${selected ? 'var(--teal)' : 'rgba(255,255,255,0.15)'}`,
        background: selected ? 'var(--teal)' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.2s',
        flexShrink: 0,
      }}>
        {selected && (
          <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
            <path d="M1 4L4.5 7.5L11 1" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
    </button>
  )
}

/* ─── Main ─── */
export default function OnboardingPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [step, setStep] = useState<Step>('goal')
  const [direction, setDirection] = useState(1) // 1 = forward, -1 = back

  // Data state
  const [goal, setGoal] = useState<Goal | null>(null)
  const [sex, setSex] = useState<'male' | 'female' | null>(null)
  const [age, setAge] = useState(25)
  const [weight, setWeight] = useState(75)
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg')
  const [height, setHeight] = useState(175)
  const [heightUnit, setHeightUnit] = useState<'cm' | 'ft'>('cm')
  const [heightFt, setHeightFt] = useState(5)
  const [heightIn, setHeightIn] = useState(9)
  const [gym, setGym] = useState<GymType | null>(null)
  const [name, setName] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const next = useCallback(() => {
    const idx = ALL_STEPS.indexOf(step)
    if (idx < ALL_STEPS.length - 1) {
      setDirection(1)
      setStep(ALL_STEPS[idx + 1])
    }
  }, [step])

  const back = useCallback(() => {
    const idx = ALL_STEPS.indexOf(step)
    if (idx > 0) {
      setDirection(-1)
      setStep(ALL_STEPS[idx - 1])
    } else {
      router.push('/')
    }
  }, [step, router])

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      setImagePreview(dataUrl)
      setState({ uploadedImageDataUrl: dataUrl })
    }
    reader.readAsDataURL(file)
  }, [])

  const handleSubmit = () => {
    if (!imagePreview) return
    setState({
      goal: goal ?? 'build',
      sex: sex ?? 'male',
      age,
      weight: weightUnit === 'lbs' ? Math.round(weight * 0.453592) : weight,
      weightUnit: 'kg',
      height: heightUnit === 'ft' ? Math.round(heightFt * 30.48 + heightIn * 2.54) : height,
      heightUnit: 'cm',
      gymType: gym ?? 'gym',
      name: name.trim() || null,
    })
    router.push('/loading')
  }

  const slideVariants = {
    enter: (dir: number) => ({ opacity: 0, x: dir * 32 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir * -32 }),
  }
  const transition = { duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }

  const wrapStyle: React.CSSProperties = {
    minHeight: '100dvh',
    background: '#000',
    display: 'flex',
    flexDirection: 'column',
    padding: '52px 24px 0',
    position: 'relative',
    overflow: 'hidden',
  }

  return (
    <main style={{ minHeight: '100dvh', background: '#000', overflow: 'hidden' }}>
      {/* Ambient glow */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(92,224,208,0.06) 0%, transparent 70%)',
      }} />

      <AnimatePresence mode="wait" custom={direction}>
        {/* ── GOAL ── */}
        {step === 'goal' && (
          <motion.div key="goal" custom={direction} variants={slideVariants}
            initial="enter" animate="center" exit="exit" transition={transition}
            style={wrapStyle}>
            <StepHeader step={step} onBack={back} />
            <p className="section-label" style={{ marginBottom: 10 }}>STEP 1 OF 8</p>
            <h1 style={{ fontSize: 30, fontWeight: 800, color: '#fff', letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: 8 }}>
              What's your<br />main goal?
            </h1>
            <p style={{ fontSize: 14, color: 'var(--text-sub)', marginBottom: 32, lineHeight: 1.5 }}>
              We'll build your entire transformation plan around this.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
              <SelectCard icon="🔥" title="Lose Body Fat" subtitle="Get lean & shredded" selected={goal === 'cut'} onClick={() => setGoal('cut')} />
              <SelectCard icon="💪" title="Build Muscle" subtitle="Pack on size & strength" selected={goal === 'build'} onClick={() => setGoal('build')} />
              <SelectCard icon="⚡" title="Bulk Up" subtitle="Maximize mass fast" selected={goal === 'bulk'} onClick={() => setGoal('bulk')} />
            </div>
            <div style={{ padding: '24px 0 48px' }}>
              <button onClick={next} disabled={!goal} className="btn-white">Continue</button>
            </div>
          </motion.div>
        )}

        {/* ── SEX ── */}
        {step === 'sex' && (
          <motion.div key="sex" custom={direction} variants={slideVariants}
            initial="enter" animate="center" exit="exit" transition={transition}
            style={wrapStyle}>
            <StepHeader step={step} onBack={back} />
            <p className="section-label" style={{ marginBottom: 10 }}>STEP 2 OF 8</p>
            <h1 style={{ fontSize: 30, fontWeight: 800, color: '#fff', letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: 8 }}>
              What's your<br />biological sex?
            </h1>
            <p style={{ fontSize: 14, color: 'var(--text-sub)', marginBottom: 32, lineHeight: 1.5 }}>
              Used to calibrate your body analysis and hormone-based recommendations.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
              <SelectCard icon="♂️" title="Male" subtitle="Testosterone-based plan" selected={sex === 'male'} onClick={() => setSex('male')} />
              <SelectCard icon="♀️" title="Female" subtitle="Estrogen-based plan" selected={sex === 'female'} onClick={() => setSex('female')} />
            </div>
            <div style={{ padding: '24px 0 48px' }}>
              <button onClick={next} disabled={!sex} className="btn-white">Continue</button>
            </div>
          </motion.div>
        )}

        {/* ── AGE ── */}
        {step === 'age' && (
          <motion.div key="age" custom={direction} variants={slideVariants}
            initial="enter" animate="center" exit="exit" transition={transition}
            style={wrapStyle}>
            <StepHeader step={step} onBack={back} />
            <p className="section-label" style={{ marginBottom: 10 }}>STEP 3 OF 8</p>
            <h1 style={{ fontSize: 30, fontWeight: 800, color: '#fff', letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: 8 }}>
              How old<br />are you?
            </h1>
            <p style={{ fontSize: 14, color: 'var(--text-sub)', marginBottom: 40, lineHeight: 1.5 }}>
              Age affects your metabolism, recovery, and hormone profile.
            </p>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <NumericPicker value={age} onChange={setAge} min={13} max={80} unit="years old" />
            </div>
            <div style={{ padding: '24px 0 48px' }}>
              <button onClick={next} className="btn-white">Continue</button>
            </div>
          </motion.div>
        )}

        {/* ── WEIGHT ── */}
        {step === 'weight' && (
          <motion.div key="weight" custom={direction} variants={slideVariants}
            initial="enter" animate="center" exit="exit" transition={transition}
            style={wrapStyle}>
            <StepHeader step={step} onBack={back} />
            <p className="section-label" style={{ marginBottom: 10 }}>STEP 4 OF 8</p>
            <h1 style={{ fontSize: 30, fontWeight: 800, color: '#fff', letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: 8 }}>
              What's your<br />current weight?
            </h1>
            <p style={{ fontSize: 14, color: 'var(--text-sub)', marginBottom: 24, lineHeight: 1.5 }}>
              Used to calculate your daily calorie and macro targets.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 36 }}>
              <UnitToggle
                options={['kg', 'lbs']}
                value={weightUnit}
                onChange={(v) => {
                  const isKg = v === 'kg'
                  setWeight(isKg
                    ? Math.round(weight / 2.20462)
                    : Math.round(weight * 2.20462)
                  )
                  setWeightUnit(v as 'kg' | 'lbs')
                }}
              />
            </div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <NumericPicker
                value={weight}
                onChange={setWeight}
                min={weightUnit === 'kg' ? 30 : 66}
                max={weightUnit === 'kg' ? 250 : 551}
                unit={weightUnit}
              />
            </div>
            <div style={{ padding: '24px 0 48px' }}>
              <button onClick={next} className="btn-white">Continue</button>
            </div>
          </motion.div>
        )}

        {/* ── HEIGHT ── */}
        {step === 'height' && (
          <motion.div key="height" custom={direction} variants={slideVariants}
            initial="enter" animate="center" exit="exit" transition={transition}
            style={wrapStyle}>
            <StepHeader step={step} onBack={back} />
            <p className="section-label" style={{ marginBottom: 10 }}>STEP 5 OF 8</p>
            <h1 style={{ fontSize: 30, fontWeight: 800, color: '#fff', letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: 8 }}>
              How tall<br />are you?
            </h1>
            <p style={{ fontSize: 14, color: 'var(--text-sub)', marginBottom: 24, lineHeight: 1.5 }}>
              Height helps us assess your ideal body composition.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 36 }}>
              <UnitToggle
                options={['cm', 'ft']}
                value={heightUnit}
                onChange={(v) => {
                  if (v === 'ft') {
                    const totalIn = Math.round(height / 2.54)
                    setHeightFt(Math.floor(totalIn / 12))
                    setHeightIn(totalIn % 12)
                  } else {
                    setHeight(Math.round(heightFt * 30.48 + heightIn * 2.54))
                  }
                  setHeightUnit(v as 'cm' | 'ft')
                }}
              />
            </div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {heightUnit === 'cm' ? (
                <NumericPicker value={height} onChange={setHeight} min={120} max={250} unit="cm" />
              ) : (
                <div style={{ display: 'flex', gap: 24, alignItems: 'flex-end' }}>
                  <div style={{ textAlign: 'center' }}>
                    <NumericPicker value={heightFt} onChange={setHeightFt} min={3} max={8} unit="ft" />
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <NumericPicker value={heightIn} onChange={setHeightIn} min={0} max={11} unit="in" />
                  </div>
                </div>
              )}
            </div>
            <div style={{ padding: '24px 0 48px' }}>
              <button onClick={next} className="btn-white">Continue</button>
            </div>
          </motion.div>
        )}

        {/* ── GYM ── */}
        {step === 'gym' && (
          <motion.div key="gym" custom={direction} variants={slideVariants}
            initial="enter" animate="center" exit="exit" transition={transition}
            style={wrapStyle}>
            <StepHeader step={step} onBack={back} />
            <p className="section-label" style={{ marginBottom: 10 }}>STEP 6 OF 8</p>
            <h1 style={{ fontSize: 30, fontWeight: 800, color: '#fff', letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: 8 }}>
              Where do<br />you train?
            </h1>
            <p style={{ fontSize: 14, color: 'var(--text-sub)', marginBottom: 32, lineHeight: 1.5 }}>
              We'll design your workout around the equipment you have access to.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
              <SelectCard icon="🏋️" title="Gym" subtitle="Full equipment access" selected={gym === 'gym'} onClick={() => setGym('gym')} />
              <SelectCard icon="🏠" title="Home" subtitle="Bodyweight & minimal gear" selected={gym === 'home'} onClick={() => setGym('home')} />
            </div>
            <div style={{ padding: '24px 0 48px' }}>
              <button onClick={next} disabled={!gym} className="btn-white">Continue</button>
            </div>
          </motion.div>
        )}

        {/* ── NAME ── */}
        {step === 'name' && (
          <motion.div key="name" custom={direction} variants={slideVariants}
            initial="enter" animate="center" exit="exit" transition={transition}
            style={wrapStyle}>
            <StepHeader step={step} onBack={back} />
            <p className="section-label" style={{ marginBottom: 10 }}>STEP 7 OF 8</p>
            <h1 style={{ fontSize: 30, fontWeight: 800, color: '#fff', letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: 8 }}>
              What should<br />we call you?
            </h1>
            <p style={{ fontSize: 14, color: 'var(--text-sub)', marginBottom: 32, lineHeight: 1.5 }}>
              Your plan will be personally addressed to you.
            </p>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your first name"
              className="premium-input"
              autoFocus
              style={{ marginBottom: 16 }}
            />
            <div style={{ flex: 1 }} />
            <div style={{ padding: '0 0 48px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button onClick={next} disabled={!name.trim()} className="btn-white">
                {name.trim() ? `Continue as ${name.trim()}` : 'Continue'}
              </button>
              <button onClick={() => { next() }} className="btn-ghost">Skip for now</button>
            </div>
          </motion.div>
        )}

        {/* ── UPLOAD ── */}
        {step === 'upload' && (
          <motion.div key="upload" custom={direction} variants={slideVariants}
            initial="enter" animate="center" exit="exit" transition={transition}
            style={wrapStyle}>
            <StepHeader step={step} onBack={back} />
            <p className="section-label" style={{ marginBottom: 10 }}>STEP 8 OF 8</p>
            <h1 style={{ fontSize: 30, fontWeight: 800, color: '#fff', letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: 8 }}>
              Upload your<br />physique photo
            </h1>
            <p style={{ fontSize: 14, color: 'var(--text-sub)', marginBottom: 20, lineHeight: 1.5 }}>
              A full-body front-facing photo gives the most accurate AI analysis.
            </p>

            {/* Upload zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
              style={{
                flexShrink: 0,
                height: 280,
                borderRadius: 24,
                border: `1.5px dashed ${isDragging ? 'var(--teal)' : imagePreview ? 'rgba(92,224,208,0.4)' : 'rgba(255,255,255,0.12)'}`,
                background: isDragging ? 'rgba(92,224,208,0.04)' : imagePreview ? 'transparent' : 'rgba(255,255,255,0.02)',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.2s',
                position: 'relative',
              }}
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{
                    position: 'absolute', bottom: 12, right: 12,
                    background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
                    borderRadius: 20, padding: '6px 14px',
                    fontSize: 12, fontWeight: 600, color: 'var(--teal)',
                    border: '1px solid rgba(92,224,208,0.3)',
                  }}>
                    ✓ Photo added — tap to change
                  </div>
                </>
              ) : (
                <div style={{
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  height: '100%', textAlign: 'center', padding: '0 24px',
                }}>
                  <div style={{
                    width: 60, height: 60, borderRadius: '50%',
                    border: '1.5px solid var(--teal)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 16,
                    background: 'rgba(92,224,208,0.06)',
                    boxShadow: '0 0 24px rgba(92,224,208,0.15)',
                  }}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                      <path d="M12 5v14M5 12h14" stroke="var(--teal)" strokeWidth="2.2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <p style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 6 }}>Tap to upload photo</p>
                  <p style={{ fontSize: 13, color: 'var(--text-dim)' }}>JPG, PNG — full body works best</p>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              style={{ display: 'none' }}
              onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }}
            />

            {/* Privacy note */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 12, padding: '10px 14px',
              marginTop: 14,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L3 7v5c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V7L12 2z" stroke="rgba(255,255,255,0.3)" strokeWidth="1.8" fill="none"/>
              </svg>
              <span style={{ fontSize: 12, color: 'var(--text-dim)', lineHeight: 1.4 }}>
                Your photo is processed securely and never stored permanently.
              </span>
            </div>

            <div style={{ flex: 1 }} />
            <div style={{ padding: '20px 0 48px' }}>
              <button
                onClick={handleSubmit}
                disabled={!imagePreview}
                className="btn-teal"
              >
                Analyse My Physique →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
