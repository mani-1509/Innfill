"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { UserProfile } from '@/types/user';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function FreelancerDashboardPage() {
  const { user, loading, error } = useAuth();
  const params = useParams();
  const freelancerId = params.id as string;

  const [freelancerData, setFreelancerData] = useState<any>(null); // Replace 'any' with specific types
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if (!loading && user && user.user_type === 'freelancer' && user.id === freelancerId) {
      const fetchFreelancerSpecificData = async () => {
        setDataLoading(true);
        try {
          // Example: Fetch applications by this freelancer
          const { data, error } = await supabase
            .from('applications') // Assuming you have an 'applications' table
            .select('*, projects(*)')
            .eq('freelancer_id', freelancerId);

          if (error) throw error;
          setFreelancerData(data);
          setDataError(null);
        } catch (err: any) {
          setDataError(err.message || 'Failed to fetch freelancer data.');
        } finally {
          setDataLoading(false);
        }
      };
      fetchFreelancerSpecificData();
    } else if (!loading && user && user.id !== freelancerId) {
      setDataError('You are not authorized to view this dashboard.');
      setDataLoading(false);
    }
  }, [loading, user, freelancerId, supabase]);

  if (loading || dataLoading) {
    return <div className="p-8 text-center text-white">Loading dashboard...</div>;
  }

  if (error || dataError) {
    return <div className="p-8 text-center text-red-500">Error: {error || dataError}</div>;
  }

  if (!user || user.user_type !== 'freelancer') {
    return <div className="p-8 text-center text-red-500">Access Denied.</div>;
  }

  return (
    <div className="p-8 text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Freelancer Dashboard</h1>
        <Link
          href={`/freelancers/${user.id}`}
          className="px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition shadow-lg"
        >
          View Public Profile
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-primary-dark p-6 rounded-2xl border border-white/10">
          <h3 className="text-gray-400 text-sm font-medium">Total Earnings</h3>
          <p className="text-3xl font-bold mt-2">$0.00</p> {/* Placeholder */}
        </div>
        <div className="bg-primary-dark p-6 rounded-2xl border border-white/10">
          <h3 className="text-gray-400 text-sm font-medium">Active Applications</h3>
          <p className="text-3xl font-bold mt-2">{freelancerData?.length || 0}</p>
        </div>
        <div className="bg-primary-dark p-6 rounded-2xl border border-white/10">
          <h3 className="text-gray-400 text-sm font-medium">Projects Won</h3>
          <p className="text-3xl font-bold mt-2">0</p> {/* Placeholder */}
        </div>
        <div className="bg-primary-dark p-6 rounded-2xl border border-white/10">
          <h3 className="text-gray-400 text-sm font-medium">Profile Rating</h3>
          <p className="text-3xl font-bold mt-2">{(user as UserProfile).rating?.toFixed(1) || 'N/A'}</p>
        </div>
      </div>

      {/* Recent Applications List */}
      <div>
        <h2 className="text-2xl font-bold mb-4">My Applications</h2>
        <div className="bg-primary-dark rounded-2xl border border-white/10">
          {freelancerData && freelancerData.length > 0 ? (
            <ul className="divide-y divide-white/10">
              {freelancerData.map((app: any) => (
                <li key={app.id} className="p-6 hover:bg-white/5 transition">
                  <div className="flex justify-between items-center">
                    <div>
                      <Link href={`/projects/${app.projects.id}`} className="text-lg font-semibold text-white hover:text-accent">
                        {app.projects.title}
                      </Link>
                      <p className="text-sm text-gray-400 mt-1">
                        Your Bid: <span className="font-medium text-gray-300">${app.bid_amount}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${app.status === 'accepted' ? 'bg-green-500/20 text-green-300' : 'bg-blue-500/20 text-blue-300'}`}>
                        {app.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-2">Applied on {new Date(app.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-8 text-center text-gray-400">
              <p>You haven't applied to any projects yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
