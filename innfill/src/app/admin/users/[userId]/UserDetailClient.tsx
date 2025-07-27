// src/app/admin/users/[userId]/UserDetailClient.tsx
'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { UserProfile } from '@/types/types';

// This client component handles all user interactions on the detail page.
const UserDetailClient = ({ userProfile, adminProfile }: { userProfile: any, adminProfile: UserProfile | null }) => {
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  const [isSuspended, setIsSuspended] = useState(false);

  // Determine the initial suspension status from the server-fetched data.
  useEffect(() => {
    if (userProfile.users?.banned_until) {
      const bannedUntil = new Date(userProfile.users.banned_until);
      if (bannedUntil > new Date()) {
        setIsSuspended(true);
      }
    }
  }, [userProfile.users?.banned_until]);

  // Handles suspending or unsuspending a user.
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

  // Handles deleting a user.
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

  const email = userProfile.users?.email ?? 'N/A';

  return (
    <div className="flex bg-gray-900 text-white min-h-screen">
      <Sidebar userProfile={adminProfile} />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <Link href="/admin" className="text-indigo-400 hover:text-indigo-300 font-semibold">
            &larr; Back to User Management
          </Link>
        </div>
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
          <div className="flex items-center space-x-6 mb-8">
            <img src={userProfile.avatar_url || '/avatar.svg'} alt={userProfile.full_name || 'User'} className="w-24 h-24 rounded-full object-cover border-4 border-gray-700" />
            <div>
              <h1 className="text-3xl font-bold">{userProfile.full_name}</h1>
              <p className="text-gray-400">{email}</p>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${userProfile.user_type === 'client' ? 'bg-blue-500/20 text-blue-300' : 'bg-green-500/20 text-green-300'}`}>
                {userProfile.user_type}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">User Information</h2>
              <div className="space-y-2 text-gray-300">
                <p><strong>User ID:</strong> {userProfile.id}</p>
                <p><strong>Joined:</strong> {new Date(userProfile.created_at).toLocaleDateString()}</p>
                <p><strong>Status:</strong> {isSuspended ? <span className="text-red-400">Suspended</span> : <span className="text-green-400">Active</span>}</p>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4">Contact & Bio</h2>
              <p className="text-gray-300">{userProfile.bio || 'No bio provided.'}</p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Actions</h2>
            <div className="flex space-x-4">
              <button 
                onClick={() => handleSuspend(!isSuspended)}
                className={`px-4 py-2 font-semibold rounded-lg transition-colors ${isSuspended ? 'bg-green-500/20 text-green-300 hover:bg-green-500/30' : 'bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30'}`}>
                {isSuspended ? 'Unsuspend User' : 'Suspend User'}
              </button>
              <button 
                onClick={handleDelete}
                className="px-4 py-2 font-semibold rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors">
                Delete User
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDetailClient;
