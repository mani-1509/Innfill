// src/app/(platform)/settings/page.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiShield, FiBell, FiCreditCard } from 'react-icons/fi';

const tabs = [
  { id: 'profile', label: 'Profile', icon: FiUser },
  { id: 'account', label: 'Account & Security', icon: FiShield },
  { id: 'notifications', label: 'Notifications', icon: FiBell },
  { id: 'billing', label: 'Billing', icon: FiCreditCard },
];

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 mt-1">Manage your account and platform preferences.</p>
      </motion.div>

      <div className="mt-8 flex flex-col lg:flex-row gap-8">
        {/* Tabs Navigation */}
        <aside className="lg:w-1/4">
          <nav className="space-y-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${activeTab === tab.id ? 'bg-violet-600/20 text-white' : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'}`}>
                <tab.icon className={`w-5 h-5 mr-3 ${activeTab === tab.id ? 'text-violet-400' : ''}`} />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Tab Content */}
        <main className="flex-1">
           <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-gray-800/50 p-6 sm:p-8 rounded-xl border border-white/10"
            >
              {/* Render content based on activeTab */}
              {activeTab === 'profile' && <ProfileSettings />}
              {activeTab === 'account' && <AccountSettings />}
              {activeTab === 'notifications' && <NotificationSettings />}
              {activeTab === 'billing' && <BillingSettings />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

// Dummy components for each settings tab
const ProfileSettings = () => (
  <div>
    <h2 className="text-2xl font-bold text-white mb-6">Profile Information</h2>
    {/* Form fields here */}
    <div className="space-y-4">
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
            <input type="text" defaultValue="Sharvan G" className="w-full bg-gray-700/60 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-white" />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Headline</label>
            <input type="text" defaultValue="Full-Stack Developer & UI/UX Enthusiast" className="w-full bg-gray-700/60 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-white" />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Bio</label>
            <textarea rows={4} className="w-full bg-gray-700/60 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-white" defaultValue="Passionate about creating beautiful, functional, and user-centered digital experiences..."></textarea>
        </div>
        <button className="px-5 py-2 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 transition-colors">Save Changes</button>
    </div>
  </div>
);

const AccountSettings = () => (
    <div>
        <h2 className="text-2xl font-bold text-white mb-6">Account & Security</h2>
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-white mb-2">Change Password</h3>
                <div className="space-y-2">
                    <input type="password" placeholder="Current Password" className="w-full bg-gray-700/60 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-white" />
                    <input type="password" placeholder="New Password" className="w-full bg-gray-700/60 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-white" />
                </div>
            </div>
            <div className="p-4 border border-red-500/50 bg-red-900/20 rounded-lg">
                <h3 className="text-lg font-semibold text-red-300 mb-2">Delete Account</h3>
                <p className="text-sm text-red-200/80 mb-3">This action is irreversible. All your data, projects, and messages will be permanently deleted.</p>
                <button className="px-4 py-2 bg-red-500/80 text-white font-semibold rounded-lg hover:bg-red-500 transition-colors">Delete My Account</button>
            </div>
        </div>
    </div>
);

const NotificationSettings = () => (
    <div>
        <h2 className="text-2xl font-bold text-white mb-6">Notification Preferences</h2>
        <div className="space-y-4">
            {['New Messages', 'Project Updates', 'Application Status Changes', 'Platform Announcements'].map(item => (
                <div key={item} className="flex justify-between items-center bg-gray-700/40 p-3 rounded-lg">
                    <span className="text-gray-200">{item}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-violet-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                    </label>
                </div>
            ))}
        </div>
    </div>
);

const BillingSettings = () => (
    <div>
        <h2 className="text-2xl font-bold text-white mb-6">Billing & Payments</h2>
        <p className="text-gray-400">Manage your payment methods and view past invoices.</p>
        {/* Content for billing settings */}
    </div>
);

export default SettingsPage;
