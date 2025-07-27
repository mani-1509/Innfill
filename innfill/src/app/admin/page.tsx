// src/app/admin/page.tsx
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import React from 'react';
import Sidebar from '@/components/Sidebar';
import { UserProfile } from '@/types/types';
import UserTable, { type UserForTable } from '@/components/Admin/UserTable';

// Client Component for rendering the dashboard UI
const AdminDashboardClient = ({ 
  userCount, 
  projectCount, 
  users,
  userProfile
}: { 
  userCount: number; 
  projectCount: number; 
  users: UserForTable[];
  userProfile: UserProfile | null;
}) => {
  return (
    <div className="flex bg-gray-900 text-white min-h-screen">
      <Sidebar userProfile={userProfile} />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold">Total Users</h2>
            <p className="text-4xl font-bold mt-2">{userCount}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold">Total Projects</h2>
            <p className="text-4xl font-bold mt-2">{projectCount}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold">Open Tickets</h2>
            <p className="text-4xl font-bold mt-2">-</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold">Revenue</h2>
            <p className="text-4xl font-bold mt-2">-</p>
          </div>
        </div>
        <div className="mt-12 bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">User Management</h2>
          <UserTable users={users} />
        </div>
      </main>
    </div>
  );
};

// Server Component for fetching data
const AdminPage = async () => {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );

  // Fetch counts
  const { count: userCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  const { count: projectCount } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true });

  // Fetch all users with their email
  const { data: usersData, error: usersError } = await supabase
    .from('profiles')
    .select(`
      id,
      full_name,
      user_type,
      created_at,
      users ( email )
    `);

  if (usersError) {
    console.error('Error fetching users:', usersError);
    // Handle error appropriately
  }

  // Transform the data to match the UserForTable type
  const users: UserForTable[] = usersData?.map(profile => ({
    id: profile.id,
    full_name: profile.full_name,
    // @ts-ignore
    email: profile.users?.email ?? 'N/A',
    user_type: profile.user_type,
    created_at: profile.created_at,
  })) ?? [];

  const { data: { user } } = await supabase.auth.getUser();

  const { data: userProfile } = user
    ? await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single<UserProfile>()
    : { data: null };

  return <AdminDashboardClient userCount={userCount ?? 0} projectCount={projectCount ?? 0} users={users} userProfile={userProfile} />;
};

export default AdminPage;
