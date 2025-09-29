"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EmployerStats } from "@/components/dashboard/employer-stats"
import { JobForm } from "@/components/dashboard/job-form"
import { EmployerJobList } from "@/components/dashboard/employer-job-list"
import { mockJobs, type Job } from "@/lib/jobs"
import { Plus, Briefcase } from "lucide-react"

export default function EmployerDashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [jobs, setJobs] = useState<Job[]>([])
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [showJobForm, setShowJobForm] = useState(false)

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login")
        return
      }
      if (user.role !== "employer") {
        router.push("/dashboard/candidate")
        return
      }
    }
  }, [user, loading, router])

  useEffect(() => {
    // Load employer's jobs (filtered by employerId in real app)
    const employerJobs = mockJobs.filter((job) => job.employerId === user?.id)
    setJobs(employerJobs)
  }, [user])

  const stats = {
    totalJobs: jobs.length,
    activeJobs: jobs.filter((job) => new Date(job.applicationDeadline) > new Date()).length,
    totalViews: jobs.reduce((acc) => acc + Math.floor(Math.random() * 200) + 50, 0),
    totalApplications: jobs.reduce((acc) => acc + Math.floor(Math.random() * 20) + 5, 0),
  }

  const handleJobSubmit = async (jobData: Partial<Job>) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (editingJob) {
      // Update existing job
      const updatedJob = { ...editingJob, ...jobData }
      setJobs((prev) => prev.map((job) => (job.id === editingJob.id ? updatedJob : job)))
    } else {
      // Create new job
      const newJob: Job = {
        id: Date.now().toString(),
        postedDate: new Date(),
        employerId: user?.id || "1",
        ...jobData,
      } as Job
      setJobs((prev) => [newJob, ...prev])
    }

    setShowJobForm(false)
    setEditingJob(null)
    setActiveTab("jobs")
  }

  const handleEditJob = (job: Job) => {
    setEditingJob(job)
    setShowJobForm(true)
    setActiveTab("post-job")
  }

  const handleDeleteJob = (jobId: string) => {
    setJobs((prev) => prev.filter((job) => job.id !== jobId))
  }

  const handleViewApplications = (jobId: string) => {
    router.push(`/dashboard/employer/jobs/${jobId}/applications`)
  }

  const handleNewJob = () => {
    setEditingJob(null)
    setShowJobForm(true)
    setActiveTab("post-job")
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Employer Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user.name} from {user.company}
            </p>
          </div>
          <Button onClick={handleNewJob} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Post New Job
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="jobs">My Jobs ({jobs.length})</TabsTrigger>
            <TabsTrigger value="post-job">
              {showJobForm ? (editingJob ? "Edit Job" : "Post Job") : "Post Job"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <EmployerStats stats={stats} />

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>New application for Senior Frontend Developer</span>
                      <span className="text-muted-foreground">2 hours ago</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Job posting "UX Designer" went live</span>
                      <span className="text-muted-foreground">1 day ago</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>5 new applications received</span>
                      <span className="text-muted-foreground">2 days ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button onClick={handleNewJob} className="w-full justify-start">
                    <Plus className="mr-2 h-4 w-4" />
                    Post a New Job
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Briefcase className="mr-2 h-4 w-4" />
                    View All Applications
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Plus className="mr-2 h-4 w-4" />
                    Upgrade to Premium
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="jobs">
            <EmployerJobList
              jobs={jobs}
              onEdit={handleEditJob}
              onDelete={handleDeleteJob}
              onViewApplications={handleViewApplications}
            />
          </TabsContent>

          <TabsContent value="post-job">
            {showJobForm ? (
              <JobForm
                job={editingJob || undefined}
                onSubmit={handleJobSubmit}
                onCancel={() => {
                  setShowJobForm(false)
                  setEditingJob(null)
                  setActiveTab("jobs")
                }}
              />
            ) : (
              <Card>
                <CardContent className="py-8 text-center">
                  <h3 className="text-lg font-semibold mb-2">Ready to post a job?</h3>
                  <p className="text-muted-foreground mb-4">
                    Create a compelling job posting to attract the best candidates.
                  </p>
                  <Button onClick={() => setShowJobForm(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Start Posting
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
