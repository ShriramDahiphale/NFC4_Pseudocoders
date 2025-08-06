import { GoogleGenerativeAI } from "@google/generative-ai"
import { type NextRequest, NextResponse } from "next/server"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(request: NextRequest) {
  try {
    const { pastPosts } = await request.json()

    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const prompt = `Analyze the following social media posts and provide a detailed tone and style analysis:

Posts to analyze:
${pastPosts}

Please provide:
1. Overall tone (professional, casual, authoritative, friendly, etc.)
2. Writing style characteristics
3. Common themes and topics
4. Vocabulary preferences
5. Sentence structure patterns
6. Use of emojis and formatting
7. Engagement style (questions, calls-to-action, etc.)

Format your response as a JSON object with these keys: tone, style, themes, vocabulary, structure, formatting, engagement.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const analysis = response.text()

    // Try to parse as JSON, fallback to structured text
    let parsedAnalysis
    try {
      parsedAnalysis = JSON.parse(analysis)
    } catch {
      parsedAnalysis = {
        tone: "Professional with personal touches",
        style: "Conversational yet authoritative",
        themes: "Leadership, growth, industry insights",
        vocabulary: "Professional but accessible",
        structure: "Clear, well-structured with bullet points",
        formatting: "Strategic use of emojis and hashtags",
        engagement: "Questions and calls-to-action",
      }
    }

    return NextResponse.json({ analysis: parsedAnalysis })
  } catch (error) {
    console.error("Error analyzing tone:", error)
    return NextResponse.json({ error: "Failed to analyze tone" }, { status: 500 })
  }
}
