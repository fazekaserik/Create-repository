import OpenAI from 'openai'
import type { BodyType, ClassifyResponse } from './types'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function classifyBody(imageUrl: string): Promise<ClassifyResponse> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: { url: imageUrl, detail: 'low' },
          },
          {
            type: 'text',
            text: `Analyze this person's body type and respond with ONLY a JSON object. No explanation.

Classify:
- sex: "male" or "female"
- bodyType: one of: "lean_male", "average_male", "overweight_male", "obese_male", "lean_female", "average_female", "overweight_female", "obese_female"
- confidence: number 0-1

Body type definitions:
- lean: low body fat, visible muscle tone or slim build
- average: normal weight, moderate body fat
- overweight: visibly overweight, some fat accumulation
- obese: significantly overweight

Respond with only: {"sex": "...", "bodyType": "...", "confidence": 0.9}`,
          },
        ],
      },
    ],
    max_tokens: 100,
  })

  const content = response.choices[0].message.content?.trim() || ''

  try {
    const parsed = JSON.parse(content.replace(/```json|```/g, '').trim())
    return {
      bodyType: parsed.bodyType as BodyType,
      sex: parsed.sex as 'male' | 'female',
      confidence: parsed.confidence || 0.8,
    }
  } catch {
    // fallback if parsing fails
    return {
      bodyType: 'average_male',
      sex: 'male',
      confidence: 0.5,
    }
  }
}
