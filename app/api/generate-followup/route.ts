import { GoogleGenerativeAI } from "@google/generative-ai"
import { type NextRequest, NextResponse } from "next/server"
import dotenv from "dotenv"

// Load environment variables from .env file
dotenv.config()

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSyDI11N8SSnWGuprtVXvxeylaIVg5qySN-U")

export async function POST(request: NextRequest) {
  try {
    const { messages, chatId } = await request.json()

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

    // Build context from recent messages
    const recentContext = messages
      .slice(-3)
      .map((msg: any) => `${msg.type === "user" ? "User" : "Assistant"}: ${msg.content}`)
      .join("\n\n")

    const followUpPrompt = `Based on this recent conversation, generate a helpful follow-up question or suggestion to continue the content creation process:

${recentContext}

Generate a conversational follow-up that:
1. Acknowledges what was just created
2. Suggests logical next steps (like creating more content, scheduling, or exploring related topics)
3. Keeps the user engaged in the content creation process
4. Sounds natural and helpful, not robotic

Examples of good follow-ups:
- "Great choice! Would you like me to create a content calendar around this theme?"
- "This turned out well! Should we create some follow-up posts or explore a different angle?"
- "Perfect! Want to generate some complementary content for your other social platforms?"

Keep it conversational and under 2 sentences.`

    const result = await model.generateContent(followUpPrompt)
    const response = await result.response
    const question = response.text()

    return NextResponse.json({
      question: question.trim(),
    })
  } catch (error) {
    console.error("Error generating follow-up:", error)
    return NextResponse.json({
      question:
        "What other content would you like to create? I can help with more posts, a content calendar, or trending topic ideas!",
    })
  }
}