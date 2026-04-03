import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface StripeEvent {
  type: string;
  data: {
    object: {
      id: string;
      customer: string;
      subscription?: string;
      metadata?: Record<string, string>;
      status?: string;
      current_period_end?: number;
    };
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );

    const body = await req.text();
    const event: StripeEvent = JSON.parse(body);

    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const obj = event.data.object;
        const coachId = obj.metadata?.coach_id;

        if (!coachId) {
          console.error("No coach_id in metadata");
          return new Response(JSON.stringify({ error: "No coach_id" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const { error } = await supabase
          .from("subscriptions")
          .upsert(
            {
              coach_id: coachId,
              stripe_customer_id: obj.customer,
              stripe_subscription_id: obj.id,
              plan_name: obj.metadata?.plan || "unknown",
              status: obj.status || "active",
              current_period_end: obj.current_period_end
                ? new Date(obj.current_period_end * 1000).toISOString()
                : null,
            },
            { onConflict: "stripe_subscription_id" }
          );

        if (error) {
          console.error("Subscription update error:", error);
          throw error;
        }
        break;
      }

      case "customer.subscription.deleted": {
        const obj = event.data.object;
        const { error } = await supabase
          .from("subscriptions")
          .update({ status: "canceled" })
          .eq("stripe_subscription_id", obj.id);

        if (error) {
          console.error("Subscription cancel error:", error);
          throw error;
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const obj = event.data.object;
        if (obj.subscription) {
          const { error } = await supabase
            .from("subscriptions")
            .update({ status: "active" })
            .eq("stripe_subscription_id", obj.subscription);

          if (error) {
            console.error("Invoice payment error:", error);
            throw error;
          }
        }
        break;
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
