"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { X } from "lucide-react"
import type { Job } from "@/lib/jobs"

interface JobFormProps {
  job?: Partial<Job>
  onSubmit: (jobData: Partial<Job>) => void
  onCancel: () => void
  loading?: boolean
}

export function JobForm({ job, onSubmit, onCancel, loading = false }: JobFormProps) {
  const [formData, setFormData] = useState({
    title: job?.title || "",
    location: job?.location || "",
    type: job?.type || "full-time",
    salaryMin: job?.salary?.min?.toString() || "",
    salaryMax: job?.salary?.max?.toString() || "",
    description: job?.description || "",
    requirements: job?.requirements?.join("\n") || "",
    benefits: job?.benefits?.join("\n") || "",
    remote: job?.remote || false,
    experienceLevel: job?.experienceLevel || "mid",
    department: job?.department || "",
    skills: job?.skills || [],
    applicationDeadline: job?.applicationDeadline?.toISOString().split("T")[0] || "",
    featured: job?.featured || false,
  })

  const [currentSkill, setCurrentSkill] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Basic validation
    if (!formData.title || !formData.location || !formData.description) {
      setError("Please fill in all required fields")
      return
    }

    if (!formData.salaryMin || !formData.salaryMax) {
      setError("Please provide salary range")
      return
    }

    if (Number.parseInt(formData.salaryMin) >= Number.parseInt(formData.salaryMax)) {
      setError("Maximum salary must be higher than minimum salary")
      return
    }

    const jobData: Partial<Job> = {
      ...job,
      title: formData.title,
      location: formData.location,
      type: formData.type as Job["type"],
      salary: {
        min: Number.parseInt(formData.salaryMin),
        max: Number.parseInt(formData.salaryMax),
        currency: "INR", // Changed from "USD"
      },
      description: formData.description,
      requirements: formData.requirements.split("\n").filter((req) => req.trim()),
      benefits: formData.benefits.split("\n").filter((benefit) => benefit.trim()),
      remote: formData.remote,
      experienceLevel: formData.experienceLevel as Job["experienceLevel"],
      department: formData.department,
      skills: formData.skills,
      applicationDeadline: new Date(formData.applicationDeadline),
      featured: formData.featured,
    }

    onSubmit(jobData)
  }

  const addSkill = () => {
    if (currentSkill.trim() && !formData.skills.includes(currentSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, currentSkill.trim()],
      }))
      setCurrentSkill("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }))
  }

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{job?.id ? "Edit Job Posting" : "Post a New Job"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g. Senior Frontend Developer"
                  value={formData.title}
                  onChange={(e) => updateFormData("title", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  placeholder="e.g. San Francisco, CA"
                  value={formData.location}
                  onChange={(e) => updateFormData("location", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Job Type</Label>
                <Select value={formData.type} onValueChange={(value) => updateFormData("type", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full Time</SelectItem>
                    <SelectItem value="part-time">Part Time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="experienceLevel">Experience Level</Label>
                <Select
                  value={formData.experienceLevel}
                  onValueChange={(value) => updateFormData("experienceLevel", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry">Entry Level</SelectItem>
                    <SelectItem value="mid">Mid Level</SelectItem>
                    <SelectItem value="senior">Senior Level</SelectItem>
                    <SelectItem value="executive">Executive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  placeholder="e.g. Engineering"
                  value={formData.department}
                  onChange={(e) => updateFormData("department", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salaryMin">Minimum Salary (INR) *</Label>
                <Input
                  id="salaryMin"
                  type="number"
                  placeholder="6000000"
                  value={formData.salaryMin}
                  onChange={(e) => updateFormData("salaryMin", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salaryMax">Maximum Salary (INR) *</Label>
                <Input
                  id="salaryMax"
                  type="number"
                  placeholder="9000000"
                  value={formData.salaryMax}
                  onChange={(e) => updateFormData("salaryMax", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="applicationDeadline">Application Deadline</Label>
              <Input
                id="applicationDeadline"
                type="date"
                value={formData.applicationDeadline}
                onChange={(e) => updateFormData("applicationDeadline", e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remote"
                  checked={formData.remote}
                  onCheckedChange={(checked) => updateFormData("remote", checked)}
                />
                <Label htmlFor="remote">Remote work available</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => updateFormData("featured", checked)}
                />
                <Label htmlFor="featured">Featured job (premium)</Label>
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Job Description</h3>
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
                value={formData.description}
                onChange={(e) => updateFormData("description", e.target.value)}
                rows={6}
                required
              />
            </div>
          </div>

          {/* Requirements */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Requirements</h3>
            <div className="space-y-2">
              <Label htmlFor="requirements">Requirements (one per line)</Label>
              <Textarea
                id="requirements"
                placeholder="3+ years of React experience&#10;Strong TypeScript skills&#10;Experience with modern CSS"
                value={formData.requirements}
                onChange={(e) => updateFormData("requirements", e.target.value)}
                rows={5}
              />
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Benefits</h3>
            <div className="space-y-2">
              <Label htmlFor="benefits">Benefits & Perks (one per line)</Label>
              <Textarea
                id="benefits"
                placeholder="Competitive salary and equity&#10;Health, dental, and vision insurance&#10;Flexible work arrangements"
                value={formData.benefits}
                onChange={(e) => updateFormData("benefits", e.target.value)}
                rows={5}
              />
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Required Skills</h3>
            <div className="space-y-2">
              <Label>Skills</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a skill..."
                  value={currentSkill}
                  onChange={(e) => setCurrentSkill(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                />
                <Button type="button" onClick={addSkill} variant="outline">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                    {skill}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeSkill(skill)} />
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Saving..." : job?.id ? "Update Job" : "Post Job"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}