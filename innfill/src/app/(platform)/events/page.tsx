// src/app/(platform)/events/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiRss, FiBriefcase, FiAward, FiUserPlus, FiMessageSquare } from 'react-icons/fi';
import { createClient } from '@/lib/supabase/client';
import { Event } from '@/types/types';
import { timeAgo } from '@/lib/utils';

const EventIcon = ({ type }: { type: Event['type'] }) => {
  const typeMap: { [key: string]: { icon: React.ElementType, color: string } } = {
    new_project: { icon: FiBriefcase, color: 'text-blue-400' },
    milestone: { icon: FiAward, color: 'text-yellow-400' },
    new_freelancer: { icon: FiUserPlus, color: 'text-green-400' },
    announcement: { icon: FiRss, color: 'text-violet-400' },
    discussion: { icon: FiMessageSquare, color: 'text-pink-400' },
  };
  const { icon: Icon, color } = typeMap[type] || { icon: FiRss, color: 'text-gray-400' };
  return <Icon className={`w-6 h-6 ${color}`} />;
};

const EventCard = ({ item, index }: { item: Event, index: number }) => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="relative pl-12 border-l-2 border-gray-700/50"
    >
        <div className="absolute left-0 -translate-x-1/2 top-1 bg-gray-800 border-2 border-gray-700/80 rounded-full p-2">
            <EventIcon type={item.type} />
        </div>
        <div className="bg-gray-800/50 p-6 rounded-xl border border-white/10 shadow-lg hover:border-white/20 transition-colors duration-300">
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-white">{item.title}</h3>
                <span className="text-xs text-gray-500 whitespace-nowrap">{timeAgo(item.created_at)}</span>
            </div>
            <p className="text-gray-400 text-sm mb-3">{item.description}</p>
            {item.metadata?.author && (
                <p className="text-xs text-gray-500">By: <span className="font-semibold text-gray-400">{item.metadata.author}</span></p>
            )}
        </div>
    </motion.div>
);

const SkeletonEvent = () => (
    <div className="relative pl-12 border-l-2 border-gray-700/50 animate-pulse">
        <div className="absolute left-0 -translate-x-1/2 top-1 bg-gray-800 border-2 border-gray-700/80 rounded-full p-2">
            <div className="w-6 h-6 bg-gray-700 rounded-full"></div>
        </div>
        <div className="bg-gray-800/50 p-6 rounded-xl border border-white/10">
            <div className="flex justify-between items-start mb-2">
                <div className="h-6 bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-700 rounded w-20"></div>
            </div>
            <div className="h-4 bg-gray-700 rounded w-full mb-3"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6"></div>
        </div>
    </div>
);

const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error fetching events:', error);
        setError('Could not fetch the event feed. Please try again later.');
      } else {
        setEvents(data as Event[]);
      }
      setLoading(false);
    };

    fetchEvents();
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2">Events & News</h1>
        <p className="text-gray-400 mb-8">Stay updated with the latest projects, announcements, and community highlights.</p>
      </motion.div>

      <div className="max-w-3xl mx--auto">
        <div className="space-y-6">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <SkeletonEvent key={i} />)
          ) : error ? (
            <div className="col-span-full text-center text-red-400 bg-red-900/20 p-6 rounded-lg">{error}</div>
          ) : (
            events.map((item, index) => <EventCard key={item.id} item={item} index={index} />)
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
