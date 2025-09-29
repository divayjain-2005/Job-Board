"use client"

import { useState, useEffect } from "react"
import { JobCard } from "@/components/jobs/job-card"
import { JobSearch, type SearchFilters } from "@/components/jobs/job-search"
import { searchJobs, type Job } from "@/lib/jobs"
import { Badge } from "@/components/ui/badge"

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    location: "",
    type: "",
    experienceLevel: "",
    remote: null,
  })

  const handleSearch = async (newFilters: SearchFilters) => {
    setLoading(true)
    setFilters(newFilters)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const results = searchJobs(
      newFilters.query,
      newFilters.location,
      newFilters.type,
      newFilters.experienceLevel,
      newFilters.remote,
    )

    setJobs(results)
    setLoading(false)
  }

  // Initial load
  useEffect(() => {
    handleSearch(filters)
  }, [])

  const activeFiltersCount = Object.values(filters).filter((value) => value !== "" && value !== null).length

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Find Your Next Job</h1>
          <p className="text-muted-foreground">Discover opportunities from top companies around the world</p>
        </div>

        <div className="mb-8">
          <JobSearch onSearch={handleSearch} initialFilters={filters} />
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold">{loading ? "Searching..." : `${jobs.length} Jobs Found`}</h2>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">
                {activeFiltersCount} filter{activeFiltersCount > 1 ? "s" : ""} applied
              </Badge>
            )}
          </div>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : jobs.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} featured={job.featured} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or browse all available positions.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
