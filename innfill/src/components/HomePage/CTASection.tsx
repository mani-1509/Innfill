// src/components/HomePage/CTASection.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const CTASection = () => {
  return (
    <section className="py-20 sm:py-24 bg-gray-900/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Ready to Build the Future?
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
            Join a growing community of forward-thinking freelancers and innovative companies. Your next big opportunity is just a click away.
          </p>
          <div className="mt-10">
            <Link href="/auth/signup" passHref>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0px 0px 25px rgba(167, 139, 250, 0.6)' }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 bg-violet-600 text-white font-semibold rounded-lg shadow-lg hover:bg-violet-700 transition-all duration-300 text-lg"
              >
                Get Started for Free
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
