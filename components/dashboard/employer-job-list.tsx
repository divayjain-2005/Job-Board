"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Job } from "@/lib/jobs"
import { MoreHorizontal, Eye, Edit, Trash2, Users, Calendar } from "lucide-react"

interface EmployerJobListProps {
  jobs: Job[]
  onEdit: (job: Job) => void
  onDelete: (jobId: string) => void
  onViewApplications: (jobId: string) => void
}

export function EmployerJobList({ jobs, onEdit, onDelete, onViewApplications }: EmployerJobListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (jobId: string) => {
    setDeletingId(jobId)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    onDelete(jobId)
    setDeletingId(null)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatSalary = (min: number, max: number, currency: string) => {
    const formatter = new Intl.NumberFormat("en-IN", { // Changed to en-IN for Indian Rupees
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
    return `${formatter.format(min)} - ${formatter.format(max)}`
  }

  if (jobs.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <h3 className="text-lg font-semibold mb-2">No jobs posted yet</h3>
          <p className="text-muted-foreground mb-4">Start by posting your first job to attract talented candidates.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <Card key={job.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg">{job.title}</CardTitle>
                  {job.featured && <Badge className="bg-accent text-accent-foreground">Featured</Badge>}
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span>{job.location}</span>
                  <span>{formatSalary(job.salary.min, job.salary.max, job.salary.currency)}</span>
                  <span className="capitalize">{job.type.replace("-", " ")}</span>
                  <span className="capitalize">{job.experienceLevel}</span>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => window.open(`/jobs/${job.id}`, "_blank")}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Job
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(job)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Job
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onViewApplications(job.id)}>
                    <Users className="mr-2 h-4 w-4" />
                    View Applications
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDelete(job.id)}
                    className="text-destructive"
                    disabled={deletingId === job.id}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {deletingId === job.id ? "Deleting..." : "Delete Job"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2 text-pretty">{job.description}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {job.skills.slice(0, 5).map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {job.skills.length > 5 && (
                <Badge variant="outline" className="text-xs">
                  +{job.skills.length - 5} more
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Posted {formatDate(job.postedDate)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>12 applications</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>156 views</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => onViewApplications(job.id)}>
                  View Applications
                </Button>
                <Button size="sm" onClick={() => onEdit(job)}>
                  Edit
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}