import { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { useOrders } from '@/hooks/useOrders';
import { useTransactions } from '@/hooks/useTransactions';
import { useNavigate } from 'react-router-dom';
import { User, Package, CreditCard, Edit, Save, MapPin, Phone, Mail, LogOut, ShoppingBag, Clock, CheckCircle, Truck, XCircle, AlertCircle } from 'lucide-react';

const UserDashboard = () => {
  const { user, profile, signOut, updateProfile, loading: authLoading } = useAuth();
  const { orders, loading: ordersLoading } = useOrders();
  const { transactions, loading: transactionsLoading } = useTransactions();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({ full_name: '', phone: '', address: '', pincode: '' });

  useEffect(() => {
    if (!authLoading && !user) navigate('/login');
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (profile) setProfileData({ full_name: profile.full_name || '', phone: profile.phone || '', address: profile.address || '', pincode: profile.pincode || '' });
  }, [profile]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(profileData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-5 h-5" />;
      case 'confirmed': case 'processing': return <AlertCircle className="w-5 h-5" />;
      case 'shipped': return <Truck className="w-5 h-5" />;
      case 'delivered': return <CheckCircle className="w-5 h-5" />;
      case 'cancelled': return <XCircle className="w-5 h-5" />;
      default: return <Package className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#F59E0B';
      case 'confirmed': case 'processing': return '#3B82F6';
      case 'shipped': return '#8B5CF6';
      case 'delivered': return '#10B981';
      case 'cancelled': return '#EF4444';
      default: return '#6B7280';
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F8F9FA' }}>
        <div className="text-center">
          <div className="w-16 h-16 rounded-full mx-auto mb-4 animate-spin" style={{ border: '4px solid #D4AF37', borderTopColor: 'transparent' }} />
          <p style={{ color: '#666666' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'payments', label: 'Payments', icon: CreditCard },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#F8F9FA' }}>
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="rounded-3xl p-8 mb-8 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #2D3E50 0%, #101820 100%)' }}>
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold" style={{ background: '#D4AF37', color: '#2D3E50' }}>
                  {(profile?.full_name?.charAt(0) || user.email?.charAt(0) || 'U').toUpperCase()}
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-serif font-bold" style={{ color: '#FFFFFF' }}>
                    {profile?.full_name || 'Welcome'}
                  </h1>
                  <p className="flex items-center gap-2" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    <Mail className="w-4 h-4" /> {user.email}
                  </p>
                </div>
              </div>
              <button onClick={handleSignOut} className="flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all duration-300 hover:scale-105" style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#FFFFFF', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Orders', value: orders.length, icon: ShoppingBag, color: '#3B82F6' },
              { label: 'Pending', value: orders.filter(o => o.status === 'pending').length, icon: Clock, color: '#F59E0B' },
              { label: 'Delivered', value: orders.filter(o => o.status === 'delivered').length, icon: CheckCircle, color: '#10B981' },
              { label: 'Transactions', value: transactions.length, icon: CreditCard, color: '#8B5CF6' },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="p-5 rounded-2xl transition-all duration-300 hover:scale-105" style={{ background: '#FFFFFF', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${stat.color}15` }}>
                      <Icon className="w-5 h-5" style={{ color: stat.color }} />
                    </div>
                  </div>
                  <div className="text-2xl font-bold" style={{ color: '#2D3E50' }}>{stat.value}</div>
                  <div className="text-sm" style={{ color: '#666666' }}>{stat.label}</div>
                </div>
              );
            })}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 p-1.5 rounded-2xl" style={{ background: '#FFFFFF', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all duration-300" style={{ background: activeTab === tab.id ? '#2D3E50' : 'transparent', color: activeTab === tab.id ? '#FFFFFF' : '#666666' }}>
                  <Icon className="w-4 h-4" /> {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="rounded-2xl p-6 md:p-8" style={{ background: '#FFFFFF', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-serif font-bold" style={{ color: '#2D3E50' }}>Profile Information</h2>
                    <p className="text-sm" style={{ color: '#666666' }}>Manage your personal details</p>
                  </div>
                  <button onClick={() => isEditing ? handleProfileUpdate(new Event('submit') as any) : setIsEditing(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 hover:scale-105" style={{ background: isEditing ? '#D4AF37' : '#F8F9FA', color: isEditing ? '#2D3E50' : '#666666' }}>
                    {isEditing ? <><Save className="w-4 h-4" /> Save</> : <><Edit className="w-4 h-4" /> Edit</>}
                  </button>
                </div>

                <form onSubmit={handleProfileUpdate} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#2D3E50' }}>Full Name</label>
                      <input type="text" value={profileData.full_name} onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })} disabled={!isEditing} className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-300" style={{ background: isEditing ? '#FFFFFF' : '#F8F9FA', border: '1px solid rgba(0,0,0,0.1)', color: '#2D3E50' }} placeholder="Enter your full name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center gap-1" style={{ color: '#2D3E50' }}><Phone className="w-4 h-4" /> Phone</label>
                      <input type="text" value={profileData.phone} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} disabled={!isEditing} className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-300" style={{ background: isEditing ? '#FFFFFF' : '#F8F9FA', border: '1px solid rgba(0,0,0,0.1)', color: '#2D3E50' }} placeholder="Enter phone number" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-1" style={{ color: '#2D3E50' }}><MapPin className="w-4 h-4" /> Address</label>
                    <input type="text" value={profileData.address} onChange={(e) => setProfileData({ ...profileData, address: e.target.value })} disabled={!isEditing} className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-300" style={{ background: isEditing ? '#FFFFFF' : '#F8F9FA', border: '1px solid rgba(0,0,0,0.1)', color: '#2D3E50' }} placeholder="Enter your address" />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-sm font-medium mb-2" style={{ color: '#2D3E50' }}>Pincode</label>
                    <input type="text" value={profileData.pincode} onChange={(e) => setProfileData({ ...profileData, pincode: e.target.value })} disabled={!isEditing} className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-300" style={{ background: isEditing ? '#FFFFFF' : '#F8F9FA', border: '1px solid rgba(0,0,0,0.1)', color: '#2D3E50' }} placeholder="Enter pincode" />
                  </div>
                </form>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-serif font-bold" style={{ color: '#2D3E50' }}>My Orders</h2>
                  <p className="text-sm" style={{ color: '#666666' }}>Track and manage your orders</p>
                </div>

                {ordersLoading ? (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 rounded-full mx-auto mb-4 animate-spin" style={{ border: '3px solid #D4AF37', borderTopColor: 'transparent' }} />
                    <p style={{ color: '#666666' }}>Loading orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 mx-auto mb-4" style={{ color: '#CCCCCC' }} />
                    <p className="text-lg font-medium mb-2" style={{ color: '#2D3E50' }}>No orders yet</p>
                    <p className="mb-4" style={{ color: '#666666' }}>Start shopping to see your orders here</p>
                    <button onClick={() => navigate('/shop')} className="px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105" style={{ background: '#D4AF37', color: '#2D3E50' }}>Browse Products</button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="p-5 rounded-xl transition-all duration-300 hover:scale-[1.01]" style={{ background: '#F8F9FA', borderLeft: `4px solid ${getStatusColor(order.status)}` }}>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${getStatusColor(order.status)}15` }}>
                              <span style={{ color: getStatusColor(order.status) }}>{getStatusIcon(order.status)}</span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold" style={{ color: '#2D3E50' }}>Order #{order.order_number}</h3>
                                <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: `${getStatusColor(order.status)}20`, color: getStatusColor(order.status) }}>{order.status.toUpperCase()}</span>
                              </div>
                              <p className="text-sm" style={{ color: '#666666' }}>{new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-xl font-bold" style={{ color: '#D4AF37' }}>₹{order.total_amount.toFixed(2)}</p>
                              <p className="text-xs" style={{ color: '#666666' }}>{order.payment_status}</p>
                            </div>
                            <button onClick={() => navigate(`/track-order/${order.id}`)} className="px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105" style={{ background: '#2D3E50', color: '#FFFFFF' }}>Track</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Payments Tab */}
            {activeTab === 'payments' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-serif font-bold" style={{ color: '#2D3E50' }}>Payment History</h2>
                  <p className="text-sm" style={{ color: '#666666' }}>View all your transactions</p>
                </div>

                {transactionsLoading ? (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 rounded-full mx-auto mb-4 animate-spin" style={{ border: '3px solid #D4AF37', borderTopColor: 'transparent' }} />
                    <p style={{ color: '#666666' }}>Loading transactions...</p>
                  </div>
                ) : transactions.length === 0 ? (
                  <div className="text-center py-12">
                    <CreditCard className="w-16 h-16 mx-auto mb-4" style={{ color: '#CCCCCC' }} />
                    <p className="text-lg font-medium mb-2" style={{ color: '#2D3E50' }}>No transactions yet</p>
                    <p style={{ color: '#666666' }}>Your payment history will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {transactions.map((transaction) => {
                      const statusColor = transaction.status === 'completed' ? '#10B981' : transaction.status === 'pending' ? '#F59E0B' : '#EF4444';
                      return (
                        <div key={transaction.id} className="flex items-center justify-between p-4 rounded-xl transition-all duration-300 hover:scale-[1.01]" style={{ background: '#F8F9FA' }}>
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${statusColor}15` }}>
                              <CreditCard className="w-5 h-5" style={{ color: statusColor }} />
                            </div>
                            <div>
                              <p className="font-semibold" style={{ color: '#2D3E50' }}>Transaction #{transaction.transaction_id}</p>
                              <p className="text-sm" style={{ color: '#666666' }}>{new Date(transaction.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold" style={{ color: '#D4AF37' }}>₹{transaction.amount.toFixed(2)}</p>
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: `${statusColor}20`, color: statusColor }}>{transaction.status.toUpperCase()}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UserDashboard;
