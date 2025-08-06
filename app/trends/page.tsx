"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  ArrowLeft,
  TrendingUp,
  Search,
  Sparkles,
  LinkedinIcon,
  Twitter,
  RefreshCw,
  MessageSquare,
  Hash,
  Users,
  BarChart3,
} from "lucide-react"
import Link from "next/link"

interface TrendingTopic {
  topic: string
  description: string
  hashtags: string[]
  platforms: string[]
  engagement: string
  category: string
  volume: number
  growth: string
}

export default function TrendsPage() {
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([])
  const [filteredTopics, setFilteredTopics] = useState<TrendingTopic[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  const fetchTrendingTopics = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/trending-topics")
      if (response.ok) {
        const data = await response.json()
        setTrendingTopics(data.trends)
        setFilteredTopics(data.trends)
      }
    } catch (error) {
      console.error("Failed to fetch trending topics:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTrendingTopics()
  }, [])

  useEffect(() => {
    let filtered = trendingTopics

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (topic) =>
          topic.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
          topic.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          topic.hashtags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((topic) => topic.category === selectedCategory)
    }

    setFilteredTopics(filtered)
  }, [searchQuery, selectedCategory, trendingTopics])

  const categories = ["all", "technology", "business", "marketing", "lifestyle", "entertainment", "sports"]

  const generateContentFromTrend = (trend: TrendingTopic) => {
    const prompt = `Create content about ${trend.topic}. Context: ${trend.description}. Use hashtags: ${trend.hashtags.join(", ")}`
    localStorage.setItem("trendPrompt", prompt)
    window.location.href = "/generator"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-xl font-semibold">Trending Topics</h1>
            </div>
            <Button onClick={fetchTrendingTopics} disabled={isLoading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Header Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2 flex items-center">
            <TrendingUp className="mr-3 h-8 w-8 text-purple-600" />
            What's Trending Now
          </h2>
          <p className="text-gray-600">
            Discover the hottest topics across social media platforms and create engaging content around them.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search trending topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Trending Topics Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="border-0 shadow-sm animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="flex gap-2 mb-4">
                    <div className="h-6 w-16 bg-gray-200 rounded"></div>
                    <div className="h-6 w-16 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTopics.map((trend, index) => (
              <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2 flex items-center">
                        <Hash className="mr-2 h-5 w-5 text-purple-600" />
                        {trend.topic}
                      </CardTitle>
                      <CardDescription className="text-sm leading-relaxed">{trend.description}</CardDescription>
                    </div>
                    <Badge variant="secondary" className="ml-2 capitalize">
                      {trend.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {/* Hashtags */}
                    <div className="flex flex-wrap gap-1">
                      {trend.hashtags.map((hashtag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {hashtag}
                        </Badge>
                      ))}
                    </div>

                    {/* Platforms */}
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Popular on:</span>
                      {trend.platforms.map((platform, idx) => (
                        <div key={idx} className="flex items-center">
                          {platform === "LinkedIn" ? (
                            <LinkedinIcon className="h-4 w-4 text-blue-600" />
                          ) : (
                            <Twitter className="h-4 w-4 text-blue-400" />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <BarChart3 className="h-4 w-4" />
                        <span>{trend.engagement}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{trend.volume.toLocaleString()} posts</span>
                      </div>
                      <div className="text-green-600 font-medium">{trend.growth}</div>
                    </div>

                    {/* Action Button */}
                    <Button
                      onClick={() => generateContentFromTrend(trend)}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      size="sm"
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Create Content
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredTopics.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No trends found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}

        {/* Tips Section */}
        <div className="mt-12">
          <Card className="border-0 shadow-sm bg-gradient-to-r from-purple-50 to-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="mr-2 h-5 w-5 text-purple-600" />
                How to Use Trending Topics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">💡 Content Ideas</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Share your unique perspective on trending topics</li>
                    <li>• Connect trends to your industry or expertise</li>
                    <li>• Create educational content around popular hashtags</li>
                    <li>• Join conversations with thoughtful commentary</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">⚡ Best Practices</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Act quickly while topics are still trending</li>
                    <li>• Add value, don't just jump on bandwagons</li>
                    <li>• Use relevant hashtags naturally in your content</li>
                    <li>• Engage authentically with trending conversations</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
