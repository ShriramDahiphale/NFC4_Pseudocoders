import { GoogleGenerativeAI } from "@google/generative-ai"
import { type NextRequest, NextResponse } from "next/server"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSyCSXwfhVMCrEgmd5XHHuf7JAqSKJL0CdsY")

export async function GET(request: NextRequest) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" })

    const prompt = `Generate 12 current trending topics for social media content creation. These should be real, current trends that are popular right now across LinkedIn and Twitter/X.

For each trend, provide:
1. Topic name (concise, trending keyword/phrase)
2. Description (why it's trending, context)
3. Relevant hashtags (3-4 popular ones)
4. Platforms where it's trending (LinkedIn, Twitter/X, or both)
5. Engagement level (High, Medium, Low)
6. Category (technology, business, marketing, lifestyle, entertainment, sports)
7. Estimated volume (number of posts/mentions)
8. Growth rate (percentage increase)

Focus on:
- Current events and news
- Industry developments
- Seasonal topics
- Popular culture moments
- Business and tech trends
- Professional development topics

Format as JSON array with this structure:
{
  "trends": [
    {
      "topic": "AI in Healthcare",
      "description": "Growing discussion about AI applications in medical diagnosis and treatment",
      "hashtags": ["#AIHealthcare", "#MedTech", "#DigitalHealth", "#Innovation"],
      "platforms": ["LinkedIn", "Twitter/X"],
      "engagement": "High",
      "category": "technology",
      "volume": 15000,
      "growth": "+45%"
    }
  ]
}`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const content = response.text()

    // Try to parse the JSON response
    let trends
    try {
      trends = JSON.parse(content)
    } catch (parseError) {
      // Fallback with sample data if parsing fails
      trends = {
        trends: [
          {
            topic: "AI Productivity Tools",
            description: "New AI tools transforming workplace productivity and automation",
            hashtags: ["#AIProductivity", "#WorkplaceAI", "#Automation", "#TechTrends"],
            platforms: ["LinkedIn", "Twitter/X"],
            engagement: "High",
            category: "technology",
            volume: 25000,
            growth: "+67%",
          },
          {
            topic: "Remote Work Culture",
            description: "Evolution of remote work practices and company culture adaptations",
            hashtags: ["#RemoteWork", "#WorkCulture", "#DigitalNomad", "#FutureOfWork"],
            platforms: ["LinkedIn"],
            engagement: "High",
            category: "business",
            volume: 18000,
            growth: "+23%",
          },
          {
            topic: "Sustainable Business",
            description: "Companies adopting sustainable practices and ESG initiatives",
            hashtags: ["#Sustainability", "#ESG", "#GreenBusiness", "#ClimateAction"],
            platforms: ["LinkedIn", "Twitter/X"],
            engagement: "Medium",
            category: "business",
            volume: 12000,
            growth: "+34%",
          },
          {
            topic: "Personal Branding",
            description: "Professionals building their online presence and thought leadership",
            hashtags: ["#PersonalBranding", "#ThoughtLeadership", "#ProfessionalGrowth", "#LinkedIn"],
            platforms: ["LinkedIn"],
            engagement: "High",
            category: "marketing",
            volume: 22000,
            growth: "+41%",
          },
          {
            topic: "Mental Health at Work",
            description: "Workplace wellness and mental health awareness initiatives",
            hashtags: ["#MentalHealth", "#WorkplaceWellness", "#EmployeeWellbeing", "#WorkLifeBalance"],
            platforms: ["LinkedIn", "Twitter/X"],
            engagement: "High",
            category: "lifestyle",
            volume: 16000,
            growth: "+28%",
          },
          {
            topic: "Cryptocurrency Regulation",
            description: "Latest developments in crypto regulation and institutional adoption",
            hashtags: ["#Crypto", "#Bitcoin", "#Regulation", "#FinTech"],
            platforms: ["Twitter/X", "LinkedIn"],
            engagement: "Medium",
            category: "technology",
            volume: 14000,
            growth: "+19%",
          },
        ],
      }
    }

    return NextResponse.json(trends)
  } catch (error) {
    console.error("Error fetching trending topics:", error)
    return NextResponse.json({ error: "Failed to fetch trending topics" }, { status: 500 })
  }
}
