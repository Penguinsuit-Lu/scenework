"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { SearchParams, Project, ProjectFilters } from "@/types/projects"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Filter, X, Calendar, DollarSign, MapPin, Users, Clock, Plus } from "lucide-react"

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

const PAY_STATUS_OPTIONS = [
      { value: "paid", label: "Paid", color: "bg-amber-500" },
  { value: "unpaid", label: "Unpaid", color: "bg-red-500" },
      { value: "deferred", label: "Deferred", color: "bg-yellow-400" },
          { value: "negotiable", label: "Negotiable", color: "bg-amber-500" }
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

interface ProjectsClientProps {
  searchParams: SearchParams
}

export function ProjectsClient({ searchParams }: ProjectsClientProps) {
  const router = useRouter()
  const searchParamsHook = useSearchParams()
  
  const [filters, setFilters] = useState<ProjectFilters>({
    q: searchParams.q || "",
    role_needed: searchParams.role_needed || "",
    location: searchParams.location || "",
    pay_status: searchParams.pay_status || "",
    min_day_rate: searchParams.min_day_rate || "",
    start_date: searchParams.start_date || "",
    end_date: searchParams.end_date || "",
    project_type: searchParams.project_type || ""
  })
  
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.page || "1"))
  const [showFilters, setShowFilters] = useState(false)

  // Mock data for preview
  const mockProjects: Project[] = [
    {
      id: "1",
      title: "The Last Sunset",
      description: "A psychological thriller about a photographer who discovers a series of mysterious images that seem to predict future events.",
      role_needed: "Director of Photography",
      location: "Los Angeles, CA",
      pay_status: "paid",
      min_day_rate: 800,
      max_day_rate: 1200,
      start_date: "2024-03-15",
      end_date: "2024-06-15",
      project_type: "feature",
      genre: "Thriller",
      budget_range: "$500K - $1M",
      crew_size: 25,
      requirements: ["5+ years experience", "Sony Venice knowledge", "Available full-time"],
      created_by: "user1",
      created_at: "2024-01-15",
      updated_at: "2024-01-15",
      applications_count: 12
    },
    {
      id: "2",
      title: "Urban Dreams",
      description: "A coming-of-age story set in a vibrant city, exploring themes of identity and belonging through the eyes of a young artist.",
      role_needed: "Actor",
      location: "New York, NY",
      pay_status: "paid",
      min_day_rate: 500,
      max_day_rate: 800,
      start_date: "2024-04-01",
      end_date: "2024-05-15",
      project_type: "short",
      genre: "Drama",
      budget_range: "$50K - $100K",
      crew_size: 15,
      requirements: ["18-25 age range", "Dance experience", "Available weekends"],
      created_by: "user2",
      created_at: "2024-01-10",
      updated_at: "2024-01-10",
      applications_count: 8
    }
  ]

  useEffect(() => {
    // Simulate API call with mock data
    setLoading(true)
    setTimeout(() => {
      let filteredProjects = [...mockProjects]
      
      // Apply filters
      if (filters.q) {
        filteredProjects = filteredProjects.filter(project =>
          project.title.toLowerCase().includes(filters.q!.toLowerCase()) ||
          project.description.toLowerCase().includes(filters.q!.toLowerCase()) ||
          project.genre?.toLowerCase().includes(filters.q!.toLowerCase())
        )
      }
      
      if (filters.role_needed) {
        filteredProjects = filteredProjects.filter(project => project.role_needed === filters.role_needed)
      }
      
      if (filters.location) {
        filteredProjects = filteredProjects.filter(project =>
          project.location.toLowerCase().includes(filters.location!.toLowerCase())
        )
      }
      
      if (filters.pay_status) {
        filteredProjects = filteredProjects.filter(project => project.pay_status === filters.pay_status)
      }
      
      if (filters.min_day_rate) {
        const minRate = parseFloat(filters.min_day_rate)
        filteredProjects = filteredProjects.filter(project => 
          project.min_day_rate && project.min_day_rate >= minRate
        )
      }
      
      if (filters.project_type) {
        filteredProjects = filteredProjects.filter(project => project.project_type === filters.project_type)
      }
      
      setProjects(filteredProjects)
      setTotal(filteredProjects.length)
      setLoading(false)
    }, 500)
  }, [filters])

  const updateURL = useCallback((newFilters: Partial<ProjectFilters>) => {
    const params = new URLSearchParams(searchParamsHook.toString())
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })
    
    // Reset to first page when filters change
    params.set('page', '1')
    setCurrentPage(1)
    
    router.push(`/projects?${params.toString()}`)
  }, [router, searchParamsHook])

  const handleFilterChange = (key: keyof ProjectFilters, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    updateURL(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters = {
      q: "",
      role_needed: "",
      location: "",
      pay_status: "",
      min_day_rate: "",
      start_date: "",
      end_date: "",
      project_type: ""
    }
    setFilters(clearedFilters)
    updateURL(clearedFilters)
  }

  const hasActiveFilters = Object.values(filters).some(value => value !== "")

  const getPayStatusColor = (status: string) => {
    const option = PAY_STATUS_OPTIONS.find(opt => opt.value === status)
    return option?.color || "bg-gray-500"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatDateRange = (start: string, end: string) => {
    return `${formatDate(start)} - ${formatDate(end)}`
  }

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => router.push("/projects/new")}
            className="bg-brand-amber text-black hover:bg-brand-amber/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Post Project
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects by title, description, or genre..."
            value={filters.q}
            onChange={(e) => handleFilterChange('q', e.target.value)}
            className="pl-10 pr-4 h-12 text-lg"
          />
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            {showFilters ? "Hide" : "Show"} Filters
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2">
                {Object.values(filters).filter(v => v !== "").length}
              </Badge>
            )}
          </Button>
          
          {hasActiveFilters && (
            <Button variant="ghost" onClick={clearFilters} className="text-muted-foreground">
              <X className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Role Needed</label>
                  <Select value={filters.role_needed} onValueChange={(value) => handleFilterChange('role_needed', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All roles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All roles</SelectItem>
                      {ROLE_OPTIONS.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <Input
                    placeholder="City, State, Country"
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Pay Status</label>
                  <Select value={filters.pay_status} onValueChange={(value) => handleFilterChange('pay_status', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All pay types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All pay types</SelectItem>
                      {PAY_STATUS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Min Day Rate</label>
                  <Input
                    type="number"
                    placeholder="Min $ per day"
                    value={filters.min_day_rate}
                    onChange={(e) => handleFilterChange('min_day_rate', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Project Type</label>
                  <Select value={filters.project_type} onValueChange={(value) => handleFilterChange('project_type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All types</SelectItem>
                      {PROJECT_TYPE_OPTIONS.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Start Date</label>
                  <Input
                    type="date"
                    value={filters.start_date}
                    onChange={(e) => handleFilterChange('start_date', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">End Date</label>
                  <Input
                    type="date"
                    value={filters.end_date}
                    onChange={(e) => handleFilterChange('end_date', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {loading ? "Loading..." : `${total} projects found`}
        </p>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="space-y-2">
                  <div className="h-5 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded w-full" />
                  <div className="h-3 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {projects.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <p className="text-muted-foreground mb-4">No projects found matching your criteria</p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

function ProjectCard({ project }: { project: Project }) {
  const router = useRouter()

  return (
    <Card className="hover:shadow-soft transition-shadow duration-200 cursor-pointer" 
          onClick={() => router.push(`/projects/${project.id}`)}>
      <CardHeader>
        <div className="space-y-2">
          <CardTitle className="text-lg line-clamp-2">{project.title}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {project.role_needed}
            </Badge>
            <Badge 
              className={`text-xs text-white ${getPayStatusColor(project.pay_status)}`}
            >
              {project.pay_status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {project.description}
        </p>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {project.location}
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {formatDateRange(project.start_date, project.end_date)}
          </div>
          
          {project.min_day_rate && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-3 w-3" />
              ${project.min_day_rate}/day
              {project.max_day_rate && ` - $${project.max_day_rate}/day`}
            </div>
          )}
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-3 w-3" />
            {project.crew_size} crew members
          </div>
        </div>

        {project.genre && (
          <Badge variant="secondary" className="text-xs">
            {project.genre}
          </Badge>
        )}

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-muted-foreground">
            {project.applications_count} applications
          </span>
          <Button size="sm" variant="outline">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
