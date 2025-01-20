import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = `
You are a flashcard creator. You take in text and create multiple flashcards from it. Make sure to create exactly 10 flashcards.
Both front and back should be one sentence long.
You should return in the following JSON format:
{
  "flashcards":[
    {
      "front": "Front of the card",
      "back": "Back of the card"
    }
  ]
}
`;

export async function POST(req) {
  // Initialize OpenAI with the API key
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Use the environment variable
  });

  try {
    // Read the request body
    const data = await req.text();

    // Make the API call
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Corrected model name
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: data },
      ],
    });

    // Parse the response
    const messageContent = completion.choices[0]?.message?.content;
    if (!messageContent) {
      throw new Error("Invalid response from OpenAI.");
    }

    const flashcards = JSON.parse(messageContent);

    // Return the flashcards as a JSON response
    return NextResponse.json(flashcards.flashcards);
  } catch (error) {
    console.error("Error generating flashcards:", error);
    return NextResponse.json(
      { error: "Failed to generate flashcards. Please try again later." },
      { status: 500 }
    );
  }
}
