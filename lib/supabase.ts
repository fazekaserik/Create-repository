import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export async function uploadImage(file: File | Blob, path: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from('transformations')
    .upload(path, file, { upsert: true, contentType: 'image/jpeg' })

  if (error) throw new Error(`Upload failed: ${error.message}`)

  const { data: urlData } = supabase.storage
    .from('transformations')
    .getPublicUrl(data.path)

  return urlData.publicUrl
}

export async function uploadBase64Image(base64: string, path: string): Promise<string> {
  const response = await fetch(base64)
  const blob = await response.blob()
  return uploadImage(blob, path)
}
