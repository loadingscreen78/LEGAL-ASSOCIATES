import React, { useState, useEffect } from 'react';
import { Search, Package, User, Calendar, Eye, Clock, Truck, Timer, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useOrders } from '@/hooks/useOrders';
import { useToast } from '@/hooks/use-toast';

// Countdown Timer Component
const CountdownTimer = ({ targetDate, status }: { targetDate: string; status: string }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: false });

  useEffect(() => {
    if (status === 'delivered' || status === 'cancelled') {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true });
      return;
    }

    const calculateTimeLeft = () => {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
        expired: false
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [targetDate, status]);

  if (status === 'delivered') {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: '#D1FAE5' }}>
        <CheckCircle className="w-4 h-4" style={{ color: '#059669' }} />
        <span className="text-sm font-semibold" style={{ color: '#059669' }}>Delivered</span>
      </div>
    );
  }

  if (status === 'cancelled') {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: '#FEE2E2' }}>
        <AlertCircle className="w-4 h-4" style={{ color: '#DC2626' }} />
        <span className="text-sm font-semibold" style={{ color: '#DC2626' }}>Cancelled</span>
      </div>
    );
  }

  if (timeLeft.expired) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: '#FEF3C7' }}>
        <AlertCircle className="w-4 h-4" style={{ color: '#D97706' }} />
        <span className="text-sm font-semibold" style={{ color: '#D97706' }}>Overdue</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-1 px-2 py-1 rounded-lg text-center" style={{ background: '#DBEAFE' }}>
        <span className="text-lg font-bold" style={{ color: '#1E40AF' }}>{timeLeft.days}</span>
        <span className="text-xs" style={{ color: '#3B82F6' }}>d</span>
      </div>
      <span style={{ color: '#94A3B8' }}>:</span>
      <div className="flex items-center gap-1 px-2 py-1 rounded-lg text-center" style={{ background: '#DBEAFE' }}>
        <span className="text-lg font-bold" style={{ color: '#1E40AF' }}>{String(timeLeft.hours).padStart(2, '0')}</span>
        <span className="text-xs" style={{ color: '#3B82F6' }}>h</span>
      </div>
      <span style={{ color: '#94A3B8' }}>:</span>
      <div className="flex items-center gap-1 px-2 py-1 rounded-lg text-center" style={{ background: '#DBEAFE' }}>
        <span className="text-lg font-bold" style={{ color: '#1E40AF' }}>{String(timeLeft.minutes).padStart(2, '0')}</span>
        <span className="text-xs" style={{ color: '#3B82F6' }}>m</span>
      </div>
      <span style={{ color: '#94A3B8' }}>:</span>
      <div className="flex items-center gap-1 px-2 py-1 rounded-lg text-center animate-pulse" style={{ background: '#FEE2E2' }}>
        <span className="text-lg font-bold" style={{ color: '#DC2626' }}>{String(timeLeft.seconds).padStart(2, '0')}</span>
        <span className="text-xs" style={{ color: '#EF4444' }}>s</span>
      </div>
    </div>
  );
};

