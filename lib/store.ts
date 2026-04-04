'use client'

// Simple sessionStorage-backed store so state survives page navigation
// without requiring a heavy state library

import type { Goal, GymType, DietType, BodyType, TransformPeriod, PhysiqueRating } from './types'

export interface Meal { name: string; emoji: string; calories: number; items: string[]; time: string }
export interface WeekDay { day: string; meals: string[] }
export interface DietPlan { calories: number; protein: number; carbs: number; fat: number; meals: Meal[]; weeklyPlan: WeekDay[]; tips: string[] }
export interface Exercise { name: string; sets: number; reps: string; rest: string; muscle: string }
export interface WorkoutDay { day: string; focus: string; exercises: Exercise[] }
export interface WorkoutPlan { daysPerWeek: number; splitType: string; schedule: WorkoutDay[]; restDays: string[]; restDayTips: string[]; progressionNotes: string; tips: string[] }

export interface AppState {
  // onboarding
  originalImageUrl: string | null
  uploadedImageDataUrl: string | null
  name: string | null
  age: number | null
  weight: number | null
  weightUnit: 'kg' | 'lbs'
  height: number | null
  heightUnit: 'cm' | 'ft'
  goal: Goal | null
  gymType: GymType | null
  dietType: DietType | null
  demoMode: boolean
  // classification result
  bodyType: BodyType | null
  sex: 'male' | 'female' | null
  // transformation results — keyed by period
  transformations: Partial<Record<TransformPeriod, string>>
  // physique rating
  rating: PhysiqueRating | null
  // subscription
  tier: 'free' | 'weekly' | 'monthly'
  activePeriod: TransformPeriod
  // generated plans
  dietPlan: DietPlan | null
  workoutPlan: WorkoutPlan | null
}

const KEY = 'nextbody_state'

const defaults: AppState = {
  originalImageUrl: null,
  uploadedImageDataUrl: null,
  name: null,
  age: null,
  weight: null,
  weightUnit: 'kg',
  height: null,
  heightUnit: 'cm',
  goal: null,
  gymType: null,
  dietType: null,
  demoMode: false,
  bodyType: null,
  sex: null,
  transformations: {},
  rating: null,
  tier: 'free',
  activePeriod: '1month',
  dietPlan: null,
  workoutPlan: null,
}

export function getState(): AppState {
  if (typeof window === 'undefined') return defaults
  try {
    const raw = sessionStorage.getItem(KEY)
    return raw ? { ...defaults, ...JSON.parse(raw) } : defaults
  } catch {
    return defaults
  }
}

export function setState(partial: Partial<AppState>): AppState {
  const current = getState()
  const next = { ...current, ...partial }
  sessionStorage.setItem(KEY, JSON.stringify(next))
  return next
}

export function clearState() {
  sessionStorage.removeItem(KEY)
}
