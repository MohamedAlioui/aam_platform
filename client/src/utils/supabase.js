import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL  = import.meta.env.VITE_SUPABASE_URL  || '';
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = (SUPABASE_URL && SUPABASE_ANON)
  ? createClient(SUPABASE_URL, SUPABASE_ANON)
  : null;

/* ── helpers ── */

export const BUCKET         = 'testimonials';
export const GALLERY_BUCKET = 'gallery';

/** Upload a video file → returns public URL */
export async function uploadVideo(file) {
  if (!supabase) throw new Error('Supabase not configured');
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
  if (!supabase) throw new Error('Supabase not configured');
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
  if (!supabase) return;
  const path = publicUrl.split(`/${BUCKET}/`)[1];
  if (!path) return;
  await supabase.storage.from(BUCKET).remove([path]);
}

/** Upload a gallery image → returns public URL */
export async function uploadGalleryImage(file) {
  if (!supabase) throw new Error('Supabase not configured');
  const ext  = file.name.split('.').pop();
  const name = `gallery_${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from(GALLERY_BUCKET).upload(name, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from(GALLERY_BUCKET).getPublicUrl(name);
  return data.publicUrl;
}

/** Delete a gallery image from storage by its full public URL */
export async function deleteGalleryImage(publicUrl) {
  if (!supabase) return;
  const filePath = publicUrl.split(`/${GALLERY_BUCKET}/`)[1];
  if (!filePath) return;
  await supabase.storage.from(GALLERY_BUCKET).remove([filePath]);
}
