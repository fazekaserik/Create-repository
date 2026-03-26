import { NextRequest, NextResponse } from 'next/server'
import { swapFace } from '@/lib/replicate'
import { getTemplate } from '@/lib/templates'
import type { BodyType, Goal, TransformPeriod } from '@/lib/types'

export async function POST(req: NextRequest) {
  try {
    const { imageUrl, bodyType, goal, period } = await req.json()

    if (!imageUrl || !bodyType || !goal || !period) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get the matching body template from library
    const templateUrl = getTemplate(bodyType as BodyType, goal as Goal, period as TransformPeriod)

    // Overlay user's face onto the template body
    const resultUrl = await swapFace(imageUrl, templateUrl)

    return NextResponse.json({ imageUrl: resultUrl })
  } catch (err) {
    console.error('[transform]', err)
    return NextResponse.json({ error: 'Transformation failed' }, { status: 500 })
  }
}
