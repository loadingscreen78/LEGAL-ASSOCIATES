import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where,
  orderBy, 
  getDocs, 
  updateDoc, 
  doc,
  onSnapshot,
  writeBatch
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Product } from './useProducts';

export interface InventoryAlert {
  id: string;
  product_id: string;
  product_title: string;
  current_stock: number;
  threshold: number;
  alert_type: 'low_stock' | 'out_of_stock';
  is_resolved: boolean;
  created_at: string;
}

export const useInventory = () => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [alerts, setAlerts] = useState<InventoryAlert[]>([]);
  const [loading, setLoading] = useState(false);

  const LOW_STOCK_THRESHOLD = 10;

  const fetchLowStockProducts = async () => {
    if (!isAdmin) return;

    setLoading(true);
    try {
      const q = query(
        collection(db, 'products'),
        where('stock', '<=', LOW_STOCK_THRESHOLD),
        orderBy('stock', 'asc')
      );

      const querySnapshot = await getDocs(q);
      const productsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      
      setLowStockProducts(productsData);
    } catch (error: any) {
      console.error('Error fetching low stock products:', error);
      toast({
        title: "Error",
        description: "Failed to fetch inventory alerts.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (productId: string, newStock: number) => {
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only admins can update inventory.",
        variant: "destructive",
      });
      return { error: new Error('Access denied') };
    }

    try {
      const productRef = doc(db, 'products', productId);
      await updateDoc(productRef, {
        stock: newStock,
        updated_at: new Date().toISOString(),
      });

      toast({
        title: "Success",
        description: "Stock updated successfully!",
      });

      await fetchLowStockProducts();
      return { error: null };
    } catch (error: any) {
      console.error('Error updating stock:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update stock.",
        variant: "destructive",
      });
      return { error };
    }
  };

  const bulkUpdateStock = async (updates: Array<{ productId: string; stock: number }>) => {
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only admins can update inventory.",
        variant: "destructive",
      });
      return { error: new Error('Access denied') };
    }

    try {
      const batch = writeBatch(db);

      updates.forEach(({ productId, stock }) => {
        const productRef = doc(db, 'products', productId);
        batch.update(productRef, {
          stock,
          updated_at: new Date().toISOString(),
        });
      });

      await batch.commit();

      toast({
        title: "Success",
        description: `${updates.length} products updated successfully!`,
      });

      await fetchLowStockProducts();
      return { error: null };
    } catch (error: any) {
      console.error('Error bulk updating stock:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update stock.",
        variant: "destructive",
      });
      return { error };
    }
  };

  const deductStock = async (productId: string, quantity: number) => {
    try {
      const productRef = doc(db, 'products', productId);
      const productSnap = await getDocs(query(collection(db, 'products'), where('__name__', '==', productId)));
      
      if (!productSnap.empty) {
        const currentStock = productSnap.docs[0].data().stock;
        const newStock = Math.max(0, currentStock - quantity);
        
        await updateDoc(productRef, {
          stock: newStock,
          updated_at: new Date().toISOString(),
        });

        return { error: null };
      }
    } catch (error: any) {
      console.error('Error deducting stock:', error);
      return { error };
    }
  };

  const getInventoryStats = () => {
    const totalLowStock = lowStockProducts.length;
    const outOfStock = lowStockProducts.filter(p => p.stock === 0).length;
    const criticalStock = lowStockProducts.filter(p => p.stock > 0 && p.stock <= 5).length;

    return {
      totalLowStock,
      outOfStock,
      criticalStock,
    };
  };

  // Real-time listener for low stock products
  useEffect(() => {
    if (!isAdmin) return;

    fetchLowStockProducts();

    const q = query(
      collection(db, 'products'),
      where('stock', '<=', LOW_STOCK_THRESHOLD),
      orderBy('stock', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setLowStockProducts(productsData);
    });

    return () => unsubscribe();
  }, [isAdmin]);

  return {
    lowStockProducts,
    alerts,
    loading,
    updateStock,
    bulkUpdateStock,
    deductStock,
    getInventoryStats,
    refetch: fetchLowStockProducts,
  };
};
