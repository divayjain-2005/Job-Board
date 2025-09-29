export interface SavedJob {
  id: string
  jobId: string
  candidateId: string
  savedDate: Date
  notes?: string
}

// Mock saved jobs data
export const mockSavedJobs: SavedJob[] = [
  {
    id: "1",
    jobId: "2",
    candidateId: "2",
    savedDate: new Date("2024-01-18"),
    notes: "Interesting product role, good company culture",
  },
  {
    id: "2",
    jobId: "4",
    candidateId: "2",
    savedDate: new Date("2024-01-30"),
    notes: "Great backend opportunity, remote-friendly",
  },
  {
    id: "3",
    jobId: "5",
    candidateId: "2",
    savedDate: new Date("2024-02-02"),
  },
]

export function getSavedJobsByCandidate(candidateId: string): SavedJob[] {
  return mockSavedJobs.filter((saved) => saved.candidateId === candidateId)
}

export function saveJob(jobId: string, candidateId: string, notes?: string): SavedJob {
  const newSavedJob: SavedJob = {
    id: Date.now().toString(),
    jobId,
    candidateId,
    savedDate: new Date(),
    notes,
  }

  mockSavedJobs.push(newSavedJob)
  return newSavedJob
}

export function unsaveJob(jobId: string, candidateId: string): boolean {
  const index = mockSavedJobs.findIndex((saved) => saved.jobId === jobId && saved.candidateId === candidateId)

  if (index === -1) return false

  mockSavedJobs.splice(index, 1)
  return true
}

export function isJobSaved(jobId: string, candidateId: string): boolean {
  return mockSavedJobs.some((saved) => saved.jobId === jobId && saved.candidateId === candidateId)
}
