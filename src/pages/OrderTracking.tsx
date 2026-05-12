import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { useOrders } from '@/hooks/useOrders';
import { useAuth } from '@/hooks/useAuth';
import { generateInvoicePDF } from '@/lib/invoiceGenerator';
import { useToast } from '@/hooks/use-toast';
import { MobileOrderTracking } from '@/components/mobile/MobileOrderTracking';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin, 
  CreditCard, 
  ArrowLeft,
  AlertCircle,
  ShoppingBag,
  Calendar,
  Phone,
  User,
  Sparkles,
  Zap,
  FileText,
  Loader2
} from 'lucide-react';

const OrderTracking = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { orders, loading } = useOrders();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [order, setOrder] = useState<any>(null);
  const [truckPosition, setTruckPosition] = useState(0);
  const [downloadingInvoice, setDownloadingInvoice] = useState(false);

  // Delivery Countdown Component
  const DeliveryCountdown = ({ targetDate }: { targetDate: string }) => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, expired: false });

    useEffect(() => {
      const calculateTimeLeft = () => {
        const target = new Date(targetDate).getTime();
        const now = new Date().getTime();
        const difference = target - now;

        if (difference <= 0) {
          return { days: 0, hours: 0, minutes: 0, expired: true };
        }

        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          expired: false
        };
      };

      setTimeLeft(calculateTimeLeft());
      const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 60000);
      return () => clearInterval(timer);
    }, [targetDate]);

    if (timeLeft.expired) {
      return (
        <p className="text-sm mt-1" style={{ color: '#D97706' }}>
          Expected delivery date passed
        </p>
      );
    }

    return (
      <div className="flex items-center gap-2 mt-2">
        <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: '#DBEAFE' }}>
          <span className="text-sm font-bold" style={{ color: '#1E40AF' }}>{timeLeft.days}</span>
          <span className="text-xs" style={{ color: '#3B82F6' }}>days</span>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: '#DBEAFE' }}>
          <span className="text-sm font-bold" style={{ color: '#1E40AF' }}>{timeLeft.hours}</span>
          <span className="text-xs" style={{ color: '#3B82F6' }}>hrs</span>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: '#DBEAFE' }}>
          <span className="text-sm font-bold" style={{ color: '#1E40AF' }}>{timeLeft.minutes}</span>
          <span className="text-xs" style={{ color: '#3B82F6' }}>min</span>
        </div>
        <span className="text-xs" style={{ color: '#64748B' }}>remaining</span>
      </div>
    );
  };

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }
    
    if (orders.length > 0 && orderId) {
      const foundOrder = orders.find(o => o.id === orderId || o.order_number === orderId);
      setOrder(foundOrder);
    }
  }, [orders, orderId, user, authLoading, navigate]);

  // Animate truck position based on order status
  useEffect(() => {
    if (order) {
      const statusPositions: Record<string, number> = {
        'pending': 10,
        'confirmed': 30,
        'processing': 50,
        'shipped': 70,
        'delivered': 95,
        'cancelled': 0
      };
      const targetPosition = statusPositions[order.status] || 0;
      
      // Animate to position
      let current = truckPosition;
      const animate = () => {
        if (current < targetPosition) {
          current += 0.5;
          setTruckPosition(Math.min(current, targetPosition));
          requestAnimationFrame(animate);
        }
      };
      animate();
    }
  }, [order?.status]);

  const orderSteps = [
    { key: 'pending', label: 'Order Placed', icon: Package, description: 'Your order has been received', position: 10 },
    { key: 'confirmed', label: 'Confirmed', icon: CheckCircle, description: 'Order confirmed by seller', position: 30 },
    { key: 'processing', label: 'Processing', icon: Zap, description: 'Order is being prepared', position: 50 },
    { key: 'shipped', label: 'Shipped', icon: Truck, description: 'Order is on the way', position: 70 },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle, description: 'Order delivered successfully', position: 95 },
  ];

  const getStepIndex = (status: string) => {
    if (status === 'cancelled') return -1;
    const index = orderSteps.findIndex(step => step.key === status);
    return index >= 0 ? index : 0;
  };

  const currentStepIndex = order ? getStepIndex(order.status) : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#F59E0B';
      case 'confirmed': return '#10B981';
      case 'processing': return '#8B5CF6';
      case 'shipped': return '#3B82F6';
      case 'delivered': return '#10B981';
      case 'cancelled': return '#EF4444';
      default: return '#6B7280';
    }
  };

  // Loading state
  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%)' }}>
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full animate-ping" style={{ background: 'rgba(212, 175, 55, 0.2)' }} />
            <div className="absolute inset-2 rounded-full animate-spin" style={{ border: '4px solid transparent', borderTopColor: '#D4AF37', borderRightColor: '#D4AF37' }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <Truck className="w-10 h-10 animate-bounce" style={{ color: '#D4AF37' }} />
            </div>
          </div>
          <p className="text-lg font-medium" style={{ color: '#1e293b' }}>Tracking your order...</p>
        </div>
      </div>
    );
  }

  // Order not found
  if (!order) {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%)' }}>
        <Navigation mobileTitle="Track order" mobileShowBack hideMobileSearchIcon />
        <main className="pt-20 md:pt-24 pb-12">
          <div className="container mx-auto px-4 max-w-4xl text-center py-16">
            <div className="w-24 h-24 rounded-3xl mx-auto mb-6 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #fee2e2, #fecaca)' }}>
              <Package className="w-12 h-12" style={{ color: '#EF4444' }} />
            </div>
            <h1 className="text-3xl font-bold mb-3" style={{ color: '#1e293b' }}>Order Not Found</h1>
            <p className="text-lg mb-8" style={{ color: '#64748b' }}>The order you're looking for doesn't exist.</p>
            <button 
              onClick={() => navigate('/user-dashboard')}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #1e293b, #334155)', color: '#FFFFFF', boxShadow: '0 10px 40px rgba(30, 41, 59, 0.3)' }}
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Dashboard
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const shippingAddress = typeof order.shipping_address === 'string' 
    ? { full_name: '', phone: '', address: order.shipping_address, pincode: '' }
    : order.shipping_address || { full_name: '', phone: '', address: '', pincode: '' };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #f0f4f8 0%, #e2e8f0 50%, #f0f4f8 100%)' }}>
      <Navigation mobileTitle="Track order" mobileShowBack hideMobileSearchIcon />

      {/* Mobile view (< md) */}
      <MobileOrderTracking orderId={orderId} />

      {/* Desktop / tablet (≥ md) */}
      <main className="hidden md:block pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Back Button */}
          <button 
            onClick={() => navigate('/user-dashboard')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium mb-6 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
            style={{ background: 'rgba(255, 255, 255, 0.7)', color: '#64748b', border: '1px solid rgba(255, 255, 255, 0.5)', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)' }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </button>

          {/* Premium Header Card */}
          <div className="rounded-3xl p-8 mb-8 relative overflow-hidden" style={{ 
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
            boxShadow: '0 25px 60px rgba(15, 23, 42, 0.4)'
          }}>
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{ 
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                animation: 'slide 20s linear infinite'
              }} />
            </div>
            
            {/* Glowing Orbs */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20 blur-3xl" style={{ background: '#D4AF37' }} />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10 blur-3xl" style={{ background: '#3B82F6' }} />
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: 'rgba(212, 175, 55, 0.2)', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
                      <Sparkles className="w-4 h-4" style={{ color: '#D4AF37' }} />
                      <span className="text-sm font-semibold" style={{ color: '#D4AF37' }}>Order Tracking</span>
                    </div>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                    #{order.order_number}
                  </h1>
                  <p className="flex items-center gap-2 text-lg" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    <Calendar className="w-5 h-5" />
                    Placed on {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm mb-1" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Total Amount</p>
                    <p className="text-4xl font-bold" style={{ color: '#D4AF37', textShadow: '0 0 30px rgba(212, 175, 55, 0.3)' }}>
                      ₹{order.total_amount.toFixed(2)}
                    </p>
                  </div>
                  <div 
                    className="px-5 py-3 rounded-2xl font-bold uppercase tracking-wide"
                    style={{ 
                      background: `linear-gradient(135deg, ${getStatusColor(order.status)}20, ${getStatusColor(order.status)}10)`,
                      color: getStatusColor(order.status),
                      border: `1px solid ${getStatusColor(order.status)}40`,
                      boxShadow: `0 0 20px ${getStatusColor(order.status)}20`
                    }}
                  >
                    {order.status.replace('_', ' ')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 🚚 GAMIFIED ROAD TRACKING VISUALIZATION */}
          <div className="rounded-3xl p-8 mb-8 relative overflow-hidden backdrop-blur-xl" style={{ 
            background: 'rgba(255, 255, 255, 0.7)',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.5)'
          }}>
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3" style={{ color: '#1e293b' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #D4AF37, #F59E0B)' }}>
                <Truck className="w-5 h-5 text-white" />
              </div>
              Order Progress
            </h2>

            {order.status === 'cancelled' ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-3xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #fee2e2, #fecaca)' }}>
                  <AlertCircle className="w-10 h-10" style={{ color: '#EF4444' }} />
                </div>
                <p className="text-2xl font-bold mb-2" style={{ color: '#EF4444' }}>Order Cancelled</p>
                <p style={{ color: '#64748b' }}>This order has been cancelled</p>
              </div>
            ) : (
              <div className="relative">
                {/* 3D Road Visualization */}
                <div className="relative h-48 md:h-56 mb-8">
                  {/* Sky/Background Gradient */}
                  <div className="absolute inset-0 rounded-2xl overflow-hidden" style={{ 
                    background: 'linear-gradient(180deg, #e0f2fe 0%, #f0f9ff 30%, #ecfdf5 70%, #d1fae5 100%)'
                  }}>
                    {/* Clouds */}
                    <div className="absolute top-4 left-[10%] w-16 h-6 rounded-full opacity-60" style={{ background: 'white', filter: 'blur(4px)' }} />
                    <div className="absolute top-8 left-[30%] w-24 h-8 rounded-full opacity-50" style={{ background: 'white', filter: 'blur(6px)' }} />
                    <div className="absolute top-6 right-[20%] w-20 h-7 rounded-full opacity-55" style={{ background: 'white', filter: 'blur(5px)' }} />
                  </div>

                  {/* Road */}
                  <div className="absolute bottom-8 left-4 right-4 h-16 rounded-full overflow-hidden" style={{ 
                    background: 'linear-gradient(180deg, #374151 0%, #1f2937 50%, #111827 100%)',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.1)'
                  }}>
                    {/* Road Markings - Dashed Line */}
                    <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1 flex gap-4 px-4">
                      {[...Array(20)].map((_, i) => (
                        <div key={i} className="flex-1 h-full rounded-full" style={{ background: '#FCD34D', opacity: 0.8 }} />
                      ))}
                    </div>
                    
                    {/* Road Edges */}
                    <div className="absolute top-2 left-0 right-0 h-1" style={{ background: 'rgba(255, 255, 255, 0.2)' }} />
                    <div className="absolute bottom-2 left-0 right-0 h-1" style={{ background: 'rgba(255, 255, 255, 0.2)' }} />
                  </div>

                  {/* Checkpoint Markers on Road */}
                  {orderSteps.map((step, index) => {
                    const isCompleted = index <= currentStepIndex;
                    const isCurrent = index === currentStepIndex;
                    const StepIcon = step.icon;
                    
                    return (
                      <div 
                        key={step.key}
                        className="absolute bottom-6 transform -translate-x-1/2 transition-all duration-500"
                        style={{ left: `${step.position}%` }}
                      >
                        {/* Checkpoint Pole */}
                        <div className="relative">
                          {/* Glow Effect for Current */}
                          {isCurrent && (
                            <div className="absolute -inset-4 rounded-full animate-ping" style={{ background: 'rgba(212, 175, 55, 0.3)' }} />
                          )}
                          
                          {/* Checkpoint Circle */}
                          <div 
                            className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-500 ${isCurrent ? 'scale-125' : ''}`}
                            style={{ 
                              background: isCompleted 
                                ? 'linear-gradient(135deg, #D4AF37 0%, #F59E0B 100%)' 
                                : 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)',
                              boxShadow: isCompleted 
                                ? '0 8px 25px rgba(212, 175, 55, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.3)' 
                                : '0 4px 15px rgba(0, 0, 0, 0.1)',
                              border: isCurrent ? '3px solid white' : 'none'
                            }}
                          >
                            <StepIcon className={`w-5 h-5 md:w-6 md:h-6 ${isCompleted ? 'text-white' : ''}`} style={{ color: isCompleted ? 'white' : '#94a3b8' }} />
                          </div>
                          
                          {/* Label */}
                          <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap text-center">
                            <p className={`text-xs md:text-sm font-semibold ${isCompleted ? '' : ''}`} style={{ color: isCompleted ? '#1e293b' : '#94a3b8' }}>
                              {step.label}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* 🚚 Animated Delivery Truck */}
                  <div 
                    className="absolute bottom-[52px] transform -translate-x-1/2 transition-all duration-1000 ease-out z-20"
                    style={{ left: `${truckPosition}%` }}
                  >
                    {/* Motion Lines */}
                    <div className="absolute -left-8 top-1/2 -translate-y-1/2 flex gap-1">
                      <div className="w-4 h-0.5 rounded-full animate-pulse" style={{ background: '#94a3b8', animationDelay: '0ms' }} />
                      <div className="w-3 h-0.5 rounded-full animate-pulse" style={{ background: '#94a3b8', animationDelay: '100ms' }} />
                      <div className="w-2 h-0.5 rounded-full animate-pulse" style={{ background: '#94a3b8', animationDelay: '200ms' }} />
                    </div>
                    
                    {/* Truck Body */}
                    <div className="relative">
                      {/* Truck Shadow */}
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-14 h-3 rounded-full" style={{ background: 'rgba(0, 0, 0, 0.2)', filter: 'blur(4px)' }} />
                      
                      {/* Truck Container */}
                      <div className="relative w-16 h-12 rounded-lg" style={{ 
                        background: 'linear-gradient(180deg, #FCD34D 0%, #F59E0B 100%)',
                        boxShadow: '0 6px 20px rgba(245, 158, 11, 0.4)'
                      }}>
                        {/* Truck Cabin */}
                        <div className="absolute -right-4 bottom-0 w-6 h-8 rounded-t-lg" style={{ 
                          background: 'linear-gradient(180deg, #FCD34D 0%, #F59E0B 100%)'
                        }}>
                          {/* Window */}
                          <div className="absolute top-1 right-1 w-4 h-3 rounded-sm" style={{ background: '#0ea5e9' }} />
                        </div>
                        
                        {/* Package Icon on Truck */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Package className="w-6 h-6 text-white opacity-80" />
                        </div>
                        
                        {/* Wheels */}
                        <div className="absolute -bottom-2 left-2 w-4 h-4 rounded-full" style={{ background: '#1f2937', border: '2px solid #374151' }}>
                          <div className="absolute inset-1 rounded-full" style={{ background: '#6b7280' }} />
                        </div>
                        <div className="absolute -bottom-2 right-2 w-4 h-4 rounded-full" style={{ background: '#1f2937', border: '2px solid #374151' }}>
                          <div className="absolute inset-1 rounded-full" style={{ background: '#6b7280' }} />
                        </div>
                      </div>
                      
                      {/* Smoke/Exhaust */}
                      <div className="absolute -left-2 top-0 flex flex-col gap-1">
                        <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: '#e2e8f0', animationDuration: '0.5s' }} />
                        <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: '#e2e8f0', animationDuration: '0.7s', animationDelay: '0.1s' }} />
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar Under Road */}
                  <div className="absolute bottom-0 left-4 right-4 h-2 rounded-full overflow-hidden" style={{ background: '#e2e8f0' }}>
                    <div 
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ 
                        width: `${truckPosition}%`,
                        background: 'linear-gradient(90deg, #D4AF37, #F59E0B, #FBBF24)'
                      }}
                    />
                  </div>
                </div>

                {/* Step Descriptions - Mobile */}
                <div className="md:hidden space-y-3 mt-8">
                  {orderSteps.map((step, index) => {
                    const isCompleted = index <= currentStepIndex;
                    const isCurrent = index === currentStepIndex;
                    const StepIcon = step.icon;
                    
                    return (
                      <div 
                        key={step.key}
                        className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${isCurrent ? 'scale-[1.02]' : ''}`}
                        style={{ 
                          background: isCurrent ? 'rgba(212, 175, 55, 0.1)' : 'rgba(255, 255, 255, 0.5)',
                          border: isCurrent ? '2px solid rgba(212, 175, 55, 0.3)' : '1px solid rgba(0, 0, 0, 0.05)'
                        }}
                      >
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ 
                            background: isCompleted ? 'linear-gradient(135deg, #D4AF37, #F59E0B)' : '#e2e8f0'
                          }}
                        >
                          <StepIcon className="w-6 h-6" style={{ color: isCompleted ? 'white' : '#94a3b8' }} />
                        </div>
                        <div>
                          <p className="font-semibold" style={{ color: isCompleted ? '#1e293b' : '#94a3b8' }}>{step.label}</p>
                          <p className="text-sm" style={{ color: '#64748b' }}>{step.description}</p>
                        </div>
                        {isCurrent && (
                          <div className="ml-auto">
                            <div className="w-3 h-3 rounded-full animate-pulse" style={{ background: '#D4AF37' }} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Order Details Grid - Glassmorphism Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Order Details Card */}
            <div className="rounded-3xl p-6 backdrop-blur-xl relative overflow-hidden" style={{ 
              background: 'rgba(255, 255, 255, 0.7)',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.5)'
            }}>
              {/* Decorative Gradient */}
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20 blur-3xl" style={{ background: '#D4AF37' }} />
              
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3 relative z-10" style={{ color: '#1e293b' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)' }}>
                  <Package className="w-5 h-5 text-white" />
                </div>
                Order Details
              </h3>
              
              <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-center p-4 rounded-2xl" style={{ background: 'rgba(255, 255, 255, 0.6)', border: '1px solid rgba(255, 255, 255, 0.8)' }}>
                  <span className="font-medium" style={{ color: '#64748b' }}>Order Number</span>
                  <span className="font-bold" style={{ color: '#1e293b' }}>#{order.order_number}</span>
                </div>
                
                <div className="flex justify-between items-center p-4 rounded-2xl" style={{ background: 'rgba(255, 255, 255, 0.6)', border: '1px solid rgba(255, 255, 255, 0.8)' }}>
                  <span className="font-medium" style={{ color: '#64748b' }}>Order Date</span>
                  <span className="font-bold" style={{ color: '#1e293b' }}>
                    {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-4 rounded-2xl" style={{ background: 'rgba(255, 255, 255, 0.6)', border: '1px solid rgba(255, 255, 255, 0.8)' }}>
                  <span className="font-medium" style={{ color: '#64748b' }}>Total Amount</span>
                  <span className="text-2xl font-bold" style={{ color: '#D4AF37' }}>₹{order.total_amount.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center p-4 rounded-2xl" style={{ background: 'rgba(255, 255, 255, 0.6)', border: '1px solid rgba(255, 255, 255, 0.8)' }}>
                  <span className="font-medium" style={{ color: '#64748b' }}>Payment Status</span>
                  <span 
                    className="px-4 py-1.5 rounded-full text-sm font-bold uppercase"
                    style={{ 
                      background: order.payment_status === 'paid' 
                        ? 'linear-gradient(135deg, #d1fae5, #a7f3d0)' 
                        : 'linear-gradient(135deg, #fef3c7, #fde68a)',
                      color: order.payment_status === 'paid' ? '#059669' : '#D97706'
                    }}
                  >
                    {order.payment_status || 'PENDING'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-4 rounded-2xl" style={{ background: 'rgba(255, 255, 255, 0.6)', border: '1px solid rgba(255, 255, 255, 0.8)' }}>
                  <span className="font-medium" style={{ color: '#64748b' }}>Payment Method</span>
                  <span className="font-bold flex items-center gap-2" style={{ color: '#1e293b' }}>
                    <CreditCard className="w-4 h-4" style={{ color: '#D4AF37' }} />
                    {order.payment_method || 'pending'}
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery Information Card */}
            <div className="rounded-3xl p-6 backdrop-blur-xl relative overflow-hidden" style={{ 
              background: 'rgba(255, 255, 255, 0.7)',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.5)'
            }}>
              {/* Decorative Gradient */}
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20 blur-3xl" style={{ background: '#10B981' }} />
              
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3 relative z-10" style={{ color: '#1e293b' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}>
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                Delivery Information
              </h3>
              
              <div className="space-y-4 relative z-10">
                {shippingAddress.full_name && (
                  <div className="p-4 rounded-2xl" style={{ background: 'rgba(255, 255, 255, 0.6)', border: '1px solid rgba(255, 255, 255, 0.8)' }}>
                    <div className="flex items-center gap-3 mb-1">
                      <User className="w-4 h-4" style={{ color: '#D4AF37' }} />
                      <span className="text-sm" style={{ color: '#64748b' }}>Recipient</span>
                    </div>
                    <p className="font-bold text-lg ml-7" style={{ color: '#1e293b' }}>{shippingAddress.full_name}</p>
                  </div>
                )}
                
                {shippingAddress.phone && (
                  <div className="p-4 rounded-2xl" style={{ background: 'rgba(255, 255, 255, 0.6)', border: '1px solid rgba(255, 255, 255, 0.8)' }}>
                    <div className="flex items-center gap-3 mb-1">
                      <Phone className="w-4 h-4" style={{ color: '#D4AF37' }} />
                      <span className="text-sm" style={{ color: '#64748b' }}>Phone</span>
                    </div>
                    <p className="font-bold text-lg ml-7" style={{ color: '#1e293b' }}>{shippingAddress.phone}</p>
                  </div>
                )}
                
                <div className="p-4 rounded-2xl" style={{ background: 'rgba(255, 255, 255, 0.6)', border: '1px solid rgba(255, 255, 255, 0.8)' }}>
                  <div className="flex items-center gap-3 mb-1">
                    <MapPin className="w-4 h-4" style={{ color: '#D4AF37' }} />
                    <span className="text-sm" style={{ color: '#64748b' }}>Delivery Address</span>
                  </div>
                  <p className="font-bold text-lg ml-7" style={{ color: '#1e293b' }}>
                    {shippingAddress.address || 'Address not provided'}
                    {shippingAddress.pincode && ` - ${shippingAddress.pincode}`}
                  </p>
                </div>
                
                <div className="p-4 rounded-2xl" style={{ background: 'rgba(255, 255, 255, 0.6)', border: '1px solid rgba(255, 255, 255, 0.8)' }}>
                  <div className="flex items-center gap-3 mb-1">
                    <Clock className="w-4 h-4" style={{ color: '#D4AF37' }} />
                    <span className="text-sm" style={{ color: '#64748b' }}>Estimated Delivery</span>
                  </div>
                  {order.status === 'delivered' ? (
                    <p className="font-bold text-lg ml-7" style={{ color: '#10B981' }}>✓ Delivered</p>
                  ) : order.estimated_delivery_date ? (
                    <div className="ml-7">
                      <p className="font-bold text-lg" style={{ color: '#1e293b' }}>
                        {new Date(order.estimated_delivery_date).toLocaleDateString('en-US', { 
                          weekday: 'short', month: 'short', day: 'numeric' 
                        })}
                      </p>
                      <DeliveryCountdown targetDate={order.estimated_delivery_date} />
                    </div>
                  ) : (
                    <p className="font-bold text-lg ml-7" style={{ color: '#1e293b' }}>3-5 business days</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="rounded-3xl p-6 mt-6 backdrop-blur-xl" style={{ 
            background: 'rgba(255, 255, 255, 0.7)',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.5)'
          }}>
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Download Invoice Button - Only enabled when order is confirmed or beyond */}
              {order.status !== 'pending' && order.status !== 'cancelled' ? (
                <button 
                  onClick={async () => {
                    setDownloadingInvoice(true);
                    try {
                      await generateInvoicePDF({
                        orderNumber: order.order_number,
                        orderDate: new Date(order.created_at).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        }),
                        paymentStatus: order.payment_status || 'pending',
                        paymentMethod: order.payment_method || 'Online',
                        totalAmount: order.total_amount,
                        shippingAddress: shippingAddress,
                        items: order.items || []
                      });
                      toast({
                        title: "Invoice Downloaded!",
                        description: `Invoice for order #${order.order_number} has been downloaded.`,
                      });
                    } catch (error) {
                      toast({
                        title: "Download Failed",
                        description: "Failed to generate invoice. Please try again.",
                        variant: "destructive"
                      });
                    } finally {
                      setDownloadingInvoice(false);
                    }
                  }}
                  disabled={downloadingInvoice}
                  className="flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ 
                    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', 
                    color: '#FFFFFF',
                    boxShadow: '0 10px 30px rgba(30, 41, 59, 0.3)'
                  }}
                >
                  {downloadingInvoice ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileText className="w-5 h-5" />
                      Download Invoice
                    </>
                  )}
                </button>
              ) : (
                <button 
                  disabled
                  className="flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-semibold cursor-not-allowed opacity-50"
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.8)', 
                    color: '#94a3b8', 
                    border: '2px solid #e2e8f0'
                  }}
                  title={order.status === 'pending' ? 'Invoice available after order confirmation' : 'Invoice not available for cancelled orders'}
                >
                  <FileText className="w-5 h-5" />
                  {order.status === 'pending' ? 'Invoice Available After Confirmation' : 'Invoice Not Available'}
                </button>
              )}
              <button 
                onClick={() => navigate('/shop')}
                className="flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105"
                style={{ 
                  background: 'linear-gradient(135deg, #D4AF37 0%, #F59E0B 100%)', 
                  color: '#1e293b',
                  boxShadow: '0 10px 30px rgba(212, 175, 55, 0.3)'
                }}
              >
                <ShoppingBag className="w-5 h-5" />
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </main>

      <div className="hidden md:block">
        <Footer />
      </div>

      {/* Custom Animation Styles */}
      <style>{`
        @keyframes slide {
          0% { transform: translateX(0); }
          100% { transform: translateX(-60px); }
        }
      `}</style>
    </div>
  );
};

export default OrderTracking;
