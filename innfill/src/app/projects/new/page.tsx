"use client";

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { WithContext as ReactTags } from 'react-tag-input';
import '@/styles/ReactTags.css'; // Custom styles for the tag input

const KeyCodes = {
  comma: 188,
  enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

export default function NewProjectPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [tags, setTags] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDelete = (i: number) => {
    setTags(tags.filter((tag, index) => index !== i));
  };

  const handleAddition = (tag: any) => {
    setTags([...tags, tag]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user || user.user_type !== 'client') {
      setError('You must be logged in as a client to post a project.');
      return;
    }

    if (!title || !description || !budget || tags.length === 0) {
      setError('Please fill in all required fields and add at least one skill.');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error: insertError } = await supabase
        .from('projects')
        .insert({
          client_id: user.id,
          title,
          description,
          budget: parseFloat(budget),
          required_skills: tags.map(tag => tag.text),
          status: 'open',
        })
        .select('id')
        .single();

      if (insertError) throw insertError;

      router.push(`/projects/${data.id}`);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-white">Loading...</div>;
  }

  if (!user || user.user_type !== 'client') {
    return (
      <div className="p-8 text-center text-red-500">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="mt-2">Only clients can post new projects.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 text-white">
      <h1 className="text-4xl font-bold mb-8">Post a New Project</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6 bg-primary-dark p-8 rounded-2xl border border-white/10">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">Project Title</label>
            <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-white/5 p-3 rounded-lg border border-white/10 focus:ring-accent focus:border-accent transition" placeholder="e.g., Build a Landing Page" required />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">Project Description</label>
            <textarea id="description" rows={8} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-white/5 p-3 rounded-lg border border-white/10 focus:ring-accent focus:border-accent transition" placeholder="Describe the project in detail..." required></textarea>
          </div>
          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-gray-300 mb-2">Budget ($)</label>
            <input type="number" id="budget" value={budget} onChange={(e) => setBudget(e.target.value)} className="w-full bg-white/5 p-3 rounded-lg border border-white/10 focus:ring-accent focus:border-accent transition" placeholder="e.g., 1500" required />
          </div>
          <div>
            <label htmlFor="skills" className="block text-sm font-medium text-gray-300 mb-2">Required Skills</label>
            <ReactTags
              tags={tags}
              handleDelete={handleDelete}
              handleAddition={handleAddition}
              delimiters={delimiters}
              placeholder="Add a new skill"
              inputFieldPosition="bottom"
              autocomplete
              classNames={{
                tags: 'react-tags',
                tagInput: 'react-tags__search',
                tagInputField: 'react-tags__search-input',
                selected: 'react-tags__selected',
                tag: 'react-tags__selected-tag',
                remove: 'react-tags__selected-tag-remove',
                suggestions: 'react-tags__suggestions',
              }}
            />
          </div>
          {error && <div className="p-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg">{error}</div>}
          <button type="submit" disabled={isSubmitting} className="w-full px-6 py-4 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition shadow-lg disabled:bg-gray-500 disabled:cursor-not-allowed">
            {isSubmitting ? 'Submitting...' : 'Post Project'}
          </button>
        </form>

        <div className="lg:col-span-1">
          <h2 className="text-2xl font-bold mb-4">Live Preview</h2>
          <div className="bg-primary-dark border border-white/10 rounded-2xl p-6 sticky top-24">
            <h3 className="text-xl font-bold text-white truncate mb-2">{title || 'Project Title'}</h3>
            <p className="text-accent font-semibold text-lg mb-4">${budget || '0'}</p>
            <p className="text-gray-400 text-sm mb-4 h-24 overflow-hidden">{description || 'Your project description will appear here.'}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.length > 0 ? (
                tags.map(tag => (
                  <span key={tag.id} className="px-3 py-1 bg-accent/20 text-accent text-xs font-semibold rounded-full">{tag.text}</span>
                ))
              ) : (
                <span className="px-3 py-1 bg-white/10 text-gray-400 text-xs font-semibold rounded-full">Skills will appear here</span>
              )}
            </div>
            <button disabled className="w-full mt-4 px-6 py-3 bg-accent/50 text-white/50 font-semibold rounded-lg cursor-not-allowed">
              Apply Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
