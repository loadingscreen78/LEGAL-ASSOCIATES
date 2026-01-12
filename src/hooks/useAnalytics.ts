import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where,
  getDocs,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';

export interface DashboardStats {
  totalBooks: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  pendingOrders: number;
  lowStockCount: number;
  todayOrders: number;
  todayRevenue: number;
  monthlyRevenue: number;
}

export interface BestSellingProduct {
  id: string;
  title: string;
  category: string;
  totalSold: number;
  revenue: number;
}

export interface CategoryStats {
  category: string;
  productCount: number;
  totalSales: number;
  revenue: number;
}

export const useAnalytics = () => {
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalBooks: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    lowStockCount: 0,
    todayOrders: 0,
    todayRevenue: 0,
    monthlyRevenue: 0,
  });
  const [bestSelling, setBestSelling] = useState<BestSellingProduct[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDashboardStats = async () => {
    if (!isAdmin) return;

    setLoading(true);
    try {
      // Get total books
      const productsSnapshot = await getDocs(collection(db, 'products'));
      const totalBooks = productsSnapshot.size;

      // Get total orders
      const ordersSnapshot = await getDocs(collection(db, 'orders'));
      const totalOrders = ordersSnapshot.size;

      // Get total users
      const usersSnapshot = await getDocs(collection(db, 'profiles'));
      const totalUsers = usersSnapshot.size;

      // Get pending orders
      const pendingQuery = query(
        collection(db, 'orders'),
        where('status', '==', 'pending')
      );
      const pendingSnapshot = await getDocs(pendingQuery);
      const pendingOrders = pendingSnapshot.size;

      // Get low stock products
      const lowStockQuery = query(
        collection(db, 'products'),
        where('stock', '<=', 10)
      );
      const lowStockSnapshot = await getDocs(lowStockQuery);
      const lowStockCount = lowStockSnapshot.size;

      // Calculate revenue from successful transactions
      const transactionsQuery = query(
        collection(db, 'transactions'),
        where('status', '==', 'success')
      );
      const transactionsSnapshot = await getDocs(transactionsQuery);
      const totalRevenue = transactionsSnapshot.docs.reduce(
        (sum, doc) => sum + (doc.data().amount || 0),
        0
      );

      // Today's stats
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayISO = today.toISOString();

      const todayOrdersQuery = query(
        collection(db, 'orders'),
        where('created_at', '>=', todayISO)
      );
      const todayOrdersSnapshot = await getDocs(todayOrdersQuery);
      const todayOrders = todayOrdersSnapshot.size;

      const todayTransactionsQuery = query(
        collection(db, 'transactions'),
        where('status', '==', 'success'),
        where('created_at', '>=', todayISO)
      );
      const todayTransactionsSnapshot = await getDocs(todayTransactionsQuery);
      const todayRevenue = todayTransactionsSnapshot.docs.reduce(
        (sum, doc) => sum + (doc.data().amount || 0),
        0
      );

      // Monthly revenue
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const monthlyTransactionsQuery = query(
        collection(db, 'transactions'),
        where('status', '==', 'success'),
        where('created_at', '>=', firstDayOfMonth.toISOString())
      );
      const monthlyTransactionsSnapshot = await getDocs(monthlyTransactionsQuery);
      const monthlyRevenue = monthlyTransactionsSnapshot.docs.reduce(
        (sum, doc) => sum + (doc.data().amount || 0),
        0
      );

      setStats({
        totalBooks,
        totalOrders,
        totalUsers,
        totalRevenue,
        pendingOrders,
        lowStockCount,
        todayOrders,
        todayRevenue,
        monthlyRevenue,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBestSellingProducts = async () => {
    if (!isAdmin) return;

    try {
      // Get all order items
      const orderItemsSnapshot = await getDocs(collection(db, 'order_items'));
      
      // Aggregate by product
      const productSales: { [key: string]: { title: string; category: string; quantity: number; revenue: number } } = {};
      
      orderItemsSnapshot.docs.forEach(doc => {
        const data = doc.data();
        const productId = data.product_id;
        
        if (!productSales[productId]) {
          productSales[productId] = {
            title: data.product_title,
            category: data.product_category || 'Unknown',
            quantity: 0,
            revenue: 0,
          };
        }
        
        productSales[productId].quantity += data.quantity || 0;
        productSales[productId].revenue += data.total_price || 0;
      });

      // Convert to array and sort
      const bestSellingData = Object.entries(productSales)
        .map(([id, data]) => ({
          id,
          title: data.title,
          category: data.category,
          totalSold: data.quantity,
          revenue: data.revenue,
        }))
        .sort((a, b) => b.totalSold - a.totalSold)
        .slice(0, 10);

      setBestSelling(bestSellingData);
    } catch (error) {
      console.error('Error fetching best selling products:', error);
    }
  };

  const fetchCategoryStats = async () => {
    if (!isAdmin) return;

    try {
      const productsSnapshot = await getDocs(collection(db, 'products'));
      const orderItemsSnapshot = await getDocs(collection(db, 'order_items'));

      const categoryData: { [key: string]: { productCount: number; totalSales: number; revenue: number } } = {};

      // Count products per category
      productsSnapshot.docs.forEach(doc => {
        const category = doc.data().category || 'Unknown';
        if (!categoryData[category]) {
          categoryData[category] = { productCount: 0, totalSales: 0, revenue: 0 };
        }
        categoryData[category].productCount++;
      });

      // Aggregate sales per category
      orderItemsSnapshot.docs.forEach(doc => {
        const data = doc.data();
        const category = data.product_category || 'Unknown';
        
        if (!categoryData[category]) {
          categoryData[category] = { productCount: 0, totalSales: 0, revenue: 0 };
        }
        
        categoryData[category].totalSales += data.quantity || 0;
        categoryData[category].revenue += data.total_price || 0;
      });

      const categoryStatsData = Object.entries(categoryData).map(([category, data]) => ({
        category,
        ...data,
      }));

      setCategoryStats(categoryStatsData);
    } catch (error) {
      console.error('Error fetching category stats:', error);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchDashboardStats();
      fetchBestSellingProducts();
      fetchCategoryStats();
    }
  }, [isAdmin]);

  return {
    stats,
    bestSelling,
    categoryStats,
    loading,
    refetch: fetchDashboardStats,
  };
};
