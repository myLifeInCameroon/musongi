import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const systemPrompt = `You are a helpful business advisor AI assistant for a Business Profitability Canvas application. Your role is to help entrepreneurs and startup founders:

1. **Fill the Canvas Form**: Guide users on what information to enter in each section:
   - Project Information: Business name, location, sector, promoter details
   - Equipment & Materials: Capital investments, machinery, tools with their costs and lifespan
   - Personnel & Salaries: Team roles, headcount, and salary structures
   - Products & Services: Revenue streams, pricing strategies, sales volumes
   - Operational Activities: Regular business operations and their costs
   - Target Customers: Market segments and customer acquisition targets
   - Other Charges: Operating expenses like rent, utilities, marketing
   - Raw Materials: Direct costs for production

2. **Business Model Guidance**: Help users think through:
   - Value propositions and competitive advantages
   - Revenue model optimization
   - Cost structure analysis
   - Break-even analysis interpretation
   - Growth rate projections

3. **Financial Analysis**: Explain:
   - What the financial metrics mean
   - How to interpret ROI and cash flow
   - Break-even point significance
   - 3-year projection insights

4. **Tax Considerations**: Provide general guidance on:
   - Understanding pre-tax vs post-tax profits
   - Regional tax implications (CEMAC, UEMOA, EU, US, etc.)
   - Importance of consulting local tax professionals

Be concise, practical, and encouraging. Use examples when helpful. If asked about specific tax rates, remind users to verify with local authorities.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Usage limit reached. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI service temporarily unavailable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
