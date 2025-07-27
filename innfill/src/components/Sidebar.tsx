// src/components/Sidebar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { UserProfile } from '@/types/types';
import { motion } from 'framer-motion';
import {
  FiHome, FiRss, FiMessageSquare, FiBriefcase, 
  FiDollarSign, FiBell, FiUser, FiLogOut, FiSettings
} from 'react-icons/fi';

const mainNavLinks = [
  { href: '/events', label: 'Events & News', icon: FiHome },
  { href: '/sync-feed', label: 'Sync Feed', icon: FiRss },
  { href: '/projects', label: 'Projects', icon: FiBriefcase },
  { href: '/chat', label: 'Chat', icon: FiMessageSquare },
];

const accountNavLinks = [
  { href: '/payments', label: 'Payments', icon: FiDollarSign },
  { href: '/notifications', label: 'Notifications', icon: FiBell },
  { href: '/profile', label: 'My Profile', icon: FiUser },
  { href: '/settings', label: 'Settings', icon: FiSettings },
];

interface SidebarProps {
  userProfile: UserProfile | null;
}

const NavLink = ({ href, label, icon: Icon }: { href: string; label: string; icon: React.ElementType }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${isActive ? 'bg-violet-600/20 text-white' : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'}`}>
      <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-violet-400' : ''}`} />
      <span>{label}</span>
    </Link>
  );
};

const UserAreaSkeleton = () => (
  <div className="flex items-center space-x-3 animate-pulse">
    <div className="w-10 h-10 rounded-full bg-gray-700"></div>
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-gray-700 rounded w-3/4"></div>
      <div className="h-3 bg-gray-700 rounded w-1/2"></div>
    </div>
  </div>
);

export default function Sidebar({ userProfile }: SidebarProps) {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <aside className="fixed top-0 left-0 h-full z-40 bg-[#111217] border-r border-white/10 shadow-lg w-64 flex flex-col">
      <div className="p-6 border-b border-white/10">
        <Link href="/events" className="flex items-center space-x-2">
          <img src="/logo.svg" alt="Innfill Logo" className="h-8 w-auto" />
          <span className="text-xl font-bold text-white">Innfill</span>
        </Link>
      </div>

      <nav className="flex-grow p-4 space-y-6">
        <div>
          <h3 className="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Main</h3>
          <div className="space-y-1">
            {mainNavLinks.map(link => <NavLink key={link.href} {...link} />)}
          </div>
        </div>
        <div>
          <h3 className="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Account</h3>
          <div className="space-y-1">
            {accountNavLinks.map(link => <NavLink key={link.href} {...link} />)}
          </div>
        </div>
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="mb-4">
          {userProfile ? (
            <div className="flex items-center space-x-3">
              <img 
                src={userProfile.avatar_url || '/avatar.svg'} 
                alt={userProfile.full_name || 'User Avatar'}
                className="w-10 h-10 rounded-full object-cover border-2 border-gray-700"
              />
              <div>
                <p className="font-semibold text-sm text-white truncate">{userProfile.full_name || 'New User'}</p>
                <p className="text-xs text-gray-400 capitalize">{userProfile.user_type}</p>
              </div>
            </div>
          ) : (
            <UserAreaSkeleton />
          )}
        </div>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700/50 rounded-lg hover:bg-red-500/20 hover:text-red-300 transition-colors duration-200"
        >
          <FiLogOut className="w-5 h-5 mr-2" />
          Logout
        </button>
      </div>
    </aside>
  );
}

