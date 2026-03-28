import { NextRequest, NextResponse } from 'next/server'
import { classifyBody } from '@/lib/openai'

export async function POST(req: NextRequest) {
  try {
    const { imageUrl } = await req.json()
    if (!imageUrl) return NextResponse.json({ error: 'imageUrl required' }, { status: 400 })

    const result = await classifyBody(imageUrl)
    return NextResponse.json(result)
  } catch (err) {
    console.error('[classify]', err)
    return NextResponse.json({ error: 'Classification failed' }, { status: 500 })
  }
}
