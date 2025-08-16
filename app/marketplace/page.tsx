"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { listListings, MarketplaceListing } from "./actions"
import { Button } from "@/components/ui/ButtonNew"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, MapPin, DollarSign, Camera, Building2, Wrench } from "lucide-react"

type Category = 'all' | 'gear' | 'location' | 'service'

const CATEGORIES = [
  { id: 'all', label: 'All', icon: Camera, count: 0 },
  { id: 'gear', label: 'Gear', icon: Camera, count: 0 },
  { id: 'location', label: 'Location', icon: Building2, count: 0 },
  { id: 'service', label: 'Service', icon: Wrench, count: 0 }
]

export default function MarketplacePage() {
  const [activeCategory, setActiveCategory] = useState<Category>('all')
  const [listings, setListings] = useState<MarketplaceListing[]>([])
  const [loading, setLoading] = useState(true)
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true)
      const data = await listListings(activeCategory)
      setListings(data)
      setLoading(false)
    }

    fetchListings()
  }, [activeCategory])

  useEffect(() => {
    const fetchAllCounts = async () => {
      const allListings = await listListings()
      const counts = allListings.reduce((acc, listing) => {
        acc[listing.category] = (acc[listing.category] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      
      setCategoryCounts({
        all: allListings.length,
        gear: counts.gear || 0,
        location: counts.location || 0,
        service: counts.service || 0
      })
    }

    fetchAllCounts()
  }, [])

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'gear': return Camera
      case 'location': return Building2
      case 'service': return Wrench
      default: return Camera
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'gear': return 'bg-blue-500'
      case 'location': return 'bg-green-500'
      case 'service': return 'bg-purple-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Marketplace</h1>
          <p className="text-white/80">
            Find and offer film equipment, locations, and services.
          </p>
        </div>
        <Link href="/marketplace/new">
          <Button variant="brand" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Listing
          </Button>
        </Link>
      </div>

      {/* Category Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-1">
          {CATEGORIES.map((category) => {
            const Icon = category.icon
            const count = categoryCounts[category.id] || 0
            
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id as Category)}
                className={`px-6 py-3 rounded-xl transition-all flex items-center gap-2 ${
                  activeCategory === category.id
                    ? 'bg-white/20 text-white shadow-lg'
                    : 'text-white/70 hover:text-white/90'
                }`}
              >
                <Icon className="w-4 h-4" />
                {category.label}
                <Badge variant="secondary" className="text-xs">
                  {count}
                </Badge>
              </button>
            )
          })}
        </div>
      </div>

      {/* Listings */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin"></div>
          </div>
          <p className="text-white/60">Loading listings...</p>
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <Camera className="w-8 h-8 text-white/60" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No listings yet</h3>
          <p className="text-white/60 mb-6">
            {activeCategory === 'all' 
              ? "Be the first to create a marketplace listing!"
              : `No ${activeCategory} listings available yet.`
            }
          </p>
          <Link href="/marketplace/new">
            <Button variant="brand">Create Your First Listing</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => {
            const Icon = getCategoryIcon(listing.category)
            
            return (
              <Link key={listing.id} href={`/marketplace/${listing.id}`}>
                <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge className={`text-xs ${getCategoryColor(listing.category)}`}>
                        {listing.category}
                      </Badge>
                      <Icon className="w-5 h-5 text-white/60" />
                    </div>
                    <CardTitle className="text-white text-lg line-clamp-2">
                      {listing.title}
                    </CardTitle>
                    <CardDescription className="text-white/70 line-clamp-2">
                      {listing.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-white/80">
                      <MapPin className="w-4 h-4" />
                      {listing.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white/80">
                      <DollarSign className="w-4 h-4" />
                      {listing.rate}
                    </div>
                    {listing.photos && listing.photos.length > 0 && (
                      <div className="flex items-center gap-2 text-sm text-white/60">
                        <Camera className="w-4 h-4" />
                        {listing.photos.length} photo{listing.photos.length !== 1 ? 's' : ''}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
