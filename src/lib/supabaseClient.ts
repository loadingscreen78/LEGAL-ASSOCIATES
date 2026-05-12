import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Supabase configuration - single source for Auth, Database, and Storage
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/**
 * Flag other code (and the root error screen) can read to decide whether
 * Supabase-dependent features are usable. We intentionally DO NOT throw
 * at module load — a throw here blanks the whole app (white screen).
 */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

if (!isSupabaseConfigured) {
  // Log loudly in dev + prod, but let the app mount so users get a real UI.
  // eslint-disable-next-line no-console
  console.error(
    '[supabase] Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. ' +
      'Auth, orders, and product data will be unavailable until these are set on the host.'
  );
} else {
  // eslint-disable-next-line no-console
  console.log('✅ Supabase client initialized for Auth, Database, and Storage');
}

/**
 * When envs are missing we still export a Supabase client stub so existing
 * imports don't explode. The stub points at a placeholder URL (no network
 * traffic will succeed, but module eval won't throw).
 */
export const supabase: SupabaseClient = createClient(
  SUPABASE_URL || 'https://placeholder.supabase.co',
  SUPABASE_ANON_KEY || 'public-anon-key-placeholder',
  {
    auth: {
      autoRefreshToken: isSupabaseConfigured,
      persistSession: isSupabaseConfigured,
      detectSessionInUrl: isSupabaseConfigured,
    },
  }
);

/**
 * Upload a product image to Supabase Storage
 * @param file - The image file to upload
 * @returns The public URL of the uploaded image
 */
export async function uploadProductImage(file: File): Promise<string> {
  try {
    console.log('📤 Starting image upload to Supabase...');
    
    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${fileName}`;

    console.log('📁 Upload path:', filePath);

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('products')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type
      });

    if (uploadError) {
      console.error('❌ Supabase upload error:', uploadError);
      throw new Error(`Failed to upload image: ${uploadError.message}`);
    }

    console.log('✅ Upload successful:', uploadData);

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('products')
      .getPublicUrl(filePath);

    if (!urlData?.publicUrl) {
      throw new Error('Failed to get public URL');
    }

    console.log('🔗 Public URL:', urlData.publicUrl);
    return urlData.publicUrl;
  } catch (error: any) {
    console.error('❌ Error in uploadProductImage:', error);
    throw error;
  }
}

/**
 * Delete a product image from Supabase Storage
 * @param imageUrl - The public URL of the image to delete
 */
export async function deleteProductImage(imageUrl: string): Promise<void> {
  try {
    // Extract file path from URL
    const urlParts = imageUrl.split('/products/');
    if (urlParts.length < 2) {
      console.warn('Invalid image URL format');
      return;
    }
    
    const filePath = urlParts[1];

    const { error } = await supabase.storage
      .from('products')
      .remove([filePath]);

    if (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  } catch (error: any) {
    console.error('Error in deleteProductImage:', error);
    throw error;
  }
}
