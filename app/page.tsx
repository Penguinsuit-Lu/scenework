import Link from "next/link"
import { Button } from "../components/ui/ButtonNew"
import { getFollowersFeed } from "./home-feed/actions"
import { getMe } from "@/app/home-feed/user-actions"
import HomeProfileCard from "@/components/HomeProfileCard"
import { HomeFeed } from "../components/HomeFeed"
import { HomePostForm } from "../components/HomePostForm"
import { 
  Film, 
  Users, 
  ShoppingCart, 
  Sparkles, 
  Play,
  Star,
  Zap,
  Plus
} from "lucide-react"

export default async function Home() {
  const me = await getMe()
  const items = await getFollowersFeed()
  
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Main Three-Panel Layout */}
      <main className="mx-auto max-w-6xl px-4 py-10 bg-black">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Panel - Hero Content */}
          <aside className="md:col-span-3 md:sticky md:top-20 self-start">
            <div className="text-left">
              {/* New Heading */}
              <h1 className="text-xs text-muted-foreground mb-6 max-w-xs leading-relaxed">Shoot that<br />film already.</h1>
              
              {/* Updated Hero Paragraph */}
              <p className="text-sm text-muted-foreground mb-6 max-w-xs leading-relaxed">
                Empowering indie filmmakers to create their masterpiece.<br />
                Discover your cast or join a crew, and start rolling on your next project.
              </p>

              {/* Call to Action Buttons */}
              <div className="flex flex-col gap-3 mb-8">
                <Link href="/projects">
                  <Button size="sm" className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold px-4 py-2 rounded-lg shadow-lg hover:shadow-amber-500/25 transition-all duration-300 transform hover:scale-105">
                    <Play className="w-4 h-4 mr-2" />
                    Explore Projects
                  </Button>
                </Link>
                <Link href="/projects/new">
                  <Button size="sm" variant="outline" className="border-2 border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-white font-bold px-4 py-2 rounded-lg shadow-lg hover:shadow-amber-500/25 transition-all duration-300 transform hover:scale-105">
                    <Plus className="w-4 h-4 mr-2" />
                    Post Project
                  </Button>
                </Link>
              </div>

              {/* Extended Projects Preview */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-white">Featured Projects</h3>
                <div className="space-y-2">
                  <div className="bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-green-400">Casting</span>
                    </div>
                    <h4 className="text-sm font-medium text-white">Urban Dreams</h4>
                    <p className="text-xs text-gray-400">Seeking lead actor for indie drama</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-xs text-blue-400">Crew</span>
                    </div>
                    <h4 className="text-sm font-medium text-white">The Last Light</h4>
                    <p className="text-xs text-gray-400">Looking for experienced DP</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-xs text-purple-400">Post-Production</span>
                    </div>
                    <h4 className="text-sm font-medium text-white">Night City</h4>
                    <p className="text-xs text-gray-400">Need sound designer for sci-fi</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-xs text-orange-400">Production</span>
                    </div>
                    <h4 className="text-sm font-medium text-white">Desert Road</h4>
                    <p className="text-xs text-gray-400">Seeking location manager</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Middle Panel - Feed */}
          <section className="md:col-span-6 space-y-6">
            {/* Feed Content */}
            <div className="space-y-4">
              <h2 className="text-xs text-muted-foreground mb-4 text-center">Build your Community.</h2>
              <HomePostForm />
              {items.length ? <HomeFeed items={items} /> : <div className="rounded-2xl border border-white/20 p-6 opacity-80 text-white/80">Follow people to see posts here.</div>}
            </div>
          </section>

          {/* Right Panel - HomeProfileCard */}
          <aside className="md:col-span-3 md:sticky md:top-20 self-start space-y-6">
            <HomeProfileCard me={me} />
            
            {/* Extended Marketplace Preview */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white">Marketplace</h3>
              <div className="space-y-2">
                <div className="bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <span className="text-xs text-amber-400">Equipment</span>
                  </div>
                  <h4 className="text-sm font-medium text-white">ARRI Alexa Mini</h4>
                  <p className="text-xs text-gray-400">$500/day • Miami</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-xs text-blue-400">Venue</span>
                  </div>
                  <h4 className="text-sm font-medium text-white">Downtown Studio</h4>
                  <p className="text-xs text-gray-400">$800/day • LA</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <span className="text-xs text-amber-400">Equipment</span>
                  </div>
                  <h4 className="text-sm font-medium text-white">DJI Ronin 4D</h4>
                  <p className="text-xs text-gray-400">$300/day • NYC</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-xs text-blue-400">Venue</span>
                  </div>
                  <h4 className="text-sm font-medium text-white">Warehouse Space</h4>
                  <p className="text-xs text-gray-400">$600/day • Chicago</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <span className="text-xs text-amber-400">Equipment</span>
                  </div>
                  <h4 className="text-sm font-medium text-white">Lighting Kit</h4>
                  <p className="text-xs text-gray-400">$150/day • Austin</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Features Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Find Projects */}
          <div className="group text-center p-8 bg-gradient-to-br from-amber-500/20 to-amber-600/20 backdrop-blur-sm rounded-3xl border border-amber-400/30 hover:border-amber-400/60 transition-all duration-300 transform hover:scale-105">
            <div className="w-20 h-20 bg-gradient-to-r from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <Film className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Find Projects</h3>
            <p className="text-white/80 leading-relaxed">
              Discover exciting film and media projects looking for talented crew members. 
              From indie films to commercial shoots, find your next big opportunity.
            </p>
          </div>

          {/* Connect with Crew */}
          <div className="group text-center p-8 bg-gradient-to-br from-amber-500/20 to-amber-600/20 backdrop-blur-sm rounded-3xl border border-amber-400/30 hover:border-amber-400/60 transition-all duration-300 transform hover:scale-105">
            <div className="w-20 h-20 bg-gradient-to-r from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <Users className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Connect with Crew</h3>
            <p className="text-white/80 leading-relaxed">
              Browse professional profiles, find the perfect team members, and build 
              lasting creative partnerships that help you create your masterpiece.
            </p>
          </div>

          {/* Marketplace */}
          <div className="group text-center p-8 bg-gradient-to-br from-amber-500/20 to-amber-600/20 backdrop-blur-sm rounded-3xl border border-amber-400/30 hover:border-amber-400/60 transition-all duration-300 transform hover:scale-105">
            <div className="w-20 h-20 bg-gradient-to-r from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <ShoppingCart className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Marketplace</h3>
            <p className="text-white/80 leading-relaxed">
              Buy, sell, and rent film equipment, props, costumes, and services 
              all in one place. Everything you need for your next production.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-white mb-6">
            Ready to Make Your <span className="text-yellow-300">Mark</span>?
          </h2>
          <p className="text-xl text-white/80 mb-10 leading-relaxed">
            Join thousands of filmmakers, crew members, and creative professionals 
            building amazing projects together. Your next big break is waiting.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/auth/sign-in">
              <Button size="lg" className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold text-lg px-8 py-6 rounded-xl shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300 transform hover:scale-105">
                <Zap className="w-5 h-5 mr-2" />
                Get Started Now
              </Button>
            </Link>
            <Link href="/projects/new">
              <Button size="lg" variant="outline" className="border-2 border-white/30 text-white hover:bg-white hover:text-black font-bold text-lg px-8 py-6 rounded-xl backdrop-blur-sm transition-all duration-300 transform hover:scale-105">
                <Plus className="w-5 h-5 mr-2" />
                Post Project
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
