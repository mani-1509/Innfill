// src/components/HomePage/Footer.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { FiTwitter, FiGithub, FiLinkedin } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-white/10">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" passHref>
                <div className="text-2xl font-bold text-white cursor-pointer">Innfill</div>
            </Link>
            <p className="mt-4 text-gray-400 text-sm">The future of freelance is here. Connect, create, and conquer.</p>
            <div className="mt-6 flex space-x-4">
                <motion.a href="#" whileHover={{ y: -2, color: '#a78bfa' }} className="text-gray-400 hover:text-violet-400 transition-colors"><FiTwitter /></motion.a>
                <motion.a href="#" whileHover={{ y: -2, color: '#a78bfa' }} className="text-gray-400 hover:text-violet-400 transition-colors"><FiGithub /></motion.a>
                <motion.a href="#" whileHover={{ y: -2, color: '#a78bfa' }} className="text-gray-400 hover:text-violet-400 transition-colors"><FiLinkedin /></motion.a>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Solutions</h3>
            <ul className="mt-4 space-y-3">
              <li><Link href="/projects"><div className="text-base text-gray-400 hover:text-white transition-colors cursor-pointer">Find Projects</div></Link></li>
              <li><Link href="/freelancers"><div className="text-base text-gray-400 hover:text-white transition-colors cursor-pointer">Find Talent</div></Link></li>
              <li><Link href="#"><div className="text-base text-gray-400 hover:text-white transition-colors cursor-pointer">How it Works</div></Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Company</h3>
            <ul className="mt-4 space-y-3">
              <li><Link href="#"><div className="text-base text-gray-400 hover:text-white transition-colors cursor-pointer">About Us</div></Link></li>
              <li><Link href="#"><div className="text-base text-gray-400 hover:text-white transition-colors cursor-pointer">Contact</div></Link></li>
              <li><Link href="#"><div className="text-base text-gray-400 hover:text-white transition-colors cursor-pointer">Careers</div></Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-3">
              <li><Link href="#"><div className="text-base text-gray-400 hover:text-white transition-colors cursor-pointer">Terms of Service</div></Link></li>
              <li><Link href="#"><div className="text-base text-gray-400 hover:text-white transition-colors cursor-pointer">Privacy Policy</div></Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-8 text-center">
          <p className="text-base text-gray-400">&copy; {new Date().getFullYear()} Innfill, Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
