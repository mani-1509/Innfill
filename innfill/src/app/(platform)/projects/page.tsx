// src/app/(platform)/projects/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiPlus, FiClock, FiDollarSign } from 'react-icons/fi';
import { createClient } from '@/lib/supabase/client';
import { Project } from '@/types/types';
import Link from 'next/link';
import { timeAgo } from '@/lib/utils';

const ProjectCard = ({ project, index }: { project: Project, index: number }) => (
  <Link href={`/projects/${project.id}`} passHref>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-gray-800/50 p-6 rounded-xl border border-white/10 hover:border-violet-500/50 transition-all duration-300 flex flex-col h-full cursor-pointer"
    >
      <h3 className="font-bold text-lg text-white mb-2">{project.title}</h3>
      <p className="text-sm text-gray-400 mb-4">by <span className="font-semibold text-violet-400">{project.profiles?.full_name || 'A client'}</span></p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {project.skills.map((skill: string) => (
          <span key={skill} className="px-2 py-1 bg-gray-700/60 text-xs font-medium text-gray-300 rounded-full">{skill}</span>
        ))}
      </div>

      <div className="mt-auto pt-4 border-t border-white/10 flex justify-between items-center text-sm text-gray-400">
        <div className="flex items-center"><FiDollarSign className="mr-1.5" /> {project.budget.toLocaleString()}</div>
        <div className="flex items-center"><FiClock className="mr-1.5" /> {timeAgo(project.created_at)}</div>
      </div>
    </motion.div>
  </Link>
);

const SkeletonCard = () => (
    <div className="bg-gray-800/50 p-6 rounded-xl border border-white/10 animate-pulse">
        <div className="h-6 bg-gray-700/60 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-700/60 rounded w-1/2 mb-6"></div>
        <div className="flex flex-wrap gap-2 mb-6">
            <div className="h-5 bg-gray-700/60 rounded-full w-16"></div>
            <div className="h-5 bg-gray-700/60 rounded-full w-20"></div>
        </div>
        <div className="mt-auto pt-4 border-t border-white/10 flex justify-between items-center">
            <div className="h-5 bg-gray-700/60 rounded w-24"></div>
            <div className="h-5 bg-gray-700/60 rounded w-28"></div>
        </div>
    </div>
);

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          profiles ( full_name )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects:', error);
        setError('Could not fetch projects. Please try again later.');
      } else {
        setProjects(data as Project[]);
      }
      setLoading(false);
    };

    fetchProjects();
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Find Your Next Project</h1>
                <p className="text-gray-400 mt-1">Browse through the latest opportunities on Innfill.</p>
            </div>
            <button className="px-5 py-3 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 transition-colors flex items-center shadow-lg shadow-violet-500/20">
                <FiPlus className="mr-2" /> Post a New Project
            </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex items-center space-x-4 bg-gray-800/50 p-4 rounded-xl border border-white/10 mb-8">
          <FiSearch className="text-gray-400" />
          <input 
            type="text"
            placeholder='Search by title, skill, or client...'
            className='flex-grow bg-transparent focus:outline-none text-white placeholder-gray-500'
          />
        </div>
      </motion.div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
        ) : error ? (
          <div className="col-span-full text-center text-red-400 bg-red-900/20 p-6 rounded-lg">{error}</div>
        ) : (
          projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
