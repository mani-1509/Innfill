"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const EventsPage = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClientComponentClient();
    async function fetchEvents() {
      const { data, error } = await supabase
        .from("events")
        .select("id, name, date, description, organizer")
        .order("date", { ascending: false });
      setEvents(data || []);
      setLoading(false);
    }
    fetchEvents();
  }, []);

  if (loading) return <div className="p-8 text-lg">Loading events...</div>;
  if (!events.length) return <div className="p-8 text-lg">No events found.</div>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Events & Sync Feed</h1>
      <div className="space-y-6">
        {events.map((event) => (
          <div
            key={event.id}
            className="rounded-xl bg-neutral-900 border border-neutral-700 p-6 shadow hover:border-blue-500 transition"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-lg">{event.name}</div>
              <div className="text-sm text-neutral-400">
                {event.date ? new Date(event.date).toLocaleDateString() : ""}
              </div>
            </div>
            <div className="mb-2 text-neutral-300">{event.description}</div>
            <div className="text-sm text-neutral-500">Organized by: {event.organizer}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsPage;
