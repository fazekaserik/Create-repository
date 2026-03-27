'use client'

import { useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { setState } from '@/lib/store'
import type { Goal, GymType, DietType } from '@/lib/types'

type Step = 'landing' | 'upload' | 'goal' | 'gym' | 'diet'

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

export default function OnboardingPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState<Step>('landing')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)
  const [selectedGym, setSelectedGym] = useState<GymType | null>(null)

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      setImagePreview(dataUrl)
      setState({ uploadedImageDataUrl: dataUrl })
      setTimeout(() => setStep('goal'), 400)
    }
    reader.readAsDataURL(file)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const handleGoalSelect = (g: Goal) => {
    setSelectedGoal(g)
    setState({ goal: g })
    setTimeout(() => setStep('gym'), 220)
  }

  const handleGymSelect = (g: GymType) => {
    setSelectedGym(g)
    setState({ gymType: g })
    setTimeout(() => setStep('diet'), 220)
  }

  const handleDietSelect = (d: DietType) => {
    setState({ dietType: d })
    router.push('/loading')
  }

  const slideIn = {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
    transition: { duration: 0.25 },
  }

  return (
    <main className="min-h-screen radial-bg flex flex-col">

      {/* LANDING */}
      <AnimatePresence mode="wait">
        {step === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-between min-h-screen px-6 py-12"
          >
            {/* Logo */}
            <div className="text-center mt-8">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl border border-[var(--teal)] flex items-center justify-center text-xl">⚡</div>
                <h1 className="text-4xl font-black tracking-tight">
                  Next<span className="teal-glow">Body</span>
                </h1>
              </div>
              <p className="text-[var(--text-muted)] text-sm">10,000+ body scans completed</p>
              <p className="text-[var(--text-muted)] text-sm">Unlock your top 20% physique in 90 days</p>
            </div>

            {/* Feature list */}
            <div className="w-full max-w-sm space-y-3 mt-6">
              {[
                'AI Physique Rating & Analysis',
                'See Your 90-Day Transformation',
                'Personalized Training Plan',
                'Elite Body Optimization',
              ].map((f) => (
                <div key={f} className="flex items-center gap-3">
                  <span className="teal font-bold text-lg">✓</span>
                  <span className="text-white text-sm font-medium">{f}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="w-full max-w-sm mt-8 space-y-3">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setStep('upload')}
                className="btn-primary w-full py-4 pulse-teal"
              >
                Scan My Body →
              </motion.button>
              <p className="text-center text-[var(--text-dim)] text-xs">
                Takes less than 10 seconds
              </p>
            </div>
          </motion.div>
        )}

        {/* UPLOAD */}
        {step === 'upload' && (
          <motion.div key="upload" {...slideIn} className="flex flex-col min-h-screen px-6 py-10">
            <button onClick={() => setStep('landing')} className="text-[var(--text-muted)] text-sm mb-8">‹ Back</button>

            <h2 className="text-3xl font-black text-white mb-2">Upload your photo</h2>
            <p className="text-[var(--text-muted)] text-sm mb-8">Full body photo works best for accurate analysis</p>

            <div
              className={`relative flex-1 max-h-96 rounded-3xl border-2 border-dashed transition-all duration-200 cursor-pointer overflow-hidden
                ${isDragging ? 'border-[var(--teal)] bg-[var(--teal-dim)]' : 'border-white/15 bg-white/[0.03] hover:border-white/30'}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-10 text-center" style={{ minHeight: 300 }}>
                  <div className="text-6xl mb-5 float">📸</div>
                  <p className="text-white font-semibold text-base">Tap to upload</p>
                  <p className="text-[var(--text-dim)] text-sm mt-1">or drag & drop</p>
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

            <div className="flex justify-center gap-4 mt-6 text-xs text-[var(--text-dim)]">
              <span>🔒 Private & encrypted</span>
              <span>⚡ AI analysis in seconds</span>
            </div>
          </motion.div>
        )}

        {/* GOAL */}
        {step === 'goal' && (
          <motion.div key="goal" {...slideIn} className="flex flex-col min-h-screen px-6 py-10">
            <button onClick={() => setStep('upload')} className="text-[var(--text-muted)] text-sm mb-8">‹ Back</button>
            <h2 className="text-3xl font-black text-white mb-2">What's your goal?</h2>
            <p className="text-[var(--text-muted)] text-sm mb-8">We'll tailor your transformation preview</p>
            <div className="flex flex-col gap-3">
              {GOALS.map((g) => (
                <motion.button
                  key={g.value}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleGoalSelect(g.value)}
                  className={`w-full flex items-center justify-between p-5 rounded-2xl transition-all duration-200 text-left
                    ${selectedGoal === g.value ? 'card-teal' : 'card hover:border-white/20'}`}
                >
                  <div>
                    <div className={`font-bold text-base ${selectedGoal === g.value ? 'teal' : 'text-white'}`}>{g.label}</div>
                    <div className="text-[var(--text-muted)] text-sm mt-0.5">{g.desc}</div>
                  </div>
                  <div className={`text-lg ${selectedGoal === g.value ? 'teal' : 'text-white/20'}`}>›</div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* GYM */}
        {step === 'gym' && (
          <motion.div key="gym" {...slideIn} className="flex flex-col min-h-screen px-6 py-10">
            <button onClick={() => setStep('goal')} className="text-[var(--text-muted)] text-sm mb-8">‹ Back</button>
            <h2 className="text-3xl font-black text-white mb-2">Where do you train?</h2>
            <p className="text-[var(--text-muted)] text-sm mb-8">Affects your workout plan</p>
            <div className="grid grid-cols-2 gap-3">
              {GYMS.map((g) => (
                <motion.button
                  key={g.value}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleGymSelect(g.value)}
                  className={`flex flex-col items-center justify-center gap-3 p-8 rounded-2xl transition-all duration-200
                    ${selectedGym === g.value ? 'card-teal' : 'card hover:border-white/20'}`}
                >
                  <span className="text-4xl">{g.value === 'gym' ? '🏢' : '🏠'}</span>
                  <span className={`font-bold ${selectedGym === g.value ? 'teal' : 'text-white'}`}>{g.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* DIET */}
        {step === 'diet' && (
          <motion.div key="diet" {...slideIn} className="flex flex-col min-h-screen px-6 py-10">
            <button onClick={() => setStep('gym')} className="text-[var(--text-muted)] text-sm mb-8">‹ Back</button>
            <h2 className="text-3xl font-black text-white mb-2">Diet preference?</h2>
            <p className="text-[var(--text-muted)] teal text-sm mb-8 font-semibold">Last step 🎯</p>
            <div className="grid grid-cols-2 gap-3">
              {DIETS.map((d) => (
                <motion.button
                  key={d.value}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDietSelect(d.value)}
                  className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl card hover:border-[var(--teal)] transition-all duration-200"
                >
                  <span className="text-3xl">{d.value === 'standard' ? '🍽️' : d.value === 'keto' ? '🥑' : d.value === 'vegan' ? '🌱' : '🥩'}</span>
                  <span className="font-semibold text-white text-sm">{d.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress dots (not on landing) */}
      {step !== 'landing' && (
        <div className="fixed bottom-8 left-0 right-0 flex justify-center gap-2 pointer-events-none">
          {(['upload', 'goal', 'gym', 'diet'] as const).map((s, i) => {
            const stepIdx = ['upload', 'goal', 'gym', 'diet'].indexOf(step)
            return (
              <div
                key={s}
                className="rounded-full transition-all duration-300"
                style={{
                  width: step === s ? 24 : 8,
                  height: 8,
                  background: step === s ? 'var(--teal)' : i < stepIdx ? 'rgba(92,224,208,0.4)' : 'rgba(255,255,255,0.15)',
                }}
              />
            )
          })}
        </div>
      )}
    </main>
  )
}
