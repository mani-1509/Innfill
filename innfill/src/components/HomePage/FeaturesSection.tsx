// src/components/HomePage/FeaturesSection.tsx
'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { FiCpu, FiShield, FiMessageSquare, FiTrendingUp, FiAward, FiUsers } from 'react-icons/fi';

const features = [
  {
    icon: <FiCpu className="w-8 h-8 text-violet-400" />,
    title: 'AI-Powered Matching',
    description: 'Our intelligent algorithms connect you with the most relevant projects or the perfect freelance talent, saving you time and effort.',
  },
  {
    icon: <FiShield className="w-8 h-8 text-violet-400" />,
    title: 'Secure Escrow & Payments',
    description: 'Work with confidence. Our robust escrow system ensures that payments are secure and released only upon project completion.',
  },
  {
    icon: <FiMessageSquare className="w-8 h-8 text-violet-400" />,
    title: 'Real-Time Collaboration',
    description: 'Communicate seamlessly with integrated messaging and file sharing, keeping your projects on track and your team in sync.',
  },
  {
    icon: <FiTrendingUp className="w-8 h-8 text-violet-400" />,
    title: 'Skill & Career Growth',
    description: 'Level up with our gamified system. Earn badges, complete challenges, and access resources to build your reputation.',
  },
  {
    icon: <FiAward className="w-8 h-8 text-violet-400" />,
    title: 'Quality-Vetted Talent',
    description: 'Access a curated network of top-tier freelancers who have been vetted for their skills and professionalism.',
  },
  {
    icon: <FiUsers className="w-8 h-8 text-violet-400" />,
    title: 'Community & Networking',
    description: 'Join a vibrant community of innovators. Connect with peers, share insights, and grow your professional network.',
  },
];

const cardVariants: Variants = {
  offscreen: {
    y: 50,
    opacity: 0,
  },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: {
      stiffness: 90,
      damping: 15,
      bounce: 0.4,
      duration: 0.8,
    },
  },
};

const FeaturesSection = () => {
  return (
    <section className="py-20 sm:py-32 bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-bold text-white tracking-tight"
          >
            Everything You Need to Succeed
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 max-w-2xl mx-auto text-lg text-gray-400"
          >
            Innfill provides a comprehensive suite of tools designed for modern collaboration and growth.
          </motion.p>
        </div>
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-lg shadow-lg transition-all duration-300 hover:border-violet-400/50 hover:bg-white/10"
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: 0.3 }}
              variants={cardVariants}
            >
              <div className="flex-shrink-0 mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
              <p className="mt-3 text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
