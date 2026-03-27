'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { setState } from '@/lib/store'
import type { Goal, GymType, DietType } from '@/lib/types'

/* ─────────────────────────────────────────────
   Step definitions
───────────────────────────────────────────── */
type Step =
  | 'edu_halo'
  | 'edu_dating'
  | 'edu_influence'
  | 'quiz_name'
  | 'quiz_goal'
  | 'quiz_gym'
  | 'quiz_diet'
  | 'upload'

const EDU_STEPS: Step[] = ['edu_halo', 'edu_dating', 'edu_influence']
const QUIZ_STEPS: Step[] = ['quiz_name', 'quiz_goal', 'quiz_gym', 'quiz_diet', 'upload']
const ALL_STEPS: Step[] = [...EDU_STEPS, ...QUIZ_STEPS]
const QUIZ_TOTAL = QUIZ_STEPS.length

/* ─────────────────────────────────────────────
   SVG Illustrations
───────────────────────────────────────────── */
function AngelFace() {
  return (
    <svg width="110" height="140" viewBox="0 0 110 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Halo */}
      <ellipse cx="55" cy="14" rx="28" ry="8" stroke="#F4C430" strokeWidth="3" fill="none" />
      {/* Head */}
      <ellipse cx="55" cy="82" rx="34" ry="40" stroke="white" strokeWidth="2.5" fill="none" />
      {/* Eyes */}
      <ellipse cx="43" cy="74" rx="5" ry="4" stroke="white" strokeWidth="2" fill="none" />
      <ellipse cx="67" cy="74" rx="5" ry="4" stroke="white" strokeWidth="2" fill="none" />
      {/* Nose */}
      <path d="M55 82 L51 93 Q55 96 59 93" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Smile */}
      <path d="M43 103 Q55 114 67 103" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Neck */}
      <path d="M45 122 L45 132 M65 122 L65 132" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function DevilFace() {
  return (
    <svg width="110" height="140" viewBox="0 0 110 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Horns */}
      <path d="M32 28 Q28 10 38 6 Q35 16 42 22" stroke="#E05050" strokeWidth="2.5" fill="#E05050" fillOpacity="0.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M78 28 Q82 10 72 6 Q75 16 68 22" stroke="#E05050" strokeWidth="2.5" fill="#E05050" fillOpacity="0.8" strokeLinecap="round" strokeLinejoin="round" />
      {/* Head */}
      <ellipse cx="55" cy="82" rx="34" ry="40" stroke="white" strokeWidth="2.5" fill="none" />
      {/* Drooping eyes */}
      <path d="M36 70 Q43 66 50 70" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M60 70 Q67 66 74 70" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
      <ellipse cx="43" cy="75" rx="4" ry="4" stroke="white" strokeWidth="2" fill="none" />
      <ellipse cx="67" cy="75" rx="4" ry="4" stroke="white" strokeWidth="2" fill="none" />
      {/* Nose */}
      <path d="M55 83 L51 93 Q55 96 59 93" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Frown */}
      <path d="M43 108 Q55 100 67 108" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Neck */}
      <path d="M45 122 L45 132 M65 122 L65 132" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

