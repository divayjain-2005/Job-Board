import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Job } from "@/lib/jobs"
import { MapPin, Clock, DollarSign, Building2 } from "lucide-react"

interface JobCardProps {
  job: Job
  featured?: boolean
}

export function JobCard({ job, featured = false }: JobCardProps) {
  const formatSalary = (min: number, max: number, currency: string) => {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
    return `${formatter.format(min)} - ${formatter.format(max)}`
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "1 day ago"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    return `${Math.ceil(diffDays / 30)} months ago`
  }

  return (
    <Card
      className={`group hover:shadow-lg transition-all duration-200 ${featured ? "ring-2 ring-accent/20 bg-accent/5" : ""}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <Link href={`/jobs/${job.id}`} className="block">
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors text-balance">
                {job.title}
              </h3>
            </Link>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Building2 className="h-4 w-4" />
              <span className="font-medium">{job.company}</span>
            </div>
          </div>
          {featured && (
            <Badge variant="secondary" className="bg-accent text-accent-foreground">
              Featured
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{job.location}</span>
            {job.remote && (
              <Badge variant="outline" className="ml-1 text-xs">
                Remote
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="h-4 w-4" />
            <span>{formatSalary(job.salary.min, job.salary.max, job.salary.currency)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{formatDate(job.postedDate)}</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 text-pretty">{job.description}</p>

        <div className="flex flex-wrap gap-2">
          {job.skills.slice(0, 4).map((skill) => (
            <Badge key={skill} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
          {job.skills.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{job.skills.length - 4} more
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex gap-2">
            <Badge variant="outline" className="capitalize">
              {job.type.replace("-", " ")}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {job.experienceLevel}
            </Badge>
          </div>
          <Button asChild size="sm">
            <Link href={`/jobs/${job.id}`}>View Details</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
