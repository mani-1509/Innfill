// src/components/Layouts/AuthLayout.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl shadow-violet-500/10 border border-white/10">
        {/* Left Panel: Visuals & Branding */}
        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
          className="hidden lg:flex flex-col justify-between p-12 bg-gray-800/50 relative overflow-hidden"
        >
          <div className="absolute inset-0 z-0">
            <svg className='absolute inset-0 w-full h-full' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 800'>
              <defs>
                <radialGradient id='grad_auth' cx='50%' cy='50%' r='50%' fx='50%' fy='50%'>
                  <stop offset='0%' style={{stopColor: 'rgba(124, 58, 237, 0.2)', stopOpacity: 1}} />
                  <stop offset='100%' style={{stopColor: 'rgba(124, 58, 237, 0)', stopOpacity: 0}} />
                </radialGradient>
              </defs>
              <rect width='100%' height='100%' fill='transparent' />
              <motion.circle 
                cx='400' 
                cy='400' 
                r='300' 
                fill='url(#grad_auth)' 
                animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
              />
            </svg>
          </div>
          <div className="relative z-10">
            <Link href="/" passHref>
              <div className="text-3xl font-bold text-white cursor-pointer mb-8">Innfill</div>
            </Link>
            <h1 className="text-4xl font-bold leading-tight">Welcome Back to the Future of Work.</h1>
            <p className="mt-4 text-gray-300 text-lg">Connect, collaborate, and create with the best talent on the planet.</p>
          </div>
          <div className="relative z-10 text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Innfill, Inc. All rights reserved.
          </div>
        </motion.div>

        {/* Right Panel: Form Content */}
        <motion.div 
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1], delay: 0.2 }}
          className="w-full bg-gray-900 p-8 sm:p-12 flex flex-col justify-center"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
