'use client'

import { useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { setState } from '@/lib/store'
import type { Goal, GymType, DietType } from '@/lib/types'

type Step = 'upload' | 'goal' | 'gym' | 'diet'

const GOALS: { value: Goal; label: string; emoji: string; desc: string }[] = [
  { value: 'cut', label: 'Get Lean', emoji: '⚡', desc: 'Cut fat, keep muscle' },
  { value: 'build', label: 'Build Muscle', emoji: '💪', desc: 'Lean muscle gains' },
  { value: 'bulk', label: 'Get Big', emoji: '🏋️', desc: 'Max size & strength' },
]

const GYMS: { value: GymType; label: string; emoji: string }[] = [
  { value: 'gym', label: 'Gym', emoji: '🏢' },
  { value: 'home', label: 'Home', emoji: '🏠' },
]

const DIETS: { value: DietType; label: string; emoji: string }[] = [
  { value: 'standard', label: 'Standard', emoji: '🍽️' },
  { value: 'keto', label: 'Keto', emoji: '🥩' },
  { value: 'vegan', label: 'Vegan', emoji: '🌱' },
  { value: 'carnivore', label: 'Carnivore', emoji: '🥩' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState<Step>('upload')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [goal, setGoal] = useState<Goal | null>(null)
  const [gym, setGym] = useState<GymType | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      setImagePreview(dataUrl)
      setState({ uploadedImageDataUrl: dataUrl })
      setTimeout(() => setStep('goal'), 300)
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
    setGoal(g)
    setState({ goal: g })
    setTimeout(() => setStep('gym'), 200)
  }

  const handleGymSelect = (g: GymType) => {
    setGym(g)
    setState({ gymType: g })
    setTimeout(() => setStep('diet'), 200)
  }

  const handleDietSelect = (d: DietType) => {
    setState({ dietType: d })
    router.push('/loading')
  }

  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center px-5 py-8">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <h1 className="text-3xl font-black tracking-tight neon-green">NextBody</h1>
        <p className="text-xs text-white/40 mt-1 tracking-widest uppercase">AI Body Transformation</p>
      </motion.div>

      <div className="w-full max-w-sm">
        <AnimatePresence mode="wait">

          {/* STEP: Upload */}
          {step === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">See your future body</h2>
                <p className="text-white/50 text-sm">Upload a full body photo to begin</p>
              </div>

              <div
                className={`relative rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer overflow-hidden
                  ${isDragging
                    ? 'border-[#00ff88] bg-[rgba(0,255,136,0.08)]'
                    : 'border-white/20 bg-white/[0.03] hover:border-white/40 hover:bg-white/[0.05]'
                  }`}
                style={{ minHeight: 260 }}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" style={{ minHeight: 260 }} />
                ) : (
                  <div className="flex flex-col items-center justify-center p-10 text-center" style={{ minHeight: 260 }}>
                    <div className="text-5xl mb-4 float">📸</div>
                    <p className="text-white font-semibold mb-1">Tap to upload photo</p>
                    <p className="text-white/40 text-xs">Full body photo works best</p>
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

              <div className="mt-6 flex gap-3 text-xs text-white/30 justify-center">
                <span>🔒 Private & secure</span>
                <span>·</span>
                <span>⚡ Results in seconds</span>
              </div>
            </motion.div>
          )}

          {/* STEP: Goal */}
          {step === 'goal' && (
            <motion.div
              key="goal"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.25 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">What's your goal?</h2>
                <p className="text-white/40 text-sm">Choose one</p>
              </div>
              <div className="flex flex-col gap-3">
                {GOALS.map((g) => (
                  <motion.button
                    key={g.value}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleGoalSelect(g.value)}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl glass border border-white/10 hover:border-[#00ff88]/50 transition-all duration-200 text-left"
                  >
                    <span className="text-3xl">{g.emoji}</span>
                    <div>
                      <div className="font-bold text-white">{g.label}</div>
                      <div className="text-white/40 text-xs">{g.desc}</div>
                    </div>
                    <div className="ml-auto text-white/20">›</div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP: Gym or Home */}
          {step === 'gym' && (
            <motion.div
              key="gym"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.25 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Where do you train?</h2>
                <p className="text-white/40 text-sm">We'll tailor your plan</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {GYMS.map((g) => (
                  <motion.button
                    key={g.value}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleGymSelect(g.value)}
                    className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl glass border border-white/10 hover:border-[#00ff88]/50 transition-all duration-200"
                  >
                    <span className="text-4xl">{g.emoji}</span>
                    <span className="font-bold text-white">{g.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP: Diet */}
          {step === 'diet' && (
            <motion.div
              key="diet"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.25 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Diet preference?</h2>
                <p className="text-white/40 text-sm">Last step 🎯</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {DIETS.map((d) => (
                  <motion.button
                    key={d.value}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDietSelect(d.value)}
                    className="flex flex-col items-center justify-center gap-3 p-5 rounded-2xl glass border border-white/10 hover:border-[#00ff88]/50 transition-all duration-200"
                  >
                    <span className="text-3xl">{d.emoji}</span>
                    <span className="font-semibold text-white text-sm">{d.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress dots */}
      <div className="flex gap-2 mt-8">
        {(['upload', 'goal', 'gym', 'diet'] as Step[]).map((s, i) => (
          <div
            key={s}
            className={`rounded-full transition-all duration-300 ${
              step === s
                ? 'w-6 h-2 bg-[#00ff88]'
                : i < (['upload', 'goal', 'gym', 'diet'] as Step[]).indexOf(step)
                  ? 'w-2 h-2 bg-[#00ff88]/60'
                  : 'w-2 h-2 bg-white/20'
            }`}
          />
        ))}
      </div>
    </main>
  )
}
