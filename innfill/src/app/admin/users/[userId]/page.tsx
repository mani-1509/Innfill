// src/app/admin/users/[userId]/page.tsx
'use client';

import { createServerClient } from '@/lib/supabase/server';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { UserProfile } from '@/types/types';
import { notFound } from 'next/navigation';

// This is now a server component to handle data fetching
const UserDetailPageServer = async ({ params }: { params: { userId: string } }) => {
  const supabase = createServerClient();
  const { userId } = params;

  // Fetch the detailed profile of the user being viewed
  const { data: userProfile, error: userProfileError } = await supabase
    .from('profiles')
    .select('*, users(email, banned_until)')
    .eq('id', userId)
    .single();

  if (userProfileError) {
    console.error('Error fetching user profile:', userProfileError);
    notFound();
  }

  // Fetch the profile of the currently logged-in admin user
  const { data: { user: adminUser } } = await supabase.auth.getUser();
  const { data: adminProfile } = adminUser 
    ? await supabase.from('profiles').select('*').eq('id', adminUser.id).single<UserProfile>()
    : { data: null };

  return <UserDetailClient userProfile={userProfile as any} adminProfile={adminProfile} />;
};

// This is now a client component to handle state and actions
const UserDetailClient = ({ userProfile, adminProfile }: { userProfile: any, adminProfile: UserProfile | null }) => {
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  const [profile, setProfile] = useState<any | null>(userProfile);
  const [isSuspended, setIsSuspended] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select(`id, full_name, user_type, created_at, avatar_url, bio, skills, users ( email, banned_until )`)
        .eq('id', userProfile.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to fetch user profile.');
        notFound();
      } else {
        const userProfileData = data as any;
        setProfile(userProfileData);
        // Check if the user is currently banned/suspended
        if (userProfileData.users?.banned_until) {
          const bannedUntil = new Date(userProfileData.users.banned_until);
          if (bannedUntil > new Date()) {
            setIsSuspended(true);
          }
        }
      }
      setLoading(false);
    };

    fetchProfile();
  }, [userProfile, supabase]);

  const handleSuspend = async (suspend: boolean) => {
    const action = suspend ? 'suspend' : 'unsuspend';
    if (window.confirm(`Are you sure you want to ${action} this user?`)) {
      try {
        const { error: functionError } = await supabase.functions.invoke('suspend-user', {
          body: { userId: userProfile.id, suspend },
        });

        if (functionError) throw functionError;

        alert(`User ${action}ed successfully.`);
        setIsSuspended(suspend);
      } catch (e: any) {
        console.error(`Failed to ${action} user:`, e);
        alert(`Failed to ${action} user: ${e.message}`);
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        const { error: functionError } = await supabase.functions.invoke('delete-user', {
          body: { userId: userProfile.id },
        });

        if (functionError) throw functionError;

        alert('User deleted successfully.');
        router.push('/admin');
      } catch (e: any) {
        console.error('Failed to delete user:', e);
        alert(`Failed to delete user: ${e.message}`);
      }
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">Loading...</div>;
  }

  if (error || !profile) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">{error || 'User not found.'}</div>;
  }

  const email = profile.users?.email ?? 'N/A';

  return (
    <div className="flex bg-gray-900 text-white min-h-screen">
      <Sidebar userProfile={adminProfile} />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <Link href="/admin" className="text-indigo-400 hover:text-indigo-300 font-semibold">
            &larr; Back to Dashboard
          </Link>
        </div>
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
          <div className="flex items-center space-x-6 mb-8">
            <img 
              src={profile.avatar_url || '/default-avatar.png'} 
              alt={`${profile.full_name}'s avatar`} 
              className="w-24 h-24 rounded-full object-cover border-4 border-gray-700"
            />
            <div>
              <h1 className="text-4xl font-bold">{profile.full_name || 'User Profile'}</h1>
              <p className="text-gray-400 text-lg">{email}</p>
              <span className={`mt-2 inline-block px-3 py-1 text-sm font-semibold rounded-full ${profile.user_type === 'admin' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}`}>
                {profile.user_type.charAt(0).toUpperCase() + profile.user_type.slice(1)}
              </span>
              {isSuspended && (
                <span className="mt-2 ml-2 inline-block px-3 py-1 text-sm font-semibold rounded-full bg-red-800 text-white">
                  Suspended
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">Details</h2>
              <ul className="space-y-3 text-gray-300">
                <li><strong>User ID:</strong> <span className="font-mono bg-gray-700 px-2 py-1 rounded">{profile.id}</span></li>
                <li><strong>Joined:</strong> {new Date(profile.created_at).toLocaleString()}</li>
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">Profile Info</h2>
              <div className="space-y-4 text-gray-300">
                <div>
                  <h3 className="font-semibold">Bio</h3>
                  <p>{profile.bio || 'No bio provided.'}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Skills</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {profile.skills && profile.skills.length > 0 ? (
                      profile.skills.map((skill: string) => (
                        <span key={skill} className="bg-gray-700 px-3 py-1 rounded-full text-sm">{skill}</span>
                      ))
                    ) : (
                      <p>No skills listed.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 border-t border-gray-700 pt-8">
            <h2 className="text-2xl font-semibold mb-4">Actions</h2>
            <div className="flex space-x-4">
              <button 
                onClick={() => handleSuspend(!isSuspended)}
                className={`font-bold py-2 px-4 rounded transition-colors ${isSuspended ? 'bg-green-500 hover:bg-green-600' : 'bg-yellow-500 hover:bg-yellow-600'} text-white`}>
                {isSuspended ? 'Unsuspend User' : 'Suspend User'}
              </button>
              <button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors">Delete User</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDetailPageServer;
