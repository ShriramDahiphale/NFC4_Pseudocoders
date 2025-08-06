"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowRight, ArrowLeft, Sparkles, User, Target, Settings } from "lucide-react"
import { useRouter } from "next/navigation"

const steps = [
  { id: 1, title: "Profile Setup", icon: User },
  { id: 2, title: "Content Goals", icon: Target },
  { id: 3, title: "Preferences", icon: Settings },
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Step 1: Profile
    name: "",
    email: "",
    userType: "",
    company: "",
    industry: "",

    // Step 2: Goals
    platforms: [] as string[],
    contentTypes: [] as string[],
    targetAudience: "",
    contentGoals: "",
    postFrequency: "",

    // Step 3: Preferences
    toneStyle: "",
    pastPosts: "",
    topics: [] as string[],
    contentLength: "",
  })

  const router = useRouter()

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleArrayChange = (field: string, value: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: checked
        ? [...(prev[field as keyof typeof prev] as string[]), value]
        : (prev[field as keyof typeof prev] as string[]).filter((item) => item !== value),
    }))
  }

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    } else {
      // Complete onboarding
      localStorage.setItem("userProfile", JSON.stringify(formData))
      router.push("/dashboard")
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="h-8 w-8 text-purple-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              ContentCraft AI
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Let's Set Up Your Content Strategy</h1>
          <p className="text-gray-600">Help us understand your needs to create the perfect AI assistant for you</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id

              return (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                      isActive
                        ? "border-purple-600 bg-purple-600 text-white"
                        : isCompleted
                          ? "border-green-600 bg-green-600 text-white"
                          : "border-gray-300 bg-white text-gray-400"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span
                    className={`ml-2 text-sm font-medium ${
                      isActive ? "text-purple-600" : isCompleted ? "text-green-600" : "text-gray-400"
                    }`}
                  >
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-0.5 mx-4 ${isCompleted ? "bg-green-600" : "bg-gray-300"}`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Step Content */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">
              {currentStep === 1 && "Tell us about yourself"}
              {currentStep === 2 && "What are your content goals?"}
              {currentStep === 3 && "Set your preferences"}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Basic information to personalize your experience"}
              {currentStep === 2 && "Define your content strategy and objectives"}
              {currentStep === 3 && "Customize how AI generates content for you"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Profile Setup */}
            {currentStep === 1 && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="userType">I am a... *</Label>
                  <Select value={formData.userType} onValueChange={(value) => handleInputChange("userType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="influencer">Individual Influencer</SelectItem>
                      <SelectItem value="brand">Brand/Company</SelectItem>
                      <SelectItem value="agency">Social Media Agency</SelectItem>
                      <SelectItem value="freelancer">Freelance Content Creator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company/Brand Name</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                    placeholder="Optional"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="industry">Industry/Niche</Label>
                  <Select value={formData.industry} onValueChange={(value) => handleInputChange("industry", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="lifestyle">Lifestyle</SelectItem>
                      <SelectItem value="fitness">Fitness & Wellness</SelectItem>
                      <SelectItem value="food">Food & Beverage</SelectItem>
                      <SelectItem value="travel">Travel</SelectItem>
                      <SelectItem value="fashion">Fashion</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 2: Content Goals */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label>Which platforms do you want to create content for? *</Label>
                  <div className="flex flex-wrap gap-3">
                    {["LinkedIn", "Twitter/X", "Both"].map((platform) => (
                      <div key={platform} className="flex items-center space-x-2">
                        <Checkbox
                          id={platform}
                          checked={formData.platforms.includes(platform)}
                          onCheckedChange={(checked) => handleArrayChange("platforms", platform, checked as boolean)}
                        />
                        <Label htmlFor={platform} className="cursor-pointer">
                          {platform}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>What type of content do you want to create? *</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      "Thought Leadership",
                      "Company Updates",
                      "Industry News",
                      "Personal Stories",
                      "Tips & Advice",
                      "Product Announcements",
                      "Behind the Scenes",
                      "Educational Content",
                      "Motivational Posts",
                    ].map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={type}
                          checked={formData.contentTypes.includes(type)}
                          onCheckedChange={(checked) => handleArrayChange("contentTypes", type, checked as boolean)}
                        />
                        <Label htmlFor={type} className="cursor-pointer text-sm">
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetAudience">Describe your target audience *</Label>
                  <Textarea
                    id="targetAudience"
                    value={formData.targetAudience}
                    onChange={(e) => handleInputChange("targetAudience", e.target.value)}
                    placeholder="e.g., Tech professionals, startup founders, marketing managers..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contentGoals">What are your main content goals? *</Label>
                  <Textarea
                    id="contentGoals"
                    value={formData.contentGoals}
                    onChange={(e) => handleInputChange("contentGoals", e.target.value)}
                    placeholder="e.g., Build thought leadership, increase brand awareness, generate leads..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postFrequency">How often do you want to post? *</Label>
                  <Select
                    value={formData.postFrequency}
                    onValueChange={(value) => handleInputChange("postFrequency", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select posting frequency" />
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
              </div>
            )}

            {/* Step 3: Preferences */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="toneStyle">What's your preferred tone and style? *</Label>
                  <Select value={formData.toneStyle} onValueChange={(value) => handleInputChange("toneStyle", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your tone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional & Formal</SelectItem>
                      <SelectItem value="conversational">Conversational & Friendly</SelectItem>
                      <SelectItem value="authoritative">Authoritative & Expert</SelectItem>
                      <SelectItem value="casual">Casual & Relaxed</SelectItem>
                      <SelectItem value="inspirational">Inspirational & Motivational</SelectItem>
                      <SelectItem value="humorous">Humorous & Light-hearted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pastPosts">Share some of your past posts (optional)</Label>
                  <Textarea
                    id="pastPosts"
                    value={formData.pastPosts}
                    onChange={(e) => handleInputChange("pastPosts", e.target.value)}
                    placeholder="Paste 2-3 of your recent posts here so AI can learn your writing style..."
                    rows={6}
                  />
                  <p className="text-sm text-gray-500">
                    This helps AI understand your unique voice and writing patterns
                  </p>
                </div>

                <div className="space-y-3">
                  <Label>What topics do you frequently discuss?</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      "Leadership",
                      "Innovation",
                      "Productivity",
                      "Career Growth",
                      "Industry Trends",
                      "Team Building",
                      "Customer Success",
                      "Product Development",
                      "Marketing Strategy",
                      "Data & Analytics",
                      "Remote Work",
                      "Entrepreneurship",
                    ].map((topic) => (
                      <div key={topic} className="flex items-center space-x-2">
                        <Checkbox
                          id={topic}
                          checked={formData.topics.includes(topic)}
                          onCheckedChange={(checked) => handleArrayChange("topics", topic, checked as boolean)}
                        />
                        <Label htmlFor={topic} className="cursor-pointer text-sm">
                          {topic}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contentLength">Preferred content length *</Label>
                  <Select
                    value={formData.contentLength}
                    onValueChange={(value) => handleInputChange("contentLength", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select content length" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Short & Punchy (1-2 sentences)</SelectItem>
                      <SelectItem value="medium">Medium Length (3-5 sentences)</SelectItem>
                      <SelectItem value="long">Long Form (6+ sentences)</SelectItem>
                      <SelectItem value="mixed">Mixed (varies by content type)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center bg-transparent"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <Button
                onClick={nextStep}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 flex items-center"
              >
                {currentStep === 3 ? "Complete Setup" : "Next"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
