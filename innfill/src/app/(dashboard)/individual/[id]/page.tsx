"use client";

import { useAuth } from '@/hooks/useAuth';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function IndividualDashboardPage() {
  const { user, loading, error } = useAuth();
  const params = useParams();
  const individualId = params.id as string;

  if (loading) {
    return <div className="p-8 text-center text-white">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  }

  if (!user || user.user_type !== 'individual' || user.id !== individualId) {
    return <div className="p-8 text-center text-red-500">Access Denied.</div>;
  }

  return (
    <div className="p-8 text-white">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to Innfill, {user.full_name}!</h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          You're all set to explore. What would you like to do first? Choose your path or simply browse the opportunities available.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Card to Browse Projects */}
        <div className="bg-primary-dark p-8 rounded-2xl border border-white/10 text-center hover:border-accent transition-all duration-300 transform hover:-translate-y-1">
          <h2 className="text-2xl font-bold text-white mb-4">Find Your Next Project</h2>
          <p className="text-gray-400 mb-6">
            Explore thousands of projects posted by innovative clients. Find work that excites you and matches your skills.
          </p>
          <Link
            href="/projects"
            className="inline-block px-8 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition shadow-lg"
          >
            Browse Projects
          </Link>
        </div>

        {/* Card to Browse Freelancers */}
        <div className="bg-primary-dark p-8 rounded-2xl border border-white/10 text-center hover:border-accent transition-all duration-300 transform hover:-translate-y-1">
          <h2 className="text-2xl font-bold text-white mb-4">Discover Top Talent</h2>
          <p className="text-gray-400 mb-6">
            Looking to hire? Browse profiles of skilled freelancers ready to bring your ideas to life.
          </p>
          <Link
            href="/freelancers"
            className="inline-block px-8 py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition"
          >
            Browse Freelancers
          </Link>
        </div>
      </div>

      <div className="text-center mt-16">
        <h3 className="text-xl font-semibold text-white">Ready to dive in?</h3>
        <p className="text-gray-400 mt-2">Update your profile to become a <span className="text-accent font-semibold">Client</span> or <span className="text-accent font-semibold">Freelancer</span> and unlock more features.</p>
        <Link href="/profile" className="mt-4 inline-block text-accent hover:underline">Go to Profile Settings</Link>
      </div>
    </div>
  );
}
