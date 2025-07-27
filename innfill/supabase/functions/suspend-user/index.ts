// supabase/functions/suspend-user/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

console.log('Suspend User function initialized');

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { userId, suspend } = await req.json();

    if (!userId) {
      throw new Error('User ID is required.');
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Set a far-future date for suspension, or 'now()' to unsuspend.
    const bannedUntil = suspend ? new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 100).toISOString() : 'now()';

    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      { banned_until: bannedUntil }
    );

    if (updateError) {
      console.error('Error updating user:', updateError);
      throw updateError;
    }

    const message = suspend ? `User ${userId} suspended successfully.` : `User ${userId} suspension lifted.`

    return new Response(JSON.stringify({ message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in function:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
