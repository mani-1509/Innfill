// src/app/(dashboard)/client/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { UserProfile } from "@/types/user"; // Import UserProfile
import Image from "next/image";
import Link from "next/link";

interface ClientPageProps {
  // If you don't actually need the ID to fetch *this user's* data
  // (because useAuth already gives you the logged-in user),
  // you might not need to destructure params.id here,
  // but it's good for consistency with the route.
}

export default function ClientDashboardPage() {
  const { user, loading, error } = useAuth();
  const params = useParams(); // Get route parameters, e.g., { id: 'client-user-id' }
  const clientId = params.id as string; // The ID from the URL

  // State to hold any additional client-specific data you might fetch
  const [clientData, setClientData] = useState<any>(null); // Replace 'any' with a specific type for client data
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if (
      !loading &&
      user &&
      user.user_type === "client" &&
      user.id === clientId
    ) {
      // Fetch client-specific projects, applications, etc.
      const fetchClientSpecificData = async () => {
        setDataLoading(true);
        try {
          // Example: Fetch projects posted by this client
          const { data, error } = await supabase
            .from("projects") // Assuming you have a 'projects' table
            .select("*")
            .eq("client_id", clientId); // Filter by the logged-in client's ID

          if (error) throw error;
          setClientData(data);
          setDataError(null);
        } catch (err: any) {
          setDataError(err.message || "Failed to fetch client data.");
        } finally {
          setDataLoading(false);
        }
      };
      fetchClientSpecificData();
    } else if (!loading && user && user.id !== clientId) {
      // Handle case where logged-in user tries to access another user's dashboard by URL
      setDataError(
        "You are not authorized to view this client's dashboard directly."
      );
      setDataLoading(false);
    }
    // No need to redirect here, middleware handles initial access control.
  }, [loading, user, clientId, supabase]);

  if (loading || dataLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Client Dashboard
        </h1>
        <p className="text-gray-600">Loading client data...</p>
      </div>
    );
  }

  if (error || dataError) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-red-500">{error || dataError}</p>
        <p className="text-gray-600 mt-4">
          Please try again or contact support.
        </p>
      </div>
    );
  }

  if (!user || user.user_type !== "client") {
    // This state should ideally be caught by middleware, but as a fallback
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-gray-600">
          You do not have permission to view this page.
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Client Dashboard</h1>
        <Link
          href="/projects/new"
          className="px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition shadow-lg"
        >
          Post a New Project
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-primary-dark p-6 rounded-2xl border border-white/10">
          <h3 className="text-gray-400 text-sm font-medium">Active Projects</h3>
          <p className="text-3xl font-bold mt-2">{clientData?.length || 0}</p>
        </div>
        <div className="bg-primary-dark p-6 rounded-2xl border border-white/10">
          <h3 className="text-gray-400 text-sm font-medium">Total Spent</h3>
          <p className="text-3xl font-bold mt-2">$0.00</p> {/* Placeholder */}
        </div>
        <div className="bg-primary-dark p-6 rounded-2xl border border-white/10">
          <h3 className="text-gray-400 text-sm font-medium">Open Applications</h3>
          <p className="text-3xl font-bold mt-2">0</p> {/* Placeholder */}
        </div>
        <div className="bg-primary-dark p-6 rounded-2xl border border-white/10">
          <h3 className="text-gray-400 text-sm font-medium">Completed Projects</h3>
          <p className="text-3xl font-bold mt-2">0</p> {/* Placeholder */}
        </div>
      </div>

      {/* Recent Projects List */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Recent Projects</h2>
        <div className="bg-primary-dark rounded-2xl border border-white/10">
          {clientData && clientData.length > 0 ? (
            <ul className="divide-y divide-white/10">
              {clientData.map((project: any) => (
                <li key={project.id} className="p-6 hover:bg-white/5 transition">
                  <div className="flex justify-between items-center">
                    <div>
                      <Link href={`/projects/${project.id}`} className="text-lg font-semibold text-white hover:text-accent">
                        {project.title}
                      </Link>
                      <p className="text-sm text-gray-400 mt-1">
                        Budget: <span className="font-medium text-gray-300">${project.budget}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${project.status === 'open' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                        {project.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-2">Posted on {new Date(project.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-8 text-center text-gray-400">
              <p>You haven't posted any projects yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
