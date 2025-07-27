"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  title: string | null;
  bio: string | null;
  skills: string[] | null;
}

interface Project {
  id: string;
  title: string;
  budget: number;
  created_at: string;
}

export default function FreelancerProfilePage() {
  const { id } = useParams();
  const supabase = createClient();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);

      try {
        // Fetch profile details
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .single();

        if (profileError) throw new Error('Freelancer not found.');
        setProfile(profileData);

        // Fetch completed projects
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('id, title, budget, created_at')
          .eq('freelancer_id', id)
          .eq('status', 'completed')
          .order('created_at', { ascending: false });
        
        if (projectsError) throw new Error('Could not fetch projects.');
        setProjects(projectsData || []);

      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [id, supabase]);

  if (loading) return <div className="p-8 text-center text-white">Loading profile...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  if (!profile) return <div className="p-8 text-center text-white">Freelancer not found.</div>;

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 text-white">
      {/* Profile Header */}
      <header className="flex flex-col md:flex-row items-center gap-6 md:gap-8 p-8 bg-primary-dark border border-white/10 rounded-2xl mb-8">
        <img 
          src={profile.avatar_url || '/default-avatar.png'} 
          alt={profile.full_name || 'Freelancer'}
          className="w-32 h-32 rounded-full object-cover border-4 border-accent shadow-lg"
        />
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-bold text-white">{profile.full_name}</h1>
          <p className="text-xl text-accent font-medium mt-1">{profile.title || 'Freelancer'}</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (About & Skills) */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-primary-dark border border-white/10 rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-4">About</h2>
            <p className="text-gray-300 leading-relaxed">{profile.bio || 'No bio available.'}</p>
          </div>
          <div className="bg-primary-dark border border-white/10 rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-4">Skills</h2>
            <div className="flex flex-wrap gap-3">
              {profile.skills?.map(skill => (
                <span key={skill} className="px-4 py-2 bg-accent/20 text-accent text-sm font-semibold rounded-full">
                  {skill}
                </span>
              )) || <p className="text-gray-400">No skills listed.</p>}
            </div>
          </div>
        </div>

        {/* Right Column (Completed Projects) */}
        <div className="lg:col-span-2 bg-primary-dark border border-white/10 rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4">Completed Projects</h2>
          <div className="space-y-4">
            {projects.length > 0 ? (
              projects.map(project => (
                <Link href={`/projects/${project.id}`} key={project.id} className="block p-4 bg-white/5 rounded-lg hover:bg-white/10 transition">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg text-white">{project.title}</h3>
                    <p className="text-accent font-bold">${project.budget.toLocaleString()}</p>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">Completed on {new Date(project.created_at).toLocaleDateString()}</p>
                </Link>
              ))
            ) : (
              <div className="text-center py-12 text-gray-400">
                <p>No completed projects yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
