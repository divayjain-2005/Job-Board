export interface Application {
  id: string
  jobId: string
  candidateId: string
  status: "pending" | "reviewing" | "interview" | "rejected" | "accepted"
  appliedDate: Date
  coverLetter: string
  resumeUrl?: string
  notes?: string
  lastUpdated: Date
}

// Mock applications data
export const mockApplications: Application[] = [
  {
    id: "1",
    jobId: "1",
    candidateId: "2",
    status: "reviewing",
    appliedDate: new Date("2024-01-20"),
    coverLetter: "I am excited to apply for the Senior Frontend Developer position...",
    resumeUrl: "/resumes/sarah-johnson-resume.pdf",
    lastUpdated: new Date("2024-01-22"),
  },
  {
    id: "2",
    jobId: "3",
    candidateId: "2",
    status: "interview",
    appliedDate: new Date("2024-01-25"),
    coverLetter: "As a passionate UX/UI designer with 3 years of experience...",
    resumeUrl: "/resumes/sarah-johnson-resume.pdf",
    notes: "Interview scheduled for next Tuesday",
    lastUpdated: new Date("2024-01-28"),
  },
  {
    id: "3",
    jobId: "6",
    candidateId: "2",
    status: "pending",
    appliedDate: new Date("2024-02-01"),
    coverLetter: "I would love to join your DevOps team...",
    resumeUrl: "/resumes/sarah-johnson-resume.pdf",
    lastUpdated: new Date("2024-02-01"),
  },
]

export function getApplicationsByCandidate(candidateId: string): Application[] {
  return mockApplications.filter((app) => app.candidateId === candidateId)
}

export function getApplicationById(id: string): Application | undefined {
  return mockApplications.find((app) => app.id === id)
}

export function createApplication(
  applicationData: Omit<Application, "id" | "appliedDate" | "lastUpdated">,
): Application {
  const newApplication: Application = {
    id: Date.now().toString(),
    appliedDate: new Date(),
    lastUpdated: new Date(),
    ...applicationData,
  }

  mockApplications.push(newApplication)
  return newApplication
}

export function updateApplicationStatus(id: string, status: Application["status"]): Application | null {
  const appIndex = mockApplications.findIndex((app) => app.id === id)
  if (appIndex === -1) return null

  mockApplications[appIndex] = {
    ...mockApplications[appIndex],
    status,
    lastUpdated: new Date(),
  }

  return mockApplications[appIndex]
}
