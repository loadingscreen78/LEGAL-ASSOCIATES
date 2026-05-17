import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  CreditCard, 
  LogOut,
  ChevronLeft,
  User,
  Sparkles
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { AnimatedLogo } from '@/components/AnimatedLogo';
import { useToast } from '@/hooks/use-toast';

const navItems = [
  {
    title: 'Dashboard',
    url: '/admin-dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Products',
    url: '/admin-dashboard/products',
    icon: Package,
  },
  {
    title: 'Orders',
    url: '/admin-dashboard/orders',
    icon: ShoppingCart,
  },
  {
    title: 'Transactions',
    url: '/admin-dashboard/transactions',
    icon: CreditCard,
  },
  {
    title: 'Landing Page',
    url: '/admin-dashboard/landing-editor',
    icon: Sparkles,
  },
];

export function AdminSidebar() {
  const { open } = useSidebar();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of the admin portal.",
      });
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Sidebar className={!open ? "w-14" : "w-60"} collapsible="icon" style={{ background: '#FFFFFF', borderRight: '1px solid #E2E8F0' }}>
      <SidebarContent>
        {/* Header with Logo */}
        <div className="p-4 border-b" style={{ borderColor: '#E2E8F0' }}>
          {!open ? (
            <div className="flex justify-center">
              <SidebarTrigger />
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <AnimatedLogo />
              <SidebarTrigger />
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <SidebarGroup>
          {open && <SidebarGroupLabel style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Navigation</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.url === '/admin-dashboard'}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 ${
                          isActive 
                            ? 'font-semibold' 
                            : 'hover:scale-[1.02]'
                        }`
                      }
                      style={({ isActive }) => ({
                        background: isActive ? '#F8FAFC' : 'transparent',
                        color: isActive ? '#2563EB' : '#64748B',
                        border: isActive ? '1px solid #DBEAFE' : '1px solid transparent',
                      })}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {open && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User Section */}
        <div className="mt-auto border-t p-4" style={{ borderColor: '#E2E8F0' }}>
          {!open ? (
            <div className="flex flex-col gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full p-2 h-auto hover:bg-slate-100"
                title="User Profile"
                style={{ color: '#64748B' }}
              >
                <User className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="w-full p-2 h-auto hover:bg-red-50"
                title="Sign Out"
                style={{ color: '#DC2626' }}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <div className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold" style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', color: '#FFFFFF' }}>
                  {user?.email?.charAt(0).toUpperCase() || 'A'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: '#1E293B' }}>
                    Admin
                  </p>
                  <p className="text-xs truncate" style={{ color: '#64748B' }}>
                    {user?.email}
                  </p>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="w-full justify-start gap-3 hover:bg-red-50 transition-all duration-300"
                style={{ color: '#DC2626' }}
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          )}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}