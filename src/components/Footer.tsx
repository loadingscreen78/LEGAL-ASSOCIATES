import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, ArrowRight, Scale, BookOpen, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const quickLinks = [
  { label: 'Law Journals', href: '/journals', icon: '📘' },
  { label: 'Legal Books', href: '/books', icon: '📚' },
  { label: 'Court Publications', href: '/shop', icon: '🏛️' },
  { label: 'Bare Acts', href: '/shop', icon: '📜' },
];

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Instagram, href: '#', label: 'Instagram' },
];

export const Footer = () => {
  return (
    <footer className="relative overflow-hidden" style={{ background: '#101820' }}>
      {/* Top Border */}
      <div className="h-1" style={{ background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)' }} />
      
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand */}
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
                Your trusted partner in legal publishing. Quality, accuracy, and reliability in every publication.
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
                      <span>{link.icon}</span>
                      {link.label}
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
                  <div>
                    <p className="font-semibold" style={{ color: '#FFFFFF' }}>LEGAL ASSOCIATES</p>
                    <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>High Court Road, Cuttack - 753002, Odisha</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 flex-shrink-0" style={{ color: '#D4AF37' }} />
                  <div className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    <p>+91 9437019131</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 flex-shrink-0" style={{ color: '#D4AF37' }} />
                  <span className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>legalassociates.ocr@gmail.com</span>
                </li>
              </ul>
            </div>

            {/* Hours */}
            <div>
              <h4 className="font-semibold text-lg mb-6 flex items-center gap-2" style={{ color: '#D4AF37' }}>
                <Clock className="w-5 h-5" /> Working Hours
              </h4>
              <div className="p-4 rounded-xl" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <div className="flex items-center justify-between mb-3 pb-3" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Monday - Saturday</span>
                  <span className="font-semibold" style={{ color: '#FFFFFF' }}>10 AM - 8 PM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Sunday</span>
                  <span className="font-semibold" style={{ color: '#D4AF37' }}>Closed</span>
                </div>
              </div>
              <Link to="/shop" className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-full font-medium transition-all duration-300 hover:scale-105" style={{ background: '#D4AF37', color: '#2D3E50' }}>
                Visit Shop <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="py-6" style={{ background: 'rgba(0, 0, 0, 0.3)', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>© 2024 Legal Associates. All Rights Reserved.</p>
          <p className="text-sm mt-1" style={{ color: '#D4AF37' }}>Empowering Legal Minds Since Decades</p>
        </div>
      </div>
    </footer>
  );
};
