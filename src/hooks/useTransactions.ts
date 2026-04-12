import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

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
      console.log('📊 Fetching transactions... isAdmin:', isAdmin, 'user:', user.id);
      
      let query = supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

      // Filter for non-admin users
      if (!isAdmin) {
        query = query.eq('user_id', user.id);
      }

      const { data, error } = await query;

      if (error) throw error;

      console.log('📊 Found transactions:', data?.length || 0);
      setTransactions((data as Transaction[]) || []);
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

      // Subscribe to real-time changes
      const channel = supabase
        .channel('transactions-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'transactions',
          },
          (payload: RealtimePostgresChangesPayload<Transaction>) => {
            console.log('🔄 Transaction change detected:', payload);
            fetchTransactions();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
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
