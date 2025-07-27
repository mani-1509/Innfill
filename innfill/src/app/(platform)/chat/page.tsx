import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiSend, FiPaperclip } from 'react-icons/fi';
import { createClient } from '@/lib/supabase/client';
import { Conversation, Message } from '@/types/types';
import { timeAgo } from '@/lib/utils';
import { User } from '@supabase/supabase-js';

const ChatPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState({ convos: true, messages: false });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchUserAndConversations = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUser(user);

      // This is a complex query. For a production app, creating a DB function (RPC)
      // would be more efficient than making multiple requests from the client.
      const { data: convos, error } = await supabase.rpc('get_conversations_for_user', { p_user_id: user.id });

      if (error) {
        console.error('Error fetching conversations:', error);
      } else {
        setConversations(convos || []);
      }
      setLoading(prevState => ({ ...prevState, convos: false }));
    };
    fetchUserAndConversations();
  }, [supabase]);

  useEffect(() => {
    if (selectedConversation) {
      const fetchMessages = async () => {
        setLoading(prevState => ({ ...prevState, messages: true }));
        const { data, error } = await supabase
          .from('messages')
          .select('*, sender_profile:profiles(full_name, avatar_url)')
          .eq('chat_id', selectedConversation.chat_id)
          .order('created_at', { ascending: true });

        if (error) console.error('Error fetching messages:', error);
        else setMessages(data as any || []);
        setLoading(prevState => ({ ...prevState, messages: false }));
      };
      fetchMessages();

      const channel = supabase
        .channel(`chat:${selectedConversation.chat_id}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `chat_id=eq.${selectedConversation.chat_id}` }, async (payload) => {
            const newMessage = payload.new as Message;
            const { data: profile, error } = await supabase.from('profiles').select('full_name, avatar_url').eq('id', newMessage.sender_id).single();
            if (!error) {
                newMessage.sender_profile = profile;
            }
            setMessages(currentMessages => [...currentMessages, newMessage]);
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedConversation, supabase]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !selectedConversation) return;

    const { error } = await supabase.from('messages').insert({
      chat_id: selectedConversation.chat_id,
      sender_id: user.id,
      content: newMessage.trim(),
    });

    if (error) console.error('Error sending message:', error);
    else setNewMessage('');
  };

  return (
    <div className="h-screen flex bg-gray-900 text-white overflow-hidden">
      <div className="w-1/3 xl:w-1/4 bg-gray-800/50 border-r border-white/10 flex flex-col">
        <div className="p-4 border-b border-white/10">
          <h1 className="text-2xl font-bold">Chat</h1>
        </div>
        <div className="flex-grow overflow-y-auto">
          {loading.convos ? <p className='p-4 text-gray-400'>Loading...</p> : conversations.map(convo => (
            <div key={convo.chat_id} onClick={() => setSelectedConversation(convo)} className={`p-4 flex items-center space-x-3 cursor-pointer ${selectedConversation?.chat_id === convo.chat_id ? 'bg-violet-600/20' : 'hover:bg-gray-700/50'}`}>
              <img src={convo.other_participant.avatar_url || '/avatar.svg'} alt={convo.other_participant.full_name || ''} className="w-12 h-12 rounded-full" />
              <div>
                <h3>{convo.other_participant.full_name}</h3>
                <p className="text-sm text-gray-400 truncate">{convo.last_message?.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            <div className="p-4 border-b border-white/10 flex items-center space-x-4 bg-gray-800/50">
                <img src={selectedConversation.other_participant.avatar_url || '/avatar.svg'} alt="" className="w-10 h-10 rounded-full" />
                <h2 className="text-lg font-bold text-white">{selectedConversation.other_participant.full_name}</h2>
            </div>

            <div className="flex-grow p-6 overflow-y-auto space-y-6">
              {loading.messages ? <p>Loading messages...</p> : messages.map((msg, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex items-end gap-3 ${msg.sender_id === user?.id ? 'flex-row-reverse' : ''}`}>
                  <div className={`p-4 rounded-2xl max-w-lg ${msg.sender_id === user?.id ? 'bg-violet-600 rounded-br-lg' : 'bg-gray-700 rounded-bl-lg'}`}>
                    <p>{msg.content}</p>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 bg-gray-800/50">
              <div className="relative">
                <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type your message..." className="w-full bg-gray-700/60 pl-4 pr-24 py-3 rounded-lg" />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
                    <button type="submit" className="p-2 rounded-lg bg-violet-600 text-white"><FiSend /></button>
                </div>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">Select a conversation to start chatting</div>
        )}
      </div>
    </div>
  );
};
};

export default ChatPage;
