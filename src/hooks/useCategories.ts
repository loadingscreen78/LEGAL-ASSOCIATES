import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
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

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Subcategory {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description?: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export const useCategories = () => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'categories'), orderBy('display_order', 'asc'));
      const querySnapshot = await getDocs(q);
      const categoriesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Category[];
      
      setCategories(categoriesData);
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Error",
        description: "Failed to fetch categories.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSubcategories = async () => {
    try {
      const q = query(collection(db, 'subcategories'), orderBy('display_order', 'asc'));
      const querySnapshot = await getDocs(q);
      const subcategoriesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Subcategory[];
      
      setSubcategories(subcategoriesData);
    } catch (error: any) {
      console.error('Error fetching subcategories:', error);
    }
  };

  const createCategory = async (categoryData: Omit<Category, 'id' | 'created_at' | 'updated_at'>) => {
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only admins can create categories.",
        variant: "destructive",
      });
      return { error: new Error('Access denied') };
    }

    try {
      const docRef = await addDoc(collection(db, 'categories'), {
        ...categoryData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      toast({
        title: "Success",
        description: "Category created successfully!",
      });

      await fetchCategories();
      return { data: { id: docRef.id, ...categoryData }, error: null };
    } catch (error: any) {
      console.error('Error creating category:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create category.",
        variant: "destructive",
      });
      return { error };
    }
  };

  const updateCategory = async (categoryId: string, updates: Partial<Category>) => {
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only admins can update categories.",
        variant: "destructive",
      });
      return { error: new Error('Access denied') };
    }

    try {
      const categoryRef = doc(db, 'categories', categoryId);
      await updateDoc(categoryRef, {
        ...updates,
        updated_at: new Date().toISOString(),
      });

      toast({
        title: "Success",
        description: "Category updated successfully!",
      });

      await fetchCategories();
      return { data: updates, error: null };
    } catch (error: any) {
      console.error('Error updating category:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update category.",
        variant: "destructive",
      });
      return { error };
    }
  };

  const deleteCategory = async (categoryId: string) => {
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only admins can delete categories.",
        variant: "destructive",
      });
      return { error: new Error('Access denied') };
    }

    try {
      const categoryRef = doc(db, 'categories', categoryId);
      await deleteDoc(categoryRef);

      toast({
        title: "Success",
        description: "Category deleted successfully!",
      });

      await fetchCategories();
      return { error: null };
    } catch (error: any) {
      console.error('Error deleting category:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete category.",
        variant: "destructive",
      });
      return { error };
    }
  };

  // Real-time listeners
  useEffect(() => {
    fetchCategories();
    fetchSubcategories();

    const unsubscribeCategories = onSnapshot(
      query(collection(db, 'categories'), orderBy('display_order', 'asc')),
      (snapshot) => {
        const categoriesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Category[];
        setCategories(categoriesData);
      }
    );

    const unsubscribeSubcategories = onSnapshot(
      query(collection(db, 'subcategories'), orderBy('display_order', 'asc')),
      (snapshot) => {
        const subcategoriesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Subcategory[];
        setSubcategories(subcategoriesData);
      }
    );

    return () => {
      unsubscribeCategories();
      unsubscribeSubcategories();
    };
  }, []);

  return {
    categories,
    subcategories,
    loading,
    createCategory,
    updateCategory,
    deleteCategory,
    refetch: fetchCategories,
  };
};
