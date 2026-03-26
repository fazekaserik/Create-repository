import { NextRequest, NextResponse } from 'next/server'
import { generateTransformation } from '@/lib/replicate'

export async function POST(req: NextRequest) {
  try {
    const { imageUrl, goal, period } = await req.json()

    if (!imageUrl || !goal || !period) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const resultUrl = await generateTransformation(imageUrl, goal, period)
    return NextResponse.json({ imageUrl: resultUrl })
  } catch (err) {
    console.error('[generate]', err)
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 })
  }
}
