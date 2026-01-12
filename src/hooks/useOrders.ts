import { useState, useEffect } from 'react';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  doc,
  onSnapshot,
  writeBatch
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Order, Transaction } from '@/types/database';
import { useAuth } from '@/contexts/AuthContext';

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
      console.log('📦 Fetching orders... isAdmin:', isAdmin, 'user:', user.uid);
      let ordersData: Order[] = [];

      // Get all orders (we'll filter client-side if needed)
      const querySnapshot = await getDocs(collection(db, 'orders'));
      console.log('📦 Found orders:', querySnapshot.size);
      
      ordersData = querySnapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      })) as Order[];
      
      // Filter for non-admin users
      if (!isAdmin) {
        ordersData = ordersData.filter(order => order.user_id === user.uid);
        console.log('📦 Filtered orders for user:', ordersData.length);
      }
      
      // Sort by created_at descending
      ordersData.sort((a, b) => {
        const dateA = new Date(a.created_at || 0).getTime();
        const dateB = new Date(b.created_at || 0).getTime();
        return dateB - dateA;
      });

      console.log('📦 Final orders data:', ordersData);
      setOrders(ordersData);
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
      const batch = writeBatch(db);
      
      // Generate order number
      const orderNumber = `ORD-${Date.now()}`;
      
      // Create order
      const orderRef = doc(collection(db, 'orders'));
      batch.set(orderRef, {
        user_id: user.uid,
        order_number: orderNumber,
        status: 'pending',
        total_amount: orderData.total_amount,
        shipping_address: orderData.shipping_address,
        payment_status: 'pending',
        payment_method: orderData.payment_method,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      // Create order items
      orderData.items.forEach((item) => {
        const itemRef = doc(collection(db, 'order_items'));
        batch.set(itemRef, {
          order_id: orderRef.id,
          ...item,
          created_at: new Date().toISOString(),
        });
      });

      await batch.commit();

      // Refresh orders
      await fetchOrders();

      return { id: orderRef.id, order_number: orderNumber };
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    if (!isAdmin) throw new Error('Admin access required');

    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { 
        status,
        updated_at: new Date().toISOString(),
      });

      // Refresh orders
      await fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
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
      const transactionRef = await addDoc(collection(db, 'transactions'), {
        ...transactionData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      // Update order payment status
      const orderRef = doc(db, 'orders', transactionData.order_id);
      await updateDoc(orderRef, { 
        payment_status: transactionData.status === 'success' ? 'paid' : 'failed',
        updated_at: new Date().toISOString(),
      });

      // Refresh orders
      await fetchOrders();

      return { id: transactionRef.id, ...transactionData };
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

      // Simple subscription without compound index
      const unsubscribe = onSnapshot(collection(db, 'orders'), () => {
        fetchOrders();
      });

      return () => unsubscribe();
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
    createTransaction,
    refetch: fetchOrders,
  };
};
