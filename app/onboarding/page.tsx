'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { setState } from '@/lib/store'

/* ─────────────────────────────────────────────
   Step definitions  (age / weight / height / goal / gym / diet moved to plan pages)
───────────────────────────────────────────── */
type Step =
  | 'edu_halo'
  | 'edu_dating'
  | 'edu_influence'
  | 'quiz_name'
  | 'upload'

const EDU_STEPS: Step[] = ['edu_halo', 'edu_dating', 'edu_influence']
const QUIZ_STEPS: Step[] = ['quiz_name', 'upload']
const ALL_STEPS: Step[] = [...EDU_STEPS, ...QUIZ_STEPS]

/* ─────────────────────────────────────────────
   Animated bar (for influence screen)
───────────────────────────────────────────── */
function InfluenceBar({ label, pct, teal, delay }: { label: string; pct: number; teal?: boolean; delay: number }) {
  const [w, setW] = useState(0)
  useEffect(() => { const t = setTimeout(() => setW(pct), delay); return () => clearTimeout(t) }, [pct, delay])
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
      <span style={{ fontSize: 14, fontWeight: 600, width: 112, flexShrink: 0, color: teal ? 'var(--teal)' : '#fff' }}>{label}</span>
      <div className="hbar-track" style={{ flex: 1 }}>
        <div className={teal ? 'hbar-fill-teal' : 'hbar-fill-white'} style={{ width: `${w}%` }} />
      </div>
      <span style={{ fontSize: 13, fontWeight: 700, width: 36, textAlign: 'right', color: teal ? 'var(--teal)' : '#fff' }}>{pct}%</span>
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
    <div style={{ padding: '0 4px' }}>
      <p className="section-label" style={{ marginBottom: 4 }}>AVG # OF LIKES / WK</p>
      <div style={{ height: 1, background: 'rgba(255,255,255,0.10)', marginBottom: 12 }} />
      <div style={{ position: 'relative', height: 180 }}>
        {[0.25, 0.5, 0.75, 1].map(f => (
          <div key={f} style={{ position: 'absolute', left: 0, right: 0, bottom: `${f * 100}%`, height: 1, background: 'rgba(255,255,255,0.06)' }} />
        ))}
        <div style={{ position: 'absolute', right: 44, top: 6, fontSize: 10, color: 'rgba(255,255,255,0.45)', whiteSpace: 'nowrap' }}>
          Top 10% Dating Profiles →
        </div>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', gap: 3 }}>
          {CHART_DATA.map((d) => {
            const h = animated ? (d.v / MAX_V) * 100 : 0
            return (
              <div key={d.x} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                {d.v > 0 && (
                  <span style={{ fontSize: 10, color: d.teal ? 'var(--teal)' : '#fff', marginBottom: 2, fontWeight: 700 }}>{d.v}</span>
                )}
                <div
                  className="chart-bar"
                  style={{
                    width: '100%',
                    height: `${h}%`,
                    background: d.teal ? 'linear-gradient(to top, #5ce0d0, #4ade80)' : '#2a2a2a',
                    boxShadow: d.teal ? '0 0 12px rgba(92,224,208,0.5)' : 'none',
                    transition: 'height 0.9s cubic-bezier(.25,.46,.45,.94)',
                    minHeight: d.v > 0 ? 3 : 1,
                  }}
                />
              </div>
            )
          })}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 3, marginTop: 6 }}>
        {CHART_DATA.map((d) => (
          <div key={d.x} style={{ flex: 1, textAlign: 'center', fontSize: 9, color: d.teal ? 'var(--teal)' : 'rgba(255,255,255,0.35)' }}>{d.x}</div>
        ))}
      </div>
      <p className="section-label" style={{ textAlign: 'center', marginTop: 10 }}>ATTRACTIVENESS SCORE</p>
    </div>
  )
}

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
   Back button
