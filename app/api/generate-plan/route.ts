import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: NextRequest) {
  const { type, goal, gymType, dietType, age, weight, weightUnit, height, heightUnit, name } = await req.json()

  const weightKg = weightUnit === 'lbs' ? Math.round((weight ?? 75) * 0.453592) : (weight ?? 75)
  const heightCm = heightUnit === 'ft' ? Math.round((height ?? 175) * 30.48) : (height ?? 175)

  // BMR calculation (Mifflin-St Jeor)
  const bmr = 10 * weightKg + 6.25 * heightCm - 5 * (age ?? 25) + 5
  const tdee = bmr * 1.55 // moderate activity

  const systemPrompt = `You are an elite certified personal trainer and nutritionist. Generate highly personalized, science-backed plans. Be specific, practical, and professional. Format as clean JSON only.`

  try {
    if (type === 'diet') {
      const calories =
        goal === 'cut' ? Math.round(tdee * 0.8) :
        goal === 'build' || goal === 'bulk' ? Math.round(tdee * 1.1) :
        Math.round(tdee)
      const protein = Math.round(weightKg * 2.2)
      const fat = Math.round(calories * 0.25 / 9)
      const carbs = Math.round((calories - protein * 4 - fat * 9) / 4)

      const prompt = `Generate a personalized diet plan for ${name || 'this person'}.
Stats: ${age ?? 25}yo, ${weightKg}kg, ${heightCm}cm
Goal: ${goal || 'general fitness'}, Diet preference: ${dietType || 'no preference'}
Calculated: ${calories} kcal/day, ${protein}g protein, ${carbs}g carbs, ${fat}g fat

Return ONLY valid JSON in this exact structure:
{
  "calories": ${calories},
  "protein": ${protein},
  "carbs": ${carbs},
  "fat": ${fat},
  "meals": [
    { "name": "Breakfast", "emoji": "🌅", "calories": 450, "items": ["Oats with berries", "Greek yogurt", "Black coffee"], "time": "7:00 AM" },
    { "name": "Lunch", "emoji": "☀️", "calories": 650, "items": ["Grilled chicken breast", "Brown rice", "Salad"], "time": "12:30 PM" },
    { "name": "Dinner", "emoji": "🌙", "calories": 600, "items": ["Salmon fillet", "Sweet potato", "Broccoli"], "time": "7:00 PM" },
    { "name": "Snack", "emoji": "⚡", "calories": 250, "items": ["Protein shake", "Banana"], "time": "3:30 PM" }
  ],
  "weeklyPlan": [
    { "day": "Monday", "meals": ["Oats & eggs", "Chicken & rice", "Beef & veggies"] },
    { "day": "Tuesday", "meals": ["Smoothie bowl", "Tuna wrap", "Pasta & chicken"] },
    { "day": "Wednesday", "meals": ["Eggs & toast", "Salmon salad", "Steak & potato"] },
    { "day": "Thursday", "meals": ["Oats & berries", "Turkey sandwich", "Shrimp & rice"] },
    { "day": "Friday", "meals": ["Protein pancakes", "Chicken wrap", "Burgers (lean)"] },
    { "day": "Saturday", "meals": ["Full breakfast", "Pasta bolognese", "Grilled fish"] },
    { "day": "Sunday", "meals": ["Smoothie", "Meal prep salad", "Roast chicken"] }
  ],
  "tips": [
    "Drink at least 3L of water daily — especially around workouts",
    "Eat your largest meal within 2 hours post-workout for muscle recovery",
    "Prep meals on Sunday to stay consistent throughout the week"
  ]
}`

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        max_tokens: 1500,
      })
      const plan = JSON.parse(response.choices[0].message.content || '{}')
      return NextResponse.json({ plan })

    } else {
      // WORKOUT
      const daysPerWeek = gymType === 'home' ? 4 : 5
      const splitType = daysPerWeek >= 5 ? 'Push / Pull / Legs' : daysPerWeek === 4 ? 'Upper / Lower' : 'Full Body'

      const prompt = `Generate a personalized workout plan for ${name || 'this person'}.
Stats: ${age ?? 25}yo, ${weightKg}kg, Goal: ${goal || 'general fitness'}, Gym access: ${gymType || 'full gym'}
Training: ${daysPerWeek} days/week, ${splitType} split
Return ONLY valid JSON:
{
  "daysPerWeek": ${daysPerWeek},
  "splitType": "${splitType}",
  "schedule": [
    {
      "day": "Monday",
      "focus": "Push (Chest/Shoulders/Triceps)",
      "exercises": [
        { "name": "Bench Press", "sets": 4, "reps": "8-10", "rest": "90s", "muscle": "Chest" },
        { "name": "Overhead Press", "sets": 3, "reps": "10-12", "rest": "75s", "muscle": "Shoulders" },
        { "name": "Incline Dumbbell Press", "sets": 3, "reps": "10-12", "rest": "60s", "muscle": "Upper Chest" },
        { "name": "Lateral Raises", "sets": 3, "reps": "15-20", "rest": "45s", "muscle": "Lateral Delts" },
        { "name": "Tricep Pushdowns", "sets": 3, "reps": "12-15", "rest": "45s", "muscle": "Triceps" }
      ]
    }
  ],
  "restDays": ["Thursday", "Sunday"],
  "restDayTips": ["Light walking 20-30 min", "Foam rolling & stretching", "Stay hydrated"],
  "progressionNotes": "Add 2.5kg to compound lifts each week. If you can't complete all reps, maintain the weight.",
  "tips": [
    "Warm up with 5-10 min light cardio before every session",
    "Track your lifts in a notebook — progressive overload is the key to growth",
    "Sleep 7-9 hours — 80% of muscle growth happens during sleep"
  ]
}`

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        max_tokens: 2000,
      })
      const plan = JSON.parse(response.choices[0].message.content || '{}')
      return NextResponse.json({ plan })
    }
  } catch (err) {
    console.error('generate-plan error:', err)
    return NextResponse.json({ error: 'Failed to generate plan' }, { status: 500 })
  }
}
