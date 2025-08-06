"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Send,
  Sparkles,
  LinkedinIcon,
  Twitter,
  Copy,
  RefreshCw,
  Save,
  Calendar,
  ArrowLeft,
  Lightbulb,
  TrendingUp,
  Users,
  CheckCircle,
  Check,
  CalendarDays,
} from "lucide-react"
import Link from "next/link"
import ReactMarkdown from "react-markdown"

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
  platform?: "LinkedIn" | "Twitter/X"
  generatedPosts?: string[]
  selectedPost?: string
  postTitle?: string
  originalPrompt?: string
  isPostPlan?: boolean
}

interface ScheduleData {
  title: string
  date: string
  time: string
  type: string
}

const contentTemplates = [
  {
    category: "Thought Leadership",
    icon: Lightbulb,
    color: "text-amber-600",
    templates: [
      {
        title: "Contrarian Industry Opinion",
        description: "Share a bold perspective that challenges conventional wisdom",
        template:
          "Share a contrarian opinion about [specific industry trend or practice]. Explain why the majority is wrong and what the real solution should be.",
      },
      {
        title: "Lessons from Experience",
        description: "Transform your experiences into valuable insights",
        template:
          "Write about 3-5 key lessons you learned from [recent project/failure/success]. Make each lesson actionable for your audience.",
      },
      {
        title: "Future Predictions",
        description: "Position yourself as a forward-thinking leader",
        template:
          "Make 3 bold predictions about the future of [your industry] in the next [time period]. Explain the reasoning behind each prediction.",
      },
    ],
  },
  {
    category: "Personal Stories",
    icon: Users,
    color: "text-orange-600",
    templates: [
      {
        title: "Failure to Success Story",
        description: "Share how setbacks led to breakthroughs",
        template:
          "Tell the story of your biggest failure and how it taught you [specific lesson]. Include what you would do differently and advice for others facing similar challenges.",
      },
      {
        title: "Career Transformation",
        description: "Document your professional journey",
        template:
          "Share how you overcame [specific career challenge] and what it taught you about [relevant skill/mindset]. Include practical steps others can take.",
      },
    ],
  },
  {
    category: "Industry Insights",
    icon: TrendingUp,
    color: "text-red-600",
    templates: [
      {
        title: "News Analysis",
        description: "Provide expert commentary on current events",
        template:
          "Break down the latest [industry news/announcement] and explain what it really means for [target audience]. Include both immediate and long-term implications.",
      },
      {
        title: "Market Trends Deep Dive",
        description: "Analyze emerging patterns and opportunities",
        template:
          "Analyze what [recent event/trend] means for [your industry]. Discuss the opportunities and challenges this creates for professionals.",
      },
    ],
  },
]

