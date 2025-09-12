'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Brain, BarChart3, Menu, X, User } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: <BarChart3 className='h-4 w-4' />,
    },
    {
      name: 'Stok',
      href: '/stok',
      icon: <Package className='h-4 w-4' />,
    },
    {
      name: 'Prediksi AI',
      href: '/prediksi',
      icon: <Brain className='h-4 w-4' />,
    },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm'
          : 'bg-white/80 backdrop-blur-md border-b border-gray-100'
      }`}
    >
      <div className='container mx-auto px-4'>
        <div className='flex h-16 items-center justify-between'>
          {/* Logo */}
          <Link href='/' className='flex items-center space-x-2'>
            <motion.div
              whileHover={{ rotate: 10 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              className='flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-[#C4D9FF] to-[#C5BAFF]'
            >
              <Package className='h-5 w-5 text-white' />
            </motion.div>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='text-xl font-bold bg-gradient-to-r from-[#C4D9FF] to-[#C5BAFF] bg-clip-text text-transparent'
            >
              Smart Inventory
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center space-x-1'>
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className='relative px-3 py-2'
                >
                  <motion.div
                    whileHover={{ y: -2 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                    className={`flex items-center space-x-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                      isActive
                        ? 'text-[#C5BAFF]'
                        : 'text-gray-600 hover:text-[#C4D9FF]'
                    }`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </motion.div>

                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId='navbar-indicator'
                      className='absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#C4D9FF] to-[#C5BAFF] rounded-t-full'
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* User Profile (Desktop) */}
          <motion.div
            className='hidden md:flex items-center'
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className='flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-[#C4D9FF] to-[#C5BAFF]'>
              <User className='h-4 w-4 text-white' />
            </div>
          </motion.div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className='md:hidden p-2 rounded-md text-gray-600 hover:text-[#C4D9FF] hover:bg-gray-100 focus:outline-none'
            aria-label='Toggle menu'
          >
            {isOpen ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className='md:hidden overflow-hidden'
            >
              <div className='py-4 space-y-2 border-t border-gray-200'>
                {navItems.map((item) => {
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center space-x-3 rounded-lg px-4 py-3 text-base font-medium transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-[#C4D9FF]/10 to-[#C5BAFF]/10 text-[#C5BAFF]'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {item.icon}
                      <span>{item.name}</span>
                      {isActive && (
                        <div className='ml-auto h-2 w-2 rounded-full bg-gradient-to-r from-[#C4D9FF] to-[#C5BAFF]'></div>
                      )}
                    </Link>
                  );
                })}

                {/* Mobile User Profile */}
                <div className='pt-4 mt-4 border-t border-gray-200'>
                  <div className='flex items-center space-x-3 px-4 py-3'>
                    <div className='flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-[#C4D9FF] to-[#C5BAFF]'>
                      <User className='h-4 w-4 text-white' />
                    </div>
                    <span className='text-sm font-medium text-gray-700'>
                      Admin
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