/* ─────────────────────────────────────────────
   Animated bar (for influence screen)
───────────────────────────────────────────── */
function InfluenceBar({ label, pct, teal, delay }: { label: string; pct: number; teal?: boolean; delay: number }) {
  const [w, setW] = useState(0)
  useEffect(() => { const t = setTimeout(() => setW(pct), delay); return () => clearTimeout(t) }, [pct, delay])
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className={`text-sm font-semibold w-28 shrink-0 ${teal ? 'teal' : 'text-white'}`}>{label}</span>
      <div className="hbar-track flex-1">
        <div className={teal ? 'hbar-fill-teal' : 'hbar-fill-white'} style={{ width: `${w}%` }} />
      </div>
      <span className={`text-sm font-bold w-10 text-right ${teal ? 'teal' : 'text-white'}`}>{pct}%</span>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Bar chart (Dating Reality)
───────────────────────────────────────────── */
const CHART_DATA = [
  { x: '10%', v: 0 }, { x: '20%', v: 0 }, { x: '30%', v: 0 },
  { x: '40%', v: 0 }, { x: '50%', v: 0 }, { x: '60%', v: 1 },
  { x: '70%', v: 4 }, { x: '80%', v: 8 }, { x: '90%', v: 17 },
  { x: '100%', v: 39, teal: true },
]
const MAX_V = 39

function DatingChart() {
  const [animated, setAnimated] = useState(false)
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 400); return () => clearTimeout(t) }, [])
  return (
    <div className="px-4 pt-2">
      <p className="text-xs font-bold text-[var(--text-sub)] tracking-widest mb-1">AVG # OF LIKES / WK</p>
      <div style={{ height: 1, background: 'rgba(255,255,255,0.12)', marginBottom: 12 }} />
      <div className="relative" style={{ height: 180 }}>
        {/* Grid lines */}
        {[0.25, 0.5, 0.75, 1].map(f => (
          <div key={f} style={{ position: 'absolute', left: 0, right: 0, bottom: `${f * 100}%`, height: 1, background: 'rgba(255,255,255,0.07)' }} />
        ))}
        {/* "Top 10%" label */}
        <div style={{ position: 'absolute', right: 48, top: 8, fontSize: 11, color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap' }}>
          Top 10% Dating Profiles →
        </div>
        {/* Bars */}
        <div className="absolute inset-0 flex items-end gap-1 pb-0">
          {CHART_DATA.map((d) => {
            const h = animated ? (d.v / MAX_V) * 100 : 0
            return (
              <div key={d.x} className="flex-1 flex flex-col items-center justify-end" style={{ height: '100%' }}>
                {d.v > 0 && (
                  <span style={{ fontSize: 10, color: d.teal ? 'var(--teal)' : '#fff', marginBottom: 2, fontWeight: 700 }}>{d.v}</span>
                )}
                <div
                  className="chart-bar w-full"
                  style={{
                    height: `${h}%`,
                    background: d.teal ? 'var(--teal)' : '#fff',
                    boxShadow: d.teal ? '0 0 12px rgba(92,224,208,0.6)' : 'none',
                    transition: 'height 0.9s cubic-bezier(.25,.46,.45,.94)',
                    minHeight: d.v > 0 ? 3 : 1,
                  }}
                />
              </div>
            )
          })}
        </div>
      </div>
      {/* X axis labels */}
      <div className="flex gap-1 mt-1">
        {CHART_DATA.map((d) => (
          <div key={d.x} className="flex-1 text-center" style={{ fontSize: 9, color: d.teal ? 'var(--teal)' : 'rgba(255,255,255,0.4)' }}>{d.x}</div>
        ))}
      </div>
      <p className="text-center text-xs font-bold text-[var(--text-sub)] tracking-widest mt-2">ATTRACTIVENESS SCORE</p>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Goal / Gym / Diet options
───────────────────────────────────────────── */
const GOALS: { value: Goal; label: string; desc: string }[] = [
  { value: 'cut', label: 'Get Lean', desc: 'Lose fat, keep muscle' },
  { value: 'build', label: 'Build Muscle', desc: 'Lean muscle gains' },
  { value: 'bulk', label: 'Get Big', desc: 'Maximum size & strength' },
]
const GYMS: { value: GymType; label: string }[] = [
  { value: 'gym', label: 'Gym' },
  { value: 'home', label: 'Home' },
]
const DIETS: { value: DietType; label: string }[] = [
  { value: 'standard', label: 'Standard' },
  { value: 'keto', label: 'Keto' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'carnivore', label: 'Carnivore' },
]

/* ─────────────────────────────────────────────
   Progress bar (quiz only)
───────────────────────────────────────────── */
function ProgressBar({ step }: { step: Step }) {
  const idx = QUIZ_STEPS.indexOf(step)
  if (idx < 0) return null
  return (
    <div className="progress-bar">
      {QUIZ_STEPS.map((_, i) => (
        <div key={i} className={`progress-seg ${i <= idx ? 'active' : ''}`} />
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────────
   Main component
───────────────────────────────────────────── */
export default function OnboardingPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState<Step>('edu_halo')
  const [name, setName] = useState('')
  const [goal, setGoal] = useState<Goal | null>(null)
  const [gym, setGym] = useState<GymType | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const next = useCallback(() => {
    const idx = ALL_STEPS.indexOf(step)
    if (idx < ALL_STEPS.length - 1) setStep(ALL_STEPS[idx + 1])
  }, [step])

  const back = useCallback(() => {
    const idx = ALL_STEPS.indexOf(step)
    if (idx > 0) setStep(ALL_STEPS[idx - 1])
    else router.push('/')
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
    router.push('/loading')
  }

  const slide = {
    initial: { opacity: 0, x: 28 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -28 },
    transition: { duration: 0.22 },
  }

  return (
    <main className="min-h-dvh bg-black flex flex-col">
      <AnimatePresence mode="wait">

        {/* ── EDU: Halo Effect ── */}
        {step === 'edu_halo' && (
          <motion.div key="halo" {...slide} className="flex flex-col min-h-dvh">
            <div className="flex-1 flex flex-col px-6 pt-12">
              <button onClick={back} className="text-[var(--text-sub)] text-lg font-light mb-8 self-start">‹</button>
              <h1 className="text-3xl font-black tracking-tight text-white uppercase mb-3">The Halo Effect</h1>
              <p className="text-[var(--text-sub)] text-sm leading-relaxed text-center mb-8">
                A cognitive bias where we subconsciously assume someone&apos;s positive qualities (like intelligence or kindness) based on their physical attractiveness
              </p>
              {/* Illustrations */}
              <div className="flex justify-around items-end mt-4">
                <AngelFace />
                <DevilFace />
              </div>
              {/* Trait comparison */}
              <div className="flex justify-around mt-6 px-4">
                <div className="space-y-2">
                  {['intelligent', 'kind', 'rich'].map(t => (
                    <div key={t} className="flex items-center gap-2">
                      <span style={{ color: '#4CAF50', fontSize: 16, fontWeight: 700 }}>&#10003;</span>
                      <span className="text-white text-sm">{t}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  {['intelligent', 'kind', 'rich'].map(t => (
                    <div key={t} className="flex items-center gap-2">
                      <span style={{ color: '#E05050', fontSize: 16, fontWeight: 700 }}>&#10007;</span>
                      <span className="text-white text-sm">{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="bottom-card mx-0">
              <h2 className="text-3xl font-black text-white mb-3">Perception<br />Is Everything</h2>
              <p className="text-[var(--text-sub)] text-sm leading-relaxed mb-6">
                It&apos;s not shallow, it&apos;s human nature. The Halo Effect states that you are treated and judged in vastly different ways depending on your looks
              </p>
              <button onClick={next} className="btn-white">Next</button>
            </div>
          </motion.div>
        )}

        {/* ── EDU: Dating Reality ── */}
        {step === 'edu_dating' && (
          <motion.div key="dating" {...slide} className="flex flex-col min-h-dvh">
            <div className="flex-1 flex flex-col px-6 pt-12">
              <button onClick={back} className="text-[var(--text-sub)] text-lg font-light mb-6 self-start">‹</button>
              <DatingChart />
            </div>
            <div className="bottom-card">
              <h2 className="text-3xl font-black text-white mb-3">Dating Reality</h2>
              <p className="text-[var(--text-sub)] text-sm leading-relaxed mb-6">
                The truth is, unless you are an objectively attractive individual, you will struggle in the current dating market. Studies continuously show that 80% of women match with the top 20% of men
              </p>
              <button onClick={next} className="btn-white">Next</button>
            </div>
          </motion.div>
        )}

        {/* ── EDU: Attractiveness Influence ── */}
        {step === 'edu_influence' && (
          <motion.div key="influence" {...slide} className="flex flex-col min-h-dvh">
            <div className="flex-1 flex flex-col px-6 pt-12">
              <button onClick={back} className="text-[var(--text-sub)] text-lg font-light mb-6 self-start">‹</button>
              <h1 className="text-3xl font-black text-white leading-tight mb-8">
                Attractiveness Influence Across Life Domains
              </h1>
              <InfluenceBar label="Dating" pct={80} teal delay={300} />
              <InfluenceBar label="Popularity" pct={65} delay={450} />
              <InfluenceBar label="Career Oppt." pct={35} delay={600} />
              <InfluenceBar label="Income" pct={30} delay={750} />
            </div>
            <div className="bottom-card">
              <h2 className="text-3xl font-black text-white mb-3">The Brutal Truth</h2>
              <p className="text-[var(--text-sub)] text-sm leading-relaxed mb-6">
                99% of people don&apos;t realize how much attractiveness impacts their lives, especially for dating
              </p>
              <button onClick={next} className="btn-white">Next</button>
            </div>
          </motion.div>
        )}

        {/* ── QUIZ: Name ── */}
        {step === 'quiz_name' && (
          <motion.div key="name" {...slide} className="flex flex-col min-h-dvh px-6 pt-12">
            <button onClick={back} className="text-[var(--text-sub)] text-lg font-light mb-4 self-start">‹</button>
            <ProgressBar step={step} />
            <h1 className="text-4xl font-black text-white mb-2">What&apos;s your name?</h1>
            <p className="text-[var(--text-sub)] text-sm mb-10">This will be used to personalize your experience</p>
            <div className="flex-1" />
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name"
              className="w-full px-4 py-4 rounded-2xl text-white text-base outline-none mb-4"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
            />
            <div className="flex-1" />
            <button onClick={() => { setState({ goal: null }); next() }} className="text-[var(--text-sub)] text-sm text-center mb-3">Skip test</button>
            <button
              onClick={() => { if (name.trim()) { setState({}); next() } }}
              disabled={!name.trim()}
              className="btn-white mb-6"
            >
              Next
            </button>
          </motion.div>
        )}

        {/* ── QUIZ: Goal ── */}
        {step === 'quiz_goal' && (
          <motion.div key="goal" {...slide} className="flex flex-col min-h-dvh px-6 pt-12">
            <button onClick={back} className="text-[var(--text-sub)] text-lg font-light mb-4 self-start">‹</button>
            <ProgressBar step={step} />
            <h1 className="text-4xl font-black text-white mb-2">Your fitness goal?</h1>
            <p className="text-[var(--text-sub)] text-sm mb-8">We&apos;ll tailor your transformation preview</p>
            <div className="flex flex-col gap-3">
              {GOALS.map((g) => (
                <motion.button
                  key={g.value}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setGoal(g.value); setState({ goal: g.value }); setTimeout(next, 180) }}
                  className="flex items-center justify-between w-full px-5 py-4 rounded-2xl text-left transition-all duration-150"
                  style={{
                    background: goal === g.value ? 'rgba(92,224,208,0.1)' : 'rgba(255,255,255,0.05)',
                    border: goal === g.value ? '1.5px solid var(--teal)' : '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  <div>
                    <div className={`font-semibold text-base ${goal === g.value ? 'teal' : 'text-white'}`}>{g.label}</div>
                    <div className="text-[var(--text-sub)] text-sm">{g.desc}</div>
                  </div>
                  <div className="text-[var(--text-dim)]">›</div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── QUIZ: Gym ── */}
        {step === 'quiz_gym' && (
          <motion.div key="gym" {...slide} className="flex flex-col min-h-dvh px-6 pt-12">
            <button onClick={back} className="text-[var(--text-sub)] text-lg font-light mb-4 self-start">‹</button>
            <ProgressBar step={step} />
            <h1 className="text-4xl font-black text-white mb-2">Where do you train?</h1>
            <p className="text-[var(--text-sub)] text-sm mb-8">Affects your workout recommendations</p>
            <div className="grid grid-cols-2 gap-3">
              {GYMS.map((g) => (
                <motion.button
                  key={g.value}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { setGym(g.value); setState({ gymType: g.value }); setTimeout(next, 180) }}
                  className="flex flex-col items-center justify-center py-10 rounded-2xl font-semibold text-base transition-all duration-150"
                  style={{
                    background: gym === g.value ? 'rgba(92,224,208,0.1)' : 'rgba(255,255,255,0.05)',
                    border: gym === g.value ? '1.5px solid var(--teal)' : '1px solid rgba(255,255,255,0.1)',
                    color: gym === g.value ? 'var(--teal)' : '#fff',
                  }}
                >
                  {g.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── QUIZ: Diet ── */}
        {step === 'quiz_diet' && (
          <motion.div key="diet" {...slide} className="flex flex-col min-h-dvh px-6 pt-12">
            <button onClick={back} className="text-[var(--text-sub)] text-lg font-light mb-4 self-start">‹</button>
            <ProgressBar step={step} />
            <h1 className="text-4xl font-black text-white mb-2">Diet preference?</h1>
            <p className="text-[var(--text-sub)] text-sm mb-8">Last step before your analysis</p>
            <div className="grid grid-cols-2 gap-3">
              {DIETS.map((d) => (
                <motion.button
                  key={d.value}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { setState({ dietType: d.value }); setTimeout(next, 180) }}
                  className="flex items-center justify-center py-8 rounded-2xl font-semibold text-base transition-all duration-150"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                  }}
                >
                  {d.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── UPLOAD ── */}
        {step === 'upload' && (
          <motion.div key="upload" {...slide} className="flex flex-col min-h-dvh px-6 pt-12">
            <button onClick={back} className="text-[var(--text-sub)] text-lg font-light mb-4 self-start">‹</button>
            <ProgressBar step={step} />
            <h1 className="text-4xl font-black text-white mb-2">Upload your photo</h1>
            <p className="text-[var(--text-sub)] text-sm mb-6">Full body photo works best for accurate analysis</p>

            <div
              className="relative rounded-3xl overflow-hidden cursor-pointer"
              style={{
                flex: '0 0 auto',
                height: 340,
                background: isDragging ? 'rgba(92,224,208,0.06)' : 'rgba(255,255,255,0.03)',
                border: `2px dashed ${isDragging ? 'var(--teal)' : 'rgba(255,255,255,0.14)'}`,
                transition: 'all 0.2s',
              }}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center px-6">
                  <div className="w-14 h-14 rounded-full border-2 border-[var(--teal)] flex items-center justify-center mb-4"
                    style={{ boxShadow: '0 0 20px rgba(92,224,208,0.2)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M12 5v14M5 12h14" stroke="var(--teal)" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <p className="text-white font-semibold text-base">Tap to upload</p>
                  <p className="text-[var(--text-dim)] text-sm mt-1">or drag your photo here</p>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }}
            />

            <div className="flex-1" />
            <p className="text-center text-[var(--text-dim)] text-xs mb-3">Private & secure — your photo is never stored permanently</p>
            <button
              onClick={handleSubmit}
              disabled={!imagePreview}
              className="btn-teal mb-6"
            >
              Analyze My Physique
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
