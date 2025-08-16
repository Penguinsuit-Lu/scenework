import Link from "next/link"
import { listProjects } from "./actions"
import { Button } from "@/components/ui/ButtonNew"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, DollarSign, MapPin, Users, Plus } from "lucide-react"

export const dynamic = 'force-dynamic';
export const revalidate = 0;
// (optional alternative) export const fetchCache = 'default-no-store';

export default async function ProjectsPage() {
  const projects = await listProjects()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
          <p className="text-white/80">
            Discover and join exciting film and media projects.
          </p>
        </div>
        <Link href="/projects/new">
          <Button variant="brand" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Project
          </Button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-white/60" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No projects yet</h3>
          <p className="text-white/60 mb-6">Be the first to create a project!</p>
          <Link href="/projects/new">
            <Button variant="brand">Create Your First Project</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {project.project_type}
                    </Badge>
                    <Badge 
                      className={`text-xs ${
                        project.pay_status === 'paid' ? 'bg-amber-500' :
                        project.pay_status === 'unpaid' ? 'bg-red-500' :
                        project.pay_status === 'deferred' ? 'bg-yellow-400' :
                        'bg-amber-500'
                      }`}
                    >
                      {project.pay_status}
                    </Badge>
                  </div>
                  <CardTitle className="text-white text-lg line-clamp-2">
                    {project.title}
                  </CardTitle>
                  <CardDescription className="text-white/70 line-clamp-2">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-white/80">
                    <MapPin className="w-4 h-4" />
                    {project.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/80">
                    <Users className="w-4 h-4" />
                    {project.role_needed}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/80">
                    <DollarSign className="w-4 h-4" />
                    ${project.min_day_rate}/day
                    {project.max_day_rate > project.min_day_rate && ` - $${project.max_day_rate}/day`}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/80">
                    <Calendar className="w-4 h-4" />
                    {new Date(project.start_date).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
