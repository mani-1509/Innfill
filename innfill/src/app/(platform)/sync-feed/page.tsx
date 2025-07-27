// src/app/(platform)/sync-feed/page.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FiFileText, FiMessageCircle, FiCheckCircle, FiSend } from 'react-icons/fi';

// Mock data for the personalized feed
const syncFeedItems = [
  {
    id: 1,
    type: 'application_sent',
    icon: FiSend,
    title: 'You applied to "Brand Identity Design for Tech Startup"',
    description: 'Your application has been sent to the client. We will notify you of any updates.',
    timestamp: '30 minutes ago',
    link: '/projects/1',
  },
  {
    id: 2,
    type: 'new_message',
    icon: FiMessageCircle,
    title: 'New message from Sarah J. in "E-commerce Platform Development"',
    description: '"Hey, just wanted to check on the progress for the payment gateway integration. Let me know if you need anything!"',
    timestamp: '1 hour ago',
    link: '/chat/2',
  },
  {
    id: 3,
    type: 'project_completed',
    icon: FiCheckCircle,
    title: 'Project Completed: "Social Media Marketing Campaign"',
    description: 'Congratulations! The client has marked the project as complete. Payment has been released to your account.',
    timestamp: '5 hours ago',
    link: '/projects/3',
  },
  {
    id: 4,
    type: 'new_contract',
    icon: FiFileText,
    title: 'You have been hired for "Mobile App UI/UX Mockups"',
    description: 'The client has accepted your application. Review the contract and get started!',
    timestamp: 'Yesterday',
    link: '/projects/4',
  },
];

const FeedIcon = ({ type }: { type: string }) => {
  const typeMap: { [key: string]: { icon: React.ElementType, color: string } } = {
    application_sent: { icon: FiSend, color: 'text-blue-400' },
    new_message: { icon: FiMessageCircle, color: 'text-green-400' },
    project_completed: { icon: FiCheckCircle, color: 'text-violet-400' },
    new_contract: { icon: FiFileText, color: 'text-yellow-400' },
  };
  const { icon: Icon, color } = typeMap[type] || { icon: FiFileText, color: 'text-gray-400' };
  return <Icon className={`w-5 h-5 ${color}`} />;
};

const SyncFeedPage = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2">Sync Feed</h1>
        <p className="text-gray-400 mb-8">Your personal activity stream. All your project updates, messages, and notifications in one place.</p>
      </motion.div>

      <div className="max-w-3xl mx-auto">
        <div className="space-y-8">
          {syncFeedItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-start space-x-4"
            >
              <div className="mt-1 flex-shrink-0">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center border border-white/10">
                  <FeedIcon type={item.type} />
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="font-semibold text-white">{item.title}</h3>
                <p className="text-gray-400 text-sm mt-1">{item.description}</p>
                <div className="flex items-center justify-between mt-3">
                    <a href={item.link} className="text-sm font-semibold text-violet-400 hover:text-violet-300 transition-colors">View Details</a>
                    <span className="text-xs text-gray-500">{item.timestamp}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SyncFeedPage;
