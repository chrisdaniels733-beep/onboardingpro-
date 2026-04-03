import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");

interface CheckoutRequest {
  plan: "starter" | "pro" | "elite";
  trialDays?: number;
}

const PLANS = {
  starter: {
    priceId: "price_1THP2yAk8koYNeTJAjWyWtNl",
    name: "Starter",
    amount: 2900,
  },
  pro: {
    priceId: "price_1THP3IAk8koYNeTJmHICADlf",
    name: "Pro",
    amount: 4900,
  },
  elite: {
    priceId: "price_1THP3IAk8koYNeTJmHICADlf",
    name: "Elite",
    amount: 7900,
  },
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_ANON_KEY") || ""
    );

    const { data: userData, error: userError } = await supabase.auth.getUser(
      token
    );
    if (userError || !userData.user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { plan, trialDays = 14 }: CheckoutRequest = await req.json();

    if (!plan || !PLANS[plan]) {
      return new Response(JSON.stringify({ error: "Invalid plan" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );

    const { data: coachData } = await supabaseAdmin
      .from("coaches")
      .select("id")
      .eq("id", userData.user.id)
      .maybeSingle();

    if (!coachData) {
      return new Response(JSON.stringify({ error: "Coach profile not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const planData = PLANS[plan];

    const checkoutResponse = await fetch(
      "https://api.stripe.com/v1/checkout/sessions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${STRIPE_SECRET_KEY}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          "payment_method_types[]": "card",
          "line_items[0][price]": planData.priceId,
          "line_items[0][quantity]": "1",
          "mode": "subscription",
          "success_url": `${Deno.env.get("VITE_SUPABASE_URL")}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
          "cancel_url": `${Deno.env.get("VITE_SUPABASE_URL")}/pricing`,
          "customer_email": userData.user.email || "",
          "subscription_data[metadata][coach_id]": coachData.id,
          "subscription_data[metadata][plan]": plan,
          "subscription_data[trial_period_days]": String(trialDays),
        }).toString(),
      }
    );

    if (!checkoutResponse.ok) {
      const error = await checkoutResponse.text();
      console.error("Stripe error:", error);
      throw new Error(`Stripe API error: ${checkoutResponse.status}`);
    }

    const session = await checkoutResponse.json();

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