export default function GeneratorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content:
        "Hi! I'm your content creation assistant. I'm here to help you create engaging content for LinkedIn and Twitter/X. What would you like to create today? \n\n💡 **Quick options:**\n• Generate a single post about a specific topic\n• Create a weekly content plan\n• Get content ideas from trending topics",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState<"LinkedIn" | "Twitter/X">("LinkedIn")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [chatId] = useState(() => `chat_${Date.now()}`)

  const [editingMessage, setEditingMessage] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false)
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [schedulingPost, setSchedulingPost] = useState<{ content: string; platform: string } | null>(null)
  const [scheduleData, setScheduleData] = useState<ScheduleData>({
    title: "",
    date: "",
    time: "",
    type: "",
  })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const trendPrompt = localStorage.getItem("trendPrompt")
    if (trendPrompt) {
      setInputValue(trendPrompt)
      localStorage.removeItem("trendPrompt")
    }
  }, [])

  const generateContent = async (prompt: string, platform: string, isRegenerate = false) => {
    setIsGenerating(true)

    try {
      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          platform,
          chatId,
          messages: messages.slice(-10),
          isRegenerate,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate content")
      }

      const data = await response.json()
      setIsGenerating(false)
      return data
    } catch (error) {
      console.error("Error generating content:", error)
      setIsGenerating(false)

      return {
        content: `I'm having trouble generating content right now. Please try again in a moment.`,
        title: "Connection Error",
        needsMoreInfo: false,
      }
    }
  }

  const generateFollowUpQuestion = async (conversationHistory: Message[]) => {
    try {
      const response = await fetch("/api/generate-followup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: conversationHistory.slice(-5),
          chatId,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        return data.question
      }
    } catch (error) {
      console.error("Failed to generate follow-up:", error)
    }

    return "What other content would you like to create? I can help with more posts, a content calendar, or trending topic ideas!"
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentPrompt = inputValue
    setInputValue("")

    const result = await generateContent(currentPrompt, selectedPlatform)

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: "ai",
      content: result.needsMoreInfo
        ? result.content
        : result.isPostPlan
          ? result.content
          : `I've created 2 ${selectedPlatform} post options for you. Choose the one you like best:`,
      timestamp: new Date(),
      platform: result.needsMoreInfo ? undefined : selectedPlatform,
      generatedPosts: result.needsMoreInfo ? undefined : result.posts || [result.content],
      postTitle: result.needsMoreInfo ? undefined : result.title || `${selectedPlatform} Post`,
      originalPrompt: result.needsMoreInfo ? undefined : currentPrompt,
      isPostPlan: result.isPostPlan || false,
    }

    setMessages((prev) => [...prev, aiMessage])

    // Generate follow-up question after AI response
    if (!result.needsMoreInfo) {
      setTimeout(async () => {
        const followUpQuestion = await generateFollowUpQuestion([...messages, userMessage, aiMessage])
        const followUpMessage: Message = {
          id: (Date.now() + 2).toString(),
          type: "ai",
          content: followUpQuestion,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, followUpMessage])
      }, 2000)
    }
  }

  const handlePostSelection = (messageId: string, selectedPost: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? {
            ...msg,
            selectedPost,
            generatedPosts: undefined, // Remove other options
          }
          : msg,
      ),
    )
  }

  const handleRegenerate = async (message: Message) => {
    if (!message.originalPrompt) return

    setIsGenerating(true)
    const result = await generateContent(message.originalPrompt, selectedPlatform, true)

    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === message.id
          ? {
            ...msg,
            generatedPosts: result.posts || [result.content],
            selectedPost: undefined,
            postTitle: result.title || `${selectedPlatform} Post`,
            platform: selectedPlatform,
          }
          : msg,
      ),
    )

    setSuccessMessage(`New content options generated for ${selectedPlatform}!`)
    setIsSuccessDialogOpen(true)
  }

  const handleTemplateClick = (template: string) => {
    setInputValue(template)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setSuccessMessage("Content copied to clipboard!")
    setIsSuccessDialogOpen(true)
  }

  const saveDraft = (content: string, platform: string) => {
    const drafts = JSON.parse(localStorage.getItem("drafts") || "[]")
    const newDraft = {
      id: Date.now().toString(),
      content,
      platform,
      createdAt: new Date().toISOString(),
      status: "draft",
    }
    drafts.push(newDraft)
    localStorage.setItem("drafts", JSON.stringify(drafts))

    setSuccessMessage("Draft saved successfully!")
    setIsSuccessDialogOpen(true)
  }

  const handleSchedulePost = () => {
    if (!schedulingPost || !scheduleData.date || !scheduleData.time || !scheduleData.title) {
      return
    }

    const scheduledPost = {
      id: Date.now().toString(),
      title: scheduleData.title,
      content: schedulingPost.content,
      platform: schedulingPost.platform,
      scheduledDate: scheduleData.date,
      scheduledTime: scheduleData.time,
      status: "scheduled" as const,
      type: scheduleData.type || "Generated Content",
    }

    const existingScheduled = JSON.parse(localStorage.getItem("scheduledPosts") || "[]")
    localStorage.setItem("scheduledPosts", JSON.stringify([...existingScheduled, scheduledPost]))

    setIsScheduleDialogOpen(false)
    setSchedulingPost(null)
    setScheduleData({ title: "", date: "", time: "", type: "" })

    setSuccessMessage("Post scheduled successfully!")
    setIsSuccessDialogOpen(true)
  }

  const renderMarkdownContent = (content: string) => {
    return (
      <div className="prose prose-sm max-w-none">
        <ReactMarkdown
          components={{
            p: ({ children }) => <p className="mb-3 leading-relaxed text-amber-900">{children}</p>,
            strong: ({ children }) => <strong className="font-semibold text-amber-950">{children}</strong>,
            em: ({ children }) => <em className="italic text-amber-800">{children}</em>,
            ul: ({ children }) => <ul className="mb-3 space-y-1 list-disc list-inside text-amber-900">{children}</ul>,
            ol: ({ children }) => <ol className="mb-3 space-y-1 list-decimal list-inside text-amber-900">{children}</ol>,
            li: ({ children }) => <li className="text-amber-900">{children}</li>,
            h1: ({ children }) => <h1 className="text-xl font-bold mb-3 text-amber-950">{children}</h1>,
            h2: ({ children }) => <h2 className="text-lg font-semibold mb-2 text-amber-950">{children}</h2>,
            h3: ({ children }) => <h3 className="text-base font-medium mb-2 text-amber-950">{children}</h3>,
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  };

  const highlightPlaceholders = (text: string) => {
    return text.replace(
      /\[([^\]]+)\]/g,
      '<span class="text-orange-700 font-medium bg-orange-100 px-1 py-0.5 rounded">[$1]</span>',
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-200/60 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="hover:bg-orange-100 transition-colors">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              </Link>
              <div className="h-6 w-px bg-orange-200" />
              <h1 className="text-xl font-semibold text-amber-900">Content Generator</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={selectedPlatform} onValueChange={(value: any) => setSelectedPlatform(value)}>
                <SelectTrigger className="w-40 border-orange-200 bg-white/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                  <SelectItem value="Twitter/X">Twitter/X</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar - Templates */}
        <div className="w-96 bg-white/60 backdrop-blur-sm border-r border-orange-200/60 p-6 overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2 text-amber-900">Content Templates</h2>
            <p className="text-sm text-amber-700">Click any template to get started</p>
          </div>

          {/* Quick Actions */}
          <div className="mb-8 p-4 bg-gradient-to-r from-orange-100 to-amber-100 rounded-xl border border-orange-200">
            <h3 className="font-medium text-amber-900 mb-3 flex items-center">
              <CalendarDays className="mr-2 h-5 w-5 text-orange-600" />
              Quick Actions
            </h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start bg-white/50 hover:bg-white border-orange-200"
                onClick={() => setInputValue("Generate a 5-day content plan for my industry")}
              >
                <CalendarDays className="mr-2 h-4 w-4 text-orange-600" />
                Weekly Content Plan
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start bg-white/50 hover:bg-white border-orange-200"
                onClick={() => setInputValue("Create a post about a recent industry trend")}
              >
                <TrendingUp className="mr-2 h-4 w-4 text-red-600" />
                Trending Topic Post
              </Button>
            </div>
          </div>

          <div className="space-y-8">
            {contentTemplates.map((category, index) => {
              const Icon = category.icon
              return (
                <div
                  key={index}
                  className="animate-in fade-in duration-500"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <h3 className="font-medium text-amber-900 mb-4 flex items-center">
                    <Icon className={`mr-2 h-5 w-5 ${category.color}`} />
                    {category.category}
                  </h3>
                  <div className="space-y-4">
                    {category.templates.map((template, templateIndex) => (
                      <div
                        key={templateIndex}
                        className="border border-orange-200 rounded-xl p-4 hover:bg-white/80 hover:shadow-sm transition-all duration-200 cursor-pointer group hover:border-orange-300"
                        onClick={() => handleTemplateClick(template.template)}
                      >
                        <h4 className="font-medium text-amber-900 mb-2 group-hover:text-orange-700 transition-colors">
                          {template.title}
                        </h4>
                        <p className="text-sm text-amber-700 mb-3 leading-relaxed">{template.description}</p>
                        <div
                          className="text-xs text-amber-600 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: highlightPlaceholders(template.template) }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-8 p-4 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl border border-amber-200">
            <h3 className="font-medium text-amber-900 mb-2">💡 Pro Tips</h3>
            <ul className="text-sm text-amber-700 space-y-2">
              <li>
                • Replace <span className="text-orange-700 font-medium">[bracketed items]</span> with your details
              </li>
              <li>• Be specific about your experiences</li>
              <li>• Try "Generate a weekly content plan"</li>
              <li>• Use the platform selector for different formats</li>
            </ul>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex ${message.type === "user" ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-4 duration-500`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className={`max-w-4xl ${message.type === "user"
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                    : "bg-white/80 backdrop-blur-sm border border-orange-200/60 shadow-sm"
                    } rounded-2xl p-6`}
                >
                  {message.type === "ai" && (
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center">
                        <Sparkles className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-amber-800">Content Assistant</span>
                      {message.platform && (
                        <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-700">
                          {message.platform}
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="whitespace-pre-wrap text-amber-800">{renderMarkdownContent(message.content)}</div>

                  {/* Multiple Post Options (2 options) */}
                  {message.generatedPosts && message.generatedPosts.length > 1 && !message.selectedPost && (
                    <div className="mt-6 space-y-4">
                      {message.generatedPosts.slice(0, 2).map((post, postIndex) => (
                        <div
                          key={postIndex}
                          className="p-4 bg-amber-50/80 rounded-xl border border-orange-200/60 hover:bg-white hover:shadow-sm transition-all duration-200 cursor-pointer group"
                          onClick={() => handlePostSelection(message.id, post)}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              {message.platform === "LinkedIn" ? (
                                <LinkedinIcon className="h-5 w-5 text-blue-600" />
                              ) : (
                                <Twitter className="h-5 w-5 text-sky-500" />
                              )}
                              <span className="font-medium text-amber-800">Option {postIndex + 1}</span>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="opacity-0 group-hover:opacity-100 transition-opacity bg-transparent border-orange-200"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Choose This
                            </Button>
                          </div>
                          <div className="prose-content">{renderMarkdownContent(post)}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Selected Post */}
                  {message.selectedPost && (
                    <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50/30 rounded-xl border border-orange-200/60">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          {message.platform === "LinkedIn" ? (
                            <LinkedinIcon className="h-5 w-5 text-blue-600" />
                          ) : (
                            <Twitter className="h-5 w-5 text-sky-500" />
                          )}
                          <h3 className="font-semibold text-lg text-amber-900">{message.postTitle}</h3>
                          <Badge className="bg-green-100 text-green-700 border-green-200">Selected</Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline" onClick={() => copyToClipboard(message.selectedPost!)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => saveDraft(message.selectedPost!, message.platform!)}
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSchedulingPost({
                                content: message.selectedPost!,
                                platform: message.platform!,
                              })
                              setScheduleData((prev) => ({
                                ...prev,
                                title: message.postTitle || `${message.platform} Post`,
                              }))
                              setIsScheduleDialogOpen(true)
                            }}
                          >
                            <Calendar className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="bg-white/80 p-4 rounded-xl border border-orange-200/60">
                        <div className="prose-content">{renderMarkdownContent(message.selectedPost)}</div>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-4 text-sm text-amber-600">
                          <span>Characters: {message.selectedPost.length}</span>
                          {message.platform === "Twitter/X" && (
                            <span className={message.selectedPost.length > 280 ? "text-red-500" : "text-green-600"}>
                              {280 - message.selectedPost.length} remaining
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRegenerate(message)}
                            disabled={isGenerating || !message.originalPrompt}
                            className="border-orange-200"
                          >
                            <RefreshCw className={`mr-2 h-4 w-4 ${isGenerating ? "animate-spin" : ""}`} />
                            More Options
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Single Post (fallback) */}
                  {message.generatedPosts && message.generatedPosts.length === 1 && !message.selectedPost && (
                    <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50/30 rounded-xl border border-orange-200/60">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          {message.platform === "LinkedIn" ? (
                            <LinkedinIcon className="h-5 w-5 text-blue-600" />
                          ) : (
                            <Twitter className="h-5 w-5 text-sky-500" />
                          )}
                          <h3 className="font-semibold text-lg text-amber-900">{message.postTitle}</h3>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(message.generatedPosts![0])}
                            className="border-orange-200"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => saveDraft(message.generatedPosts![0], message.platform!)}
                            className="border-orange-200"
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="bg-white/80 p-4 rounded-xl border border-orange-200/60">
                        <div className="prose-content">{renderMarkdownContent(message.generatedPosts[0])}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isGenerating && (
              <div className="flex justify-start animate-in slide-in-from-bottom-4 duration-300">
                <div className="bg-white/80 backdrop-blur-sm border border-orange-200/60 rounded-2xl p-6 max-w-3xl">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-white animate-pulse" />
                    </div>
                    <span className="text-sm font-medium text-amber-800">Content Assistant</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-red-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                    <p className="text-amber-700">Creating your content...</p>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-orange-200/60 bg-white/60 backdrop-blur-sm p-6">
            <div className="flex items-end space-x-4">
              <div className="flex-1">
                <Textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Describe what you want to create... (e.g., 'Generate a weekly content plan for a product designer' or 'Write a LinkedIn post about my startup journey')"
                  className="min-h-[80px] resize-none border-orange-200 bg-white/80 focus:bg-white transition-colors"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                />
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isGenerating}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-amber-600 mt-2">Press Enter to send, Shift+Enter for new line</p>
          </div>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
        <DialogContent className="border-orange-200">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>Success</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-amber-700">{successMessage}</p>
            <div className="flex justify-end">
              <Button
                onClick={() => setIsSuccessDialogOpen(false)}
                className="bg-gradient-to-r from-orange-500 to-red-500"
              >
                OK
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Schedule Dialog */}
      <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
        <DialogContent className="max-w-2xl border-orange-200">
          <DialogHeader>
            <DialogTitle>Schedule Post</DialogTitle>
          </DialogHeader>
          {schedulingPost && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  {schedulingPost.platform === "LinkedIn" ? (
                    <LinkedinIcon className="h-4 w-4 text-blue-600" />
                  ) : (
                    <Twitter className="h-4 w-4 text-sky-500" />
                  )}
                  <span className="font-medium">{schedulingPost.platform}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border max-h-40 overflow-y-auto">
                  {renderMarkdownContent(schedulingPost.content)}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Post Title *</Label>
                  <Input
                    id="title"
                    value={scheduleData.title}
                    onChange={(e) => setScheduleData((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter post title"
                    className="border-orange-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Content Type</Label>
                  <Select
                    value={scheduleData.type}
                    onValueChange={(value) => setScheduleData((prev) => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger className="border-orange-200">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Thought Leadership">Thought Leadership</SelectItem>
                      <SelectItem value="Personal Story">Personal Story</SelectItem>
                      <SelectItem value="Industry News">Industry News</SelectItem>
                      <SelectItem value="Tips & Advice">Tips & Advice</SelectItem>
                      <SelectItem value="Company Update">Company Update</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="scheduleDate">Date *</Label>
                  <Input
                    id="scheduleDate"
                    type="date"
                    value={scheduleData.date}
                    onChange={(e) => setScheduleData((prev) => ({ ...prev, date: e.target.value }))}
                    className="border-orange-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scheduleTime">Time *</Label>
                  <Input
                    id="scheduleTime"
                    type="time"
                    value={scheduleData.time}
                    onChange={(e) => setScheduleData((prev) => ({ ...prev, time: e.target.value }))}
                    className="border-orange-200"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsScheduleDialogOpen(false)
                    setSchedulingPost(null)
                    setScheduleData({ title: "", date: "", time: "", type: "" })
                  }}
                  className="border-orange-200"
                >
                  Cancel
                </Button>
                <Button onClick={handleSchedulePost} className="bg-gradient-to-r from-orange-500 to-red-500">
                  Schedule Post
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
