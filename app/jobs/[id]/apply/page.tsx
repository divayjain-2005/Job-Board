"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { notFound } from "next/navigation"
import { ApplicationForm } from "@/components/jobs/application-form"
import { useAuth } from "@/lib/auth"
import { getJobById } from "@/lib/jobs"
import { getApplicationsByCandidate } from "@/lib/applications"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertTriangle } from "lucide-react"
import Link from "next/link"

interface JobApplicationPageProps {
  params: {
    id: string
  }
}

export default function JobApplicationPage({ params }: JobApplicationPageProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [job, setJob] = useState<any>(null)
  const [hasApplied, setHasApplied] = useState(false)
  const [checkingApplication, setCheckingApplication] = useState(true)

  useEffect(() => {
    const jobData = getJobById(params.id)
    if (!jobData) {
      notFound()
    }
    setJob(jobData)
  }, [params.id])

  useEffect(() => {
    if (user && job) {
      // Check if user has already applied
      const applications = getApplicationsByCandidate(user.id)
      const existingApplication = applications.find((app) => app.jobId === job.id)
      setHasApplied(!!existingApplication)
      setCheckingApplication(false)
    }
  }, [user, job])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push(`/login?redirect=/jobs/${params.id}/apply`)
    }
  }, [user, loading, router, params.id])

  // Redirect employers to job page
  useEffect(() => {
    if (user && user.role === "employer") {
      router.push(`/jobs/${params.id}`)
    }
  }, [user, router, params.id])

  if (loading || checkingApplication) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading application...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  if (!job) {
    notFound()
  }

  // Check if application deadline has passed
  const isDeadlinePassed = new Date() > new Date(job.applicationDeadline)

  if (hasApplied) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Link href={`/jobs/${job.id}`} className="text-primary hover:underline">
              ← Back to Job Details
            </Link>
          </div>

          <Card className="w-full max-w-2xl mx-auto">
            <CardContent className="py-8 text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Already Applied</h2>
              <p className="text-muted-foreground mb-4">
                You have already submitted an application for {job.title} at {job.company}.
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                You can track your application status in your dashboard.
              </p>
              <div className="flex gap-4 justify-center">
                <Button asChild>
                  <Link href="/dashboard/candidate?tab=applications">View Applications</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/jobs">Browse More Jobs</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (isDeadlinePassed) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Link href={`/jobs/${job.id}`} className="text-primary hover:underline">
              ← Back to Job Details
            </Link>
          </div>

          <Card className="w-full max-w-2xl mx-auto">
            <CardContent className="py-8 text-center">
              <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Application Deadline Passed</h2>
              <p className="text-muted-foreground mb-4">
                The application deadline for {job.title} at {job.company} has passed.
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Application deadline was {new Date(job.applicationDeadline).toLocaleDateString()}.
              </p>
              <Button asChild>
                <Link href="/jobs">Browse Other Jobs</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href={`/jobs/${job.id}`} className="text-primary hover:underline">
            ← Back to Job Details
          </Link>
        </div>

        <Alert className="mb-6 max-w-2xl mx-auto">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Application deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
            {new Date(job.applicationDeadline).getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000 && (
              <span className="font-medium text-destructive"> - Apply soon!</span>
            )}
          </AlertDescription>
        </Alert>

        <ApplicationForm job={job} />
      </div>
    </div>
  )
}
