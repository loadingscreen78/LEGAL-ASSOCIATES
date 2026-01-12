import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useOrders } from '@/hooks/useOrders';
import { Package, Truck, CheckCircle, Clock, MapPin, CreditCard, Download, ArrowLeft } from 'lucide-react';

const OrderTracking = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { orders, loading } = useOrders();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (orders.length > 0 && orderId) {
      const foundOrder = orders.find(o => o.id === orderId || o.order_number === orderId);
      setOrder(foundOrder);
    }
  }, [orders, orderId]);

  const orderSteps = [
    { key: 'pending', label: 'Order Placed', icon: Package, color: 'text-blue-500' },
    { key: 'confirmed', label: 'Confirmed', icon: CheckCircle, color: 'text-blue-500' },
    { key: 'processing', label: 'Packed', icon: Package, color: 'text-purple-500' },
    { key: 'shipped', label: 'Shipped', icon: Truck, color: 'text-orange-500' },
    { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck, color: 'text-orange-500' },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle, color: 'text-green-500' },
  ];

  const getStepIndex = (status: string) => {
    const index = orderSteps.findIndex(step => step.key === status);
    return index >= 0 ? index : 0;
  };

  const currentStepIndex = order ? getStepIndex(order.status) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-24 pb-12">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Order Not Found</h1>
            <p className="text-muted-foreground mb-6">The order you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/user-dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Header */}
          <div className="mb-8">
            <Button variant="ghost" onClick={() => navigate('/user-dashboard')} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Orders
            </Button>
            <h1 className="text-4xl font-serif font-bold text-primary mb-2">
              Track Your Order
            </h1>
            <p className="text-muted-foreground text-lg">
              Order #{order.order_number}
            </p>
          </div>

          {/* Order Status Stepper */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
              <CardDescription>Track your order progress</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Desktop Stepper - Horizontal */}
              <div className="hidden md:block">
                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute top-8 left-0 right-0 h-1 bg-muted">
                    <div 
                      className="h-full bg-primary transition-all duration-500"
                      style={{ width: `${(currentStepIndex / (orderSteps.length - 1)) * 100}%` }}
                    />
                  </div>

                  {/* Steps */}
                  <div className="relative flex justify-between">
                    {orderSteps.map((step, index) => {
                      const StepIcon = step.icon;
                      const isCompleted = index <= currentStepIndex;
                      const isCurrent = index === currentStepIndex;
                      
                      return (
                        <div key={step.key} className="flex flex-col items-center" style={{ width: `${100 / orderSteps.length}%` }}>
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                            isCompleted 
                              ? 'bg-primary border-primary text-white' 
                              : 'bg-background border-muted text-muted-foreground'
                          } ${isCurrent ? 'ring-4 ring-primary/30 scale-110' : ''}`}>
                            <StepIcon className="w-7 h-7" />
                          </div>
                          <p className={`mt-3 text-sm font-medium text-center ${
                            isCompleted ? 'text-foreground' : 'text-muted-foreground'
                          }`}>
                            {step.label}
                          </p>
                          {isCompleted && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(order.updated_at).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Mobile Stepper - Vertical */}
              <div className="md:hidden space-y-4">
                {orderSteps.map((step, index) => {
                  const StepIcon = step.icon;
                  const isCompleted = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;
                  
                  return (
                    <div key={step.key} className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all ${
                          isCompleted 
                            ? 'bg-primary border-primary text-white' 
                            : 'bg-background border-muted text-muted-foreground'
                        } ${isCurrent ? 'ring-4 ring-primary/30' : ''}`}>
                          <StepIcon className="w-6 h-6" />
                        </div>
                        {index < orderSteps.length - 1 && (
                          <div className={`w-1 h-12 ${isCompleted ? 'bg-primary' : 'bg-muted'}`} />
                        )}
                      </div>
                      <div className="flex-1 pt-2">
                        <p className={`font-medium ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {step.label}
                        </p>
                        {isCompleted && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(order.updated_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Order Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Order Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order Number</span>
                  <span className="font-semibold">#{order.order_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order Date</span>
                  <span className="font-semibold">
                    {new Date(order.created_at).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Amount</span>
                  <span className="font-bold text-primary text-xl">₹{order.total_amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Status</span>
                  <Badge className="bg-primary text-white">
                    {order.status.toUpperCase().replace('_', ' ')}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Status</span>
                  <Badge variant={order.payment_status === 'paid' ? 'default' : 'secondary'}>
                    {order.payment_status.toUpperCase()}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Delivery Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Delivery Address</p>
                  <p className="font-medium">
                    {order.shipping_address || 'Address not provided'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Estimated Delivery</p>
                  <p className="font-medium">
                    {order.status === 'delivered' 
                      ? 'Delivered' 
                      : '3-5 business days'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Payment Method</p>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    <span className="font-medium">{order.payment_method || 'Online Payment'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <Card className="mt-6">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="flex-1" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download Invoice
                </Button>
                <Button className="flex-1" onClick={() => navigate('/shop')}>
                  Continue Shopping
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderTracking;
