import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Order, Transaction } from '@/types/database';
import { useAuth } from '@/contexts/AuthContext';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

export const useOrders = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    if (!user) {
      console.log('📦 No user, skipping fetch');
      setOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      console.log('📦 Fetching orders... isAdmin:', isAdmin, 'user:', user.id);
      
      let query = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      // Filter for non-admin users
      if (!isAdmin) {
        query = query.eq('user_id', user.id);
      }

      const { data, error } = await query;

      if (error) throw error;

      console.log('📦 Found orders:', data?.length || 0);
      setOrders((data as Order[]) || []);
    } catch (error) {
      console.error('❌ Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (orderData: {
    items: Array<{
      product_id: string;
      product_title: string;
      product_category: string;
      quantity: number;
      unit_price: number;
      total_price: number;
    }>;
    total_amount: number;
    shipping_address: {
      full_name: string;
      phone: string;
      address: string;
      pincode: string;
    };
    payment_method: string;
  }) => {
    if (!user) throw new Error('User not authenticated');

    try {
      // Generate order number
      const orderNumber = `ORD-${Date.now()}`;
      
      // Create order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          order_number: orderNumber,
          status: 'pending',
          total_amount: orderData.total_amount,
          shipping_address: orderData.shipping_address,
          payment_status: 'pending',
          payment_method: orderData.payment_method,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = orderData.items.map(item => ({
        order_id: orderData.id,
        ...item,
        created_at: new Date().toISOString(),
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Refresh orders
      await fetchOrders();

      return { id: orderData.id, order_number: orderNumber };
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    if (!isAdmin) throw new Error('Admin access required');

    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId);

      if (error) throw error;

      // Refresh orders
      await fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  };

  const updateEstimatedDelivery = async (orderId: string, estimatedDays: number) => {
    if (!isAdmin) throw new Error('Admin access required');

    try {
      const estimatedDeliveryDate = new Date();
      estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + estimatedDays);
      
      const { error } = await supabase
        .from('orders')
        .update({ 
          estimated_days: estimatedDays,
          estimated_delivery_date: estimatedDeliveryDate.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId);

      if (error) throw error;

      // Refresh orders
      await fetchOrders();
    } catch (error) {
      console.error('Error updating estimated delivery:', error);
      throw error;
    }
  };

  const createTransaction = async (transactionData: {
    order_id: string;
    transaction_id?: string;
    amount: number;
    status: Transaction['status'];
    payment_method?: string;
    gateway_response?: Record<string, any>;
  }) => {
    try {
      // Create transaction
      const { data: transaction, error: transactionError } = await supabase
        .from('transactions')
        .insert({
          ...transactionData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (transactionError) throw transactionError;

      // Update order payment status
      const { error: orderError } = await supabase
        .from('orders')
        .update({ 
          payment_status: transactionData.status === 'success' ? 'paid' : 'failed',
          updated_at: new Date().toISOString(),
        })
        .eq('id', transactionData.order_id);

      if (orderError) throw orderError;

      // Refresh orders
      await fetchOrders();

      return transaction;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  };

  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) {
      return;
    }
    
    if (user) {
      fetchOrders();

      // Subscribe to real-time changes
      const channel = supabase
        .channel('orders-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'orders',
          },
          (payload: RealtimePostgresChangesPayload<Order>) => {
            console.log('🔄 Order change detected:', payload);
            fetchOrders();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      setOrders([]);
      setLoading(false);
    }
  }, [user, isAdmin, authLoading]);

  return {
    orders,
    loading,
    createOrder,
    updateOrderStatus,
    updateEstimatedDelivery,
    createTransaction,
    refetch: fetchOrders,
  };
};
