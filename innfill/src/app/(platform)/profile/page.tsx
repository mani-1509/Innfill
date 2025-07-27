// src/app/(platform)/profile/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiEdit, FiMail, FiMapPin, FiGlobe } from 'react-icons/fi';
import { createClient } from '@/lib/supabase/client';
import { UserProfile, Project } from '@/types/types';

const ProfileSkeleton = () => (
    <div className="p-4 sm:p-6 lg:p-8 animate-pulse">
        <div className="relative mb-8">
            <div className="h-48 bg-gray-700/60 rounded-xl"></div>
            <div className="absolute bottom-0 left-8 transform translate-y-1/2 flex items-end space-x-6">
                <div className="w-32 h-32 rounded-full bg-gray-700/60 border-4 border-gray-900"></div>
                <div>
                    <div className="h-8 bg-gray-700/60 rounded w-48 mb-2"></div>
                    <div className="h-6 bg-gray-700/60 rounded w-64"></div>
                </div>
            </div>
        </div>
        <div className="mt-24 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-gray-800/50 p-6 rounded-xl border border-white/10">
                    <div className="h-6 bg-gray-700/60 rounded w-1/4 mb-4"></div>
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-700/60 rounded w-full"></div>
                        <div className="h-4 bg-gray-700/60 rounded w-5/6"></div>
                    </div>
                </div>
            </div>
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-gray-800/50 p-6 rounded-xl border border-white/10">
                    <div className="h-6 bg-gray-700/60 rounded w-1/4 mb-4"></div>
                    <div className="flex flex-wrap gap-2">
                        <div className="h-6 bg-gray-700/60 rounded-full w-20"></div>
                        <div className="h-6 bg-gray-700/60 rounded-full w-24"></div>
                        <div className="h-6 bg-gray-700/60 rounded-full w-16"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const ProfilePage = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfileData = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setError('You must be logged in to view this page.');
                setLoading(false);
                return;
            }

            // Fetch profile
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (profileError || !profileData) {
                setError('Could not fetch your profile.');
                console.error('Profile fetch error:', profileError);
            } else {
                setProfile(profileData as UserProfile);
            }

            // Fetch user's projects
            const { data: projectsData, error: projectsError } = await supabase
                .from('projects')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (projectsError) {
                setError('Could not fetch your projects.');
                console.error('Projects fetch error:', projectsError);
            } else {
                setProjects(projectsData as Project[]);
            }

            setLoading(false);
        };

        fetchProfileData();
    }, []);

    if (loading) return <ProfileSkeleton />;
    if (error) return <div className="p-8 text-center text-red-400">{error}</div>;
    if (!profile) return <div className="p-8 text-center text-gray-400">Profile not found.</div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative mb-8">
        <div className="h-48 bg-gray-700 rounded-xl overflow-hidden">
          <img src={profile.cover_url || '/cover.jpg'} alt="Cover" className="w-full h-full object-cover" />
        </div>
        <div className="absolute bottom-0 left-8 transform translate-y-1/2 flex items-end space-x-6">
          <div className="w-32 h-32 rounded-full bg-gray-800 border-4 border-gray-900 overflow-hidden">
            <img src={profile.avatar_url || '/avatar.svg'} alt={profile.full_name || 'User Avatar'} className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">{profile.full_name}</h1>
            <p className="text-gray-300 text-md">{profile.headline}</p>
          </div>
        </div>
         <button className="absolute top-4 right-4 px-4 py-2 bg-gray-700/50 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors flex items-center">
            <FiEdit className="mr-2" /> Edit Profile
        </button>
      </motion.div>

      <div className="mt-24 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="lg:col-span-1 space-y-6">
            <div className="bg-gray-800/50 p-6 rounded-xl border border-white/10">
                <h2 className="text-xl font-bold text-white mb-4">About</h2>
                <p className="text-gray-400">{profile.bio || 'No bio provided.'}</p>
            </div>
            <div className="bg-gray-800/50 p-6 rounded-xl border border-white/10">
                <h2 className="text-xl font-bold text-white mb-4">Contact</h2>
                <div className="space-y-3 text-gray-300">
                    {profile.location && <div className="flex items-center"><FiMapPin className="mr-3 text-gray-500"/>{profile.location}</div>}
                    {profile.email && <div className="flex items-center"><FiMail className="mr-3 text-gray-500"/>{profile.email}</div>}
                    {profile.website && <div className="flex items-center"><FiGlobe className="mr-3 text-gray-500"/>{profile.website}</div>}
                </div>
            </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="lg:col-span-2 space-y-6">
            <div className="bg-gray-800/50 p-6 rounded-xl border border-white/10">
                <h2 className="text-xl font-bold text-white mb-4">Skills</h2>
                <div className="flex flex-wrap gap-2">
                    {profile.skills?.map(skill => (
                        <span key={skill} className="px-3 py-1 bg-violet-600/20 text-violet-300 text-sm font-medium rounded-full">{skill}</span>
                    ))}
                </div>
            </div>
            <div className="bg-gray-800/50 p-6 rounded-xl border border-white/10">
                <h2 className="text-xl font-bold text-white mb-4">Completed Projects</h2>
                <div className="space-y-4">
                    {projects.length > 0 ? projects.map(proj => (
                        <div key={proj.id} className="bg-gray-700/40 p-4 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-bold text-white">{proj.title}</p>
                            </div>
                            <p className="font-bold text-green-400">${proj.budget.toLocaleString()}</p>
                        </div>
                    )) : <p className="text-gray-400">No completed projects yet.</p>}
                </div>
            </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
