"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClientComponentClient();
    async function fetchNotifications() {
      const { data, error } = await supabase
        .from("notifications")
        .select("id, type, message, read, created_at")
        .order("created_at", { ascending: false });
      setNotifications(data || []);
      setLoading(false);
    }
    fetchNotifications();
  }, []);

  if (loading) return <div className="p-8 text-lg">Loading notifications...</div>;
  if (!notifications.length) return <div className="p-8 text-lg">No notifications found.</div>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>
      <div className="space-y-6">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`rounded-xl border p-6 shadow transition ${notification.read ? "bg-neutral-900 border-neutral-700" : "bg-blue-950 border-blue-700"}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-lg">{notification.type}</div>
              <div className="text-sm text-neutral-400">
                {notification.created_at ? new Date(notification.created_at).toLocaleString() : ""}
              </div>
            </div>
            <div className="mb-2 text-neutral-300">{notification.message}</div>
            <div className="text-xs text-neutral-500">{notification.read ? "Read" : "Unread"}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;
