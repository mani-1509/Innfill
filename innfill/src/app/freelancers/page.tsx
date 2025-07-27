"use client";

import { useEffect, useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { User } from '@supabase/supabase-js';

interface FreelancerProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  title: string | null;
  skills: string[] | null;
}

export default function FreelancersPage() {
  const supabase = createClient();
  const [freelancers, setFreelancers] = useState<FreelancerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchFreelancers = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, title, skills')
        .eq('user_type', 'freelancer');

      if (error) {
        setError('Could not fetch freelancers. Please try again later.');
        console.error(error);
      } else {
        setFreelancers(data || []);
      }
      setLoading(false);
    };

    fetchFreelancers();
  }, [supabase]);

  const filteredFreelancers = useMemo(() => {
    if (!searchTerm) {
      return freelancers;
    }
    return freelancers.filter(f => 
      f.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.skills?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [freelancers, searchTerm]);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 text-white">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Find Talent</h1>
        <p className="mt-2 text-lg text-gray-400">Browse our community of expert freelancers.</p>
        <div className="mt-6 max-w-md">
          <input
            type="text"
            placeholder="Search by name, title, or skill..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 p-3 rounded-lg border border-white/10 focus:ring-accent focus:border-accent transition"
          />
        </div>
      </header>

      {loading && <div className="text-center py-12">Loading profiles...</div>}
      {error && <div className="text-center py-12 text-red-500">{error}</div>}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFreelancers.map(freelancer => (
            <Link href={`/freelancers/${freelancer.id}`} key={freelancer.id} className="block bg-primary-dark border border-white/10 rounded-2xl p-6 group hover:border-accent transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex flex-col items-center text-center">
                <img 
                  src={freelancer.avatar_url || '/default-avatar.png'} 
                  alt={freelancer.full_name || 'Freelancer'}
                  className="w-24 h-24 rounded-full object-cover border-2 border-white/10 mb-4"
                />
                <h3 className="font-bold text-lg text-white">{freelancer.full_name}</h3>
                <p className="text-accent text-sm font-medium">{freelancer.title || 'Freelancer'}</p>
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {freelancer.skills?.slice(0, 3).map(skill => (
                    <span key={skill} className="px-3 py-1 bg-accent/20 text-accent text-xs font-semibold rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading && filteredFreelancers.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold">No Freelancers Found</h3>
          <p className="text-gray-400 mt-2">Try adjusting your search term.</p>
        </div>
      )}
    </div>
  );
}
