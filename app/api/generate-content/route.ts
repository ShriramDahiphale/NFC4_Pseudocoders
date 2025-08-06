import { GoogleGenerativeAI } from "@google/generative-ai"
import { type NextRequest, NextResponse } from "next/server"
import dotenv from "dotenv"

// Load environment variables from .env file
dotenv.config()

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSyDI11N8SSnWGuprtVXvxeylaIVg5qySN-U")

interface ChatMemory {
  messages: Array<{
    role: "user" | "assistant"
    content: string
    timestamp: number
    platform?: string
  }>
  summary?: string
}

const chatMemoryStore = new Map<string, ChatMemory>()
const MAX_MEMORY_MESSAGES = 20
const SUMMARY_THRESHOLD = 15

export async function POST(request: NextRequest) {
  try {
    const { prompt, platform, chatId, messages, isRegenerate } = await request.json()

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

    // Get or initialize chat memory
    const chatMemory = chatMemoryStore.get(chatId) || { messages: [] }

    // Add current user message to memory (unless it's a regenerate)
    if (!isRegenerate) {
      chatMemory.messages.push({
        role: "user",
        content: prompt,
        timestamp: Date.now(),
        platform,
      })
    }

    // Implement memory buffer management
    if (chatMemory.messages.length > MAX_MEMORY_MESSAGES) {
      if (!chatMemory.summary && chatMemory.messages.length > SUMMARY_THRESHOLD) {
        const oldMessages = chatMemory.messages.slice(0, SUMMARY_THRESHOLD)
        const summaryPrompt = `Summarize the following conversation history in 2-3 sentences, focusing on the user's content preferences, topics discussed, and writing style:

${oldMessages.map((msg) => `${msg.role}: ${msg.content}`).join("\n")}

Summary:`

        try {
          const summaryResult = await model.generateContent(summaryPrompt)
          const summaryResponse = await summaryResult.response
          chatMemory.summary = summaryResponse.text()
        } catch (error) {
          console.error("Failed to create summary:", error)
        }
      }

      chatMemory.messages = chatMemory.messages.slice(-10)
    }

    // Check if this is a content plan request
    const isContentPlan = /content plan|weekly plan|posting plan|content calendar|5-day|weekly content/i.test(prompt)

    if (isContentPlan) {
      const planPrompt = `Generate a 5-day content plan based on this request: "${prompt}"

Create a professional content plan that looks like it came from a social media manager. Format it exactly like this:

📅 Monday: "[Engaging title]"
📅 Tuesday: "[Engaging title]"  
📅 Wednesday: "[Engaging title]"
📅 Thursday: "[Engaging title]"
📅 Friday: "[Engaging title]"

Make each title:
- Specific and actionable
- Relevant to the user's industry/role
- Engaging and clickable
- Professional but approachable

Include a brief intro explaining the strategy behind the plan.`

      const result = await model.generateContent(planPrompt)
      const response = await result.response
      const content = response.text()

      chatMemory.messages.push({
        role: "assistant",
        content: content,
        timestamp: Date.now(),
        platform,
      })

      chatMemoryStore.set(chatId, chatMemory)

      return NextResponse.json({
        content: content.trim(),
        title: "Weekly Content Plan",
        needsMoreInfo: false,
        isPostPlan: true,
      })
    }

    // Check if the prompt has placeholders that need to be filled
    const hasPlaceholders = /\[([^\]]+)\]/g.test(prompt)
    const placeholderMatches = prompt.match(/\[([^\]]+)\]/g)

    if (hasPlaceholders && placeholderMatches && placeholderMatches.length > 2 && !isRegenerate) {
      const clarificationPrompt = `The user wants to create content but has several placeholders that need specific information. Here's their request: "${prompt}"

Please ask them to provide specific details for the placeholders, making it conversational and helpful. Focus on the most important ones that would make the content more authentic and valuable.`

      const clarificationResult = await model.generateContent(clarificationPrompt)
      const clarificationResponse = await clarificationResult.response

      chatMemory.messages.push({
        role: "assistant",
        content: clarificationResponse.text(),
        timestamp: Date.now(),
      })

      chatMemoryStore.set(chatId, chatMemory)

      return NextResponse.json({
        content: clarificationResponse.text(),
        needsMoreInfo: true,
      })
    }

    // Build context from chat memory
    let contextMessages = ""

    if (chatMemory.summary) {
      contextMessages += `Previous conversation summary: ${chatMemory.summary}\n\n`
    }

    contextMessages += chatMemory.messages
      .slice(-8)
      .map((msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
      .join("\n\n")

    const systemPrompt = `You are an expert social media content creator specializing in ${platform} content. 

${contextMessages ? `Context from previous conversation:\n${contextMessages}\n\n` : ""}

Platform Guidelines for ${platform}:
${platform === "LinkedIn"
        ? `
- Professional tone with personal insights
- Use emojis sparingly and professionally (2-3 max)
- Include relevant hashtags (3-5 at the end)
- Encourage engagement with questions
- Optimal length: 150-300 words
- Use line breaks for readability
- Focus on thought leadership, industry insights, or professional experiences
- Structure with clear paragraphs and bullet points when appropriate
`
        : `
- Conversational and engaging tone
- Use emojis naturally but not excessively
- Keep under 280 characters for single tweets
- Use relevant hashtags (1-3)
- Encourage retweets and replies
- Be concise and punchy
- Create threads for longer content if needed
`
      }

IMPORTANT: Generate exactly 2 different post variations for the user to choose from. Each should have a distinctly different angle or approach while addressing the same core topic.

FORMATTING INSTRUCTIONS:
1. Return ONLY the post content body - no titles, headers, or meta descriptions
2. Use markdown formatting for better readability
3. Make the content engaging and authentic
4. Include a compelling hook in the first line
5. End with a question or call-to-action to encourage engagement
6. If the user provided specific examples or experiences, use them authentically
7. ${isRegenerate ? `This is a regeneration request - create fresh, alternative content with different angles while maintaining the same core message.` : ""}

Create exactly 1 engaging, authentic content variations that feel personal and valuable. Make sure they have different approaches - for example, one could be more personal/story-driven while the other is more analytical/data-driven.`

    const fullPrompt = `${systemPrompt}\n\nUser Request: ${prompt}\n\nGenerate exactly 2 different ${platform} post variations:`

    const result = await model.generateContent(fullPrompt)
    const response = await result.response
    const content = response.text()

    // Split content into exactly 2 posts
    let posts = content
      .split(/(?:\n\n---\n\n|\n\n\*\*Option \d+\*\*|\n\n\d+\.|\n\n\*\*Variation \d+\*\*)/g)
      .filter((post) => post.trim().length > 50)
      .slice(0, 2)

    // If we don't get exactly 2 distinct posts, generate them separately
    if (posts.length < 2) {
      const post1Prompt = `${systemPrompt}\n\nUser Request: ${prompt}\n\nGenerate a single ${platform} post with a personal/story-driven approach:`
      const post2Prompt = `${systemPrompt}\n\nUser Request: ${prompt}\n\nGenerate a single ${platform} post with an analytical/data-driven approach:`

      try {
        const [result1, result2] = await Promise.all([
          model.generateContent(post1Prompt),
          model.generateContent(post2Prompt),
        ])

        const response1 = await result1.response
        const response2 = await result2.response

        posts = [response1.text().trim(), response2.text().trim()]
      } catch (error) {
        // Fallback to splitting the original content
        posts = [content.trim()]
      }
    }

    // Ensure we have exactly 2 posts
    posts = posts.slice(0, 2)

    // Add AI response to memory
    chatMemory.messages.push({
      role: "assistant",
      content: `Generated ${posts.length} post options for: ${prompt}`,
      timestamp: Date.now(),
      platform,
    })

    chatMemoryStore.set(chatId, chatMemory)

    const title = prompt.length > 50 ? prompt.substring(0, 47) + "..." : prompt || `${platform} Post`

    return NextResponse.json({
      posts: posts.map((post) => post.trim()),
      title: title,
      needsMoreInfo: false,
    })
  } catch (error) {
    console.error("Error generating content:", error)
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 })
  }
}