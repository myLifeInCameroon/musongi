import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// List of allowed frontend origins
const allowedOrigins = [
  "http://localhost:8080", // adjust port if needed
  "https://musongi.netlify.app", // replace with your actual Netlify URL
];

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
  const origin = req.headers.get("origin") || "";

  // Set CORS headers conditionally
  const corsHeaders: Record<string, string> = {
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };

  if (allowedOrigins.includes(origin)) {
    corsHeaders["Access-Control-Allow-Origin"] = origin;
  }

  // Handle preflight request
  if (req.method === "OPTIONS") {
    corsHeaders["Access-Control-Allow-Methods"] = "POST, OPTIONS";
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const GITHUB_TOKEN = Deno.env.get("GITHUB_TOKEN");

    if (!GITHUB_TOKEN) {
      throw new Error("GITHUB_TOKEN is not configured");
    }

    const response = await fetch(
      "https://models.github.ai/inference/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-4o",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages,
          ],
          temperature: 1,
          max_tokens: 4096,
          top_p: 1
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("GitHub Model API error:", response.status, errorText);

      return new Response(
        JSON.stringify({
          error: "AI service temporarily unavailable",
          details: errorText,
        }),
        {
          status: response.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || "No response from AI";

    return new Response(JSON.stringify({ answer }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});