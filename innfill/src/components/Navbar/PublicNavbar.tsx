// src/components/Navbar/PublicNavbar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const PublicNavbar = () => {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl mx-auto z-50"
    >
      <div className="container mx-auto px-6 py-3 flex justify-between items-center bg-black/30 backdrop-blur-lg rounded-xl border border-white/10 shadow-lg">
        <Link href="/" passHref>
          <motion.div 
            className="text-2xl font-bold text-white cursor-pointer"
            whileHover={{ scale: 1.05, color: '#a78bfa' }}
          >
            Innfill
          </motion.div>
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/auth/login" passHref>
            <motion.div
              className="text-white font-medium cursor-pointer relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:w-0 after:h-[2px] after:bg-violet-400 after:transition-all after:duration-300 hover:after:w-full"
              whileHover={{ y: -2 }}
            >
              Login
            </motion.div>
          </Link>
          <Link href="/auth/signup" passHref>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-violet-500 text-white font-semibold px-5 py-2 rounded-lg shadow-md hover:bg-violet-600 transition-colors duration-300"
            >
              Sign Up
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
};

export default PublicNavbar;
