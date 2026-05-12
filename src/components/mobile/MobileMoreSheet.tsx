import { Link } from 'react-router-dom';
import {
  Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerClose,
} from '@/components/ui/drawer';
import {
  Menu, Users, MapPin, Scale, FileText, Phone, Mail, Truck, ShieldCheck, LogOut, LogIn,
  Moon, Sun,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

/**
 * MobileMoreSheet — bottom-sheet that surfaces every secondary route the
 * bottom tab bar can't fit (Founder, Visit Store, OCR, Track Order, etc).
 * Also carries quick contact shortcuts + theme toggle + sign-out.
 */
export const MobileMoreSheet = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({ title: 'Signed out', description: 'You have been logged out.' });
      navigate('/');
    } catch {
      toast({ title: 'Sign out failed', variant: 'destructive' });
    }
  };

  const sections: {
    heading: string;
    items: {
      to?: string;
      href?: string;
      label: string;
      icon: React.ComponentType<{ className?: string }>;
      sub?: string;
      onClick?: () => void;
    }[];
  }[] = [
    {
      heading: 'Explore',
      items: [
        { to: '/founder', label: 'Founder', icon: Users, sub: "Our story since 1985" },
        { to: '/visit-store', label: 'Visit store', icon: MapPin, sub: 'High Court Road, Cuttack' },
        { to: '/orissa-criminal-reports', label: 'Orissa Criminal Reports', icon: Scale, sub: 'Monthly legal journal' },
      ],
    },
    {
      heading: 'Your activity',
      items: user
        ? [
            { to: '/user-dashboard', label: 'My orders', icon: Truck, sub: 'Track and manage' },
            { to: '/user-dashboard', label: 'Account settings', icon: ShieldCheck, sub: 'Profile & address' },
          ]
        : [{ to: '/login', label: 'Sign in or create account', icon: LogIn, sub: 'Track orders, faster checkout' }],
    },
    {
      heading: 'Contact',
      items: [
        { href: 'tel:+919437019131', label: 'Call us', icon: Phone, sub: '+91 94370 19131' },
        { href: 'mailto:legalassociates.ocr@gmail.com', label: 'Email us', icon: Mail, sub: 'legalassociates.ocr@gmail.com' },
      ],
    },
  ];

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button
          aria-label="More options"
          className="w-11 h-11 rounded-full flex items-center justify-center tap-fade"
          style={{
            background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(45,62,80,0.06)',
            color: isDark ? '#FFFFFF' : '#2D3E50',
          }}
        >
          <Menu className="w-5 h-5" />
        </button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader>
          <DrawerTitle>Menu</DrawerTitle>
        </DrawerHeader>

        <div className="px-4 pb-8 overflow-y-auto" style={{ maxHeight: '72vh' }}>
          {sections.map((sec) => (
            <section key={sec.heading} className="mb-5 last:mb-0">
              <h3 className="text-[11px] uppercase tracking-wide mb-2 px-1 text-muted-foreground">
                {sec.heading}
              </h3>
              <ul className="space-y-1">
                {sec.items.map((it) => {
                  const Ic = it.icon;
                  const content = (
                    <div className="flex items-center gap-3 h-14 px-3 rounded-2xl tap-fade hover:bg-accent/10">
                      <span className="w-10 h-10 rounded-xl flex items-center justify-center bg-accent/10 text-accent">
                        <Ic className="w-4 h-4" />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-[14px] font-medium truncate">{it.label}</span>
                        {it.sub && <span className="block text-[11px] text-muted-foreground truncate">{it.sub}</span>}
                      </span>
                    </div>
                  );
                  return (
                    <li key={it.label}>
                      <DrawerClose asChild>
                        {it.href ? (
                          <a href={it.href}>{content}</a>
                        ) : (
                          <Link to={it.to!}>{content}</Link>
                        )}
                      </DrawerClose>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}

          {/* Quick actions */}
          <section className="flex gap-2">
            <button
              onClick={toggleTheme}
              className="flex-1 h-11 rounded-full flex items-center justify-center gap-2 text-[13px] font-medium tap-fade border"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {isDark ? 'Light mode' : 'Dark mode'}
            </button>
            {user && (
              <DrawerClose asChild>
                <button
                  onClick={handleSignOut}
                  className="flex-1 h-11 rounded-full flex items-center justify-center gap-2 text-[13px] font-semibold tap-fade"
                  style={{ border: '1px solid rgba(239,68,68,0.3)', color: '#EF4444' }}
                >
                  <LogOut className="w-4 h-4" /> Sign out
                </button>
              </DrawerClose>
            )}
          </section>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
