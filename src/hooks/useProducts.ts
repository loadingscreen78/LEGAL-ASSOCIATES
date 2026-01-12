import { useState, useEffect } from 'react';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  onSnapshot
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

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
      const querySnapshot = await getDocs(collection(db, 'products'));
      console.log('🔥 Firebase products count:', querySnapshot.docs.length);
      
      let productsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        console.log('🔥 Product data:', { id: doc.id, ...data });
        return {
          id: doc.id,
          ...data
        };
      }) as Product[];
      
      console.log('🔥 Total products before filter:', productsData.length);
      
      // Filter active products for non-admin users
      if (!isAdmin) {
        productsData = productsData.filter(p => p.is_active);
        console.log('🔥 Active products after filter:', productsData.length);
      }
      
      // Sort by created_at descending
      productsData.sort((a, b) => {
        const dateA = new Date(a.created_at || 0).getTime();
        const dateB = new Date(b.created_at || 0).getTime();
        return dateB - dateA;
      });
      
      console.log('🔥 Final products to display:', productsData);
      setProducts(productsData);
    } catch (error: any) {
      console.error('❌ Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to fetch products. Please try again.",
        variant: "destructive",
      });
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
      const docRef = await addDoc(collection(db, 'products'), {
        ...productData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      toast({
        title: "Success",
        description: "Product created successfully!",
      });

      await fetchProducts();
      return { data: { id: docRef.id, ...productData }, error: null };
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
      const productRef = doc(db, 'products', productId);
      await updateDoc(productRef, {
        ...updates,
        updated_at: new Date().toISOString(),
      });

      toast({
        title: "Success",
        description: "Product updated successfully!",
      });

      await fetchProducts();
      return { data: updates, error: null };
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
      const productRef = doc(db, 'products', productId);
      await deleteDoc(productRef);

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
      // Use Supabase Storage for image upload
      const { uploadProductImage: uploadToSupabase } = await import('@/lib/supabaseClient');
      
      console.log('📤 Uploading image to Supabase Storage...');
      const imageUrl = await uploadToSupabase(file);
      console.log('✅ Image uploaded successfully:', imageUrl);

      toast({
        title: "Success",
        description: "Image uploaded successfully to Supabase!",
      });

      return { data: imageUrl, error: null };
    } catch (error: any) {
      console.error('❌ Error uploading image to Supabase:', error);
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

    const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
      let productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      
      // Filter active products for non-admin users
      if (!isAdmin) {
        productsData = productsData.filter(p => p.is_active);
      }
      
      // Sort by created_at descending
      productsData.sort((a, b) => {
        const dateA = new Date(a.created_at || 0).getTime();
        const dateB = new Date(b.created_at || 0).getTime();
        return dateB - dateA;
      });
      
      setProducts(productsData);
    });

    return () => unsubscribe();
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
