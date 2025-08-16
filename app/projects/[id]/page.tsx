import { notFound } from "next/navigation"
import Link from "next/link"
import { getProject } from "../actions"
import { Button } from "@/components/ui/ButtonNew"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  Calendar, 
  DollarSign, 
  MapPin, 
  Users, 
  Clock,
  FileText,
  CheckCircle
} from "lucide-react"

export const dynamic = 'force-dynamic';
export const revalidate = 0;
// (optional alternative) export const fetchCache = 'default-no-store';

interface ProjectPageProps {
  params: {
    id: string
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = await getProject(params.id)

  if (!project) {
    notFound()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getPayStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-amber-500'
      case 'unpaid': return 'bg-red-500'
      case 'deferred': return 'bg-yellow-400'
      case 'negotiable': return 'bg-amber-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/projects" className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>
      </div>

      <div className="space-y-6">
        {/* Project Header */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <CardTitle className="text-3xl font-bold text-white mb-2">
                  {project.title}
                </CardTitle>
                <CardDescription className="text-white/70 text-lg">
                  {project.description}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Badge variant="secondary" className="text-sm">
                  {project.project_type}
                </Badge>
                <Badge className={`text-sm ${getPayStatusColor(project.pay_status)}`}>
                  {project.pay_status}
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Project Details Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Basic Info */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-white">Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-white/60" />
                  <div>
                    <p className="text-sm text-white/60">Location</p>
                    <p className="text-white font-medium">{project.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-white/60" />
                  <div>
                    <p className="text-sm text-white/60">Role Needed</p>
                    <p className="text-white font-medium">{project.role_needed}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-white/60" />
                  <div>
                    <p className="text-sm text-white/60">Timeline</p>
                    <p className="text-white font-medium">
                      {formatDate(project.start_date)} - {formatDate(project.end_date)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-white/60" />
                  <div>
                    <p className="text-sm text-white/60">Crew Size</p>
                    <p className="text-white font-medium">{project.crew_size} people</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Info */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-white">Financial Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-white/60" />
                  <div>
                    <p className="text-sm text-white/60">Day Rate</p>
                    <p className="text-white font-medium">
                      ${project.min_day_rate}/day
                      {project.max_day_rate > project.min_day_rate && ` - $${project.max_day_rate}/day`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-white/60" />
                  <div>
                    <p className="text-sm text-white/60">Budget Range</p>
                    <p className="text-white font-medium">{project.budget_range}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Project Type & Genre */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-white">Project Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-white/60 mb-1">Project Type</p>
                  <Badge variant="outline" className="text-white">
                    {project.project_type}
                  </Badge>
                </div>

                <div>
                  <p className="text-sm text-white/60 mb-1">Genre</p>
                  <Badge variant="outline" className="text-white">
                    {project.genre}
                  </Badge>
                </div>

                <div>
                  <p className="text-sm text-white/60 mb-1">Pay Status</p>
                  <Badge className={`${getPayStatusColor(project.pay_status)}`}>
                    {project.pay_status}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            {project.requirements && project.requirements.length > 0 && (
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-white">Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {project.requirements.map((req, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-amber-400" />
                        <span className="text-white/90">{req}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Apply Button */}
            <Card className="bg-white/5 border-white/10">
              <CardContent className="pt-6">
                <Button 
                  variant="brand" 
                  className="w-full" 
                  disabled
                >
                  Apply for this Role
                </Button>
                <p className="text-xs text-white/50 text-center mt-2">
                  Application functionality coming soon
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Project Metadata */}
        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center text-sm text-white/50">
              <div className="flex items-center gap-4">
                <span>Created: {formatDate(project.created_at)}</span>
                {project.updated_at !== project.created_at && (
                  <span>Updated: {formatDate(project.updated_at)}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Project ID: {project.id}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

