"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const ChatPage = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");

  useEffect(() => {
    const supabase = createClientComponentClient();
    async function fetchMessages() {
      const { data, error } = await supabase
        .from("messages")
        .select("id, sender, content, created_at")
        .order("created_at", { ascending: true });
      setMessages(data || []);
      setLoading(false);
    }
    fetchMessages();
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;
    const supabase = createClientComponentClient();
    await supabase.from("messages").insert([{ content: input }]);
    setInput("");
    // Re-fetch messages (for demo; ideally use realtime subscription)
    const { data } = await supabase
      .from("messages")
      .select("id, sender, content, created_at")
      .order("created_at", { ascending: true });
    setMessages(data || []);
  };

  if (loading) return <div className="p-8 text-lg">Loading chat...</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Chat</h1>
      <div className="space-y-4 mb-4">
        {messages.map((msg) => (
          <div key={msg.id} className="bg-neutral-900 border border-neutral-700 rounded p-3">
            <div className="text-sm text-neutral-400 mb-1">{msg.sender || "User"}</div>
            <div>{msg.content}</div>
            <div className="text-xs text-neutral-500 mt-1">{msg.created_at ? new Date(msg.created_at).toLocaleString() : ""}</div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 rounded border border-neutral-700 bg-neutral-800 text-white px-3 py-2"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
