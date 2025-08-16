"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "./ui/ButtonNew"
import { 
  Search, 
  Plus, 
  Menu,
  X,
  User,
  LogOut,
  Users
} from "lucide-react"
import { useState, useEffect } from "react"
import { createClient } from "../lib/supabase/client"
import { User as SupabaseUser } from "@supabase/supabase-js"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Avatar, AvatarFallback } from "./ui/avatar"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Profiles", href: "/profiles" },
  { name: "Projects", href: "/projects" },
  { name: "Marketplace", href: "/marketplace" },
  { name: "Messages", href: "/messages" },
]

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      if (user) {
        // Fetch user's profile data - handle case where table doesn't exist
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('profile_picture_url')
            .eq('id', user.id)
            .single()
          
          setUserProfile(profile)
        } catch (error) {
          // If profiles table doesn't exist, just continue without profile data
          console.log('Profiles table not available yet')
          setUserProfile(null)
        }
      }
      
      setLoading(false)
    }

    getUser()

    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)
      
      if (session?.user) {
        // Fetch user's profile data - handle case where table doesn't exist
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('profile_picture_url')
            .eq('id', session.user.id)
            .single()
          
          setUserProfile(profile)
        } catch (error) {
          // If profiles table doesn't exist, just continue without profile data
          console.log('Profiles table not available yet')
          setUserProfile(null)
        }
      } else {
        setUserProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = () => {
    router.push('/auth/sign-out')
  }

    // Show header immediately, authentication will update when ready
  return (
    <header className="bg-black border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-brand-amber to-brand-green rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-sm">SW</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-brand-amber to-brand-green bg-clip-text text-transparent">
              SceneWork
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-amber-500 ${
                  pathname === item.href
                    ? "text-amber-500"
                    : "text-gray-300"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search profiles, projects..."
                className="pl-10 pr-4 py-2 w-64 rounded-md border border-gray-600 bg-gray-900 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
              />
            </div>

            {/* Auth UI */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      {userProfile?.profile_picture_url ? (
                        <img
                          src={userProfile.profile_picture_url}
                          alt="Profile Picture"
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <AvatarFallback className="bg-amber-500 text-black">
                          {user.email?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem asChild>
                    <Link href="/profile/edit" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>My Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth/sign-in">
                <Button className="bg-amber-500 text-black hover:bg-amber-500/90">
                  Sign In
                </Button>
              </Link>
            )}

            {/* Meet the Crew Button */}
            <Link href="/profiles">
              <Button className="bg-amber-500 text-black hover:bg-amber-500/90">
                <Users className="h-4 w-4 mr-2" />
                Meet the Crew
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-800 py-4">
            <nav className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    pathname === item.href
                      ? "bg-gray-800 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="mt-4 space-y-2">
              {user ? (
                <>
                  <Link href="/profile/edit">
                    <Button variant="outline" className="w-full">
                      <User className="h-4 w-4 mr-2" />
                      My Profile
                    </Button>
                  </Link>
                  <Button onClick={handleSignOut} variant="outline" className="w-full">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Link href="/auth/sign-in">
                  <Button className="w-full bg-brand-amber text-black hover:bg-brand-amber/90">
                    Sign In
                  </Button>
                </Link>
              )}

              <Link href="/profiles">
                <Button className="w-full bg-amber-500 text-black hover:bg-amber-500/90">
                  <Users className="h-4 w-4 mr-2" />
                  Meet the Crew
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
