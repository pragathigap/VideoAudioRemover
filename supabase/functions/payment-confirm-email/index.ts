import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, plan, amount, paymentId, redirectTo }: {
      email?: string;
      plan?: string;
      amount?: number | string;
      paymentId?: string;
      redirectTo?: string;
    } = await req.json();

    if (!email || typeof email !== "string") {
      return new Response(JSON.stringify({ error: "Missing email" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return new Response(JSON.stringify({ error: "Missing Supabase server env" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const s = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const redirect = typeof redirectTo === "string" && redirectTo.length
      ? redirectTo
      : `${new URL(req.url).origin}/dashboard?payment=success`;

    // Send Supabase "magic link" email using the configured Magic Link template.
    // We piggyback the existing template; customize the template in Auth > Templates.
    const { error } = await s.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirect,
        data: {
          plan: plan ?? "",
          amount: `${amount ?? ""}`,
          paymentId: paymentId ?? "",
        },
      },
    });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
