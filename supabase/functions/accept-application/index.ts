import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.0.0'

serve(async (req) => {
  // 1. Validate request and user authentication
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
  )

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { projectId, applicationId, freelancerId } = await req.json();

  // 2. Verify that the user is the project owner
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('client_id')
    .eq('id', projectId)
    .single();

  if (projectError || project.client_id !== user.id) {
    return new Response('Forbidden: You are not the project owner.', { status: 403 });
  }

  // 3. Perform the database updates in a transaction (via an RPC call)
  try {
    const { error: rpcError } = await supabase.rpc('accept_application_and_update_project', {
      p_id: projectId,
      a_id: applicationId,
      f_id: freelancerId
    });

    if (rpcError) throw rpcError;

    return new Response(JSON.stringify({ message: 'Application accepted successfully!' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
})
