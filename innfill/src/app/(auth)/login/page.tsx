// src/app/(auth)/login/page.tsx
'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import AuthLayout from '@/components/Layouts/AuthLayout';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiLoader } from 'react-icons/fi';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { user: authUser, loading: authLoading, signIn, error: authError } = useAuth();

  const redirectTo = searchParams.get('redirect_to');

  useEffect(() => {
    if (authLoading) return;
    if (authUser) {
      const targetUrl =
        redirectTo ||
        (authUser.user_type === 'client'
          ? `/client/${authUser.id}`
          : authUser.user_type === 'freelancer'
          ? `/freelancer/${authUser.id}`
          : authUser.user_type === 'individual'
          ? `/individual/${authUser.id}`
          : '/');
      router.push(targetUrl);
    }
  }, [authUser, authLoading, redirectTo, router]);

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setLocalError('Please fill in all fields');
      return;
    }
    if (!email.includes('@')) {
      setLocalError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setLocalError(null);

    try {
      await signIn(email, password);
    } catch (error: any) {
      setLocalError(error.message || 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || authUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-center">
          <FiLoader className="animate-spin h-8 w-8 text-violet-400 mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const displayError = localError || authError;

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <AuthLayout>
      <motion.div
        variants={formVariants}
        initial="hidden"
        animate="visible"
        className="w-full"
      >
        <motion.h2 variants={itemVariants} className="text-3xl font-bold mb-2 text-white">
          Welcome Back
        </motion.h2>
        <motion.p variants={itemVariants} className="text-gray-400 mb-8">
          Enter your credentials to access your account.
        </motion.p>

        {displayError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm"
          >
            {displayError}
          </motion.div>
        )}

        <form onSubmit={handleSignIn} className="space-y-6">
          <motion.div variants={itemVariants} className="relative">
            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="Email address"
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500 text-white disabled:opacity-50 transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              required
              autoComplete="email"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="relative">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500 text-white disabled:opacity-50 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              required
              autoComplete="current-password"
            />
          </motion.div>

          <motion.button
            variants={itemVariants}
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 px-4 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-violet-500/20"
          >
            {isSubmitting ? (
              <>
                <FiLoader className="animate-spin h-5 w-5 mr-2" />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </motion.button>

          <motion.p variants={itemVariants} className="mt-6 text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <Link href="/signup" className="font-medium text-violet-400 hover:text-violet-300 transition-colors">
              Sign up
            </Link>
          </motion.p>
        </form>
      </motion.div>
    </AuthLayout>
  );
}
