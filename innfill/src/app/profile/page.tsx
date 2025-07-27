"use client";

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/providers/AuthProvider';
import { WithContext as ReactTags } from 'react-tag-input';
import './react-tags.css'; // Custom styles for tags

const KeyCodes = {
  comma: 188,
  enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

export default function ProfilePage() {
  const { user, profile, loading: authLoading, refreshProfile } = useAuth();
  const supabase = createClient();

  const [isEditMode, setIsEditMode] = useState(false);
  const [fullName, setFullName] = useState('');
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState<{ id: string; text: string }[]>([]);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setTitle(profile.title || '');
      setBio(profile.bio || '');
      setSkills(profile.skills?.map(skill => ({ id: skill, text: skill })) || []);
      setAvatarPreview(profile.avatar_url || null);
    }
  }, [profile]);

  const handleUpdateProfile = async () => {
    if (!user) return;
    setIsUpdating(true);
    setError(null);

    let avatar_url = profile?.avatar_url;

    if (avatarFile) {
      setIsUploading(true);
      const filePath = `${user.id}/${Date.now()}`;
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, avatarFile);

      if (uploadError) {
        setError('Failed to upload avatar. Please try again.');
        setIsUploading(false);
        setIsUpdating(false);
        return;
      }

      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
      avatar_url = urlData.publicUrl;
      setIsUploading(false);
    }

    const updatedProfile = {
      full_name: fullName,
      title,
      bio,
      skills: skills.map(s => s.text),
      avatar_url,
    };

    const { error: updateError } = await supabase
      .from('profiles')
      .update(updatedProfile)
      .eq('id', user.id);

    if (updateError) {
      setError('Failed to update profile.');
    } else {
      await refreshProfile();
      setIsEditMode(false);
    }
    setIsUpdating(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  const handleDelete = (i: number) => {
    setSkills(skills.filter((_, index) => index !== i));
  };

  const handleAddition = (tag: { id: string; text: string }) => {
    setSkills([...skills, tag]);
  };

  if (authLoading) return <div className="p-8 text-center text-white">Loading profile...</div>;
  if (!profile) return <div className="p-8 text-center text-white">Profile not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Your Profile</h1>
        <button 
          onClick={() => setIsEditMode(!isEditMode)}
          className="px-4 py-2 bg-accent text-primary-dark font-semibold rounded-lg hover:bg-accent/90 transition"
        >
          {isEditMode ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {isEditMode ? (
        // Edit Mode
        <div className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <img src={avatarPreview || '/default-avatar.png'} alt="Avatar Preview" className="w-32 h-32 rounded-full object-cover border-4 border-accent" />
            <input type="file" id="avatar-upload" accept="image/*" onChange={handleFileChange} className="hidden" />
            <label htmlFor="avatar-upload" className="cursor-pointer px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition">Change Picture</label>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full bg-white/5 p-2 rounded-lg border border-white/10" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Title / Profession</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-white/5 p-2 rounded-lg border border-white/10" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Bio</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} rows={4} className="w-full bg-white/5 p-2 rounded-lg border border-white/10" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Skills</label>
            <ReactTags tags={skills} handleDelete={handleDelete} handleAddition={handleAddition} delimiters={delimiters} inputFieldPosition="bottom" autocomplete />
          </div>

          {error && <p className="text-red-500">{error}</p>}

          <button onClick={handleUpdateProfile} disabled={isUpdating} className="w-full py-3 bg-accent text-primary-dark font-bold rounded-lg disabled:bg-gray-500 transition">
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      ) : (
        // View Mode
        <div className="bg-primary-dark border border-white/10 rounded-2xl p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <img src={profile.avatar_url || '/default-avatar.png'} alt={profile.full_name || 'User'} className="w-32 h-32 rounded-full object-cover border-4 border-accent" />
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold">{profile.full_name}</h2>
              <p className="text-xl text-accent font-medium mt-1">{profile.title}</p>
              <p className="text-gray-400 mt-2">{user?.email}</p>
            </div>
          </div>
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-2">About</h3>
            <p className="text-gray-300 leading-relaxed">{profile.bio || 'No bio provided.'}</p>
          </div>
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-2">Skills</h3>
            <div className="flex flex-wrap gap-3">
              {profile.skills?.map(skill => (
                <span key={skill} className="px-4 py-2 bg-accent/20 text-accent text-sm font-semibold rounded-full">
                  {skill}
                </span>
              )) || <p className="text-gray-400">No skills listed.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
