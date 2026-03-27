export type Goal = 'cut' | 'build' | 'bulk'
export type GymType = 'gym' | 'home'
export type DietType = 'standard' | 'keto' | 'vegan' | 'carnivore'
export type TransformPeriod = '1month' | '3months' | '6months'
export type SubscriptionTier = 'free' | 'weekly' | 'monthly'

export type BodyType =
  | 'lean_male'
  | 'average_male'
  | 'overweight_male'
  | 'obese_male'
  | 'lean_female'
  | 'average_female'
  | 'overweight_female'
  | 'obese_female'

export interface UserProfile {
  imageUrl: string
  goal: Goal
  gymType: GymType
  dietType: DietType
  bodyType?: BodyType
  sex?: 'male' | 'female'
}

export interface TransformationResult {
  period: TransformPeriod
  imageUrl: string
  muscleGain: string
  fatLoss: string
  isBlurred: boolean
}

export interface ClassifyResponse {
  bodyType: BodyType
  sex: 'male' | 'female'
  confidence: number
}

export interface TransformResponse {
  imageUrl: string
}

export interface PhysiqueRating {
  overall: number          // 1-10
  attractiveness: number   // 1-10
  physique: number         // 1-10
  ratios: number           // 1-10
  shoulderWidth: number    // 1-10
  potential: number        // 1-10
  bodyFatEstimate: string  // e.g. "18-22%"
  percentile: number       // 0-100
  summary: string          // one-line brutal truth
}
