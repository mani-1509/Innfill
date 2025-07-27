// src/middleware.ts
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

interface UserProfile {
  id: string;
  user_type: "client" | "freelancer" | "individual" | "admin";
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => request.cookies.get(name)?.value,
        set: (name: string, value: string, options: CookieOptions) => {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({ request });
          response.cookies.set({ name, value, ...options });
        },
        remove: (name: string, options: CookieOptions) => {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({ request });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();
  const { pathname } = request.nextUrl;

  // --- Step 1: Handle Unauthenticated Users ---
  if (!session) {
    const publicRoutes = [
      '/', '/login', '/signup', '/freelancers', '/projects', 
      '/contact', '/terms', '/policies'
    ];
    const isPublic = publicRoutes.some(route => 
      pathname === route || (route !== '/' && pathname.startsWith(route + '/'))
    );

    if (!isPublic) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect_to', pathname);
      return NextResponse.redirect(loginUrl);
    }
    // For unauthenticated users, allow access to public routes and stop processing.
    return response;
  }

  // --- Step 2: Handle Authenticated Users ---
  const { data: userProfile } = await supabase
    .from('profiles')
    .select('id, user_type')
    .eq('id', session.user.id)
    .single<UserProfile>();

  // Redirect to onboarding if the user has a session but no profile yet.
  if (!userProfile && !pathname.startsWith('/onboarding')) {
    return NextResponse.redirect(new URL('/onboarding', request.url));
  }

  if (userProfile) {
    const userDashboardUrl = userProfile.user_type === 'admin' 
      ? '/admin' 
      : '/events';

    // If logged in, redirect away from auth pages to the main feed or admin dash.
    if (pathname === '/login' || pathname === '/signup' || pathname === '/') {
      if (userProfile.user_type === 'admin') {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      return NextResponse.redirect(new URL('/events', request.url));
    }

    // Protect the /admin route from non-admins.
    if (pathname.startsWith('/admin') && userProfile.user_type !== 'admin') {
      return NextResponse.redirect(new URL(userDashboardUrl, request.url));
    }

    // Protect role-specific dashboards from other roles.
    const protectedDashboards = [
      { path: '/client/', role: 'client' },
      { path: '/freelancer/', role: 'freelancer' },
      { path: '/individual/', role: 'individual' },
    ];

    const requestedDashboard = protectedDashboards.find(d => pathname.startsWith(d.path));
    if (requestedDashboard && userProfile.user_type !== requestedDashboard.role) {
      return NextResponse.redirect(new URL(userDashboardUrl, request.url));
    }
  }

  // If no specific redirection rule was met, allow the request to proceed.
  return response;
}

export const config = {
  matcher: [
    // Apply middleware to all routes except static assets, API routes, and images.
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
};
