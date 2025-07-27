"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const SyncFeedPage = () => {
  const [feed, setFeed] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClientComponentClient();
    async function fetchFeed() {
      const { data, error } = await supabase
        .from("sync_feed")
        .select("id, activity_type, user, description, created_at")
        .order("created_at", { ascending: false });
      setFeed(data || []);
      setLoading(false);
    }
    fetchFeed();
  }, []);

  if (loading) return <div className="p-8 text-lg">Loading sync feed...</div>;
  if (!feed.length) return <div className="p-8 text-lg">No activity yet.</div>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Sync Feed</h1>
      <div className="space-y-6">
        {feed.map((item) => (
          <div
            key={item.id}
            className="rounded-xl bg-neutral-900 border border-neutral-700 p-6 shadow hover:border-blue-500 transition"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-lg">{item.activity_type}</div>
              <div className="text-sm text-neutral-400">
                {item.created_at ? new Date(item.created_at).toLocaleString() : ""}
              </div>
            </div>
            <div className="mb-2 text-neutral-300">{item.description}</div>
            <div className="text-sm text-neutral-500">User: {item.user}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SyncFeedPage;
