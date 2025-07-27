// src/app/(platform)/layout.tsx
import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/Navbars/Sidebar';
import { UserProfile } from '@/types/types';

export default async function PlatformLayout({
  children,
}: { 
  children: React.ReactNode;
}) {
  const supabase = createServerClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: userProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single<UserProfile>();

  if (!userProfile) {
    // This case should ideally be handled by middleware,
    // but as a fallback, we redirect to onboarding.
    redirect('/onboarding');
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      <Sidebar userProfile={userProfile} />
      <main className="flex-1 pl-64">
        {/* The pl-64 should match the sidebar width */}
        <div className="w-full h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
