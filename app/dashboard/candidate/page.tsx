"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CandidateStats } from "@/components/dashboard/candidate-stats"
import { ApplicationList } from "@/components/dashboard/application-list"
import { SavedJobsList } from "@/components/dashboard/saved-jobs-list"
import { ProfileForm } from "@/components/dashboard/profile-form"
import { getApplicationsByCandidate } from "@/lib/applications"
import { getSavedJobsByCandidate, unsaveJob } from "@/lib/saved-jobs"
import { User, Briefcase, Heart, Send, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function CandidateDashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [applications, setApplications] = useState<any[]>([])
  const [savedJobs, setSavedJobs] = useState<any[]>([])

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login")
        return
      }
      if (user.role !== "candidate") {
        router.push("/dashboard/employer")
        return
      }
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      const userApplications = getApplicationsByCandidate(user.id)
      const userSavedJobs = getSavedJobsByCandidate(user.id)
      setApplications(userApplications)
      setSavedJobs(userSavedJobs)
    }
  }, [user])

  const stats = {
    totalApplications: applications.length,
    savedJobs: savedJobs.length,
    interviewsScheduled: applications.filter((app) => app.status === "interview").length,
    profileViews: Math.floor(Math.random() * 50) + 20, // Mock data
  }

  const handleUnsaveJob = (jobId: string) => {
    if (user) {
      unsaveJob(jobId, user.id)
      setSavedJobs((prev) => prev.filter((saved) => saved.jobId !== jobId))
    }
  }

  const handleProfileSave = async (userData: any) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    // In real app, update user data
    console.log("Profile updated:", userData)
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
            <h1 className="text-3xl font-bold">Welcome back, {user.name}</h1>
            <p className="text-muted-foreground">{user.title && `${user.title} • `}Track your job search progress</p>
          </div>
          <Button asChild>
            <Link href="/jobs">Browse Jobs</Link>
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="applications">Applications ({applications.length})</TabsTrigger>
            <TabsTrigger value="saved">Saved Jobs ({savedJobs.length})</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <CandidateStats stats={stats} />

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {applications.slice(0, 3).map((app, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span>Application status updated</span>
                        <span className="text-muted-foreground">2 hours ago</span>
                      </div>
                    ))}
                    {applications.length === 0 && <p className="text-sm text-muted-foreground">No recent activity</p>}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button asChild className="w-full justify-start">
                    <Link href="/jobs">
                      <Briefcase className="mr-2 h-4 w-4" />
                      Browse New Jobs
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                    onClick={() => setActiveTab("profile")}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Update Profile
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                    onClick={() => setActiveTab("saved")}
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    View Saved Jobs
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Applications */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Applications</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab("applications")}>
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {applications.length > 0 ? (
                  <ApplicationList applications={applications.slice(0, 2)} />
                ) : (
                  <div className="text-center py-6">
                    <Send className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
                    <p className="text-muted-foreground mb-4">Start applying to jobs to track your progress here.</p>
                    <Button asChild>
                      <Link href="/jobs">Browse Jobs</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications">
            <ApplicationList applications={applications} />
          </TabsContent>

          <TabsContent value="saved">
            <SavedJobsList savedJobs={savedJobs} onUnsave={handleUnsaveJob} />
          </TabsContent>

          <TabsContent value="profile">
            <ProfileForm user={user} onSave={handleProfileSave} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
