import { useState, useEffect } from 'react';
import { 
  collection, 
  getDocs, 
  onSnapshot
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

export interface Transaction {
  id: string;
  order_id: string;
  user_id?: string;
  transaction_id?: string;
  amount: number;
  status: 'pending' | 'success' | 'failed' | 'cancelled' | 'completed';
  payment_method?: string;
  gateway_response?: Record<string, any>;
  created_at: string;
  updated_at: string;
  // Joined data from orders
  orders?: {
    id: string;
    user_id: string;
    order_number: string;
    total_amount: number;
    shipping_address: any;
    profiles?: {
      full_name?: string;
    };
  };
}

export const useTransactions = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    if (!user) {
      console.log('📊 No user, skipping fetch');
      setTransactions([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      console.log('📊 Fetching transactions... isAdmin:', isAdmin, 'user:', user.uid);
      
      // Get all transactions (we'll filter client-side if needed)
      const querySnapshot = await getDocs(collection(db, 'transactions'));
      console.log('📊 Found transactions:', querySnapshot.size);
      
      let transactionsData = querySnapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      })) as Transaction[];
      
      // Filter for non-admin users
      if (!isAdmin) {
        transactionsData = transactionsData.filter(t => t.user_id === user.uid);
        console.log('📊 Filtered transactions for user:', transactionsData.length);
      }
      
      // Sort by created_at descending
      transactionsData.sort((a, b) => {
        const dateA = new Date(a.created_at || 0).getTime();
        const dateB = new Date(b.created_at || 0).getTime();
        return dateB - dateA;
      });
      
      console.log('📊 Final transactions data:', transactionsData);
      setTransactions(transactionsData);
    } catch (error: any) {
      console.error('❌ Error fetching transactions:', error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) {
      return;
    }
    
    if (user) {
      fetchTransactions();

      // Simple subscription without compound index
      const unsubscribe = onSnapshot(collection(db, 'transactions'), () => {
        fetchTransactions();
      });

      return () => unsubscribe();
    } else {
      setTransactions([]);
      setLoading(false);
    }
  }, [user, isAdmin, authLoading]);

  const getRevenueStats = () => {
    if (!transactions.length) return { total: 0, thisMonth: 0, thisWeek: 0 };

    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const successfulTransactions = transactions.filter(t => t.status === 'success');

    const total = successfulTransactions.reduce((sum, t) => sum + t.amount, 0);
    const thisMonthRevenue = successfulTransactions
      .filter(t => new Date(t.created_at) >= thisMonth)
      .reduce((sum, t) => sum + t.amount, 0);
    const thisWeekRevenue = successfulTransactions
      .filter(t => new Date(t.created_at) >= thisWeek)
      .reduce((sum, t) => sum + t.amount, 0);

    return { 
      total, 
      thisMonth: thisMonthRevenue, 
      thisWeek: thisWeekRevenue 
    };
  };

  return {
    transactions,
    loading,
    getRevenueStats,
    refetch: fetchTransactions
  };
};
