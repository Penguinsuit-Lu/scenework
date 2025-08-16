import { notFound } from "next/navigation"
import Link from "next/link"
import { getListing } from "../actions"
import { Button } from "@/components/ui/ButtonNew"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  MapPin, 
  DollarSign, 
  Camera, 
  Building2, 
  Wrench,
  Calendar,
  User
} from "lucide-react"

interface ListingPageProps {
  params: {
    id: string
  }
}

export default async function ListingPage({ params }: ListingPageProps) {
  const listing = await getListing(params.id)

  if (!listing) {
    notFound()
  }

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

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'gear': return 'Gear'
      case 'location': return 'Location'
      case 'service': return 'Service'
      default: return category
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/marketplace" className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Marketplace
        </Link>
      </div>

      <div className="space-y-6">
        {/* Listing Header */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <Badge className={`text-sm ${getCategoryColor(listing.category)}`}>
                    {getCategoryLabel(listing.category)}
                  </Badge>
                  {getCategoryIcon(listing.category)({ className: "w-5 h-5 text-white/60" })}
                </div>
                <CardTitle className="text-3xl font-bold text-white mb-3">
                  {listing.title}
                </CardTitle>
                <CardDescription className="text-white/70 text-lg leading-relaxed">
                  {listing.description}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Listing Details Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Basic Info */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-white">Listing Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-white/60" />
                  <div>
                    <p className="text-sm text-white/60">Location</p>
                    <p className="text-white font-medium">{listing.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-white/60" />
                  <div>
                    <p className="text-sm text-white/60">Rate</p>
                    <p className="text-white font-medium">{listing.rate}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-white/60" />
                  <div>
                    <p className="text-sm text-white/60">Listed</p>
                    <p className="text-white font-medium">{formatDate(listing.created_at)}</p>
                  </div>
                </div>

                {listing.updated_at !== listing.created_at && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-white/60" />
                    <div>
                      <p className="text-sm text-white/60">Updated</p>
                      <p className="text-white font-medium">{formatDate(listing.updated_at)}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact/Inquiry */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-white">Get in Touch</CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="brand" 
                  className="w-full" 
                  disabled
                >
                  Contact Seller
                </Button>
                <p className="text-xs text-white/50 text-center mt-2">
                  Contact functionality coming soon
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Category Info */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-white">Category Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-white/60 mb-1">Category</p>
                  <div className="flex items-center gap-2">
                    <Badge className={`${getCategoryColor(listing.category)}`}>
                      {getCategoryLabel(listing.category)}
                    </Badge>
                    {getCategoryIcon(listing.category)({ className: "w-5 h-5 text-white/60" })}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-white/60 mb-2">What this means:</p>
                  <p className="text-white/80 text-sm">
                    {listing.category === 'gear' && 'Equipment, tools, and hardware available for rent or purchase'}
                    {listing.category === 'location' && 'Physical spaces, studios, and venues for filming or events'}
                    {listing.category === 'service' && 'Professional services, expertise, and consultation'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Photos */}
            {listing.photos && listing.photos.length > 0 && (
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-white">Photos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {listing.photos.map((photo, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Camera className="w-4 h-4 text-white/60" />
                        <a 
                          href={photo} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-amber-400 hover:text-amber-300 text-sm truncate"
                        >
                          {photo}
                        </a>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Listing Metadata */}
            <Card className="bg-white/5 border-white/10">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-sm text-white/50">
                  <User className="w-4 h-4" />
                  <span>Listed by: {listing.created_by}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-white/50 mt-2">
                  <Calendar className="w-4 h-4" />
                  <span>Listing ID: {listing.id}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

