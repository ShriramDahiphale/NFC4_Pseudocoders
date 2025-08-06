"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  MessageSquare,
  Clock,
  Plus,
  Sparkles,
  LinkedinIcon,
  Twitter,
  FileText,
  User,
  AlertTriangle,
  Trash2,
  TrendingUp,
  CheckCircle,
  Hash,
  BarChart3,
  Users,
  CalendarDays,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

interface UserProfile {
  name: string
  userType: string
  platforms: string[]
  contentTypes: string[]
  postFrequency: string
}

interface DraftPost {
  id: string
  platform: "LinkedIn" | "Twitter/X"
  content: string
  status: "draft" | "scheduled" | "published"
  createdAt: string
  scheduledFor?: string
}

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

export default function DashboardPage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [draftPosts, setDraftPosts] = useState<DraftPost[]>([])
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([])
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isUpdateConfirmOpen, setIsUpdateConfirmOpen] = useState(false)
  const [deletingDraft, setDeletingDraft] = useState<DraftPost | null>(null)
  const [updateMessage, setUpdateMessage] = useState("")

  const [editingDraft, setEditingDraft] = useState<DraftPost | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false)
  const [schedulingPost, setSchedulingPost] = useState<DraftPost | null>(null)
  const [scheduleData, setScheduleData] = useState({
    date: "",
    time: "",
  })

  const getDraftCount = () => {
    const drafts = JSON.parse(localStorage.getItem("drafts") || "[]")
    return drafts.length
  }

  const getScheduledCount = () => {
    const scheduled = JSON.parse(localStorage.getItem("scheduledPosts") || "[]")
    return scheduled.length
  }

  const getOverdueCount = () => {
    const scheduled = JSON.parse(localStorage.getItem("scheduledPosts") || "[]")
    const now = new Date()
    return scheduled.filter((post: any) => {
      const postDateTime = new Date(`${post.scheduledDate}T${post.scheduledTime}`)
      return postDateTime < now && post.status === "scheduled"
    }).length
  }

  const fetchTrendingTopics = async () => {
    try {
      const response = await fetch("/api/trending-topics")
      if (response.ok) {
        const data = await response.json()
        setTrendingTopics(data.trends)
      }
    } catch (error) {
      console.error("Failed to fetch trending topics:", error)
    }
  }

  const generateContentFromTrend = (trend: TrendingTopic) => {
    const prompt = `Create content about ${trend.topic}. Context: ${trend.description}. Use hashtags: ${trend.hashtags.join(", ")}`
    localStorage.setItem("trendPrompt", prompt)
    window.location.href = "/generator"
  }

  const generateContentPlan = () => {
    const userType = userProfile?.userType || "content creator"
    const prompt = `Generate a 5-day content plan for a ${userType} looking to build thought leadership and engage their audience`
    localStorage.setItem("trendPrompt", prompt)
    window.location.href = "/generator"
  }

  useEffect(() => {
    const profile = localStorage.getItem("userProfile")
    if (profile) {
      setUserProfile(JSON.parse(profile))
    }
    fetchTrendingTopics()
  }, [])

  const stats = [
    {
      title: "Content Drafts",
      value: getDraftCount().toString(),
      change: "+12%",
      icon: FileText,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Scheduled Posts",
      value: getScheduledCount().toString(),
      change: "+25%",
      icon: Clock,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Overdue Posts",
      value: getOverdueCount().toString(),
      change: getOverdueCount() > 0 ? "Needs attention" : "All good",
      icon: AlertTriangle,
      color: getOverdueCount() > 0 ? "text-red-600" : "text-amber-600",
      bgColor: getOverdueCount() > 0 ? "bg-red-100" : "bg-amber-100",
    },
  ]

  const [upcomingSchedule, setUpcomingSchedule] = useState<any[]>([])
  const [overduePosts, setOverduePosts] = useState<any[]>([])

  const handleProfileUpdate = () => {
    if (userProfile) {
      localStorage.setItem("userProfile", JSON.stringify(userProfile))
      setIsProfileDialogOpen(false)
      setUpdateMessage("Profile updated successfully!")
      setIsUpdateConfirmOpen(true)
    }
  }

  const handleDeleteDraft = () => {
    if (deletingDraft) {
      const updatedDrafts = draftPosts.filter((draft) => draft.id !== deletingDraft.id)
      setDraftPosts(updatedDrafts)
      localStorage.setItem("drafts", JSON.stringify(updatedDrafts))
      setIsDeleteDialogOpen(false)
      setDeletingDraft(null)
      setUpdateMessage("Draft deleted successfully!")
      setIsUpdateConfirmOpen(true)
    }
  }

  useEffect(() => {
    const loadDrafts = () => {
      const savedDrafts = localStorage.getItem("drafts")
      if (savedDrafts) {
        const drafts = JSON.parse(savedDrafts)
        setDraftPosts(drafts)
      }
    }

    loadDrafts()

    const handleStorageChange = () => {
      loadDrafts()
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  useEffect(() => {
    const loadScheduledPosts = () => {
      const savedScheduled = localStorage.getItem("scheduledPosts")
      if (savedScheduled) {
        const scheduled = JSON.parse(savedScheduled)
        const now = new Date()

        const upcoming = scheduled
          .filter((post: any) => {
            const postDateTime = new Date(`${post.scheduledDate} ${post.scheduledTime}`)
            return postDateTime >= now
          })
          .sort(
            (a: any, b: any) =>
              new Date(`${a.scheduledDate} ${a.scheduledTime}`).getTime() -
              new Date(`${b.scheduledDate} ${b.scheduledTime}`).getTime(),
          )
          .slice(0, 3)
          .map((post: any) => ({
            ...post,
            date: new Date(`${post.scheduledDate} ${post.scheduledTime}`).toLocaleString(),
            isOverdue: false,
          }))

        const overdue = scheduled
          .filter((post: any) => {
            const postDateTime = new Date(`${post.scheduledDate} ${post.scheduledTime}`)
            return postDateTime < now && post.status === "scheduled"
          })
          .sort(
            (a: any, b: any) =>
              new Date(`${b.scheduledDate} ${b.scheduledTime}`).getTime() -
              new Date(`${a.scheduledDate} ${a.scheduledTime}`).getTime(),
          )
          .slice(0, 3)
          .map((post: any) => ({
            ...post,
            date: new Date(`${post.scheduledDate} ${post.scheduledTime}`).toLocaleString(),
            isOverdue: true,
          }))

        setUpcomingSchedule(upcoming)
        setOverduePosts(overdue)
      }
    }

    loadScheduledPosts()

    const handleStorageChange = () => {
      loadScheduledPosts()
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-200/60 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-400 rounded-xl flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  ContentCraft
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/generator">
                <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl transition-all duration-200">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Content
                </Button>
              </Link>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsProfileDialogOpen(true)}
                className="border-orange-200 hover:bg-orange-50"
              >
                <User className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Welcome Section */}
        <div className="mb-8 animate-in fade-in duration-500">
          <h2 className="text-3xl font-bold mb-2 text-amber-900">Welcome back, {userProfile?.name || "Creator"}! ✨</h2>
          <p className="text-amber-700">Ready to create amazing content that resonates with your audience?</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card
                key={index}
                className="border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:shadow-md transition-all duration-200 animate-in slide-in-from-bottom-4 border-orange-200/30"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-amber-700">{stat.title}</p>
                      <p className="text-2xl font-bold text-amber-900">{stat.value}</p>
                      <p
                        className={`text-sm ${
                          stat.title === "Overdue Posts" && getOverdueCount() > 0 ? "text-red-600" : "text-green-600"
                        }`}
                      >
                        {stat.change}
                      </p>
                    </div>
                    <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Recent Drafts */}
          <div className="lg:col-span-2 animate-in slide-in-from-left duration-500">
            <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm border-orange-200/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-amber-900">Recent Drafts</CardTitle>
                    <CardDescription className="text-amber-700">Your latest AI-generated content</CardDescription>
                  </div>
                  <Link href="/generator">
                    <Button variant="outline" size="sm" className="border-orange-200 hover:bg-orange-50 bg-transparent">
                      <Plus className="mr-2 h-4 w-4" />
                      New Draft
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {draftPosts.length > 0 ? (
                    draftPosts.map((post, index) => (
                      <div
                        key={post.id}
                        className="border border-orange-200 rounded-xl p-4 hover:bg-white/80 hover:shadow-sm transition-all duration-200 animate-in slide-in-from-bottom-2"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            {post.platform === "LinkedIn" ? (
                              <LinkedinIcon className="h-5 w-5 text-blue-600" />
                            ) : (
                              <Twitter className="h-5 w-5 text-sky-500" />
                            )}
                            <span className="font-medium text-amber-800">{post.platform}</span>
                            <Badge
                              variant={post.status === "draft" ? "secondary" : "default"}
                              className="bg-amber-100 text-amber-700"
                            >
                              {post.status}
                            </Badge>
                          </div>
                          <span className="text-sm text-amber-600">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-amber-800 mb-3 line-clamp-3">{post.content}</p>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingDraft(post)
                              setIsEditDialogOpen(true)
                            }}
                            className="border-orange-200 hover:bg-orange-50"
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSchedulingPost(post)
                              setIsScheduleDialogOpen(true)
                            }}
                            className="border-orange-200 hover:bg-orange-50"
                          >
                            Schedule
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setDeletingDraft(post)
                              setIsDeleteDialogOpen(true)
                            }}
                            className="border-orange-200 hover:bg-orange-50"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <FileText className="h-8 w-8 text-amber-500" />
                      </div>
                      <p className="text-amber-600 text-sm mb-1">No drafts yet</p>
                      <p className="text-amber-500 text-xs">Create your first AI-generated content</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6 animate-in slide-in-from-right duration-500">
            {/* AI Content Plan Generator */}
            <Card className="border-0 shadow-sm bg-gradient-to-br from-orange-100 to-amber-100 border border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center text-amber-900">
                  <Zap className="mr-2 h-5 w-5 text-orange-600" />
                  AI Content Planner
                </CardTitle>
                <CardDescription className="text-amber-700">Get a personalized weekly posting strategy</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-white/80 rounded-lg border border-orange-200/50">
                    <p className="text-sm text-amber-800 mb-2">
                      ✨ <strong>Smart Planning:</strong>
                    </p>
                    <p className="text-xs text-amber-700">
                      Get a 5-day content calendar with engaging titles and topics tailored to your audience.
                    </p>
                  </div>
                  <Button
                    onClick={generateContentPlan}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <CalendarDays className="mr-2 h-4 w-4" />
                    Generate Weekly Plan
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm border-orange-200/30">
              <CardHeader>
                <CardTitle className="text-amber-900">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/generator" className="block">
                  <Button
                    className="w-full justify-start bg-transparent border-orange-200 hover:bg-orange-50"
                    variant="outline"
                  >
                    <MessageSquare className="mr-2 h-4 w-4 text-orange-600" />
                    Generate New Post
                  </Button>
                </Link>
                <Link href="/calendar" className="block">
                  <Button
                    className="w-full justify-start bg-transparent border-orange-200 hover:bg-orange-50"
                    variant="outline"
                  >
                    <Calendar className="mr-2 h-4 w-4 text-green-600" />
                    View Calendar
                  </Button>
                </Link>
                <Link href="/trends" className="block">
                  <Button
                    className="w-full justify-start bg-transparent border-orange-200 hover:bg-orange-50"
                    variant="outline"
                  >
                    <TrendingUp className="mr-2 h-4 w-4 text-red-600" />
                    Trending Topics
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Trending Topics */}
            <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm border-orange-200/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-amber-900">
                    <TrendingUp className="mr-2 h-5 w-5 text-orange-600" />
                    Trending Now
                  </CardTitle>
                  <Link href="/trends">
                    <Button variant="ghost" size="sm" className="text-amber-700 hover:text-amber-900">
                      View All
                    </Button>
                  </Link>
                </div>
                <CardDescription className="text-amber-700">Hot topics to inspire your content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trendingTopics.slice(0, 4).map((trend, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gradient-to-r from-amber-50 to-orange-50/50 rounded-xl border border-orange-200/60 hover:bg-white hover:shadow-sm transition-all duration-200 cursor-pointer group animate-in slide-in-from-bottom-2"
                      style={{ animationDelay: `${index * 100}ms` }}
                      onClick={() => generateContentFromTrend(trend)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-amber-900 flex items-center group-hover:text-orange-700 transition-colors">
                          <Hash className="mr-1 h-4 w-4 text-orange-600" />
                          {trend.topic}
                        </h4>
                        <Badge variant="secondary" className="text-xs capitalize bg-amber-100 text-amber-700">
                          {trend.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-amber-700 mb-2 line-clamp-2">{trend.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {trend.hashtags.slice(0, 2).map((hashtag, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs border-orange-200 text-amber-700">
                              {hashtag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-amber-600">
                          <div className="flex items-center space-x-1">
                            <BarChart3 className="h-3 w-3" />
                            <span>{trend.engagement}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-3 w-3" />
                            <span>{(trend.volume / 1000).toFixed(0)}k</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {trendingTopics.length === 0 && (
                    <div className="text-center py-6">
                      <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                        <TrendingUp className="h-6 w-6 text-amber-500" />
                      </div>
                      <p className="text-amber-600 text-sm">Loading trending topics...</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Scheduled Posts */}
            <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm border-orange-200/30">
              <CardHeader>
                <CardTitle className="text-amber-900">Scheduled & Overdue Posts</CardTitle>
                <CardDescription className="text-amber-700">Your content timeline</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Overdue Posts */}
                  {overduePosts.map((item, index) => (
                    <div
                      key={`overdue-${index}`}
                      className="flex items-center space-x-3 p-3 rounded-xl bg-red-50 border border-red-200 animate-in slide-in-from-bottom-2"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex-shrink-0">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-red-900">{item.type}</p>
                        <p className="text-xs text-red-700">{item.date} (Overdue)</p>
                      </div>
                      <div className="flex-shrink-0">
                        {item.platform === "LinkedIn" ? (
                          <LinkedinIcon className="h-4 w-4 text-blue-600" />
                        ) : (
                          <Twitter className="h-4 w-4 text-sky-500" />
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Upcoming Posts */}
                  {upcomingSchedule.map((item, index) => (
                    <div
                      key={`upcoming-${index}`}
                      className="flex items-center space-x-3 p-3 rounded-xl hover:bg-amber-50 transition-colors animate-in slide-in-from-bottom-2"
                      style={{ animationDelay: `${(overduePosts.length + index) * 50}ms` }}
                    >
                      <div className="flex-shrink-0">
                        {item.platform === "LinkedIn" ? (
                          <LinkedinIcon className="h-4 w-4 text-blue-600" />
                        ) : (
                          <Twitter className="h-4 w-4 text-sky-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-amber-900">{item.type}</p>
                        <p className="text-xs text-amber-600">{item.date}</p>
                      </div>
                    </div>
                  ))}

                  {upcomingSchedule.length === 0 && overduePosts.length === 0 && (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Calendar className="h-6 w-6 text-amber-500" />
                      </div>
                      <p className="text-amber-600 text-sm">No scheduled posts</p>
                      <p className="text-amber-500 text-xs">Create and schedule content to see it here</p>
                    </div>
                  )}
                </div>
                <Link href="/calendar" className="block mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent border-orange-200 hover:bg-orange-50"
                  >
                    View Calendar
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="border-orange-200">
          <DialogHeader>
            <DialogTitle className="text-amber-900">Delete Draft</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-amber-700">Are you sure you want to delete this draft? This action cannot be undone.</p>
            {deletingDraft && (
              <div className="p-3 bg-amber-50 rounded-xl border border-orange-200">
                <div className="flex items-center space-x-2 mb-2">
                  {deletingDraft.platform === "LinkedIn" ? (
                    <LinkedinIcon className="h-4 w-4 text-blue-600" />
                  ) : (
                    <Twitter className="h-4 w-4 text-sky-500" />
                  )}
                  <span className="font-medium text-amber-800">{deletingDraft.platform}</span>
                </div>
                <p className="text-sm text-amber-800 line-clamp-2">{deletingDraft.content}</p>
              </div>
            )}
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsDeleteDialogOpen(false)
                  setDeletingDraft(null)
                }}
                className="border-orange-200"
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteDraft}>
                Delete Draft
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Update Confirmation Dialog */}
      <Dialog open={isUpdateConfirmOpen} onOpenChange={setIsUpdateConfirmOpen}>
        <DialogContent className="border-orange-200">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-amber-900">Success</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-amber-700">{updateMessage}</p>
            <div className="flex justify-end">
              <Button
                onClick={() => setIsUpdateConfirmOpen(false)}
                className="bg-gradient-to-r from-orange-500 to-red-500"
              >
                OK
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Profile Edit Dialog */}
      <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
        <DialogContent className="max-w-2xl border-orange-200">
          <DialogHeader>
            <DialogTitle className="text-amber-900">Edit Profile</DialogTitle>
          </DialogHeader>
          {userProfile && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-amber-800">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    value={userProfile.name}
                    onChange={(e) => setUserProfile((prev) => (prev ? { ...prev, name: e.target.value } : null))}
                    className="border-orange-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="userType" className="text-amber-800">
                    User Type
                  </Label>
                  <Select
                    value={userProfile.userType}
                    onValueChange={(value) => setUserProfile((prev) => (prev ? { ...prev, userType: value } : null))}
                  >
                    <SelectTrigger className="border-orange-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="influencer">Individual Influencer</SelectItem>
                      <SelectItem value="brand">Brand/Company</SelectItem>
                      <SelectItem value="agency">Social Media Agency</SelectItem>
                      <SelectItem value="freelancer">Freelance Content Creator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="postFrequency" className="text-amber-800">
                  Posting Frequency
                </Label>
                <Select
                  value={userProfile.postFrequency}
                  onValueChange={(value) => setUserProfile((prev) => (prev ? { ...prev, postFrequency: value } : null))}
                >
                  <SelectTrigger className="border-orange-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="3-times-week">3 times per week</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsProfileDialogOpen(false)} className="border-orange-200">
                  Cancel
                </Button>
                <Button onClick={handleProfileUpdate} className="bg-gradient-to-r from-orange-500 to-red-500">
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Draft Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl border-orange-200">
          <DialogHeader>
            <DialogTitle className="text-amber-900">Edit Draft</DialogTitle>
          </DialogHeader>
          {editingDraft && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="platform" className="text-amber-800">
                  Platform
                </Label>
                <Select
                  value={editingDraft.platform}
                  onValueChange={(value: any) =>
                    setEditingDraft((prev) => (prev ? { ...prev, platform: value } : null))
                  }
                >
                  <SelectTrigger className="border-orange-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                    <SelectItem value="Twitter/X">Twitter/X</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="content" className="text-amber-800">
                  Content
                </Label>
                <Textarea
                  id="content"
                  value={editingDraft.content}
                  onChange={(e) => setEditingDraft((prev) => (prev ? { ...prev, content: e.target.value } : null))}
                  rows={8}
                  className="border-orange-200"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false)
                    setEditingDraft(null)
                  }}
                  className="border-orange-200"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (editingDraft) {
                      setDraftPosts((prev) =>
                        prev.map((draft) => (draft.id === editingDraft.id ? editingDraft : draft)),
                      )
                      const drafts = JSON.parse(localStorage.getItem("drafts") || "[]")
                      const updatedDrafts = drafts.map((draft: any) =>
                        draft.id === editingDraft.id ? editingDraft : draft,
                      )
                      localStorage.setItem("drafts", JSON.stringify(updatedDrafts))
                      setUpdateMessage("Draft updated successfully!")
                      setIsUpdateConfirmOpen(true)
                    }
                    setIsEditDialogOpen(false)
                    setEditingDraft(null)
                  }}
                  className="bg-gradient-to-r from-orange-500 to-red-500"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Schedule Dialog */}
      <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
        <DialogContent className="border-orange-200">
          <DialogHeader>
            <DialogTitle className="text-amber-900">Schedule Post</DialogTitle>
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
                  <span className="font-medium text-amber-800">{schedulingPost.platform}</span>
                </div>
                <p className="text-sm text-amber-800 line-clamp-3">{schedulingPost.content}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="scheduleDate" className="text-amber-800">
                    Date
                  </Label>
                  <Input
                    id="scheduleDate"
                    type="date"
                    value={scheduleData.date}
                    onChange={(e) => setScheduleData((prev) => ({ ...prev, date: e.target.value }))}
                    className="border-orange-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scheduleTime" className="text-amber-800">
                    Time
                  </Label>
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
                    setScheduleData({ date: "", time: "" })
                  }}
                  className="border-orange-200"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (schedulingPost && scheduleData.date && scheduleData.time) {
                      const scheduledPost = {
                        id: Date.now().toString(),
                        title: schedulingPost.content.substring(0, 50) + "...",
                        content: schedulingPost.content,
                        platform: schedulingPost.platform,
                        scheduledDate: scheduleData.date,
                        scheduledTime: scheduleData.time,
                        status: "scheduled" as const,
                        type: "Generated Content",
                      }

                      const existingScheduled = JSON.parse(localStorage.getItem("scheduledPosts") || "[]")
                      localStorage.setItem("scheduledPosts", JSON.stringify([...existingScheduled, scheduledPost]))

                      setDraftPosts((prev) => prev.filter((draft) => draft.id !== schedulingPost.id))
                      const drafts = JSON.parse(localStorage.getItem("drafts") || "[]")
                      const updatedDrafts = drafts.filter((draft: any) => draft.id !== schedulingPost.id)
                      localStorage.setItem("drafts", JSON.stringify(updatedDrafts))

                      setIsScheduleDialogOpen(false)
                      setSchedulingPost(null)
                      setScheduleData({ date: "", time: "" })
                      setUpdateMessage("Post scheduled successfully!")
                      setIsUpdateConfirmOpen(true)
                    }
                  }}
                  className="bg-gradient-to-r from-orange-500 to-red-500"
                >
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
