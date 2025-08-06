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
import { Plus, ArrowLeft, ArrowRight, LinkedinIcon, Twitter, Clock, Edit, Trash2, AlertTriangle } from "lucide-react"
import Link from "next/link"

interface ScheduledPost {
  id: string
  title: string
  content: string
  platform: "LinkedIn" | "Twitter/X"
  scheduledDate: string
  scheduledTime: string
  status: "scheduled" | "published" | "failed"
  type: string
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([])
  const [editingPost, setEditingPost] = useState<ScheduledPost | null>(null)
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

  const handleUpdatePost = () => {
    if (!editingPost) return

    setScheduledPosts((prev) => prev.map((post) => (post.id === editingPost.id ? editingPost : post)))

    // Update localStorage
    const updatedPosts = scheduledPosts.map((post) => (post.id === editingPost.id ? editingPost : post))
    localStorage.setItem("scheduledPosts", JSON.stringify(updatedPosts))

    setEditingPost(null)
    setIsDialogOpen(false)
  }

  const handleSchedulePost = () => {
    const post: ScheduledPost = {
      id: Date.now().toString(),
      ...newPost,
      status: "scheduled",
    }
    setScheduledPosts((prev) => [...prev, post])

    // Save to localStorage
    const existingPosts = JSON.parse(localStorage.getItem("scheduledPosts") || "[]")
    localStorage.setItem("scheduledPosts", JSON.stringify([...existingPosts, post]))

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
    setScheduledPosts((prev) => prev.filter((post) => post.id !== id))

    // Update localStorage
    const updatedPosts = scheduledPosts.filter((post) => post.id !== id)
    localStorage.setItem("scheduledPosts", JSON.stringify(updatedPosts))
  }

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i)

  useEffect(() => {
    const savedPosts = localStorage.getItem("scheduledPosts")
    if (savedPosts) {
      setScheduledPosts(JSON.parse(savedPosts))
    }
  }, [])

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
              <h1 className="text-xl font-semibold">Content Calendar</h1>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Schedule Post
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingPost ? "Edit Scheduled Post" : "Schedule New Post"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Post Title</Label>
                      <Input
                        id="title"
                        value={editingPost ? editingPost.title : newPost.title}
                        onChange={(e) => {
                          if (editingPost) {
                            setEditingPost((prev) => (prev ? { ...prev, title: e.target.value } : null))
                          } else {
                            setNewPost((prev) => ({ ...prev, title: e.target.value }))
                          }
                        }}
                        placeholder="Enter post title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="platform">Platform</Label>
                      <Select
                        value={editingPost ? editingPost.platform : newPost.platform}
                        onValueChange={(value: any) => {
                          if (editingPost) {
                            setEditingPost((prev) => (prev ? { ...prev, platform: value } : null))
                          } else {
                            setNewPost((prev) => ({ ...prev, platform: value }))
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                          <SelectItem value="Twitter/X">Twitter/X</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      value={editingPost ? editingPost.content : newPost.content}
                      onChange={(e) => {
                        if (editingPost) {
                          setEditingPost((prev) => (prev ? { ...prev, content: e.target.value } : null))
                        } else {
                          setNewPost((prev) => ({ ...prev, content: e.target.value }))
                        }
                      }}
                      placeholder="Enter your post content"
                      rows={6}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Content Type</Label>
                      <Select
                        value={editingPost ? editingPost.type : newPost.type}
                        onValueChange={(value) => {
                          if (editingPost) {
                            setEditingPost((prev) => (prev ? { ...prev, type: value } : null))
                          } else {
                            setNewPost((prev) => ({ ...prev, type: value }))
                          }
                        }}
                      >
                        <SelectTrigger>
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
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={editingPost ? editingPost.scheduledDate : newPost.scheduledDate}
                        onChange={(e) => {
                          if (editingPost) {
                            setEditingPost((prev) => (prev ? { ...prev, scheduledDate: e.target.value } : null))
                          } else {
                            setNewPost((prev) => ({ ...prev, scheduledDate: e.target.value }))
                          }
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Time</Label>
                      <Input
                        id="time"
                        type="time"
                        value={editingPost ? editingPost.scheduledTime : newPost.scheduledTime}
                        onChange={(e) => {
                          if (editingPost) {
                            setEditingPost((prev) => (prev ? { ...prev, scheduledTime: e.target.value } : null))
                          } else {
                            setNewPost((prev) => ({ ...prev, scheduledTime: e.target.value }))
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsDialogOpen(false)
                        setEditingPost(null)
                      }}
                    >
                      Cancel
                    </Button>
                    <Button onClick={editingPost ? handleUpdatePost : handleSchedulePost}>
                      {editingPost ? "Update Post" : "Schedule Post"}
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
            <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-2xl font-bold">{formatDate(currentDate)}</h2>
            <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>LinkedIn</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-3 h-3 bg-sky-400 rounded-full"></div>
              <span>Twitter/X</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Overdue</span>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            {/* Days of Week Header */}
            <div className="grid grid-cols-7 border-b">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="p-4 text-center font-medium text-gray-600 border-r last:border-r-0">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7">
              {/* Empty days for month start */}
              {emptyDays.map((_, index) => (
                <div key={`empty-${index}`} className="h-32 border-r border-b last:border-r-0"></div>
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
                    className={`h-32 border-r border-b last:border-r-0 p-2 ${isToday ? "bg-purple-50" : ""}`}
                  >
                    <div className={`text-sm font-medium mb-2 ${isToday ? "text-purple-600" : "text-gray-900"}`}>
                      {day}
                    </div>
                    <div className="space-y-1">
                      {postsForDay.slice(0, 2).map((post) => {
                        const isOverdue = isPostOverdue(post)
                        return (
                          <div
                            key={post.id}
                            className={`text-xs p-1 rounded truncate cursor-pointer flex items-center space-x-1 ${
                              isOverdue
                                ? "bg-red-100 text-red-800 hover:bg-red-200"
                                : post.platform === "LinkedIn"
                                  ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                                  : "bg-sky-100 text-sky-800 hover:bg-sky-200"
                            }`}
                            title={post.title}
                            onClick={() => {
                              setSelectedPost(post)
                              setIsEventDialogOpen(true)
                            }}
                          >
                            {isOverdue && <AlertTriangle className="h-3 w-3 flex-shrink-0" />}
                            {post.platform === "LinkedIn" ? (
                              <LinkedinIcon className="h-3 w-3 flex-shrink-0" />
                            ) : (
                              <Twitter className="h-3 w-3 flex-shrink-0" />
                            )}
                            <span className="truncate">
                              {post.scheduledTime} - {post.title}
                            </span>
                          </div>
                        )
                      })}
                      {postsForDay.length > 2 && (
                        <div className="text-xs text-gray-500 text-center">+{postsForDay.length - 2} more</div>
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
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Upcoming Posts</CardTitle>
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
                    return (
                      <div
                        key={post.id}
                        className={`flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 ${
                          isOverdue ? "border-red-200 bg-red-50" : ""
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            {isOverdue && <AlertTriangle className="h-5 w-5 text-red-500" />}
                            {post.platform === "LinkedIn" ? (
                              <LinkedinIcon className="h-5 w-5 text-blue-600" />
                            ) : (
                              <Twitter className="h-5 w-5 text-sky-400" />
                            )}
                            <Badge variant={isOverdue ? "destructive" : "secondary"}>{post.type}</Badge>
                          </div>
                          <div>
                            <h3 className="font-medium">{post.title}</h3>
                            <p className="text-sm text-gray-600 truncate max-w-md">{post.content}</p>
                            <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">
                              <Clock className="h-3 w-3" />
                              <span>{new Date(`${post.scheduledDate} ${post.scheduledTime}`).toLocaleString()}</span>
                              <span className={isOverdue ? "text-red-500 font-medium" : "text-blue-500"}>
                                ({getTimeLeft(post)})
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingPost(post)
                              setIsDialogOpen(true)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => deletePost(post.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              {selectedPost && (
                <>
                  {isPostOverdue(selectedPost) && <AlertTriangle className="h-5 w-5 text-red-500" />}
                  {selectedPost.platform === "LinkedIn" ? (
                    <LinkedinIcon className="h-5 w-5 text-blue-600" />
                  ) : (
                    <Twitter className="h-5 w-5 text-sky-400" />
                  )}
                  <span>{selectedPost.title}</span>
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          {selectedPost && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Platform</Label>
                  <div className="flex items-center space-x-2">
                    {selectedPost.platform === "LinkedIn" ? (
                      <LinkedinIcon className="h-4 w-4 text-blue-600" />
                    ) : (
                      <Twitter className="h-4 w-4 text-sky-400" />
                    )}
                    <span>{selectedPost.platform}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Time Left</Label>
                  <div className={`font-medium ${isPostOverdue(selectedPost) ? "text-red-500" : "text-blue-500"}`}>
                    {getTimeLeft(selectedPost)}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Scheduled Time</Label>
                <p>{new Date(`${selectedPost.scheduledDate} ${selectedPost.scheduledTime}`).toLocaleString()}</p>
              </div>
              <div className="space-y-2">
                <Label>Content</Label>
                <div className="p-3 bg-gray-50 rounded-lg border max-h-60 overflow-y-auto">
                  <p className="whitespace-pre-wrap text-sm">{selectedPost.content}</p>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEventDialogOpen(false)
                    setSelectedPost(null)
                  }}
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setEditingPost(selectedPost)
                    setIsEventDialogOpen(false)
                    setIsDialogOpen(true)
                    setSelectedPost(null)
                  }}
                >
                  Edit Post
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
