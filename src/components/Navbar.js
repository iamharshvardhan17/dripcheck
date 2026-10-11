'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shirt, Menu, X, ArrowRight } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isLandingPage = pathname === '/';

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'My Wardrobe', href: '/wardrobe' },
    { name: 'Outfit Picker', href: '/outfit' },
  ];

  const toggleMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            onClick={closeMenu}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-700 group-hover:bg-brand-100 group-hover:scale-105 transition-all">
              <Shirt className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-brand-700">
              DripCheck
            </span>
          </Link>

          {/* Desktop Navigation */}
          {isLandingPage ? (
            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 shadow-sm hover:shadow transition-all"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <nav className="hidden md:flex items-center space-x-1 h-full">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`inline-flex items-center h-full px-4 text-sm font-medium transition-colors border-b-2 ${
                      isActive
                        ? 'border-brand-600 text-brand-600 font-semibold'
                        : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-200'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={toggleMenu}
              aria-label="Toggle navigation menu"
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-gray-100 bg-white px-4 pt-2 pb-4 space-y-2 shadow-lg">
          {isLandingPage ? (
            <div className="pt-2 pb-1">
              <Link
                href="/dashboard"
                onClick={closeMenu}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 shadow-sm"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className={`block px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-brand-50 text-brand-700 font-semibold'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })
          )}
        </div>
      )}
    </header>
  );
}