───────────────────────────────────────────── */
function BackBtn({ onBack }: { onBack: () => void }) {
  return (
    <button
      onClick={onBack}
      style={{ fontSize: 22, color: 'var(--text-sub)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 16, alignSelf: 'flex-start', lineHeight: 1 }}
    >‹</button>
  )
}

/* ─────────────────────────────────────────────
   Main component
───────────────────────────────────────────── */
export default function OnboardingPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState<Step>('edu_halo')

  // Quiz state
  const [name, setName] = useState('')
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

  const colStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', minHeight: '100dvh', padding: '48px 24px 0' }

  return (
    <main style={{ minHeight: '100dvh', background: '#000', display: 'flex', flexDirection: 'column' }}>
      <AnimatePresence mode="wait">

        {/* ── EDU: Halo Effect ── */}
        {step === 'edu_halo' && (
          <motion.div key="halo" {...slide} style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '48px 24px 0' }}>
              <BackBtn onBack={back} />
              <div style={{ marginBottom: 8 }}>
                <span className="teal-badge" style={{ marginBottom: 12, display: 'inline-flex' }}>THE HALO EFFECT</span>
              </div>
              <h1 style={{ fontSize: 30, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: 10, lineHeight: 1.1 }}>
                Your Looks Are<br />Holding You Back
              </h1>
              <p style={{ fontSize: 14, color: 'var(--text-sub)', lineHeight: 1.6, marginBottom: 28, maxWidth: 320 }}>
                A cognitive bias where we subconsciously assume someone&apos;s positive qualities based on their physical attractiveness.
              </p>
              <div style={{ display: 'flex', gap: 12 }}>
                <div className="premium-card" style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ marginBottom: 12 }} />
                  {['intelligent', 'kind', 'rich'].map(t => (
                    <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <span style={{ color: 'var(--green)', fontSize: 15, fontWeight: 700 }}>✓</span>
                      <span style={{ fontSize: 13, color: '#fff', textTransform: 'capitalize' }}>{t}</span>
                    </div>
                  ))}
                </div>
                <div className="premium-card" style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ marginBottom: 12 }} />
                  {['intelligent', 'kind', 'rich'].map(t => (
                    <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <span style={{ color: 'var(--red)', fontSize: 15, fontWeight: 700 }}>✗</span>
                      <span style={{ fontSize: 13, color: 'var(--text-sub)', textTransform: 'capitalize' }}>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="bottom-card">
              <p style={{ fontSize: 13, color: 'var(--text-sub)', lineHeight: 1.6, marginBottom: 20 }}>
                It&apos;s not shallow, it&apos;s human nature. The Halo Effect states that you are treated and judged in vastly different ways depending on your looks.
              </p>
              <button onClick={next} className="btn-white">Next</button>
            </div>
          </motion.div>
        )}

        {/* ── EDU: Dating Reality ── */}
        {step === 'edu_dating' && (
          <motion.div key="dating" {...slide} style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '48px 24px 0' }}>
              <BackBtn onBack={back} />
              <p className="section-label" style={{ marginBottom: 8 }}>DATING REALITY</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <span className="teal-badge">Top 10%</span>
                <span style={{ fontSize: 13, color: 'var(--text-sub)' }}>of men get 80% of matches</span>
              </div>
              <DatingChart />
            </div>
            <div className="bottom-card">
              <h2 style={{ fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 10, letterSpacing: '-0.02em' }}>Dating Reality</h2>
              <p style={{ fontSize: 13, color: 'var(--text-sub)', lineHeight: 1.6, marginBottom: 20 }}>
                The truth is, unless you are an objectively attractive individual, you will struggle in the current dating market. Studies show 80% of women match with the top 20% of men.
              </p>
              <button onClick={next} className="btn-white">Next</button>
            </div>
          </motion.div>
        )}

        {/* ── EDU: Attractiveness Influence ── */}
        {step === 'edu_influence' && (
          <motion.div key="influence" {...slide} style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '48px 24px 0' }}>
              <BackBtn onBack={back} />
              <p className="section-label" style={{ marginBottom: 12 }}>ATTRACTIVENESS IMPACT</p>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: 28 }}>
                Attractiveness Influence<br />Across Life Domains
              </h1>
              <InfluenceBar label="Dating"       pct={80} teal  delay={300} />
              <InfluenceBar label="Popularity"   pct={65}       delay={450} />
              <InfluenceBar label="Career Oppt." pct={35}       delay={600} />
              <InfluenceBar label="Income"       pct={30}       delay={750} />
            </div>
            <div className="bottom-card">
              <h2 style={{ fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 10, letterSpacing: '-0.02em' }}>The Brutal Truth</h2>
              <p style={{ fontSize: 13, color: 'var(--text-sub)', lineHeight: 1.6, marginBottom: 20 }}>
                99% of people don&apos;t realize how much attractiveness impacts their lives, especially for dating.
              </p>
              <button onClick={next} className="btn-white">Next</button>
            </div>
          </motion.div>
        )}

        {/* ── QUIZ: Name ── */}
        {step === 'quiz_name' && (
          <motion.div key="name" {...slide} style={colStyle}>
            <BackBtn onBack={back} />
            <ProgressBar step={step} />
            <h1 style={{ fontSize: 32, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: 8 }}>What&apos;s your name?</h1>
            <p style={{ fontSize: 14, color: 'var(--text-sub)', marginBottom: 32 }}>This will be used to personalize your experience</p>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name"
              className="premium-input"
              style={{ marginBottom: 16 }}
            />
            <div style={{ flex: 1 }} />
            <button onClick={() => next()} className="btn-ghost" style={{ marginBottom: 12 }}>Skip</button>
            <button
              onClick={() => { if (name.trim()) { setState({ name: name.trim() }); next() } }}
              disabled={!name.trim()}
              className="btn-white"
              style={{ marginBottom: 48 }}
            >
              Next
            </button>
          </motion.div>
        )}

        {/* ── UPLOAD ── */}
        {step === 'upload' && (
          <motion.div key="upload" {...slide} style={colStyle}>
            <BackBtn onBack={back} />
            <ProgressBar step={step} />
            <h1 style={{ fontSize: 32, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: 8 }}>Upload your photo</h1>
            <p style={{ fontSize: 14, color: 'var(--text-sub)', marginBottom: 20 }}>Full body photo works best for accurate analysis</p>

            <div
              style={{
                flexShrink: 0, height: 320, borderRadius: 20,
                border: `2px dashed ${isDragging ? 'var(--teal)' : 'rgba(255,255,255,0.12)'}`,
                background: isDragging ? 'rgba(92,224,208,0.04)' : 'rgba(255,255,255,0.02)',
                overflow: 'hidden', cursor: 'pointer',
                transition: 'border-color 0.2s, background 0.2s',
                position: 'relative',
              }}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', padding: '0 24px' }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: '50%',
                    border: '2px solid var(--teal)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
                    boxShadow: '0 0 20px rgba(92,224,208,0.2)',
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M12 5v14M5 12h14" stroke="var(--teal)" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <p style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 6 }}>Tap to upload</p>
                  <p style={{ fontSize: 13, color: 'var(--text-dim)' }}>or drag your photo here</p>
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

            <div style={{ flex: 1 }} />
            <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-dim)', marginBottom: 12 }}>
              Private &amp; secure — your photo is never stored permanently
            </p>
            <button
              onClick={handleSubmit}
              disabled={!imagePreview}
              className="btn-teal"
              style={{ marginBottom: 48 }}
            >
              Analyze My Physique
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </main>
  )
}
