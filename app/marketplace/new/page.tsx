"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createListing } from "../actions"
import { Button } from "@/components/ui/ButtonNew"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Plus, X, Camera } from "lucide-react"
import Link from "next/link"

const CATEGORIES = [
  { value: 'gear', label: 'Gear', description: 'Cameras, lighting, audio equipment' },
  { value: 'location', label: 'Location', description: 'Studios, venues, outdoor spaces' },
  { value: 'service', label: 'Service', description: 'Professional services and expertise' }
]

export default function NewListingPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [photos, setPhotos] = useState<string[]>([""])
  
  const [formData, setFormData] = useState({
    category: '',
    title: "",
    description: "",
    rate: "",
    location: "",
    photos: [""]
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addPhoto = () => {
    setPhotos(prev => [...prev, ""])
  }

  const removePhoto = (index: number) => {
    if (photos.length > 1) {
      setPhotos(prev => prev.filter((_, i) => i !== index))
    }
  }

  const updatePhoto = (index: number, value: string) => {
    setPhotos(prev => prev.map((photo, i) => i === index ? value : photo))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    // Filter out empty photo URLs
    const filteredPhotos = photos.filter(photo => photo.trim())

    const listingData = {
      ...formData,
      photos: filteredPhotos
    }

    const result = await createListing(listingData)

    if (result.success) {
      router.push("/marketplace")
    } else {
      setError(result.error || "Failed to create listing")
    }

    setIsSubmitting(false)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/marketplace" className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Marketplace
        </Link>
      </div>

      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">Create New Listing</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
                <p className="text-red-400">{error}</p>
              </div>
            )}

            <div className="grid gap-6 md:grid-cols-2">
              {/* Category */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-white mb-2">
                  Category *
                </label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        <div className="flex flex-col">
                          <span className="font-medium">{category.label}</span>
                          <span className="text-sm text-gray-500">{category.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-white mb-2">
                  Title *
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter listing title"
                  className="bg-white/5 border-white/10 text-white placeholder-white/50"
                  required
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-white mb-2">
                  Description *
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Describe what you're offering..."
                  rows={4}
                  className="bg-white/5 border-white/10 text-white placeholder-white/50 resize-none"
                  required
                />
              </div>

              {/* Rate */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Rate *
                </label>
                <Input
                  value={formData.rate}
                  onChange={(e) => handleInputChange("rate", e.target.value)}
                  placeholder="e.g., $50/day, $200/hour, $1000/week"
                  className="bg-white/5 border-white/10 text-white placeholder-white/50"
                  required
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Location *
                </label>
                <Input
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="e.g., Los Angeles, CA"
                  className="bg-white/5 border-white/10 text-white placeholder-white/50"
                  required
                />
              </div>
            </div>

            {/* Photos (Optional) */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Photo URLs (Optional)
              </label>
              <div className="space-y-2">
                {photos.map((photo, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={photo}
                      onChange={(e) => updatePhoto(index, e.target.value)}
                      placeholder="Enter photo URL"
                      className="bg-white/5 border-white/10 text-white placeholder-white/50"
                    />
                    {photos.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removePhoto(index)}
                        className="px-3"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addPhoto}
                  className="mt-2"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Photo URL
                </Button>
              </div>
              <p className="text-xs text-white/50 mt-2">
                Add URLs to photos hosted elsewhere (e.g., Imgur, Google Drive)
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                variant="brand"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? "Creating..." : "Create Listing"}
              </Button>
              <Link href="/marketplace">
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

