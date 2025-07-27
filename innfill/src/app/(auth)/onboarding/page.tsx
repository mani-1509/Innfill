// src/app/(auth)/onboarding/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import AuthLayout from '@/components/Layouts/AuthLayout';
import { motion } from 'framer-motion';
import { FiUser, FiBriefcase, FiUsers, FiLoader, FiArrowRight } from 'react-icons/fi';

const ROLES = [
  {
    value: 'freelancer' as const,
    label: 'Freelancer',
    description: 'Find projects, showcase your skills, and get paid.',
    icon: FiUser,
  },
  {
    value: 'client' as const,
    label: 'Client',
    description: 'Post projects, hire top talent, and manage work.',
    icon: FiBriefcase,
  },
  {
    value: 'individual' as const,
    label: 'Individual',
    description: 'Explore the platform, network, and learn.',
    icon: FiUsers,
  },
];

type Role = typeof ROLES[number]['value'];

export default function OnboardingPage() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkAuthAndProfile = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
          router.push('/login?redirect_to=/onboarding');
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', user.id)
          .single();

        if (profile && profile.user_type) {
          // User already has a role, redirect to their dashboard
          router.push(`/${profile.user_type}/${user.id}`);
          return;
        }

        setLoading(false);
      } catch (err) {
        console.error('Error checking auth status:', err);
        setError('An error occurred. Please refresh the page.');
        setLoading(false);
      }
    };

    checkAuthAndProfile();
  }, [router, supabase]);

  const handleRoleSelection = async () => {
    if (!selectedRole) return;

    setLoading(true);
    setError(null);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('User not found. Please log in again.');

      const { error: upsertError } = await supabase.from('profiles').upsert({
        id: user.id,
        user_type: selectedRole,
        updated_at: new Date().toISOString(),
      });

      if (upsertError) throw upsertError;

      // Redirect to the appropriate dashboard after setting the role
      router.push(`/${selectedRole}/${user.id}`);

    } catch (err: any) {
      console.error('Error during onboarding:', err);
      setError(err.message || 'An error occurred. Please try again.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-center">
          <FiLoader className="animate-spin h-8 w-8 text-violet-400 mx-auto mb-4" />
          <p>Loading your space...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full"
      >
        <h2 className="text-3xl font-bold mb-2 text-white">One last step...</h2>
        <p className="text-gray-400 mb-8">How will you be using Innfill? This helps us tailor your experience.</p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4 mb-8">
          {ROLES.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.value;
            return (
              <motion.div
                key={role.value}
                onClick={() => setSelectedRole(role.value)}
                className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 flex items-center space-x-4 ${isSelected ? 'bg-violet-600/20 border-violet-500' : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'}`}
                whileHover={{ scale: 1.03 }}
              >
                <Icon className={`h-8 w-8 transition-colors ${isSelected ? 'text-violet-400' : 'text-gray-400'}`} />
                <div>
                  <h3 className={`font-bold text-lg transition-colors ${isSelected ? 'text-white' : 'text-gray-200'}`}>{role.label}</h3>
                  <p className={`text-sm transition-colors ${isSelected ? 'text-gray-300' : 'text-gray-400'}`}>{role.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.button
          onClick={handleRoleSelection}
          disabled={!selectedRole || loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 px-4 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-violet-500/20"
        >
          {loading ? (
            <><FiLoader className="animate-spin h-5 w-5 mr-2" /> Finishing Setup...</>
          ) : (
            <>Complete Setup <FiArrowRight className="ml-2" /></>
          )}
        </motion.button>
      </motion.div>
    </AuthLayout>
  );
}

