'use client'

// Simple sessionStorage-backed store so state survives page navigation
// without requiring a heavy state library

import type { Goal, GymType, DietType, BodyType, TransformPeriod } from './types'

export interface AppState {
  // onboarding
  originalImageUrl: string | null
  uploadedImageDataUrl: string | null
  goal: Goal | null
  gymType: GymType | null
  dietType: DietType | null
  // classification result
  bodyType: BodyType | null
  sex: 'male' | 'female' | null
  // transformation results — keyed by period
  transformations: Partial<Record<TransformPeriod, string>>
  // subscription
  tier: 'free' | 'weekly' | 'monthly'
  activePeriod: TransformPeriod
}

const KEY = 'nextbody_state'

const defaults: AppState = {
  originalImageUrl: null,
  uploadedImageDataUrl: null,
  goal: null,
  gymType: null,
  dietType: null,
  bodyType: null,
  sex: null,
  transformations: {},
  tier: 'free',
  activePeriod: '1month',
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
