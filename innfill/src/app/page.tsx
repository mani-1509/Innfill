// src/app/page.tsx
'use client';

import React from 'react';
import PublicNavbar from '@/components/Navbar/PublicNavbar';
import { motion } from 'framer-motion';
import Link from 'next/link';
import FeaturesSection from '@/components/HomePage/FeaturesSection';
import TestimonialsSection from '@/components/HomePage/TestimonialsSection';
import CTASection from '@/components/HomePage/CTASection';
import Footer from '@/components/HomePage/Footer';

const HeroSection = () => {
  return (
    <section className="relative w-full h-screen flex items-center justify-center text-center overflow-hidden bg-gray-900">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <svg className='absolute inset-0 w-full h-full' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 800'>
          <defs>
            <radialGradient id='grad1' cx='50%' cy='50%' r='50%' fx='50%' fy='50%'>
              <stop offset='0%' style={{stopColor: 'rgba(124, 58, 237, 0.3)', stopOpacity: 1}} />
              <stop offset='100%' style={{stopColor: 'rgba(124, 58, 237, 0)', stopOpacity: 0}} />
            </radialGradient>
          </defs>
          <rect width='100%' height='100%' fill='transparent' />
          <motion.circle 
            cx='400' 
            cy='400' 
            r='200' 
            fill='url(#grad1)' 
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 max-w-4xl mx-auto px-4"
      >
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Find Your Spark.
          <br />
          <span className="text-violet-400">Ignite Your Project.</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
          Innfill is the premier platform connecting innovative projects with elite freelance talent. Let's build the future, together.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth/signup" passHref>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0px 0px 20px rgba(167, 139, 250, 0.5)' }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-violet-600 text-white font-semibold rounded-lg shadow-lg hover:bg-violet-700 transition-all duration-300"
            >
              Join the Future
            </motion.button>
          </Link>
          <Link href="/projects" passHref>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0px 0px 15px rgba(255, 255, 255, 0.2)' }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-lg backdrop-blur-sm hover:bg-white/20 transition-all duration-300"
            >
              Explore Projects
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <PublicNavbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}

