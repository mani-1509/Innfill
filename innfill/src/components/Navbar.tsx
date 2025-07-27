// src/components/Navbar.tsx
"use client";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client"; // Import client for logout
import { useState } from "react"; // Import useState for local loading in Navbar

export default function Navbar() {
  const { user, loading: authLoading, error } = useAuth(); // Renamed loading to authLoading for clarity
  const [signingOut, setSigningOut] = useState(false); // Local state for logout button loading
  const router = useRouter();
  const supabase = createClient(); // Initialize Supabase client for logout

  // If auth is still loading, display the skeleton and defer all path calculations
  if (authLoading) {
    return (
      <nav className="w-full flex items-center justify-between px-6 py-4 bg-primary text-white animate-pulse">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-600"></div>
          <span className="text-xl font-bold bg-gray-600 w-24 h-6 rounded"></span>
        </div>
        <div className="flex items-center gap-6">
          <span className="bg-gray-600 w-20 h-5 rounded"></span>
          <span className="bg-gray-600 w-20 h-5 rounded"></span>
          <span className="bg-gray-600 w-20 h-5 rounded"></span>
          <span className="bg-gray-600 w-20 h-5 rounded"></span>
          <span className="bg-gray-600 w-20 h-5 rounded"></span>
        </div>
        <div className="w-9 h-9 rounded-full bg-gray-600"></div>
      </nav>
    );
  }

  // Now that authLoading is false, user is either a UserProfile or null.
  let dashboardPath = "/";
  if (user) {
    // Corrected paths based on your (dashboard) route group
    if (user.user_type === "freelancer") {
      dashboardPath = `/freelancer/${user.id}`;
    } else if (user.user_type === "client") {
      dashboardPath = `/client/${user.id}`;
    } else if (user.user_type === "individual") {
      dashboardPath = `/individual/${user.id}`;
    } else {
      // Fallback for unknown user types or a general dashboard if one exists
      dashboardPath = "/";
    }
  }

  // Define visibility flags based on user.user_type
  const showFreelancersLink =
    !user ||
    (user.user_type !== "freelancer" && user.user_type !== "individual");
  const showProjectsLink =
    !user || (user.user_type !== "client" && user.user_type !== "individual");

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
    <nav className="w-full flex items-center justify-between px-6 py-4 bg-primary text-white">
      {/* Left: Logo and Brand */}
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => router.push("/")}
      >
        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
          <span className="text-white font-bold">I</span>
        </div>
        <span className="text-xl font-bold">Innfill</span>
      </div>

      {/* Center: Nav Links */}
      <div className="flex items-center gap-6">
        {showFreelancersLink && (
          <a
            href="/freelancers"
            className="text-white hover:text-accent transition"
          >
            Freelancers
          </a>
        )}
        {showProjectsLink && (
          <a
            href="/projects"
            className="text-white hover:text-accent transition"
          >
            Projects
          </a>
        )}
        <a href="/sync" className="text-white hover:text-accent transition">
          Sync
        </a>
        <a href="/events" className="text-white hover:text-accent transition">
          Events & News
        </a>
        <a href="/contact" className="text-white hover:text-accent transition">
          Contact
        </a>
        <a href="/terms" className="text-white hover:text-accent transition">
          Terms
        </a>
      </div>

      {/* Right: Profile Pic (if logged in) */}
      <div className="flex items-center gap-4">
        {user ? ( // This will only render if user is not null
          <>
            <button
              onClick={() => router.push(dashboardPath)}
              className="flex items-center gap-2 focus:outline-none"
              title="Go to Dashboard"
            >
              <Image
                src={user.avatar_url || "/logo.svg"} // Corrected path
                alt="Profile"
                width={36}
                height={36}
                className="rounded-full border-2 border-accent object-cover bg-background"
              />
            </button>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 rounded-lg text-white border border-white/20 hover:bg-white/10 transition flex items-center justify-center gap-2"
              disabled={signingOut} // Disable during logout
            >
              {signingOut ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Logout"
              )}
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => router.push("/login")}
              className="px-4 py-2 rounded-lg text-white border border-white/20 hover:bg-white/10 transition"
            >
              Log In
            </button>
            <button
              onClick={() => router.push("/signup")}
              className="px-4 py-2 rounded-lg bg-accent text-white hover:bg-accent/80 transition"
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
