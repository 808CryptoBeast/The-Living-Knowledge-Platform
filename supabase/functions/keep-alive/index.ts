/*
  Supabase Edge Function: keep-alive
  ───────────────────────────────────────────────────────────────────────────
  Prevents the free-tier Supabase project from auto-pausing by making a
  lightweight database read every time it is triggered.

  SETUP (one-time, in Supabase dashboard):
  1. Deploy this function:
       supabase functions deploy keep-alive --no-verify-jwt
  2. Add a pg_cron job so it runs every 3 days:
       select cron.schedule(
         'keep-alive',
         '0 9 */3 * *',
         $$
           select net.http_post(
             url    := 'https://<PROJECT-REF>.supabase.co/functions/v1/keep-alive',
             headers := '{"Authorization": "Bearer <ANON-KEY>"}'::jsonb
           )
         $$
       );
  Replace <PROJECT-REF> and <ANON-KEY> with your project values.
  ───────────────────────────────────────────────────────────────────────────
*/

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

Deno.serve(async (_req: Request): Promise<Response> => {
  try {
    const supabaseUrl  = Deno.env.get('SUPABASE_URL')!;
    const serviceKey   = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const supabase = createClient(supabaseUrl, serviceKey);

    /* Lightweight read — just fetch one row from profiles */
    const { error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);

    if (error) throw error;

    const now = new Date().toISOString();
    console.log(`[keep-alive] ping OK at ${now}`);

    return new Response(
      JSON.stringify({ ok: true, timestamp: now }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('[keep-alive] error:', err);
    return new Response(
      JSON.stringify({ ok: false, error: String(err) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
