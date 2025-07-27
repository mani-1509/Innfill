// src/components/Layouts/StaticPageLayout.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import PublicNavbar from '@/components/Navbars/PublicNavbar';
import Footer from '@/components/Landing/Footer';

const StaticPageLayout = ({ 
  title,
  subtitle,
  children 
}: { 
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <PublicNavbar />
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">{title}</h1>
            <p className="mt-4 text-lg text-gray-400">{subtitle}</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            className="bg-gray-800/50 border border-white/10 rounded-2xl p-8 sm:p-12 shadow-lg prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-headings:text-white prose-a:text-violet-400 hover:prose-a:text-violet-300"
          >
            {children}
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StaticPageLayout;
