import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  // Create a client-side Supabase client with the correct options
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        // This option tells Supabase to not automatically refresh the session
        // which can cause the warning when used with SSR
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
}

// This is a utility function to safely get the user session
export async function getSession() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

// This is a utility function to safely get the current user
export async function getUser() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
