"use client";

"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

// Define a specific type for the project data we're fetching
interface ProjectCardData {
  id: string;
  title: string;
  description: string;
  budget: number;
  required_skills: string[];
  created_at: string;
  profiles: {
    full_name: string;
    avatar_url: string | null;
  } | null;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('projects')
          .select(`
            id,
            title,
            description,
            budget,
            required_skills,
            created_at,
            profiles (full_name, avatar_url)
          `)
          .eq('status', 'open') // Only fetch open projects
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Supabase might return the related profile as an array, so we process it.
        const processedData = data?.map(p => ({
          ...p,
          profiles: Array.isArray(p.profiles) ? p.profiles[0] : p.profiles,
        })) || [];

        setProjects(processedData);

      } catch (err: any) {
        setError(err.message || 'Failed to fetch projects.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [supabase]);

  const renderContent = () => {
    if (loading) {
      return <p className="text-center text-gray-400">Loading projects...</p>;
    }

    if (error) {
      return <p className="text-center text-red-500">Error: {error}</p>;
    }

    if (projects.length === 0) {
      return <p className="text-center text-gray-400">No open projects found at the moment.</p>;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Link
            href={`/projects/${project.id}`}
            key={project.id}
            className="block bg-primary-dark p-6 rounded-2xl border border-white/10 hover:border-accent transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
          >
            <div className="flex items-center mb-4">
              {/* Client Avatar - Placeholder for now */}
              <div className="w-10 h-10 rounded-full bg-accent/20 mr-4"></div>
              <div>
                <h3 className="font-bold text-white">{project.profiles?.full_name || 'Anonymous Client'}</h3>
                <p className="text-xs text-gray-500">Posted on {new Date(project.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2 truncate">{project.title}</h2>
            <p className="text-gray-400 text-sm mb-4 h-10 overflow-hidden text-ellipsis">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {project.required_skills.slice(0, 3).map(skill => (
                <span key={skill} className="px-2 py-1 bg-white/10 text-xs text-gray-300 rounded-md">{skill}</span>
              ))}
            </div>
            <div className="text-right text-lg font-bold text-accent">
              ${project.budget}
            </div>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-8 text-white">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold">Browse Projects</h1>
        <p className="text-lg text-gray-400 mt-2">Find your next opportunity from thousands of listings.</p>
      </div>
      {renderContent()}
    </div>
  );
}

