"use client";

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Message {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  profiles: {
    full_name: string;
    avatar_url: string | null;
  } | null;
}

interface Project {
  id: string;
  title: string;
  client_id: string;
  freelancer_id: string | null;
}

export default function ChatPage() {
  const { projectId } = useParams();
  const { user } = useAuth();
  const supabase = createClient();

  const [project, setProject] = useState<Project | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchInitialData = useCallback(async () => {
    if (!user || !projectId) return;

    try {
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('id, title, client_id, freelancer_id')
        .eq('id', projectId)
        .single();

      if (projectError) throw new Error('Failed to load project details.');
      if (user.id !== projectData.client_id && user.id !== projectData.freelancer_id) {
        throw new Error('You do not have access to this chat.');
      }
      setProject(projectData);

      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*, profiles(full_name, avatar_url)')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true });

      if (messagesError) throw new Error('Failed to load messages.');
      setMessages(messagesData || []);

    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [projectId, supabase, user]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!projectId) return;

    const channel = supabase
      .channel(`project-chat-${projectId}`)
      .on<Message>(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `project_id=eq.${projectId}` },
        async (payload) => {
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('id', payload.new.sender_id)
            .single();

          const newMessageWithProfile = { ...payload.new, profiles: profileData };
          setMessages((prev) => [...prev, newMessageWithProfile]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId, supabase]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !projectId) return;

    const content = newMessage.trim();
    setNewMessage('');

    const { error } = await supabase.from('messages').insert({
      content,
      sender_id: user.id,
      project_id: projectId as string,
    });

    if (error) {
      setError('Failed to send message. Please try again.');
      setNewMessage(content); // Restore message on error
    }
  };

  if (loading) return <div className="p-8 text-center text-white">Loading Chat...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-primary-light">
      <header className="bg-primary-dark p-4 border-b border-white/10 shadow-md z-10">
        <h1 className="text-xl font-bold text-white">{project?.title || 'Chat'}</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => {
          const isSender = msg.sender_id === user?.id;
          return (
            <div key={msg.id} className={`flex items-end gap-3 ${isSender ? 'justify-end' : 'justify-start'}`}>
              {!isSender && <div className="w-8 h-8 rounded-full bg-accent/20 flex-shrink-0"></div>}
              <div className={`max-w-md lg:max-w-xl p-4 rounded-2xl ${isSender ? 'bg-accent text-white rounded-br-none' : 'bg-primary-dark text-gray-200 rounded-bl-none'}`}>
                <p>{msg.content}</p>
                <p className={`text-xs mt-2 ${isSender ? 'text-white/70' : 'text-gray-400'}`}>
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </main>

      <footer className="p-4 bg-primary-dark border-t border-white/10">
        <form onSubmit={handleSendMessage} className="flex items-center gap-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-white/5 p-3 rounded-lg border border-white/10 focus:ring-accent focus:border-accent transition text-white"
          />
          <button type="submit" className="px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition shadow-lg">
            Send
          </button>
        </form>
      </footer>
    </div>
  );
}

