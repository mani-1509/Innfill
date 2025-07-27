// src/context/AuthContext.tsx

"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
// Import the new User and AuthState types from your updated user.ts
import { User, AuthState, UserProfile } from "@/types/user"; // Ensure UserProfile is also imported if needed for clarity

// This interface reflects the methods and state exposed by your AuthContext.
// It uses the updated 'User' type.
interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    // The 'role' parameter in signUp now correctly aligns with 'user_type' from your new User type
    // Since User is now directly UserProfile, access user_type directly from User
    role: User["user_type"] // Corrected type: User['user_type']
  ) => Promise<void>;
  signOut: () => Promise<void>;
  // The 'profile' parameter in updateProfile now refers to Partial<UserProfile>
  // since User is now UserProfile. We want to allow partial updates of the UserProfile.
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>; // Corrected type: Partial<UserProfile>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    // Verify user on initial load
    const verifyUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await fetchUserProfile(user.id);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error verifying user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Only update state if we have a valid session
        if (session?.user) {
          try {
            // Verify the user with the server
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              await fetchUserProfile(user.id);
            } else {
              setUser(null);
            }
          } catch (error) {
            console.error('Error verifying user on auth state change:', error);
            setUser(null);
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error || !data) {
        setUser(null);
        setError("Profile not found. Please contact support.");
        return;
      }
      // Assert that 'data' (from profiles table) is of type User
      setUser(data as User); // Corrected: assert data as User (which is UserProfile)
      setError(null);
    } catch (error) {
      setUser(null);
      setError("Error fetching user profile.");
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      if (data.user) {
        await fetchUserProfile(data.user.id);
      }
    } catch (error: any) {
      setError(error.message || "Login failed.");
      throw error;
    }
  };

  const signUp = async (
    email: string,
    password: string,
    // The 'role' parameter type now correctly comes from User['user_type']
    role: User["user_type"] // Corrected type
  ) => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { user_type: role },
        },
      });
      if (error) throw error;
      if (data.user) {
        // Wait for trigger to create profile, then fetch it
        let tries = 0;
        let profile: User | null = null; // Assert profile type as User
        while (tries < 5 && !profile) {
          const { data: prof } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", data.user.id)
            .single();
          if (prof) profile = prof as User; // Assert fetched profile as User
          else await new Promise((res) => setTimeout(res, 500));
          tries++;
        }
        if (profile) {
          setUser(profile);
          setError(null);
        } else {
          setUser(null);
          setError(
            "Profile creation delayed. Please refresh or contact support."
          );
        }
      }
    } catch (error: any) {
      setError(error.message || "Signup failed.");
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  // The 'updateProfile' function now expects a partial of UserProfile,
  // which is exactly what Partial<User> means in the new setup.
  const updateProfile = async (profile: Partial<UserProfile>) => {
    // Corrected type: Partial<UserProfile>
    if (!user) return;
    try {
      const { error } = await supabase
        .from("profiles")
        .update(profile)
        .eq("id", user.id);
      if (error) throw error;
      setUser((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          ...profile,
        };
      });
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signIn,
        signUp,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