export const OrderManager = () => {
  const { orders, loading, updateOrderStatus, updateEstimatedDelivery } = useOrders();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [editingDelivery, setEditingDelivery] = useState<string | null>(null);
  const [estimatedDays, setEstimatedDays] = useState<number>(3);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shipping_address?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus as any);
      toast({
        title: "Status Updated",
        description: `Order status changed to ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive"
      });
    }
  };

  const handleEstimatedDeliveryUpdate = async (orderId: string) => {
    try {
      await updateEstimatedDelivery(orderId, estimatedDays);
      setEditingDelivery(null);
      toast({
        title: "Delivery Time Set",
        description: `Estimated delivery set to ${estimatedDays} days`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update estimated delivery",
        variant: "destructive"
      });
    }
  };

  const viewOrderDetails = (order: any) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return { bg: '#FEF3C7', color: '#D97706', border: '#FDE68A' };
      case 'confirmed': return { bg: '#DBEAFE', color: '#2563EB', border: '#BFDBFE' };
      case 'processing': return { bg: '#F3E8FF', color: '#9333EA', border: '#E9D5FF' };
      case 'shipped': return { bg: '#FED7AA', color: '#EA580C', border: '#FDBA74' };
      case 'delivered': return { bg: '#D1FAE5', color: '#059669', border: '#A7F3D0' };
      case 'cancelled': return { bg: '#FEE2E2', color: '#DC2626', border: '#FECACA' };
      default: return { bg: '#F3F4F6', color: '#6B7280', border: '#E5E7EB' };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full mx-auto mb-4 animate-spin" style={{ border: '4px solid #D4AF37', borderTopColor: 'transparent' }} />
          <p style={{ color: '#64748B' }}>Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold" style={{ color: '#1E293B' }}>Order Management</h2>
          <p style={{ color: '#64748B' }}>Track and manage customer orders with delivery estimates</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
          <Package className="w-5 h-5" style={{ color: '#D4AF37' }} />
          <span className="font-bold" style={{ color: '#1E293B' }}>{orders.length}</span>
          <span style={{ color: '#64748B' }}>Total Orders</span>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl p-6" style={{ background: '#FFFFFF', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0' }}>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#94A3B8' }} />
            <input
              type="text"
              placeholder="Search by order number or customer name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500"
              style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#1E293B' }}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] h-12 rounded-xl" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length > 0 ? (
        <div className="rounded-2xl overflow-hidden" style={{ background: '#FFFFFF', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0' }}>
          <div className="p-6 border-b" style={{ borderColor: '#E2E8F0' }}>
            <h3 className="text-xl font-bold flex items-center gap-2" style={{ color: '#1E293B' }}>
              <Truck className="w-5 h-5" style={{ color: '#D4AF37' }} />
              Orders ({filteredOrders.length})
            </h3>
          </div>
          
          <div className="divide-y" style={{ borderColor: '#E2E8F0' }}>
            {filteredOrders.map((order) => {
              const statusStyle = getStatusColor(order.status);
              const hasEstimatedDelivery = order.estimated_delivery_date;
              
              return (
                <div key={order.id} className="p-6 transition-all duration-300 hover:bg-slate-50">
                  {/* Order Header */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: statusStyle.bg }}>
                        <Package className="w-6 h-6" style={{ color: statusStyle.color }} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-lg" style={{ color: '#1E293B' }}>#{order.order_number}</h4>
                          <span 
                            className="px-3 py-1 rounded-full text-xs font-bold uppercase"
                            style={{ background: statusStyle.bg, color: statusStyle.color, border: `1px solid ${statusStyle.border}` }}
                          >
                            {order.status}
                          </span>
                        </div>
                        <p className="text-sm" style={{ color: '#64748B' }}>
                          {new Date(order.created_at).toLocaleDateString('en-US', { 
                            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {/* Estimated Delivery Countdown or Edit UI */}
                      {editingDelivery === order.id ? (
                        <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                          <span className="text-sm font-medium" style={{ color: '#64748B' }}>Set delivery in:</span>
                          <select
                            value={estimatedDays}
                            onChange={(e) => setEstimatedDays(Number(e.target.value))}
                            className="px-3 py-2 rounded-lg text-sm font-medium"
                            style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', color: '#1E293B' }}
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 10, 14, 21, 30].map(day => (
                              <option key={day} value={day}>{day} {day === 1 ? 'day' : 'days'}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleEstimatedDeliveryUpdate(order.id)}
                            className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105"
                            style={{ background: '#D4AF37', color: '#1E293B' }}
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingDelivery(null)}
                            className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105"
                            style={{ background: '#FEE2E2', color: '#DC2626' }}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : hasEstimatedDelivery ? (
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-xs font-medium" style={{ color: '#64748B' }}>Delivery Countdown</p>
                            <CountdownTimer targetDate={order.estimated_delivery_date} status={order.status} />
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingDelivery(order.id);
                            setEstimatedDays(order.estimated_days || 3);
                          }}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105"
                          style={{ background: '#F0FDF4', color: '#16A34A', border: '1px solid #BBF7D0' }}
                        >
                          <Timer className="w-4 h-4" />
                          Set Delivery Time
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Order Details Row */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: '#F8FAFC' }}>
                      <User className="w-5 h-5" style={{ color: '#D4AF37' }} />
                      <div>
                        <p className="text-xs" style={{ color: '#64748B' }}>Customer</p>
                        <p className="font-semibold text-sm" style={{ color: '#1E293B' }}>{order.shipping_address?.full_name || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: '#F8FAFC' }}>
                      <Package className="w-5 h-5" style={{ color: '#3B82F6' }} />
                      <div>
                        <p className="text-xs" style={{ color: '#64748B' }}>Items</p>
                        <p className="font-semibold text-sm" style={{ color: '#1E293B' }}>Order Items</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: '#F8FAFC' }}>
                      <Calendar className="w-5 h-5" style={{ color: '#8B5CF6' }} />
                      <div>
                        <p className="text-xs" style={{ color: '#64748B' }}>Amount</p>
                        <p className="font-bold text-sm" style={{ color: '#D4AF37' }}>₹{order.total_amount}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: '#F8FAFC' }}>
                      <Clock className="w-5 h-5" style={{ color: '#10B981' }} />
                      <div>
                        <p className="text-xs" style={{ color: '#64748B' }}>Est. Delivery</p>
                        <p className="font-semibold text-sm" style={{ color: '#1E293B' }}>
                          {order.estimated_delivery_date 
                            ? new Date(order.estimated_delivery_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                            : 'Not set'
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: '#E2E8F0' }}>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium" style={{ color: '#64748B' }}>Update Status:</span>
                      <Select
                        value={order.status}
                        onValueChange={(value) => handleStatusUpdate(order.id, value)}
                      >
                        <SelectTrigger className="w-[150px] rounded-xl" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {hasEstimatedDelivery && order.status !== 'delivered' && order.status !== 'cancelled' && editingDelivery !== order.id && (
                        <button
                          onClick={() => {
                            setEditingDelivery(order.id);
                            setEstimatedDays(order.estimated_days || 3);
                          }}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105"
                          style={{ background: '#FEF3C7', color: '#D97706', border: '1px solid #FDE68A' }}
                        >
                          <Timer className="w-4 h-4" />
                          Reset Delivery Time
                        </button>
                      )}
                      <button
                        onClick={() => viewOrderDetails(order)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105"
                        style={{ background: '#1E293B', color: '#FFFFFF' }}
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl p-12 text-center" style={{ background: '#FFFFFF', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0' }}>
          <div className="w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: '#F8FAFC' }}>
            <Package className="w-10 h-10" style={{ color: '#CBD5E1' }} />
          </div>
          <h3 className="text-xl font-bold mb-2" style={{ color: '#1E293B' }}>No orders found</h3>
          <p style={{ color: '#64748B' }}>
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your filters'
              : 'Orders will appear here when customers place them'
            }
          </p>
        </div>
      )}

      {/* Order Details Dialog */}
      <Dialog open={showOrderDetails} onOpenChange={setShowOrderDetails}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold" style={{ color: '#1E293B' }}>
              Order Details - #{selectedOrder?.order_number}
            </DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Order Details</TabsTrigger>
                <TabsTrigger value="delivery">Delivery Info</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4 pt-4">
                <div className="grid gap-4">
                  <div className="p-4 rounded-xl" style={{ background: '#F8FAFC' }}>
                    <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: '#1E293B' }}>
                      <User className="w-4 h-4" style={{ color: '#D4AF37' }} />
                      Customer Information
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p style={{ color: '#64748B' }}>Name</p>
                        <p className="font-semibold" style={{ color: '#1E293B' }}>{selectedOrder.shipping_address?.full_name}</p>
                      </div>
                      <div>
                        <p style={{ color: '#64748B' }}>Phone</p>
                        <p className="font-semibold" style={{ color: '#1E293B' }}>{selectedOrder.shipping_address?.phone}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-xl" style={{ background: '#F8FAFC' }}>
                    <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: '#1E293B' }}>
                      <Package className="w-4 h-4" style={{ color: '#3B82F6' }} />
                      Order Summary
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p style={{ color: '#64748B' }}>Status</p>
                        <span 
                          className="px-3 py-1 rounded-full text-xs font-bold uppercase inline-block mt-1"
                          style={{ 
                            background: getStatusColor(selectedOrder.status).bg, 
                            color: getStatusColor(selectedOrder.status).color 
                          }}
                        >
                          {selectedOrder.status}
                        </span>
                      </div>
                      <div>
                        <p style={{ color: '#64748B' }}>Total Amount</p>
                        <p className="text-xl font-bold" style={{ color: '#D4AF37' }}>₹{selectedOrder.total_amount}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="delivery" className="space-y-4 pt-4">
                <div className="p-4 rounded-xl" style={{ background: '#F8FAFC' }}>
                  <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: '#1E293B' }}>
                    <Truck className="w-4 h-4" style={{ color: '#10B981' }} />
                    Shipping Address
                  </h4>
                  <p className="text-sm" style={{ color: '#1E293B' }}>{selectedOrder.shipping_address?.address}</p>
                  <p className="text-sm" style={{ color: '#64748B' }}>PIN: {selectedOrder.shipping_address?.pincode}</p>
                </div>

                <div className="p-4 rounded-xl" style={{ background: '#F8FAFC' }}>
                  <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: '#1E293B' }}>
                    <Timer className="w-4 h-4" style={{ color: '#D4AF37' }} />
                    Delivery Timeline
                  </h4>
                  {selectedOrder.estimated_delivery_date ? (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span style={{ color: '#64748B' }}>Estimated Delivery</span>
                        <span className="font-bold" style={{ color: '#1E293B' }}>
                          {new Date(selectedOrder.estimated_delivery_date).toLocaleDateString('en-US', { 
                            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span style={{ color: '#64748B' }}>Time Remaining</span>
                        <CountdownTimer targetDate={selectedOrder.estimated_delivery_date} status={selectedOrder.status} />
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm" style={{ color: '#64748B' }}>No estimated delivery date set</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
