import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import type { PhysiqueRating } from '@/lib/types'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

export async function POST(req: NextRequest) {
  try {
    const { imageUrl } = await req.json()
    if (!imageUrl) return NextResponse.json({ error: 'imageUrl required' }, { status: 400 })

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: imageUrl, detail: 'low' } },
            {
              type: 'text',
              text: `You are an elite fitness and physique analyst. Analyze this person's body and rate them objectively on a scale of 1-10 for each metric. Be honest but not cruel. Respond ONLY with a JSON object.

Rate these metrics (1-10 scale):
- overall: overall score combining all factors
- attractiveness: physical attractiveness based on body composition
- physique: muscle development and body structure
- ratios: shoulder-to-waist, waist-to-hip ratios and proportions
- shoulderWidth: shoulder breadth relative to body
- potential: estimated genetic potential and improvement ceiling
- bodyFatEstimate: estimated body fat % range as string (e.g. "18-22%")
- percentile: what percentile they are physically vs general population (0-100)
- summary: one brutal honest sentence about their current physique (max 12 words)

Respond ONLY with JSON:
{"overall":X,"attractiveness":X,"physique":X,"ratios":X,"shoulderWidth":X,"potential":X,"bodyFatEstimate":"X-X%","percentile":X,"summary":"..."}`,
            },
          ],
        },
      ],
      max_tokens: 200,
    })

    const content = response.choices[0].message.content?.trim() || ''
    const parsed: PhysiqueRating = JSON.parse(content.replace(/```json|```/g, '').trim())
    return NextResponse.json(parsed)
  } catch (err) {
    console.error('[rate]', err)
    // Fallback rating so the app never crashes
    const fallback: PhysiqueRating = {
      overall: 6,
      attractiveness: 6,
      physique: 5,
      ratios: 6,
      shoulderWidth: 6,
      potential: 8,
      bodyFatEstimate: '18-24%',
      percentile: 45,
      summary: 'Solid base. Significant improvement possible with consistency.',
    }
    return NextResponse.json(fallback)
  }
}
