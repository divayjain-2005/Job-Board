export interface Job {
  id: string
  title: string
  company: string
  location: string
  type: "full-time" | "part-time" | "contract" | "remote"
  salary: {
    min: number
    max: number
    currency: string
  }
  description: string
  requirements: string[]
  benefits: string[]
  postedDate: Date
  applicationDeadline: Date
  employerId: string
  featured: boolean
  remote: boolean
  experienceLevel: "entry" | "mid" | "senior" | "executive"
  department: string
  skills: string[]
}

// Mock job data
export const mockJobs: Job[] = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    type: "full-time",
    salary: { min: 120000, max: 160000, currency: "USD" },
    description:
      "We are looking for a Senior Frontend Developer to join our dynamic team. You will be responsible for building user-facing features using modern web technologies.",
    requirements: [
      "5+ years of experience with React and TypeScript",
      "Strong understanding of modern CSS and responsive design",
      "Experience with state management libraries (Redux, Zustand)",
      "Familiarity with testing frameworks (Jest, Cypress)",
      "Bachelor's degree in Computer Science or equivalent experience",
    ],
    benefits: [
      "Competitive salary and equity package",
      "Comprehensive health, dental, and vision insurance",
      "Flexible work arrangements and remote options",
      "401(k) with company matching",
      "Professional development budget",
    ],
    postedDate: new Date("2024-01-15"),
    applicationDeadline: new Date("2024-02-15"),
    employerId: "1",
    featured: true,
    remote: true,
    experienceLevel: "senior",
    department: "Engineering",
    skills: ["React", "TypeScript", "CSS", "JavaScript", "Redux"],
  },
  {
    id: "2",
    title: "Product Manager",
    company: "InnovateLabs",
    location: "New York, NY",
    type: "full-time",
    salary: { min: 110000, max: 140000, currency: "USD" },
    description:
      "Join our product team to drive the development of cutting-edge software solutions. You will work closely with engineering, design, and business teams.",
    requirements: [
      "3+ years of product management experience",
      "Strong analytical and problem-solving skills",
      "Experience with agile development methodologies",
      "Excellent communication and leadership skills",
      "MBA or equivalent experience preferred",
    ],
    benefits: [
      "Competitive salary and performance bonuses",
      "Health and wellness benefits",
      "Flexible PTO policy",
      "Stock options",
      "Learning and development opportunities",
    ],
    postedDate: new Date("2024-01-20"),
    applicationDeadline: new Date("2024-02-20"),
    employerId: "2",
    featured: false,
    remote: false,
    experienceLevel: "mid",
    department: "Product",
    skills: ["Product Management", "Analytics", "Agile", "Strategy"],
  },
  {
    id: "3",
    title: "UX/UI Designer",
    company: "DesignStudio Pro",
    location: "Austin, TX",
    type: "full-time",
    salary: { min: 85000, max: 110000, currency: "USD" },
    description:
      "We are seeking a talented UX/UI Designer to create intuitive and beautiful user experiences for our digital products.",
    requirements: [
      "3+ years of UX/UI design experience",
      "Proficiency in Figma, Sketch, or Adobe Creative Suite",
      "Strong portfolio demonstrating design thinking",
      "Understanding of user research and usability testing",
      "Knowledge of HTML/CSS is a plus",
    ],
    benefits: [
      "Creative and collaborative work environment",
      "Health insurance and retirement plans",
      "Flexible work schedule",
      "Design conference attendance budget",
      "Latest design tools and equipment",
    ],
    postedDate: new Date("2024-01-25"),
    applicationDeadline: new Date("2024-02-25"),
    employerId: "3",
    featured: true,
    remote: true,
    experienceLevel: "mid",
    department: "Design",
    skills: ["Figma", "UI Design", "UX Research", "Prototyping", "User Testing"],
  },
  {
    id: "4",
    title: "Backend Engineer",
    company: "DataFlow Systems",
    location: "Seattle, WA",
    type: "full-time",
    salary: { min: 130000, max: 170000, currency: "USD" },
    description:
      "Join our backend team to build scalable and reliable systems that power our data processing platform.",
    requirements: [
      "4+ years of backend development experience",
      "Strong knowledge of Python, Go, or Java",
      "Experience with cloud platforms (AWS, GCP, Azure)",
      "Database design and optimization skills",
      "Understanding of microservices architecture",
    ],
    benefits: [
      "Top-tier compensation package",
      "Comprehensive benefits package",
      "Remote-first culture",
      "Annual learning stipend",
      "Sabbatical program after 5 years",
    ],
    postedDate: new Date("2024-01-30"),
    applicationDeadline: new Date("2024-03-01"),
    employerId: "4",
    featured: false,
    remote: true,
    experienceLevel: "senior",
    department: "Engineering",
    skills: ["Python", "AWS", "Microservices", "PostgreSQL", "Docker"],
  },
  {
    id: "5",
    title: "Marketing Coordinator",
    company: "GrowthCo",
    location: "Chicago, IL",
    type: "full-time",
    salary: { min: 55000, max: 70000, currency: "USD" },
    description:
      "Support our marketing team in executing campaigns and driving brand awareness across multiple channels.",
    requirements: [
      "1-2 years of marketing experience",
      "Strong written and verbal communication skills",
      "Experience with social media platforms",
      "Basic knowledge of marketing analytics",
      "Bachelor's degree in Marketing or related field",
    ],
    benefits: [
      "Competitive entry-level salary",
      "Health and dental insurance",
      "Professional development opportunities",
      "Flexible work arrangements",
      "Team building events and company culture",
    ],
    postedDate: new Date("2024-02-01"),
    applicationDeadline: new Date("2024-03-01"),
    employerId: "5",
    featured: false,
    remote: false,
    experienceLevel: "entry",
    department: "Marketing",
    skills: ["Social Media", "Content Marketing", "Analytics", "Communication"],
  },
  {
    id: "6",
    title: "DevOps Engineer",
    company: "CloudTech Solutions",
    location: "Remote",
    type: "full-time",
    salary: { min: 115000, max: 145000, currency: "USD" },
    description:
      "Help us build and maintain robust infrastructure and deployment pipelines for our cloud-native applications.",
    requirements: [
      "3+ years of DevOps/Infrastructure experience",
      "Strong knowledge of Kubernetes and Docker",
      "Experience with CI/CD pipelines",
      "Cloud platform expertise (AWS/GCP/Azure)",
      "Infrastructure as Code (Terraform, CloudFormation)",
    ],
    benefits: [
      "Fully remote position",
      "Competitive salary and equity",
      "Health, dental, and vision coverage",
      "Home office setup budget",
      "Continuous learning opportunities",
    ],
    postedDate: new Date("2024-02-05"),
    applicationDeadline: new Date("2024-03-05"),
    employerId: "6",
    featured: true,
    remote: true,
    experienceLevel: "mid",
    department: "Engineering",
    skills: ["Kubernetes", "Docker", "AWS", "Terraform", "CI/CD"],
  },
]

