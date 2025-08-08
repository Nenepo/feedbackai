import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { personas } from "@/utils/persona";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.NEXT_GEMMA_API_KEY || "",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "feedback-ai",
  },
});

export async function POST(request: NextRequest) {
  try {
    const { userText, persona } = await request.json();

    if (!process.env.NEXT_GEMMA_API_KEY) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const personaDescription =
      personas[persona as keyof typeof personas] || "Give honest feedback";

    const completion = await openai.chat.completions.create({
      model: "google/gemma-3n-e2b-it:free",
      messages: [
        {
          role: "user",
          content: `${personaDescription}\n\nNow Give feedback on this: "${userText}". Use *text* for bold emphasis and feel free to add relevant emojis to make it fun and engaging. `,
        },
      ],
    });

    return NextResponse.json({
      feedback: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to get feedback" },
      { status: 500 }
    );
  }
}
