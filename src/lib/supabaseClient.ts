import { createClient } from '@supabase/supabase-js';

// Supabase configuration - single source for Auth, Database, and Storage
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables');
}

console.log('✅ Supabase client initialized for Auth, Database, and Storage');

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

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
