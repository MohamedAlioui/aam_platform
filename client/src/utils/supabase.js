import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL  = import.meta.env.VITE_SUPABASE_URL  || '';
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

/* ── helpers ── */

export const BUCKET = 'testimonials';

/** Upload a video file → returns public URL */
export async function uploadVideo(file) {
  const ext  = file.name.split('.').pop();
  const name = `video_${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(name, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(name);
  return data.publicUrl;
}

/** Upload a thumbnail image → returns public URL */
export async function uploadThumb(file) {
  const ext  = file.name.split('.').pop();
  const name = `thumb_${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(name, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(name);
  return data.publicUrl;
}

/** Delete a file from storage by its full public URL */
export async function deleteFile(publicUrl) {
  const path = publicUrl.split(`/${BUCKET}/`)[1];
  if (!path) return;
  await supabase.storage.from(BUCKET).remove([path]);
}
