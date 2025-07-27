"use client";

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import ApplyModal from '@/components/ApplyModal';

interface Application {
  id: string;
  bid_amount: number;
  proposal_message: string;
  freelancer_id: string;
  profiles: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  } | null;
}

interface ProjectDetails {
  id: string;
  title: string;
  description: string;
  budget: number;
  required_skills: string[];
  status: string;
  created_at: string;
  client_id: string;
  freelancer_id: string | null;
  profiles: {
    full_name: string;
    avatar_url: string | null;
    bio: string | null;
  } | null;
}

export default function ProjectDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [applications, setApplications] = useState<Application[]>([]);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const supabase = createClient();

  const fetchProject = useCallback(async (showLoading = true) => {
    if (!id) return;
    if (showLoading) setLoading(true);

    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`*, freelancer_id, profiles (*)`)
        .eq('id', id)
        .single();

      if (error) throw error;
      setProject(data);

      if (user && data && user.id === data.client_id) {
        const { data: appsData, error: appsError } = await supabase
          .from('applications')
          .select(`id, bid_amount, proposal_message, freelancer_id, status, profiles (id, full_name, avatar_url)`)
          .eq('project_id', id);

        if (appsError) throw appsError;

        const processedApps = appsData?.map(app => ({
          ...app,
          profiles: Array.isArray(app.profiles) ? app.profiles[0] : app.profiles,
        })) || [];
        setApplications(processedApps);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch project details.');
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [id, supabase, user]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  const handleAcceptApplication = async (application: Application) => {
    if (!project || !application.profiles) return;
    setIsProcessing(application.id);
    try {
      const { error } = await supabase.functions.invoke('accept-application', {
        body: {
          projectId: project.id,
          applicationId: application.id,
          freelancerId: application.freelancer_id,
        },
      });

      if (error) throw error;
      
      await fetchProject(false);

    } catch (e: any) {
      setError(`Error accepting application: ${e.message}`);
    } finally {
      setIsProcessing(null);
    }
  };

  const handleRejectApplication = async (applicationId: string) => {
    setIsProcessing(applicationId);
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: 'rejected' })
        .eq('id', applicationId);

      if (error) throw error;

      await fetchProject(false);

    } catch (e: any) {
      setError(`Error rejecting application: ${e.message}`);
    } finally {
      setIsProcessing(null);
    }
  };

  const renderActionButtons = () => {
    if (!user || !project) return null;

    // Show 'Go to Chat' button if project is in-progress for client or freelancer
    if (project.status === 'in-progress' && (user.id === project.client_id || user.id === project.freelancer_id)) {
      return (
        <Link href={`/chat/${project.id}`} className="block text-center w-full px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition shadow-lg">
          Go to Chat
        </Link>
      );
    }

    // Show 'Apply Now' button for freelancers if project is open
    if (user.user_type === 'freelancer' && project.status === 'open') {
      return (
        <button 
          onClick={() => setShowApplyModal(true)}
          className="w-full px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition shadow-lg"
        >
          Apply Now
        </button>
      );
    }

    // Show 'Edit Project' button for client if project is open
    if (user.id === project.client_id && project.status === 'open') {
      return (
        <Link href={`/projects/${project.id}/edit`} className="block text-center w-full px-6 py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition">
          Edit Project
        </Link>
      );
    }

    return null;
  };

  if (loading) {
    return <div className="p-8 text-center text-white">Loading project details...</div>;
  }

  if (error || !project) {
    return <div className="p-8 text-center text-red-500">{error || 'Project not found.'}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-8 text-white">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full mb-4 ${project.status === 'open' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
          </span>
          <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
          <p className="text-gray-400 mb-8">Posted on {new Date(project.created_at).toLocaleDateString()}</p>
          
          <h2 className="text-2xl font-bold mb-4 border-b border-white/10 pb-2">Project Description</h2>
          <div className="prose prose-invert max-w-none text-gray-300">
            <p>{project.description}</p>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4 border-b border-white/10 pb-2">Required Skills</h2>
          <div className="flex flex-wrap gap-3">
            {project.required_skills.map(skill => (
              <span key={skill} className="px-4 py-2 bg-white/10 text-sm text-gray-200 rounded-lg">{skill}</span>
            ))}
          </div>

          {/* Applications Section - Visible only to project owner */}
          {user && user.id === project.client_id && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-4 border-b border-white/10 pb-2">Project Applications</h2>
              {applications.length > 0 ? (
                <div className="space-y-6">
                  {applications.map(app => (
                    <div key={app.id} className="bg-primary-dark p-6 rounded-2xl border border-white/10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-full bg-accent/20 mr-4"></div>
                          <div>
                            <h4 className="font-bold text-white text-lg">{app.profiles?.full_name || 'Anonymous'}</h4>
                            <p className="text-accent font-bold">Bid: ${app.bid_amount}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleRejectApplication(app.id)}
                            disabled={isProcessing === app.id || project.status !== 'open'}
                            className="px-4 py-2 text-sm bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/40 transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isProcessing === app.id ? '...' : 'Reject'}
                          </button>
                          <button 
                            onClick={() => handleAcceptApplication(app)}
                            disabled={isProcessing === app.id || project.status !== 'open'}
                            className="px-4 py-2 text-sm bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/40 transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isProcessing === app.id ? '...' : 'Accept'}
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm italic">{app.proposal_message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No applications received yet.</p>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside>
          <div className="bg-primary-dark p-6 rounded-2xl border border-white/10 sticky top-24">
            <h3 className="text-xl font-bold mb-4">About the Client</h3>
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 rounded-full bg-accent/20 mr-4"></div>
              <div>
                <h4 className="font-bold text-white text-lg">{project.profiles?.full_name || 'Anonymous Client'}</h4>
                <Link href={`/clients/${project.client_id}`} className="text-sm text-accent hover:underline">View Profile</Link>
              </div>
            </div>
            <p className="text-sm text-gray-400 italic mb-6">
              {project.profiles?.bio || 'No bio provided.'}
            </p>

            <div className="border-t border-white/10 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Project Budget</span>
                <span className="text-2xl font-bold text-accent">${project.budget}</span>
              </div>
            </div>
            
            {renderActionButtons()}
          </div>
        </aside>
      </div>
      {showApplyModal && (
        <ApplyModal 
          projectId={project.id}
          onClose={() => setShowApplyModal(false)}
          onApplySuccess={() => {
            setShowApplyModal(false);
            setApplicationStatus('success');
            // Optionally, you could refetch project data to show application status
          }}
        />
      )}
      {applicationStatus === 'success' && (
        <div className="fixed bottom-8 right-8 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
          Application submitted successfully!
        </div>
      )}
    </div>
  );
}

