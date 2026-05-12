import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

export interface Product {
  id: string;
  title: string;
  author?: string;
  description?: string;
  price: number;
  category: 'books' | 'journals' | 'catalogs';
  stock: number;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useProducts = () => {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      // Filter active products for non-admin users
      if (!isAdmin) {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query;

      if (error) throw error;

      console.log('✅ Supabase products count:', data?.length || 0);
      setProducts((data as Product[]) || []);
    } catch (error: any) {
      // Log in dev only — a transient network error or RLS misconfig shouldn't
      // pop a destructive toast on pages that don't list products (e.g. Login).
      // Admin pages that depend on products can still surface their own
      // per-action toasts when create/update/delete fails.
      console.error('❌ Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user || !isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only admins can create products.",
        variant: "destructive",
      });
      return { error: new Error('Access denied') };
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .insert({
          ...productData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product created successfully!",
      });

      await fetchProducts();
      return { data, error: null };
    } catch (error: any) {
      console.error('Error creating product:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create product. Please try again.",
        variant: "destructive",
      });
      return { error };
    }
  };

  const updateProduct = async (productId: string, updates: Partial<Product>) => {
    if (!user || !isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only admins can update products.",
        variant: "destructive",
      });
      return { error: new Error('Access denied') };
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', productId)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product updated successfully!",
      });

      await fetchProducts();
      return { data, error: null };
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update product. Please try again.",
        variant: "destructive",
      });
      return { error };
    }
  };

  const deleteProduct = async (productId: string) => {
    if (!user || !isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only admins can delete products.",
        variant: "destructive",
      });
      return { error: new Error('Access denied') };
    }

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product deleted successfully!",
      });

      await fetchProducts();
      return { error: null };
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete product. Please try again.",
        variant: "destructive",
      });
      return { error };
    }
  };

  const uploadProductImage = async (file: File, productId?: string) => {
    if (!user || !isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only admins can upload images.",
        variant: "destructive",
      });
      return { error: new Error('Access denied') };
    }

    try {
      const { uploadProductImage: uploadToSupabase } = await import('@/lib/supabaseClient');
      
      console.log('📤 Uploading image to Supabase Storage...');
      const imageUrl = await uploadToSupabase(file);
      console.log('✅ Image uploaded successfully:', imageUrl);

      toast({
        title: "Success",
        description: "Image uploaded successfully!",
      });

      return { data: imageUrl, error: null };
    } catch (error: any) {
      console.error('❌ Error uploading image:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload image. Please try again.",
        variant: "destructive",
      });
      return { error };
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    fetchProducts();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('products-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products',
        },
        (payload: RealtimePostgresChangesPayload<Product>) => {
          console.log('🔄 Product change detected:', payload);
          fetchProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, isAdmin]);

  return {
    products,
    loading,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadProductImage,
    refetch: fetchProducts
  };
};
