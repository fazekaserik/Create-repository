import Replicate from 'replicate'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
})

// InsightFace face swap - swaps face from source onto target body template
export async function swapFace(
  sourceImageUrl: string,  // user's original photo (face source)
  targetImageUrl: string,  // body template (face destination)
): Promise<string> {
  const output = await replicate.run(
    'zsxkib/instant-id:latest' as `${string}/${string}:${string}`,
    {
      input: {
        image: sourceImageUrl,
        pose_image: targetImageUrl,
        prompt: 'a person with athletic physique, photorealistic, high quality',
        negative_prompt: 'deformed, ugly, blurry, low quality',
        num_inference_steps: 30,
        guidance_scale: 7,
        ip_adapter_scale: 0.8,
        controlnet_conditioning_scale: 0.8,
      },
    }
  )

  if (Array.isArray(output)) return output[0] as string
  return (output as unknown) as string
}

// AI body transformation for monthly premium users
export async function generateTransformation(
  imageUrl: string,
  goal: string,
  period: string,
): Promise<string> {
  const goalPrompts: Record<string, string> = {
    cut: 'lean muscular athletic body, defined abs, low body fat, toned physique',
    build: 'muscular athletic body, visible muscle definition, athletic build',
    bulk: 'large muscular body, thick muscles, powerlifter physique',
  }

  const intensityMap: Record<string, string> = {
    '1month': 'slightly more toned, subtle improvement',
    '3months': 'significantly more muscular and lean, impressive transformation',
    '6months': 'dramatic transformation, highly athletic and muscular',
  }

  const output = await replicate.run(
    'stability-ai/stable-diffusion-img2img:15a3689ee13b0d2616e98820eca31d4af4a36106d57cb9c20b77bd66a9d4b8c2' as `${string}/${string}:${string}`,
    {
      input: {
        image: imageUrl,
        prompt: `${goalPrompts[goal] || goalPrompts.build}, ${intensityMap[period]}, photorealistic fitness photo, same background, same clothes, high quality`,
        negative_prompt: 'deformed, ugly, blurry, different background, different clothes',
        strength: period === '1month' ? 0.3 : period === '3months' ? 0.55 : 0.75,
        num_inference_steps: 35,
        guidance_scale: 8,
      },
    }
  )

  if (Array.isArray(output)) return output[0] as string
  return (output as unknown) as string
}
