import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where,
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

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  user_name: string;
  rating: number; // 1-5
  title: string;
  comment: string;
  is_approved: boolean;
  is_verified_purchase: boolean;
  helpful_count: number;
  created_at: string;
  updated_at: string;
}

export const useReviews = (productId?: string) => {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      let q = query(collection(db, 'reviews'), orderBy('created_at', 'desc'));
      
      if (productId) {
        q = query(
          collection(db, 'reviews'),
          where('product_id', '==', productId),
          orderBy('created_at', 'desc')
        );
      }

      // Non-admins only see approved reviews
      if (!isAdmin) {
        q = query(
          collection(db, 'reviews'),
          where('is_approved', '==', true),
          orderBy('created_at', 'desc')
        );
      }

      const querySnapshot = await getDocs(q);
      const reviewsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Review[];
      
      setReviews(reviewsData);
    } catch (error: any) {
      console.error('Error fetching reviews:', error);
      toast({
        title: "Error",
        description: "Failed to fetch reviews.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createReview = async (reviewData: Omit<Review, 'id' | 'created_at' | 'updated_at' | 'helpful_count'>) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to write a review.",
        variant: "destructive",
      });
      return { error: new Error('Not authenticated') };
    }

    try {
      const docRef = await addDoc(collection(db, 'reviews'), {
        ...reviewData,
        user_id: user.uid,
        helpful_count: 0,
        is_approved: false, // Requires admin approval
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      toast({
        title: "Success",
        description: "Review submitted! It will appear after admin approval.",
      });

      await fetchReviews();
      return { data: { id: docRef.id, ...reviewData }, error: null };
    } catch (error: any) {
      console.error('Error creating review:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit review.",
        variant: "destructive",
      });
      return { error };
    }
  };

  const approveReview = async (reviewId: string) => {
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only admins can approve reviews.",
        variant: "destructive",
      });
      return { error: new Error('Access denied') };
    }

    try {
      const reviewRef = doc(db, 'reviews', reviewId);
      await updateDoc(reviewRef, {
        is_approved: true,
        updated_at: new Date().toISOString(),
      });

      toast({
        title: "Success",
        description: "Review approved!",
      });

      await fetchReviews();
      return { error: null };
    } catch (error: any) {
      console.error('Error approving review:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to approve review.",
        variant: "destructive",
      });
      return { error };
    }
  };

  const deleteReview = async (reviewId: string) => {
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only admins can delete reviews.",
        variant: "destructive",
      });
      return { error: new Error('Access denied') };
    }

    try {
      const reviewRef = doc(db, 'reviews', reviewId);
      await deleteDoc(reviewRef);

      toast({
        title: "Success",
        description: "Review deleted successfully!",
      });

      await fetchReviews();
      return { error: null };
    } catch (error: any) {
      console.error('Error deleting review:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete review.",
        variant: "destructive",
      });
      return { error };
    }
  };

  // Real-time listener
  useEffect(() => {
    fetchReviews();

    let q = query(collection(db, 'reviews'), orderBy('created_at', 'desc'));
    
    if (productId) {
      q = query(
        collection(db, 'reviews'),
        where('product_id', '==', productId),
        orderBy('created_at', 'desc')
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reviewsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Review[];
      setReviews(reviewsData);
    });

    return () => unsubscribe();
  }, [productId, isAdmin]);

  return {
    reviews,
    loading,
    createReview,
    approveReview,
    deleteReview,
    refetch: fetchReviews,
  };
};
