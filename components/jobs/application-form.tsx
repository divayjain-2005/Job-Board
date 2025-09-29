"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/lib/auth"
import { createApplication } from "@/lib/applications"
import type { Job } from "@/lib/jobs"
import { Upload, FileText, CheckCircle } from "lucide-react"

interface ApplicationFormProps {
  job: Job
}

export function ApplicationForm({ job }: ApplicationFormProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [resumeFile, setResumeFile] = useState<File | null>(null)

  const [formData, setFormData] = useState({
    coverLetter: "",
    phone: "",
    linkedinUrl: "",
    portfolioUrl: "",
    availableStartDate: "",
    salaryExpectation: "",
    agreeToTerms: false,
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ]
      if (!allowedTypes.includes(file.type)) {
        setError("Please upload a PDF, DOC, or DOCX file")
        return
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB")
        return
      }

      setResumeFile(file)
      setError("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      router.push("/login")
      return
    }

    if (!formData.coverLetter.trim()) {
      setError("Please provide a cover letter")
      return
    }

    if (!resumeFile) {
      setError("Please upload your resume")
      return
    }

    if (!formData.agreeToTerms) {
      setError("Please agree to the terms and conditions")
      return
    }

    setLoading(true)
    setError("")

    try {
      // Simulate file upload and application submission
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Create application
      const application = createApplication({
        jobId: job.id,
        candidateId: user.id,
        status: "pending",
        coverLetter: formData.coverLetter,
        resumeUrl: `/resumes/${user.id}-${resumeFile.name}`,
      })

      setSuccess(true)

      // Redirect to dashboard after success
      setTimeout(() => {
        router.push("/dashboard/candidate?tab=applications")
      }, 2000)
    } catch (err) {
      setError("Failed to submit application. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (success) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="py-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Application Submitted!</h2>
          <p className="text-muted-foreground mb-4">
            Your application for {job.title} at {job.company} has been successfully submitted.
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            You'll receive an email confirmation shortly. You can track your application status in your dashboard.
          </p>
          <Button onClick={() => router.push("/dashboard/candidate")}>Go to Dashboard</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Apply for {job.title}</CardTitle>
        <p className="text-muted-foreground">
          {job.company} • {job.location}
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={user?.name || ""} disabled className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user?.email || ""} disabled className="bg-muted" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={(e) => updateFormData("phone", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="availableStartDate">Available Start Date</Label>
                <Input
                  id="availableStartDate"
                  type="date"
                  value={formData.availableStartDate}
                  onChange={(e) => updateFormData("availableStartDate", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Professional Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Professional Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="linkedinUrl">LinkedIn Profile</Label>
                <Input
                  id="linkedinUrl"
                  type="url"
                  placeholder="https://linkedin.com/in/yourprofile"
                  value={formData.linkedinUrl}
                  onChange={(e) => updateFormData("linkedinUrl", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="portfolioUrl">Portfolio/Website</Label>
                <Input
                  id="portfolioUrl"
                  type="url"
                  placeholder="https://yourportfolio.com"
                  value={formData.portfolioUrl}
                  onChange={(e) => updateFormData("portfolioUrl", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Salary Expectation */}
          <div className="space-y-2">
            <Label htmlFor="salaryExpectation">Salary Expectation (Optional)</Label>
            <Input
              id="salaryExpectation"
              placeholder="e.g. $80,000 - $100,000"
              value={formData.salaryExpectation}
              onChange={(e) => updateFormData("salaryExpectation", e.target.value)}
            />
          </div>

          {/* Resume Upload */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Resume</h3>
            <div className="space-y-2">
              <Label htmlFor="resume">Upload Resume *</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Upload your resume (PDF, DOC, DOCX - Max 5MB)</p>
                    <Input
                      id="resume"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Button type="button" variant="outline" onClick={() => document.getElementById("resume")?.click()}>
                      Choose File
                    </Button>
                  </div>
                </div>
                {resumeFile && (
                  <div className="mt-4 p-3 bg-muted rounded-lg flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">{resumeFile.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ({(resumeFile.size / 1024 / 1024).toFixed(1)} MB)
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Cover Letter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Cover Letter</h3>
            <div className="space-y-2">
              <Label htmlFor="coverLetter">Why are you interested in this position? *</Label>
              <Textarea
                id="coverLetter"
                placeholder="Tell the employer why you're the perfect fit for this role. Highlight your relevant experience, skills, and enthusiasm for the position..."
                value={formData.coverLetter}
                onChange={(e) => updateFormData("coverLetter", e.target.value)}
                rows={8}
                required
              />
              <p className="text-xs text-muted-foreground">{formData.coverLetter.length}/1000 characters</p>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="space-y-4">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="agreeToTerms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) => updateFormData("agreeToTerms", checked)}
              />
              <Label htmlFor="agreeToTerms" className="text-sm leading-relaxed">
                I agree to the{" "}
                <a href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </a>
                . I consent to the processing of my personal data for recruitment purposes.
              </Label>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !formData.agreeToTerms} className="flex-1">
              {loading ? "Submitting Application..." : "Submit Application"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
