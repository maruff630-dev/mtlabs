import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Groq API key not configured" }, { status: 500 });
    }

    // Groq API Endpoint (OpenAI compatible)
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        // Using the user-specified model, though Groq usually uses llama/mixtral
        // If this fails, we might need to fallback to a standard Groq model
        model: "openai/gpt-oss-120b",
        messages,
        temperature: 1,
        max_completion_tokens: 8192,
        top_p: 1,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Groq API error:", errorData);
      return NextResponse.json({ 
        error: errorData.error?.message || "AI service error",
        details: errorData 
      }, { status: response.status });
    }

    // Return the streaming response directly
    return new NextResponse(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (err: any) {
    console.error("AI Route Error:", err);
    return NextResponse.json({ error: err.message || "Chat failed" }, { status: 500 });
  }
}
