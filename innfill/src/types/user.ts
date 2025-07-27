// src/types/user.ts

// This interface directly maps to the columns in your 'public.profiles' table
export interface UserProfile {
  id: string; // Corresponds to profiles.id (and auth.users.id)
  email: string; // Corresponds to profiles.email (and auth.users.email)
  full_name: string | null; // Corresponds to profiles.full_name (can be NULL)
  user_type: "freelancer" | "client" | "individual" | null; // Corresponds to profiles.user_type (can be NULL initially)
  avatar_url: string | null; // Corresponds to profiles.avatar_url (can be NULL)
  bio: string | null; // Corresponds to profiles.bio (can be NULL)
  location: string | null; // Corresponds to profiles.location (can be NULL)
  phone: string | null; // Corresponds to profiles.phone (can be NULL)
  is_premium: boolean; // Corresponds to profiles.is_premium
  badge_level: string; // Corresponds to profiles.badge_level
  rating: number | null; // Corresponds to profiles.rating
  created_at: string; // Corresponds to profiles.created_at
  updated_at: string; // Corresponds to profiles.updated_at
}

// Your 'User' interface in the AuthContext should represent the data
// that you are setting in the 'user' state. Since you are doing
// `setUser(data)` where `data` comes directly from the 'profiles' table,
// the 'User' interface should directly reflect the 'UserProfile'.
export interface User extends UserProfile {}

// This remains the same, defining the overall state of your AuthContext
export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}
