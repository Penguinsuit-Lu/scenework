"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createProject } from "../actions"
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
import { ArrowLeft, Plus, X } from "lucide-react"
import Link from "next/link"

const ROLE_OPTIONS = [
  "Director",
  "Director of Photography",
  "Producer",
  "Actor",
  "Production Designer",
  "Editor",
  "Sound Designer",
  "Composer",
  "Screenwriter",
  "Gaffer",
  "Key Grip",
  "Makeup Artist",
  "Costume Designer",
  "Location Manager",
  "Production Assistant",
  "Other"
]

const PROJECT_TYPE_OPTIONS = [
  "Feature Film",
  "Short Film",
  "Commercial",
  "Documentary",
  "TV Series",
  "Music Video",
  "Other"
]

const PAY_STATUS_OPTIONS = [
  { value: "paid", label: "Paid" },
  { value: "unpaid", label: "Unpaid" },
  { value: "deferred", label: "Deferred" },
  { value: "negotiable", label: "Negotiable" }
]

const GENRE_OPTIONS = [
  "Action",
  "Comedy",
  "Drama",
  "Horror",
  "Romance",
  "Sci-Fi",
  "Thriller",
  "Documentary",
  "Other"
]

const BUDGET_RANGE_OPTIONS = [
  "Under $10K",
  "$10K - $50K",
  "$50K - $100K",
  "$100K - $500K",
  "$500K - $1M",
  "$1M - $5M",
  "$5M+"
]

export default function NewProjectPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [requirements, setRequirements] = useState<string[]>([""])
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    role_needed: "",
    location: "",
    pay_status: "paid",
    min_day_rate: "",
    max_day_rate: "",
    start_date: "",
    end_date: "",
    project_type: "",
    genre: "",
    budget_range: "",
    crew_size: "",
    requirements: [""]
  })

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addRequirement = () => {
    setRequirements(prev => [...prev, ""])
  }

  const removeRequirement = (index: number) => {
    if (requirements.length > 1) {
      setRequirements(prev => prev.filter((_, i) => i !== index))
    }
  }

  const updateRequirement = (index: number, value: string) => {
    setRequirements(prev => prev.map((req, i) => i === index ? value : req))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    // Filter out empty requirements
    const filteredRequirements = requirements.filter(req => req.trim())

    const projectData = {
      ...formData,
      min_day_rate: parseInt(formData.min_day_rate) || 0,
      max_day_rate: parseInt(formData.max_day_rate) || 0,
      crew_size: parseInt(formData.crew_size) || 1,
      requirements: filteredRequirements
    }

    const result = await createProject(projectData)

    if (result.success) {
      router.push("/projects")
    } else {
      setError(result.error || "Failed to create project")
    }

    setIsSubmitting(false)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/projects" className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>
      </div>

      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">Create New Project</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
                <p className="text-red-400">{error}</p>
              </div>
            )}

            <div className="grid gap-6 md:grid-cols-2">
              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-white mb-2">
                  Project Title *
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter project title"
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
                  placeholder="Describe your project..."
                  rows={4}
                  className="bg-white/5 border-white/10 text-white placeholder-white/50"
                  required
                />
              </div>

              {/* Role Needed */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Role Needed *
                </label>
                <Select value={formData.role_needed} onValueChange={(value) => handleInputChange("role_needed", value)}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLE_OPTIONS.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

              {/* Project Type */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Project Type
                </label>
                <Select value={formData.project_type} onValueChange={(value) => handleInputChange("project_type", value)}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROJECT_TYPE_OPTIONS.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Genre */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Genre
                </label>
                <Select value={formData.genre} onValueChange={(value) => handleInputChange("genre", value)}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Select genre" />
                  </SelectTrigger>
                  <SelectContent>
                    {GENRE_OPTIONS.map((genre) => (
                      <SelectItem key={genre} value={genre}>
                        {genre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Pay Status */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Pay Status
                </label>
                <Select value={formData.pay_status} onValueChange={(value) => handleInputChange("pay_status", value)}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAY_STATUS_OPTIONS.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Budget Range */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Budget Range
                </label>
                <Select value={formData.budget_range} onValueChange={(value) => handleInputChange("budget_range", value)}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Select budget" />
                  </SelectTrigger>
                  <SelectContent>
                    {BUDGET_RANGE_OPTIONS.map((budget) => (
                      <SelectItem key={budget} value={budget}>
                        {budget}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Min Day Rate */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Min Day Rate ($)
                </label>
                <Input
                  type="number"
                  value={formData.min_day_rate}
                  onChange={(e) => handleInputChange("min_day_rate", e.target.value)}
                  placeholder="0"
                  className="bg-white/5 border-white/10 text-white placeholder-white/50"
                />
              </div>

              {/* Max Day Rate */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Max Day Rate ($)
                </label>
                <Input
                  type="number"
                  value={formData.max_day_rate}
                  onChange={(e) => handleInputChange("max_day_rate", e.target.value)}
                  placeholder="0"
                  className="bg-white/5 border-white/10 text-white placeholder-white/50"
                />
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Start Date
                </label>
                <Input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => handleInputChange("start_date", e.target.value)}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  End Date
                </label>
                <Input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => handleInputChange("end_date", e.target.value)}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>

              {/* Crew Size */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Crew Size
                </label>
                <Input
                  type="number"
                  value={formData.crew_size}
                  onChange={(e) => handleInputChange("crew_size", e.target.value)}
                  placeholder="1"
                  min="1"
                  className="bg-white/5 border-white/10 text-white placeholder-white/50"
                />
              </div>
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Requirements
              </label>
              <div className="space-y-2">
                {requirements.map((req, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={req}
                      onChange={(e) => updateRequirement(index, e.target.value)}
                      placeholder="Enter requirement"
                      className="bg-white/5 border-white/10 text-white placeholder-white/50"
                    />
                    {requirements.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeRequirement(index)}
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
                  onClick={addRequirement}
                  className="mt-2"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Requirement
                </Button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                variant="brand"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? "Creating..." : "Create Project"}
              </Button>
              <Link href="/projects">
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
