// src/app/(platform)/notifications/page.tsx
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMessageSquare, FiBriefcase, FiCheckCircle, FiXCircle, FiBell } from 'react-icons/fi';

// Mock data
const initialNotifications = [
  {
    id: 1,
    type: 'new_message',
    icon: FiMessageSquare,
    title: 'New message from Alex Ray',
    description: 'Project: UI/UX Redesign - "Can you take a look at the latest mockups?"',
    timestamp: '5 minutes ago',
    read: false,
  },
  {
    id: 2,
    type: 'project_invite',
    icon: FiBriefcase,
    title: 'You have been invited to a new project',
    description: 'Innovate Co. has invited you to apply for "Backend API Development".',
    timestamp: '1 hour ago',
    read: false,
  },
  {
    id: 3,
    type: 'application_accepted',
    icon: FiCheckCircle,
    title: 'Your application was accepted!',
    description: 'Congratulations! You have been hired for "E-commerce Platform Development".',
    timestamp: '3 hours ago',
    read: true,
  },
  {
    id: 4,
    type: 'application_rejected',
    icon: FiXCircle,
    title: 'Update on your application',
    description: 'Unfortunately, the client has moved forward with another candidate for "Logo Design for Startup".',
    timestamp: '1 day ago',
    read: true,
  },
  {
    id: 5,
    type: 'system_announcement',
    icon: FiBell,
    title: 'System Maintenance Announcement',
    description: 'We will be undergoing scheduled maintenance on Sunday at 2 AM UTC.',
    timestamp: '2 days ago',
    read: true,
  },
];

const NotificationIcon = ({ type }: { type: string }) => {
    const typeMap: { [key: string]: { icon: React.ElementType, color: string } } = {
        new_message: { icon: FiMessageSquare, color: 'text-blue-400' },
        project_invite: { icon: FiBriefcase, color: 'text-violet-400' },
        application_accepted: { icon: FiCheckCircle, color: 'text-green-400' },
        application_rejected: { icon: FiXCircle, color: 'text-red-400' },
        system_announcement: { icon: FiBell, color: 'text-yellow-400' },
    };
    const { icon: Icon, color } = typeMap[type] || { icon: FiBell, color: 'text-gray-400' };
    return <Icon className={`w-6 h-6 ${color}`} />;
};

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Notifications</h1>
          <p className="text-gray-400 mt-1">
            You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}.
          </p>
        </div>
        <button 
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="px-4 py-2 bg-gray-700/50 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Mark all as read
        </button>
      </motion.div>

      <div className="max-w-4xl mx-auto space-y-4">
        {notifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className={`p-5 rounded-xl flex items-start space-x-4 transition-all duration-300 border ${notification.read ? 'bg-gray-800/30 border-white/10' : 'bg-violet-900/20 border-violet-500/50'}`}
          >
            <div className="flex-shrink-0 mt-1">
                <NotificationIcon type={notification.type} />
            </div>
            <div className="flex-grow">
              <h3 className={`font-bold ${notification.read ? 'text-gray-300' : 'text-white'}`}>{notification.title}</h3>
              <p className={`text-sm mt-1 ${notification.read ? 'text-gray-400' : 'text-gray-200'}`}>{notification.description}</p>
            </div>
            <div className="text-right flex-shrink-0">
                <p className={`text-xs ${notification.read ? 'text-gray-500' : 'text-gray-300'}`}>{notification.timestamp}</p>
                {!notification.read && (
                    <div className="mt-2 w-3 h-3 bg-violet-400 rounded-full ml-auto"></div>
                )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;
