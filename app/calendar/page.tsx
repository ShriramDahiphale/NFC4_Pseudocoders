"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, ArrowLeft, ArrowRight, LinkedinIcon, Twitter, Clock, Trash2, AlertTriangle, CheckCircle } from "lucide-react"
import Link from "next/link"
import ReactMarkdown from "react-markdown"

interface ScheduledPost {
  id: string
  title: string
  content: string
  platform: "LinkedIn" | "Twitter/X"
  scheduledDate: string
  scheduledTime: string
  status: "scheduled" | "published" | "failed" | "posted"
  type: string
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState<ScheduledPost | null>(null)
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    platform: "LinkedIn" as "LinkedIn" | "Twitter/X",
    scheduledDate: "",
    scheduledTime: "",
    type: "",
  })

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  const getPostsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return scheduledPosts.filter((post) => post.scheduledDate === dateStr)
  }

  const isPostOverdue = (post: ScheduledPost) => {
    const postDateTime = new Date(`${post.scheduledDate}T${post.scheduledTime}`)
    return postDateTime < new Date()
  }

  const getTimeLeft = (post: ScheduledPost) => {
    const postDateTime = new Date(`${post.scheduledDate}T${post.scheduledTime}`)
    const now = new Date()
    const diff = postDateTime.getTime() - now.getTime()

    if (diff < 0) {
      return "Overdue"
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (days > 0) {
      return `${days}d ${hours}h left`
    } else if (hours > 0) {
      return `${hours}h ${minutes}m left`
    } else {
      return `${minutes}m left`
    }
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const handleSchedulePost = () => {
    const post: ScheduledPost = {
      id: Date.now().toString(),
      ...newPost,
      status: "scheduled",
    }
    const updatedPosts = [...scheduledPosts, post]
    setScheduledPosts(updatedPosts)
    localStorage.setItem("scheduledPosts", JSON.stringify(updatedPosts))

    setNewPost({
      title: "",
      content: "",
      platform: "LinkedIn",
      scheduledDate: "",
      scheduledTime: "",
      type: "",
    })
    setIsDialogOpen(false)
  }

  const deletePost = (id: string) => {
    const updatedPosts = scheduledPosts.filter((post) => post.id !== id)
    setScheduledPosts(updatedPosts)
    localStorage.setItem("scheduledPosts", JSON.stringify(updatedPosts))
  }

  const markAsPosted = (id: string) => {
    const updatedPosts = scheduledPosts.map(post =>
      post.id === id ? { ...post, status: "posted" } : post
    )
    setScheduledPosts(updatedPosts)
    localStorage.setItem("scheduledPosts", JSON.stringify(updatedPosts))
  }

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i)

  useEffect(() => {
    const savedPosts = localStorage.getItem("scheduledPosts")
    if (savedPosts) {
      try {
        setScheduledPosts(JSON.parse(savedPosts))
      } catch (e) {
        console.error("Failed to parse saved posts", e)
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-200/60 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="hover:bg-orange-50">
                  <ArrowLeft className="mr-2 h-4 w-4 text-amber-900" />
                  <span className="text-amber-900">Back to Dashboard</span>
                </Button>
              </Link>
              <div className="h-6 w-px bg-orange-200" />
              <h1 className="text-xl font-semibold text-amber-900">Content Calendar</h1>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl">
                  <Plus className="mr-2 h-4 w-4" />
                  Schedule Post
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl border-orange-200">
                <DialogHeader>
                  <DialogTitle className="text-amber-900">Schedule New Post</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="platform" className="text-amber-800">
                        Platform
                      </Label>
                      <Select
                        value={newPost.platform}
                        onValueChange={(value) =>
                          setNewPost({
                            ...newPost,
                            platform: value as "LinkedIn" | "Twitter/X",
                          })
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
                      <Label htmlFor="type" className="text-amber-800">
                        Type
                      </Label>
                      <Input
                        id="type"
                        value={newPost.type}
                        onChange={(e) =>
                          setNewPost({
                            ...newPost,
                            type: e.target.value,
                          })
                        }
                        className="border-orange-200"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-amber-800">
                      Title
                    </Label>
                    <Input
                      id="title"
                      value={newPost.title}
                      onChange={(e) =>
                        setNewPost({
                          ...newPost,
                          title: e.target.value,
                        })
                      }
                      className="border-orange-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content" className="text-amber-800">
                      Content
                    </Label>
                    <Textarea
                      id="content"
                      value={newPost.content}
                      onChange={(e) =>
                        setNewPost({
                          ...newPost,
                          content: e.target.value,
                        })
                      }
                      rows={8}
                      className="border-orange-200 font-mono text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date" className="text-amber-800">
                        Date
                      </Label>
                      <Input
                        id="date"
                        type="date"
                        value={newPost.scheduledDate}
                        onChange={(e) =>
                          setNewPost({
                            ...newPost,
                            scheduledDate: e.target.value,
                          })
                        }
                        className="border-orange-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time" className="text-amber-800">
                        Time
                      </Label>
                      <Input
                        id="time"
                        type="time"
                        value={newPost.scheduledTime}
                        onChange={(e) =>
                          setNewPost({
                            ...newPost,
                            scheduledTime: e.target.value,
                          })
                        }
                        className="border-orange-200"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      className="border-orange-200 hover:bg-orange-50"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSchedulePost}
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                    >
                      Schedule Post
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth("prev")}
              className="border-orange-200 hover:bg-orange-50"
            >
              <ArrowLeft className="h-4 w-4 text-amber-900" />
            </Button>
            <h2 className="text-2xl font-bold text-amber-900">{formatDate(currentDate)}</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth("next")}
              className="border-orange-200 hover:bg-orange-50"
            >
              <ArrowRight className="h-4 w-4 text-amber-900" />
            </Button>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-amber-800">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span>LinkedIn</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-amber-800">
              <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
              <span>Twitter/X</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-amber-800">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Overdue</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-amber-800">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Posted</span>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm border-orange-200/30">
          <CardContent className="p-0">
            {/* Days of Week Header */}
            <div className="grid grid-cols-7 border-b border-orange-200">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="p-4 text-center font-medium text-amber-700 border-r border-orange-200 last:border-r-0">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7">
              {/* Empty days for month start */}
              {emptyDays.map((_, index) => (
                <div key={`empty-${index}`} className="h-32 border-r border-b border-orange-200 last:border-r-0"></div>
              ))}

              {/* Days with content */}
              {days.map((day) => {
                const postsForDay = getPostsForDate(day)
                const isToday =
                  new Date().toDateString() ===
                  new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString()

                return (
                  <div
                    key={day}
                    className={`h-32 border-r border-b border-orange-200 last:border-r-0 p-2 ${isToday ? "bg-orange-50" : ""}`}
                  >
                    <div className={`text-sm font-medium mb-2 ${isToday ? "text-orange-600" : "text-amber-900"}`}>
                      {day}
                    </div>
                    <div className="space-y-1">
                      {postsForDay.slice(0, 2).map((post) => {
                        const isOverdue = isPostOverdue(post)
                        const isPosted = post.status === "posted"
                        return (
                          <div
                            key={post.id}
                            className={`text-xs p-1 rounded truncate cursor-pointer flex items-center space-x-1 ${isPosted
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : isOverdue
                                ? "bg-red-100 text-red-800 hover:bg-red-200"
                                : post.platform === "LinkedIn"
                                  ? "bg-orange-100 text-orange-800 hover:bg-orange-200"
                                  : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                              }`}
                            title={post.title}
                            onClick={() => {
                              setSelectedPost(post)
                              setIsEventDialogOpen(true)
                            }}
                          >
                            {isPosted && <CheckCircle className="h-3 w-3 flex-shrink-0 text-green-600" />}
                            {isOverdue && !isPosted && <AlertTriangle className="h-3 w-3 flex-shrink-0 text-red-500" />}
                            {!isPosted && post.platform === "LinkedIn" ? (
                              <LinkedinIcon className="h-3 w-3 flex-shrink-0 text-orange-600" />
                            ) : !isPosted ? (
                              <Twitter className="h-3 w-3 flex-shrink-0 text-amber-600" />
                            ) : null}
                            <span className="truncate">
                              {post.scheduledTime} - {post.title}
                            </span>
                          </div>
                        )
                      })}
                      {postsForDay.length > 2 && (
                        <div className="text-xs text-amber-600 text-center">+{postsForDay.length - 2} more</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Posts List */}
        <div className="mt-8">
          <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm border-orange-200/30">
            <CardHeader>
              <CardTitle className="text-amber-900">Upcoming Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scheduledPosts
                  .sort(
                    (a, b) =>
                      new Date(`${a.scheduledDate} ${a.scheduledTime}`).getTime() -
                      new Date(`${b.scheduledDate} ${b.scheduledTime}`).getTime(),
                  )
                  .slice(0, 10)
                  .map((post) => {
                    const isOverdue = isPostOverdue(post)
                    const isPosted = post.status === "posted"

                    return (
                      <div
                        key={post.id}
                        className={`flex items-center justify-between p-4 rounded-lg border ${isPosted
                          ? "border-green-200 bg-green-50/80"
                          : isOverdue
                            ? "border-red-200 bg-red-50/80"
                            : "border-orange-200 hover:bg-orange-50/50"
                          }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            {isPosted && <CheckCircle className="h-5 w-5 text-green-500" />}
                            {isOverdue && !isPosted && <AlertTriangle className="h-5 w-5 text-red-500" />}
                            {post.platform === "LinkedIn" ? (
                              <LinkedinIcon className="h-5 w-5 text-orange-600" />
                            ) : (
                              <Twitter className="h-5 w-5 text-amber-500" />
                            )}
                            <Badge
                              variant={
                                isPosted
                                  ? "default"
                                  : isOverdue
                                    ? "destructive"
                                    : "secondary"
                              }
                              className={
                                isPosted
                                  ? "bg-green-100 text-green-800"
                                  : !isOverdue
                                    ? "bg-amber-100 text-amber-800"
                                    : ""
                              }
                            >
                              {post.type}
                            </Badge>
                          </div>
                          <div>
                            <h3 className="font-medium text-amber-900">{post.title}</h3>
                            <p className="text-sm text-amber-700 truncate max-w-md">{post.content}</p>
                            <div className="flex items-center space-x-2 mt-1 text-xs">
                              <Clock className="h-3 w-3 text-amber-600" />
                              <span className="text-amber-600">
                                {new Date(`${post.scheduledDate} ${post.scheduledTime}`).toLocaleString()}
                              </span>
                              {!isPosted && (
                                <span className={isOverdue ? "text-red-500 font-medium" : "text-orange-500"}>
                                  ({getTimeLeft(post)})
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {!isPosted ? (
                            <>
                              <Button
                                size="sm"
                                onClick={() => markAsPosted(post.id)}
                                className="bg-green-500 hover:bg-green-600 text-white"
                              >
                                Posted
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => deletePost(post.id)}
                                className="border-orange-200 hover:bg-orange-50"
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deletePost(post.id)}
                              className="border-orange-200 hover:bg-orange-50"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Event Details Dialog */}
      <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
        <DialogContent className="max-w-2xl border-orange-200">
          <DialogHeader>
            <div className="flex items-center space-x-2 text-amber-900">
              {selectedPost && (
                <>
                  {selectedPost.status === "posted" && <CheckCircle className="h-5 w-5 text-green-500" />}
                  {isPostOverdue(selectedPost) && selectedPost.status !== "posted" && (
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  )}
                  {selectedPost.platform === "LinkedIn" ? (
                    <LinkedinIcon className="h-5 w-5 text-orange-600" />
                  ) : (
                    <Twitter className="h-5 w-5 text-amber-500" />
                  )}
                  <div className="inline">
                    <ReactMarkdown>{selectedPost.title}</ReactMarkdown>
                  </div>
                </>
              )}
            </div>
          </DialogHeader>
          {selectedPost && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-amber-800">Platform</Label>
                  <div className="flex items-center space-x-2">
                    {selectedPost.platform === "LinkedIn" ? (
                      <LinkedinIcon className="h-4 w-4 text-orange-600" />
                    ) : (
                      <Twitter className="h-4 w-4 text-amber-500" />
                    )}
                    <span className="text-amber-900">{selectedPost.platform}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-amber-800">Status</Label>
                  <div className={`font-medium ${selectedPost.status === "posted"
                    ? "text-green-500"
                    : isPostOverdue(selectedPost)
                      ? "text-red-500"
                      : "text-orange-500"
                    }`}>
                    {selectedPost.status === "posted"
                      ? "Posted"
                      : isPostOverdue(selectedPost)
                        ? "Overdue"
                        : "Scheduled"}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-amber-800">Scheduled Time</Label>
                <p className="text-amber-900">
                  {new Date(`${selectedPost.scheduledDate} ${selectedPost.scheduledTime}`).toLocaleString()}
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-amber-800">Content</Label>
                <div className="p-3 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg border border-orange-200 max-h-60 overflow-y-auto">
                  <div className="prose prose-orange max-w-none">
                    <ReactMarkdown>{selectedPost.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEventDialogOpen(false)
                    setSelectedPost(null)
                  }}
                  className="border-orange-200 hover:bg-orange-50"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}