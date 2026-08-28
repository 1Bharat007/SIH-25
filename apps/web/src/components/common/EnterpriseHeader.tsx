'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Compass,
  Shirt,
  Shield,
  AlertTriangle,
  DownloadCloud,
  Globe,
  Menu,
  X,
} from 'lucide-react';

const NAV_LINKS = [
  { href: '/', label: 'Overview', icon: Compass },
  { href: '/explore', label: 'Places & Permits', icon: Compass },
  { href: '/culture/ar-demo', label: 'Cultural AR Studio', icon: Shirt },
  { href: '/safety', label: 'Safety & SOS', icon: Shield },
  { href: '/disaster', label: 'Disaster Alerts', icon: AlertTriangle },
  { href: '/offline-settings', label: 'Offline Data', icon: DownloadCloud },
];

export default function EnterpriseHeader() {
  const pathname = usePathname();
  const [selectedLang, setSelectedLang] = useState<'EN' | 'HI' | 'NE'>('EN');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  return (
    <header className="w-full bg-[#FFFFFF] border-b border-[#DADCE0] sticky top-0 z-40">
      {/* Top Government Auxiliary Strip */}
      <div className="bg-[#F8F9FA] border-b border-[#DADCE0] px-4 py-1.5 text-[11px] text-[#5F6368] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-medium text-[#202124]">Government of Sikkim</span>
          <span>•</span>
          <span>Tourism & Civil Aviation Department</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Language Switcher Pill */}
          <div className="flex items-center border border-[#DADCE0] bg-[#FFFFFF] rounded-full p-0.5 text-[11px]">
            <Globe className="w-3 h-3 text-[#5F6368] ml-1.5 mr-1" />
            <button
              onClick={() => setSelectedLang('EN')}
              className={`px-2 py-0.5 rounded-full transition-colors ${
                selectedLang === 'EN'
                  ? 'bg-[#0B3D91] text-[#FFFFFF] font-medium'
                  : 'text-[#5F6368] hover:text-[#202124]'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setSelectedLang('HI')}
              className={`px-2 py-0.5 rounded-full transition-colors ${
                selectedLang === 'HI'
                  ? 'bg-[#0B3D91] text-[#FFFFFF] font-medium'
                  : 'text-[#5F6368] hover:text-[#202124]'
              }`}
            >
              हिंदी
            </button>
            <button
              onClick={() => setSelectedLang('NE')}
              className={`px-2 py-0.5 rounded-full transition-colors ${
                selectedLang === 'NE'
                  ? 'bg-[#0B3D91] text-[#FFFFFF] font-medium'
                  : 'text-[#5F6368] hover:text-[#202124]'
              }`}
            >
              नेपाली
            </button>
          </div>
        </div>
      </div>

      {/* Main Enterprise Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        {/* Brand & Portal Identity */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-[4px] bg-[#0B3D91] flex items-center justify-center text-[#FFFFFF] font-medium text-[15px]">
            SY
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[17px] font-medium text-[#0B3D91] tracking-tight">
                Sikkim Yatra
              </span>
              <span className="bg-[#E8F0FE] text-[#1A73E8] border border-[#D2E3FC] px-1.5 py-0.2 text-[10px] font-medium rounded-full">
                Portal
              </span>
            </div>
            <p className="text-[11px] text-[#5F6368] leading-none hidden sm:block">
              Integrated Tourism, Safety & Culture System
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-[4px] text-[13px] font-medium transition-colors ${
                  isActive
                    ? 'bg-[#E8F0FE] text-[#0B3D91]'
                    : 'text-[#5F6368] hover:text-[#202124] hover:bg-[#F8F9FA]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Hamburger Toggle */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-[4px] text-[#5F6368] hover:text-[#202124] hover:bg-[#F8F9FA] border border-[#DADCE0]"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#DADCE0] bg-[#FFFFFF] px-4 py-3 space-y-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-[4px] text-[14px] font-medium ${
                  isActive
                    ? 'bg-[#E8F0FE] text-[#0B3D91]'
                    : 'text-[#5F6368] hover:text-[#202124] hover:bg-[#F8F9FA]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
