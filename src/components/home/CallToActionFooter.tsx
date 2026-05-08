import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, Clock, Send, Facebook, Twitter, Linkedin, Instagram, ArrowRight, BookOpen, Scale, Heart } from 'lucide-react';

export const CallToActionFooter = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const quickLinks = [
    { label: 'Our Books', href: '/books' },
    { label: 'Journals', href: '/journals' },
    { label: 'Shop', href: '/shop' },
    { label: 'About Founder', href: '/founder' },
  ];

  const categories = [
    { label: 'Criminal Law', href: '/shop?category=criminal' },
    { label: 'Civil Law', href: '/shop?category=civil' },
    { label: 'Bare Acts', href: '/shop?category=bare-acts' },
    { label: 'Odisha Laws', href: '/shop?category=odisha' },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Instagram, href: '#', label: 'Instagram' },
  ];

  return (
    <footer className="relative overflow-hidden" style={{ background: '#101820' }}>
      {/* Newsletter Section */}
      <div className="relative py-20" style={{ background: 'linear-gradient(135deg, #2D3E50 0%, #101820 100%)' }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ background: 'rgba(212, 175, 55, 0.2)', border: '1px solid rgba(212, 175, 55, 0.4)' }}>
              <Mail className="w-4 h-4" style={{ color: '#D4AF37' }} />
              <span className="text-sm font-medium" style={{ color: '#D4AF37' }}>Newsletter</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4" style={{ color: '#FFFFFF' }}>
              Stay Updated with <span style={{ color: '#D4AF37' }}>Legal Publications</span>
            </h2>
            <p className="text-lg mb-8" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Subscribe to receive the latest releases, legal updates, and exclusive offers
            </p>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <div className="flex-1 relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#666666' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full pl-12 pr-4 py-4 rounded-xl text-base outline-none transition-all duration-300 focus:ring-2"
                  style={{ background: '#FFFFFF', color: '#2D3E50', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}
                  required
                />
              </div>
              <button
                type="submit"
                className="px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105"
                style={{ background: '#D4AF37', color: '#2D3E50', boxShadow: '0 4px 20px rgba(212, 175, 55, 0.3)' }}
              >
                {isSubscribed ? 'Subscribed!' : 'Subscribe'}
                <Send className="w-5 h-5" />
              </button>
            </form>

            {isSubscribed && (
              <p className="mt-4 animate-fade-in" style={{ color: '#D4AF37' }}>
                Thank you for subscribing! Check your inbox for confirmation.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-16" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand Column */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: '#D4AF37' }}>
                  <Scale className="w-6 h-6" style={{ color: '#2D3E50' }} />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-xl" style={{ color: '#FFFFFF' }}>Legal Associates</h3>
                  <p className="text-xs" style={{ color: '#D4AF37' }}>Since 1980</p>
                </div>
              </div>
              <p className="mb-6 leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                Your trusted partner in legal publishing. Quality, accuracy, and reliability in every publication for over four decades.
              </p>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a key={index} href={social.href} aria-label={social.label} className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110" style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      <Icon className="w-5 h-5" style={{ color: '#FFFFFF' }} />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-lg mb-6 flex items-center gap-2" style={{ color: '#D4AF37' }}>
                <BookOpen className="w-5 h-5" /> Quick Links
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link to={link.href} className="flex items-center gap-2 transition-all duration-300 hover:translate-x-2" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      <ArrowRight className="w-4 h-4" style={{ color: '#D4AF37' }} />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="font-semibold text-lg mb-6 flex items-center gap-2" style={{ color: '#D4AF37' }}>
                <Scale className="w-5 h-5" /> Categories
              </h4>
              <ul className="space-y-3">
                {categories.map((cat, index) => (
                  <li key={index}>
                    <Link to={cat.href} className="flex items-center gap-2 transition-all duration-300 hover:translate-x-2" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      <ArrowRight className="w-4 h-4" style={{ color: '#D4AF37' }} />
                      {cat.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-semibold text-lg mb-6 flex items-center gap-2" style={{ color: '#D4AF37' }}>
                <Phone className="w-5 h-5" /> Contact Us
              </h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 mt-1 flex-shrink-0" style={{ color: '#D4AF37' }} />
                  <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Main Road, Cuttack, Odisha 753001, India</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 flex-shrink-0" style={{ color: '#D4AF37' }} />
                  <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>+91 9437019131</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 flex-shrink-0" style={{ color: '#D4AF37' }} />
                  <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>info@legalassociates.com</span>
                </li>
                <li className="flex items-center gap-3">
                  <Clock className="w-5 h-5 flex-shrink-0" style={{ color: '#D4AF37' }} />
                  <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Mon-Sat: 10 AM - 8 PM</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="py-6" style={{ background: 'rgba(0, 0, 0, 0.3)', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              © 2024 Legal Associates. All Rights Reserved.
            </p>
            <p className="text-sm flex items-center gap-1" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              Made with <Heart className="w-4 h-4" style={{ color: '#D4AF37' }} /> for Legal Professionals
            </p>
          </div>
        </div>
      </div>

      {/* WhatsApp Button */}
      <a href="https://wa.me/919437019131" target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 animate-bounce-subtle" style={{ background: '#25D366', boxShadow: '0 4px 20px rgba(37, 211, 102, 0.4)' }}>
        <svg className="w-7 h-7" fill="#FFFFFF" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </a>
    </footer>
  );
};
