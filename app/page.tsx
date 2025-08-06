import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Sparkles, Calendar, MessageSquare, Target, Users, Zap, Shield } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 border-orange-200/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-8 w-8 text-orange-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              ContentCraft AI
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost" className="text-amber-800 hover:text-orange-700">
                Sign In
              </Button>
            </Link>
            <Link href="/onboarding">
              <Button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="mb-4 bg-orange-100 text-orange-700 hover:bg-orange-100">AI-Powered Content Creation</Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-red-600 to-amber-600 bg-clip-text text-transparent">
            Create Engaging Social Content That Sounds Like You
          </h1>
          <p className="text-xl text-amber-800 mb-8 leading-relaxed">
            Transform your social media strategy with AI that learns your voice, understands your audience, and
            generates platform-optimized content for LinkedIn and Twitter/X. No auto-posting, just perfect drafts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/onboarding">
              <Button
                size="lg"
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-lg px-8 py-3"
              >
                Start Creating <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-3 bg-transparent border-orange-300 text-amber-800 hover:bg-orange-50"
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-amber-900">Everything You Need to Scale Your Content</h2>
            <p className="text-xl text-amber-700 max-w-2xl mx-auto">
              From tone analysis to scheduled generation, we've got every aspect of content creation covered.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow border-orange-200/30">
              <CardHeader>
                <MessageSquare className="h-12 w-12 text-orange-600 mb-4" />
                <CardTitle className="text-amber-900">Conversational AI Interface</CardTitle>
                <CardDescription className="text-amber-700">
                  Chat naturally with AI to brainstorm ideas, refine concepts, and generate content that matches your
                  vision.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow border-orange-200/30">
              <CardHeader>
                <Target className="h-12 w-12 text-red-600 mb-4" />
                <CardTitle className="text-amber-900">Tone & Voice Analysis</CardTitle>
                <CardDescription className="text-amber-700">
                  AI analyzes your past posts to understand your unique voice, ensuring every generated post sounds
                  authentically you.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow border-orange-200/30">
              <CardHeader>
                <Users className="h-12 w-12 text-amber-600 mb-4" />
                <CardTitle className="text-amber-900">Platform Optimization</CardTitle>
                <CardDescription className="text-amber-700">
                  Generate content specifically optimized for LinkedIn's professional tone or Twitter's conversational
                  style.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow border-orange-200/30">
              <CardHeader>
                <Calendar className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle className="text-amber-900">Smart Scheduling</CardTitle>
                <CardDescription className="text-amber-700">
                  Set up content schedules and let AI generate drafts automatically. Review and publish when you're
                  ready.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow border-orange-200/30">
              <CardHeader>
                <Zap className="h-12 w-12 text-yellow-600 mb-4" />
                <CardTitle className="text-amber-900">Proven Templates</CardTitle>
                <CardDescription className="text-amber-700">
                  Access high-performing post formats for announcements, thought leadership, milestones, and more.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow border-orange-200/30">
              <CardHeader>
                <Shield className="h-12 w-12 text-red-600 mb-4" />
                <CardTitle className="text-amber-900">Full Control</CardTitle>
                <CardDescription className="text-amber-700">
                  No auto-posting ever. Review, edit, and publish on your terms. Your brand safety is our priority.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* User Types */}
      <section className="py-20 px-4 bg-gradient-to-r from-orange-50 to-amber-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-amber-900">Built for Every Content Creator</h2>
            <p className="text-xl text-amber-700">Whether you're an individual or managing multiple brands</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-lg border-orange-200/30">
              <CardHeader>
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-orange-600" />
                </div>
                <CardTitle className="text-amber-900">Influencers</CardTitle>
                <CardDescription className="text-amber-700">
                  Build your personal brand with consistent, engaging content that resonates with your audience.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center border-0 shadow-lg border-orange-200/30">
              <CardHeader>
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-red-600" />
                </div>
                <CardTitle className="text-amber-900">Brands</CardTitle>
                <CardDescription className="text-amber-700">
                  Maintain your brand voice across platforms while scaling your content production efficiently.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center border-0 shadow-lg border-orange-200/30">
              <CardHeader>
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-amber-600" />
                </div>
                <CardTitle className="text-amber-900">Agencies</CardTitle>
                <CardDescription className="text-amber-700">
                  Manage multiple client voices and content strategies from one powerful, AI-driven platform.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Content Strategy?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of creators who've already elevated their social media presence with AI.
          </p>
          <Link href="/onboarding">
            <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 text-lg px-8 py-3">
              Start Your Free Trial <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-6 w-6" />
              <span className="text-xl font-bold">ContentCraft AI</span>
            </div>
            <p className="text-gray-400">© 2024 ContentCraft AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}