export function searchJobs(
  query = "",
  location = "",
  type = "",
  experienceLevel = "",
  remote: boolean | null = null,
): Job[] {
  return mockJobs.filter((job) => {
    const matchesQuery =
      !query ||
      job.title.toLowerCase().includes(query.toLowerCase()) ||
      job.company.toLowerCase().includes(query.toLowerCase()) ||
      job.skills.some((skill) => skill.toLowerCase().includes(query.toLowerCase())) ||
      job.department.toLowerCase().includes(query.toLowerCase())

    const matchesLocation = !location || job.location.toLowerCase().includes(location.toLowerCase())

    const matchesType = !type || job.type === type

    const matchesExperience = !experienceLevel || job.experienceLevel === experienceLevel

    const matchesRemote = remote === null || job.remote === remote

    return matchesQuery && matchesLocation && matchesType && matchesExperience && matchesRemote
  })
}

export function getFeaturedJobs(): Job[] {
  return mockJobs.filter((job) => job.featured).slice(0, 3)
}

export function getJobById(id: string): Job | undefined {
  return mockJobs.find((job) => job.id === id)
}

export function getJobsByEmployer(employerId: string): Job[] {
  return mockJobs.filter((job) => job.employerId === employerId)
}

export function updateJob(jobId: string, updates: Partial<Job>): Job | null {
  const jobIndex = mockJobs.findIndex((job) => job.id === jobId)
  if (jobIndex === -1) return null

  mockJobs[jobIndex] = { ...mockJobs[jobIndex], ...updates }
  return mockJobs[jobIndex]
}

export function deleteJob(jobId: string): boolean {
  const jobIndex = mockJobs.findIndex((job) => job.id === jobId)
  if (jobIndex === -1) return false

  mockJobs.splice(jobIndex, 1)
  return true
}

export function createJob(jobData: Omit<Job, "id" | "postedDate">): Job {
  const newJob: Job = {
    id: Date.now().toString(),
    postedDate: new Date(),
    ...jobData,
  }

  mockJobs.unshift(newJob)
  return newJob
}
