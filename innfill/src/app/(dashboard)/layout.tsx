// src/app/(dashboard)/layout.tsx
"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useState, ReactNode } from "react"; // Import useState and ReactNode
import { createClient } from "@/lib/supabase/client"; // Import client for logout
import Sidebar from "@/components/Sidebar";
import styles from "./Dashboard.module.css";

// Define props for DashboardLayout
interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, loading: authLoading } = useAuth(); // Renamed loading to authLoading for clarity
  const [signingOut, setSigningOut] = useState(false); // Local state for logout button loading
  const router = useRouter();
  const supabase = createClient(); // Initialize Supabase client for logout

  // Handle loading and redirection if user is not authenticated or type doesn't match path
  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-primary text-xl">Loading dashboard...</p>
      </div>
    );
  }

  // If user is null after loading, redirect to login
  if (!user) {
    router.push("/login");
    return null; // Don't render anything while redirecting
  }

  // --- Logout Function ---
  const handleSignOut = async () => {
    setSigningOut(true); // Start loading for logout
    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        console.error("Error signing out:", signOutError.message);
        // Optionally show a user-friendly error message
      } else {
        console.log("User signed out successfully.");
        // No explicit router.push here; let AuthContext and middleware handle the redirect
        // as AuthContext will set user to null, triggering the appropriate redirect logic.
      }
    } catch (err) {
      console.error("Exception during sign out:", err);
    } finally {
      setSigningOut(false); // End loading regardless of success/failure
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Sidebar: fixed vertical panel */}
      <aside className={styles.sidebarPanel}>
        <Sidebar userProfile={user} />
      </aside>

      {/* Main dashboard area */}
      <main className={styles.mainArea}>
        {/* Banner: full width with profile image and name inside */}
        <div className={styles.profileBanner}>
          <div className={styles.profileBannerContent}>
            <div className={styles.profileImageWrapper}>
              {user?.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.full_name || 'Profile'}
                  className={styles.profileImage}
                  style={{ objectFit: 'cover', width: 120, height: 120, borderRadius: '50%' }}
                />
              ) : (
                <div className={styles.profileImage}>
                  <svg width="54" height="54" fill="none" viewBox="0 0 54 54">
                    <circle cx="27" cy="27" r="27" fill="#444" />
                    <text x="50%" y="54%" textAnchor="middle" fill="#bbb" fontSize="22px" fontFamily="monospace" dy=".3em">
                      {user?.full_name?.[0]?.toUpperCase() || 'N'}
                    </text>
                  </svg>
                </div>
              )}
            </div>
            <div className={styles.profileName}>{user?.full_name || 'NAME'}</div>
          </div>
        </div>

        {/* Tabs below banner */}
        <div className={styles.profileTabs}>
          <button className={styles.tabButton}>Tab 1</button>
          <button className={styles.tabButton}>Tab 2</button>
          <button className={styles.tabButton}>Tab 3</button>
        </div>

        {/* Main info grid/cards */}
        <section className={styles.profileInfoGrid}>
          {/* Example cards/sections as per wireframe */}
          <div className={styles.infoCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <span style={{ fontSize: 28 }}>📊</span>
              <span style={{ fontWeight: 700, fontSize: 18 }}>Stats & Overview</span>
            </div>
            <div style={{ fontSize: 15, color: '#b6b6c7', marginBottom: 4 }}>Projects: <b>12</b></div>
            <div style={{ fontSize: 15, color: '#b6b6c7', marginBottom: 4 }}>Completed: <b>9</b></div>
            <div style={{ fontSize: 15, color: '#b6b6c7' }}>Rating: <b>4.8 ⭐</b></div>
          </div>
          <div className={styles.infoCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <span style={{ fontSize: 28 }}>📈</span>
              <span style={{ fontWeight: 700, fontSize: 18 }}>Performance</span>
            </div>
            <div style={{ fontSize: 15, color: '#b6b6c7', marginBottom: 4 }}>Earnings: <b>$2,300</b></div>
            <div style={{ fontSize: 15, color: '#b6b6c7', marginBottom: 4 }}>Growth: <b>+18%</b></div>
            <div style={{ fontSize: 15, color: '#b6b6c7' }}>Last Month: <b>$600</b></div>
          </div>
          <div className={styles.infoCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <span style={{ fontSize: 28 }}>🕒</span>
              <span style={{ fontWeight: 700, fontSize: 18 }}>Recent Activity</span>
            </div>
            <div style={{ fontSize: 15, color: '#b6b6c7', marginBottom: 4 }}>Last login: <b>2h ago</b></div>
            <div style={{ fontSize: 15, color: '#b6b6c7', marginBottom: 4 }}>Last project: <b>UI Dashboard</b></div>
            <div style={{ fontSize: 15, color: '#b6b6c7' }}>New messages: <b>3</b></div>
          </div>
          <div className={styles.infoCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <span style={{ fontSize: 28 }}>🏆</span>
              <span style={{ fontWeight: 700, fontSize: 18 }}>Achievements</span>
            </div>
            <div style={{ fontSize: 15, color: '#b6b6c7', marginBottom: 4 }}>Badge: <b>Pro</b></div>
            <div style={{ fontSize: 15, color: '#b6b6c7', marginBottom: 4 }}>Level: <b>Gold</b></div>
            <div style={{ fontSize: 15, color: '#b6b6c7' }}>Joined: <b>2022</b></div>
          </div>
        </section>
      </main>
    </div>
  );
}
