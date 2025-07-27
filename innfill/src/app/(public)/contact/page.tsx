// src/app/(public)/contact/page.tsx
'use client';

import React from 'react';
import StaticPageLayout from '@/components/Layouts/StaticPageLayout';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';

const ContactPage = () => {
  return (
    <StaticPageLayout 
      title="Get in Touch"
      subtitle="We're here to help and answer any question you might have. We look forward to hearing from you."
    >
      <div className="grid md:grid-cols-2 gap-12">
        {/* Contact Information */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Contact Information</h2>
          <p className="text-gray-400">
            Fill up the form and our team will get back to you within 24 hours. You can also reach us through the channels below.
          </p>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <FiMail className="w-6 h-6 text-violet-400" />
              <a href="mailto:support@innfill.com" className="text-gray-300 hover:text-white transition-colors">support@innfill.com</a>
            </div>
            <div className="flex items-center space-x-4">
              <FiPhone className="w-6 h-6 text-violet-400" />
              <span className="text-gray-300">+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center space-x-4">
              <FiMapPin className="w-6 h-6 text-violet-400" />
              <span className="text-gray-300">123 Innovation Drive, Silicon Valley, CA</span>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Send us a Message</h2>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
            <input type="text" id="name" name="name" required className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-violet-500 focus:border-violet-500 transition" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
            <input type="email" id="email" name="email" required className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-violet-500 focus:border-violet-500 transition" />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">Message</label>
            <textarea id="message" name="message" rows={4} required className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-violet-500 focus:border-violet-500 transition"></textarea>
          </div>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 px-4 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 transition-colors flex items-center justify-center shadow-lg shadow-violet-500/20"
          >
            <FiSend className="mr-2" /> Send Message
          </motion.button>
        </form>
      </div>
    </StaticPageLayout>
  );
};

export default ContactPage;
