import React, { useState, useEffect } from 'react';
import { 
  Package, 
  ShoppingCart, 
  CreditCard, 
  TrendingUp, 
  AlertCircle, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  Eye,
  MoreHorizontal,
  Sparkles,
  Activity,
  BarChart3,
  Calendar,
  RefreshCw
} from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useOrders } from '@/hooks/useOrders';
import { useTransactions } from '@/hooks/useTransactions';
import { useNavigate } from 'react-router-dom';

export const AdminOverview = () => {
  const { products } = useProducts();
  const { orders } = useOrders();
  const { transactions, getRevenueStats } = useTransactions();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [animatedValues, setAnimatedValues] = useState({ products: 0, orders: 0, revenue: 0, weekRevenue: 0 });

  const revenueStats = getRevenueStats();
  
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const confirmedOrders = orders.filter(order => order.status === 'confirmed').length;
  const shippedOrders = orders.filter(order => order.status === 'shipped').length;
  const deliveredOrders = orders.filter(order => order.status === 'delivered').length;
  const lowStockProducts = products.filter(product => product.stock < 10).length;
  const totalProducts = products.length;
  const totalOrders = orders.length;

  const recentOrders = orders.slice(0, 6);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Animate numbers on load
  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const interval = duration / steps;
    
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      setAnimatedValues({
        products: Math.round(totalProducts * easeOut),
        orders: Math.round(totalOrders * easeOut),
        revenue: Math.round(revenueStats.total * easeOut),
        weekRevenue: Math.round(revenueStats.thisWeek * easeOut),
      });
      
      if (step >= steps) clearInterval(timer);
    }, interval);
    
    return () => clearInterval(timer);
  }, [totalProducts, totalOrders, revenueStats.total, revenueStats.thisWeek]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'confirmed': return <CheckCircle2 className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'delivered': return <CheckCircle2 className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending': return { bg: '#FEF3C7', color: '#D97706', border: '#FDE68A' };
      case 'confirmed': return { bg: '#DBEAFE', color: '#2563EB', border: '#BFDBFE' };
      case 'shipped': return { bg: '#F3E8FF', color: '#9333EA', border: '#E9D5FF' };
      case 'delivered': return { bg: '#D1FAE5', color: '#059669', border: '#A7F3D0' };
      case 'cancelled': return { bg: '#FEE2E2', color: '#DC2626', border: '#FECACA' };
      default: return { bg: '#F3F4F6', color: '#6B7280', border: '#E5E7EB' };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  const greeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="space-y-6 pb-8" style={{ background: '#F8FAFC' }}>
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl p-8" style={{ 
        background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05), 0 10px 40px rgba(0, 0, 0, 0.03)',
        border: '1px solid #E2E8F0'
      }}>
        {/* Subtle Background Pattern */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-5" style={{ background: 'radial-gradient(circle, #D4AF37 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-5" style={{ background: 'radial-gradient(circle, #2D3E50 0%, transparent 70%)' }} />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: '#FEF3C7', border: '1px solid #FDE68A' }}>
                <Sparkles className="w-4 h-4" style={{ color: '#D97706' }} />
                <span className="text-sm font-semibold" style={{ color: '#D97706' }}>Admin Portal</span>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#1E293B' }}>
              {greeting()}, Admin! 👋
            </h1>
            <p className="text-lg" style={{ color: '#64748B' }}>
              Here's what's happening with your legal publications business today.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right px-4 py-3 rounded-xl" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
              <p className="text-xs font-medium mb-1" style={{ color: '#64748B' }}>Today's Date</p>
              <p className="font-semibold flex items-center gap-2" style={{ color: '#1E293B' }}>
                <Calendar className="w-4 h-4" style={{ color: '#D4AF37' }} />
                {currentTime.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Products Card */}
        <div className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer" 
          style={{ 
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
          }}
          onClick={() => navigate('/admin-dashboard/products')}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#FEF3C7' }}>
              <Package className="w-6 h-6" style={{ color: '#D97706' }} />
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold" style={{ background: '#D1FAE5', color: '#059669' }}>
              <ArrowUpRight className="w-3 h-3" />
              Active
            </div>
          </div>
          <p className="text-sm font-medium mb-1" style={{ color: '#64748B' }}>Total Products</p>
          <p className="text-3xl font-bold mb-2" style={{ color: '#1E293B' }}>{animatedValues.products}</p>
          <p className="text-sm font-medium" style={{ color: lowStockProducts > 0 ? '#D97706' : '#059669' }}>
            {lowStockProducts > 0 ? `⚠️ ${lowStockProducts} low stock` : '✓ All stocked'}
          </p>
        </div>

        {/* Total Orders Card */}
        <div className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer" 
          style={{ 
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
          }}
          onClick={() => navigate('/admin-dashboard/orders')}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#DBEAFE' }}>
              <ShoppingCart className="w-6 h-6" style={{ color: '#2563EB' }} />
            </div>
            {pendingOrders > 0 && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold animate-pulse" style={{ background: '#FEF3C7', color: '#D97706' }}>
                <Clock className="w-3 h-3" />
                {pendingOrders} pending
              </div>
            )}
          </div>
          <p className="text-sm font-medium mb-1" style={{ color: '#64748B' }}>Total Orders</p>
          <p className="text-3xl font-bold mb-2" style={{ color: '#1E293B' }}>{animatedValues.orders}</p>
          <div className="flex items-center gap-3 text-xs font-medium">
            <span style={{ color: '#059669' }}>✓ {deliveredOrders} delivered</span>
            <span style={{ color: '#9333EA' }}>🚚 {shippedOrders} shipped</span>
          </div>
        </div>

        {/* Total Revenue Card */}
        <div className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer" 
          style={{ 
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
          }}
          onClick={() => navigate('/admin-dashboard/transactions')}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#D1FAE5' }}>
              <CreditCard className="w-6 h-6" style={{ color: '#059669' }} />
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold" style={{ background: '#D1FAE5', color: '#059669' }}>
              <TrendingUp className="w-3 h-3" />
              +12%
            </div>
          </div>
          <p className="text-sm font-medium mb-1" style={{ color: '#64748B' }}>Total Revenue</p>
          <p className="text-3xl font-bold mb-2" style={{ color: '#1E293B' }}>₹{animatedValues.revenue.toLocaleString()}</p>
          <p className="text-sm font-medium" style={{ color: '#64748B' }}>
            ₹{revenueStats.thisMonth.toLocaleString()} this month
          </p>
        </div>

        {/* This Week Revenue Card */}
        <div className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl" 
          style={{ 
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#F3E8FF' }}>
              <BarChart3 className="w-6 h-6" style={{ color: '#9333EA' }} />
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold" style={{ background: '#F3E8FF', color: '#9333EA' }}>
              <Activity className="w-3 h-3" />
              Live
            </div>
          </div>
          <p className="text-sm font-medium mb-1" style={{ color: '#64748B' }}>This Week</p>
          <p className="text-3xl font-bold mb-2" style={{ color: '#1E293B' }}>₹{animatedValues.weekRevenue.toLocaleString()}</p>
          <p className="text-sm font-medium" style={{ color: '#64748B' }}>Last 7 days performance</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders - Takes 2 columns */}
        <div className="lg:col-span-2 rounded-2xl overflow-hidden" style={{ 
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
        }}>
          <div className="p-6 border-b" style={{ borderColor: '#E2E8F0' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#DBEAFE' }}>
                  <ShoppingCart className="w-5 h-5" style={{ color: '#2563EB' }} />
                </div>
                <div>
                  <h3 className="text-xl font-bold" style={{ color: '#1E293B' }}>Recent Orders</h3>
                  <p className="text-sm" style={{ color: '#64748B' }}>Latest customer orders</p>
                </div>
              </div>
              <button 
                onClick={() => navigate('/admin-dashboard/orders')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105"
                style={{ background: '#F8FAFC', color: '#2563EB', border: '1px solid #DBEAFE' }}
              >
                View All
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {recentOrders.length > 0 ? (
              <div className="space-y-3">
                {recentOrders.map((order, index) => {
                  const statusStyle = getStatusStyle(order.status);
                  return (
                    <div 
                      key={order.id}
                      className="group relative overflow-hidden rounded-xl p-4 transition-all duration-300 hover:scale-[1.01] cursor-pointer"
                      style={{ 
                        background: '#F8FAFC',
                        border: '1px solid #E2E8F0'
                      }}
                      onClick={() => navigate('/admin-dashboard/orders')}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: statusStyle.bg, border: `1px solid ${statusStyle.border}` }}>
                            <div style={{ color: statusStyle.color }}>
                              {getStatusIcon(order.status)}
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold text-sm" style={{ color: '#1E293B' }}>#{order.order_number}</p>
                              <span className="px-2 py-0.5 rounded-full text-xs font-semibold capitalize" style={{ background: statusStyle.bg, color: statusStyle.color, border: `1px solid ${statusStyle.border}` }}>
                                {order.status}
                              </span>
                            </div>
                            <p className="text-xs truncate" style={{ color: '#64748B' }}>
                              {order.shipping_address.full_name} • {formatDate(order.created_at)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-right flex-shrink-0">
                          <p className="text-lg font-bold" style={{ color: '#1E293B' }}>₹{order.total_amount.toFixed(2)}</p>
                          <p className="text-xs capitalize font-medium" style={{ color: order.payment_status === 'paid' ? '#059669' : '#D97706' }}>
                            {order.payment_status}
                          </p>
                        </div>
                        
                        <button className="w-8 h-8 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300" style={{ background: '#DBEAFE' }}>
                          <Eye className="w-4 h-4" style={{ color: '#2563EB' }} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: '#F8FAFC' }}>
                  <ShoppingCart className="w-8 h-8" style={{ color: '#CBD5E1' }} />
                </div>
                <p className="text-sm font-medium" style={{ color: '#64748B' }}>No orders yet</p>
                <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>Orders will appear here once customers start purchasing</p>
              </div>
            )}
          </div>
        </div>

        {/* Alerts & Quick Stats - Takes 1 column */}
        <div className="space-y-6">
          {/* Alerts Card */}
          <div className="rounded-2xl overflow-hidden" style={{ 
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
          }}>
            <div className="p-6 border-b" style={{ borderColor: '#E2E8F0' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#FEE2E2' }}>
                  <AlertCircle className="w-5 h-5" style={{ color: '#DC2626' }} />
                </div>
                <div>
                  <h3 className="text-lg font-bold" style={{ color: '#1E293B' }}>Alerts</h3>
                  <p className="text-xs" style={{ color: '#64748B' }}>Requires attention</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-3">
              {lowStockProducts > 0 && (
                <div className="rounded-xl p-4 transition-all duration-300 hover:scale-[1.02]" style={{ background: '#FEF3C7', border: '1px solid #FDE68A' }}>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#FDE68A' }}>
                      <Package className="w-4 h-4" style={{ color: '#D97706' }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold mb-1" style={{ color: '#D97706' }}>
                        Low Stock Alert
                      </p>
                      <p className="text-xs" style={{ color: '#92400E' }}>
                        {lowStockProducts} {lowStockProducts === 1 ? 'product has' : 'products have'} low stock (below 10 units)
                      </p>
                      <button 
                        onClick={() => navigate('/admin-dashboard/products')}
                        className="mt-2 text-xs font-semibold flex items-center gap-1 transition-all duration-300 hover:gap-2"
                        style={{ color: '#D97706' }}
                      >
                        View Products <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {pendingOrders > 0 && (
                <div className="rounded-xl p-4 transition-all duration-300 hover:scale-[1.02]" style={{ background: '#DBEAFE', border: '1px solid #BFDBFE' }}>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 animate-pulse" style={{ background: '#BFDBFE' }}>
                      <Clock className="w-4 h-4" style={{ color: '#2563EB' }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold mb-1" style={{ color: '#2563EB' }}>
                        Pending Orders
                      </p>
                      <p className="text-xs" style={{ color: '#1E40AF' }}>
                        {pendingOrders} {pendingOrders === 1 ? 'order is' : 'orders are'} waiting for confirmation
                      </p>
                      <button 
                        onClick={() => navigate('/admin-dashboard/orders')}
                        className="mt-2 text-xs font-semibold flex items-center gap-1 transition-all duration-300 hover:gap-2"
                        style={{ color: '#2563EB' }}
                      >
                        Process Orders <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {lowStockProducts === 0 && pendingOrders === 0 && (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: '#D1FAE5' }}>
                    <CheckCircle2 className="w-6 h-6" style={{ color: '#059669' }} />
                  </div>
                  <p className="text-sm font-semibold" style={{ color: '#1E293B' }}>All Clear!</p>
                  <p className="text-xs mt-1" style={{ color: '#64748B' }}>No active alerts at the moment</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats Card */}
          <div className="rounded-2xl overflow-hidden" style={{ 
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
          }}>
            <div className="p-6 border-b" style={{ borderColor: '#E2E8F0' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#F3E8FF' }}>
                  <Activity className="w-5 h-5" style={{ color: '#9333EA' }} />
                </div>
                <div>
                  <h3 className="text-lg font-bold" style={{ color: '#1E293B' }}>Quick Stats</h3>
                  <p className="text-xs" style={{ color: '#64748B' }}>Performance metrics</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: '#F8FAFC' }}>
                <span className="text-sm font-medium" style={{ color: '#64748B' }}>Avg Order Value</span>
                <span className="text-lg font-bold" style={{ color: '#1E293B' }}>
                  ₹{totalOrders > 0 ? ((revenueStats.total / totalOrders).toFixed(2)) : '0.00'}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: '#F8FAFC' }}>
                <span className="text-sm font-medium" style={{ color: '#64748B' }}>Completion Rate</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 rounded-full overflow-hidden" style={{ background: '#E2E8F0' }}>
                    <div 
                      className="h-full rounded-full transition-all duration-1000" 
                      style={{ 
                        width: `${totalOrders > 0 ? ((deliveredOrders / totalOrders) * 100) : 0}%`,
                        background: 'linear-gradient(90deg, #059669, #10B981)'
                      }} 
                    />
                  </div>
                  <span className="text-lg font-bold" style={{ color: '#059669' }}>
                    {totalOrders > 0 ? ((deliveredOrders / totalOrders) * 100).toFixed(0) : '0'}%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: '#F8FAFC' }}>
                <span className="text-sm font-medium" style={{ color: '#64748B' }}>Active Products</span>
                <span className="text-lg font-bold" style={{ color: '#1E293B' }}>
                  {products.filter(p => p.is_active).length}/{totalProducts}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: '#F8FAFC' }}>
                <span className="text-sm font-medium" style={{ color: '#64748B' }}>In Transit</span>
                <span className="text-lg font-bold" style={{ color: '#9333EA' }}>
                  {shippedOrders}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Status Distribution */}
      <div className="rounded-2xl overflow-hidden" style={{ 
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
      }}>
        <div className="p-6 border-b" style={{ borderColor: '#E2E8F0' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#FEF3C7' }}>
              <BarChart3 className="w-5 h-5" style={{ color: '#D97706' }} />
            </div>
            <div>
              <h3 className="text-xl font-bold" style={{ color: '#1E293B' }}>Order Status Distribution</h3>
              <p className="text-sm" style={{ color: '#64748B' }}>Current order pipeline</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: 'Pending', count: pendingOrders, color: '#D97706', bg: '#FEF3C7', icon: Clock },
              { label: 'Confirmed', count: confirmedOrders, color: '#2563EB', bg: '#DBEAFE', icon: CheckCircle2 },
              { label: 'Shipped', count: shippedOrders, color: '#9333EA', bg: '#F3E8FF', icon: Truck },
              { label: 'Delivered', count: deliveredOrders, color: '#059669', bg: '#D1FAE5', icon: CheckCircle2 },
              { label: 'Total', count: totalOrders, color: '#D4AF37', bg: '#FEF3C7', icon: ShoppingCart },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={index}
                  className="relative overflow-hidden rounded-xl p-4 transition-all duration-300 hover:scale-105 cursor-pointer"
                  style={{ background: stat.bg, border: '1px solid #E2E8F0' }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#FFFFFF' }}>
                      <Icon className="w-4 h-4" style={{ color: stat.color }} />
                    </div>
                  </div>
                  <p className="text-2xl font-bold mb-1" style={{ color: stat.color }}>{stat.count}</p>
                  <p className="text-xs font-medium" style={{ color: stat.color }}>{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
