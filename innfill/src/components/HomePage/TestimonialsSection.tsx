// src/components/HomePage/TestimonialsSection.tsx
'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import Image from 'next/image';

const testimonials = [
  {
    quote: 'Innfill transformed how we hire. The AI matching is scarily accurate, and we found the perfect developer in just two days. A total game-changer for our workflow.',
    name: 'Aisha Khan',
    role: 'Product Manager, TechNova',
    avatar: '/avatars/avatar-1.png', // Placeholder path
  },
  {
    quote: 'As a freelancer, the gamified experience keeps me incredibly motivated. I\'ve doubled my income and built a portfolio I\'m proud of, all thanks to this platform.',
    name: 'David Chen',
    role: 'Full-Stack Developer',
    avatar: '/avatars/avatar-2.png', // Placeholder path
  },
  {
    quote: 'The secure escrow and transparent communication tools gave us the confidence to tackle a major project. The entire process was seamless from start to finish.',
    name: 'Priya Sharma',
    role: 'Founder, Creative Solutions',
    avatar: '/avatars/avatar-3.png', // Placeholder path
  },
];

const cardVariants: Variants = {
  offscreen: {
    y: 100,
    opacity: 0,
  },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: {
      stiffness: 90,
      damping: 15,
      bounce: 0.4,
      duration: 1,
    },
  },
};

const TestimonialsSection = () => {
  return (
    <section className="py-20 sm:py-32 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-bold text-white tracking-tight"
          >
            Loved by Innovators Worldwide
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 max-w-2xl mx-auto text-lg text-gray-400"
          >
            Don't just take our word for it. Here's what our users are saying.
          </motion.p>
        </div>
        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-lg shadow-lg flex flex-col"
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: 0.3 }}
              variants={cardVariants}
            >
              <div className="flex-grow mb-6">
                <p className="text-gray-300 text-lg italic">"{testimonial.quote}"</p>
              </div>
              <div className="flex items-center mt-auto">
                {/* <Image
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  width={48}
                  height={48}
                  className="rounded-full mr-4"
                /> */}
                <div className="w-12 h-12 rounded-full mr-4 bg-violet-500/20 flex-shrink-0"></div>
                <div>
                  <p className="font-semibold text-white">{testimonial.name}</p>
                  <p className="text-violet-400 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
