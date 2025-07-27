// src/app/(auth)/signup/page.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import AuthLayout from '@/components/Layouts/AuthLayout';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiLoader, FiCheckCircle, FiXCircle, FiBriefcase, FiUser, FiUsers } from 'react-icons/fi';

const ROLES = [
  { label: 'Freelancer', value: 'freelancer', icon: FiUser },
  { label: 'Client', value: 'client', icon: FiBriefcase },
  { label: 'Individual', value: 'individual', icon: FiUsers },
] as const;

type Role = typeof ROLES[number]['value'];

const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  hasUppercase: /[A-Z]/,
  hasLowercase: /[a-z]/,
  hasNumber: /\d/,
  hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/,
};

const SignupPage = () => {
  const { signUp, error: authError, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<Role>('freelancer');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const redirectTo = searchParams?.get('redirect_to');
    if (redirectTo) {
      sessionStorage.setItem('redirectAfterSignup', redirectTo);
    }
  }, [searchParams]);

  const passwordValidation = useMemo(() => {
    if (!password) return null;
    return {
      minLength: password.length >= PASSWORD_REQUIREMENTS.minLength,
      hasUppercase: PASSWORD_REQUIREMENTS.hasUppercase.test(password),
      hasLowercase: PASSWORD_REQUIREMENTS.hasLowercase.test(password),
      hasNumber: PASSWORD_REQUIREMENTS.hasNumber.test(password),
      hasSpecialChar: PASSWORD_REQUIREMENTS.hasSpecialChar.test(password),
    };
  }, [password]);

  const allPasswordReqsMet = passwordValidation && Object.values(passwordValidation).every(Boolean);

  const validateForm = () => {
    if (!/\S+@\S+\.\S+/.test(email)) {
      setFormError('Please enter a valid email address');
      return false;
    }
    if (!allPasswordReqsMet) {
      setFormError('Please ensure your password meets all requirements.');
      return false;
    }
    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!validateForm()) return;

    try {
      await signUp(email, password, role);
      const redirectTo = sessionStorage.getItem('redirectAfterSignup') || '/onboarding';
      sessionStorage.removeItem('redirectAfterSignup');
      router.push(redirectTo);
    } catch (err: any) {
      console.error('Signup error:', err);
      setFormError(err.message || 'An unexpected error occurred.');
    }
  };

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
      <motion.div variants={formVariants} initial="hidden" animate="visible" className="w-full">
        <motion.h2 variants={itemVariants} className="text-3xl font-bold mb-2 text-white">
          Create an Account
        </motion.h2>
        <motion.p variants={itemVariants} className="text-gray-400 mb-8">
          Join Innfill and start your journey.
        </motion.p>

        {(formError || authError) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm"
          >
            {formError || authError}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Role Selection */}
          <motion.div variants={itemVariants}>
            <label className="block mb-3 text-sm font-medium text-gray-300">I am a...</label>
            <div className="grid grid-cols-3 gap-3">
              {ROLES.map((r) => {
                const Icon = r.icon;
                return (
                  <div key={r.value}>
                    <input
                      type="radio"
                      id={r.value}
                      name="role"
                      value={r.value}
                      checked={role === r.value}
                      onChange={() => setRole(r.value)}
                      className="sr-only"
                      disabled={loading}
                    />
                    <label
                      htmlFor={r.value}
                      className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${role === r.value ? 'bg-violet-600/30 border-violet-500 text-white' : 'bg-gray-800/50 border-gray-700 hover:border-gray-500 text-gray-400'}`}>
                      <Icon className="h-6 w-6 mb-2" />
                      <span className="text-sm font-semibold">{r.label}</span>
                    </label>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="relative">
            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="Email address"
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500 text-white disabled:opacity-50 transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
              autoComplete="email"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="relative">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              placeholder="Create password"
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500 text-white disabled:opacity-50 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
              autoComplete="new-password"
            />
          </motion.div>

          {password && passwordValidation && (
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs">
              <Requirement valid={passwordValidation.minLength}>At least 8 characters</Requirement>
              <Requirement valid={passwordValidation.hasUppercase}>One uppercase letter</Requirement>
              <Requirement valid={passwordValidation.hasLowercase}>One lowercase letter</Requirement>
              <Requirement valid={passwordValidation.hasNumber}>One number</Requirement>
              <Requirement valid={passwordValidation.hasSpecialChar}>One special character</Requirement>
            </motion.div>
          )}

          <motion.div variants={itemVariants} className="relative">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              placeholder="Confirm password"
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500 text-white disabled:opacity-50 transition-all"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              required
              autoComplete="new-password"
            />
          </motion.div>

          <motion.button
            variants={itemVariants}
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 px-4 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-violet-500/20"
          >
            {loading ? (
              <><FiLoader className="animate-spin h-5 w-5 mr-2" /> Creating Account...</>
            ) : (
              'Create Account'
            )}
          </motion.button>

          <motion.p variants={itemVariants} className="text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-violet-400 hover:text-violet-300 transition-colors">
              Sign In
            </Link>
          </motion.p>
        </form>
      </motion.div>
    </AuthLayout>
  );
};

const Requirement = ({ valid, children }: { valid: boolean; children: React.ReactNode }) => (
  <div className={`flex items-center transition-colors ${valid ? 'text-green-400' : 'text-gray-500'}`}>
    {valid ? <FiCheckCircle className="mr-2" /> : <FiXCircle className="mr-2" />}
    {children}
  </div>
);

export default SignupPage;

