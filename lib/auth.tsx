"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

export type UserRole = "employer" | "candidate"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  company?: string
  title?: string
  location?: string
  bio?: string
  skills?: string[]
  experience?: string
  createdAt: Date
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (
    email: string,
    password: string,
    name: string,
    role: UserRole,
    additionalData?: Partial<User>,
  ) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: "1",
    email: "employer@example.com",
    name: "John Smith",
    role: "employer",
    company: "TechCorp Inc.",
    title: "HR Manager",
    location: "San Francisco, CA",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    email: "candidate@example.com",
    name: "Sarah Johnson",
    role: "candidate",
    title: "Frontend Developer",
    location: "New York, NY",
    bio: "Passionate frontend developer with 3 years of experience in React and TypeScript.",
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    experience: "3 years",
    createdAt: new Date("2024-02-01"),
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("jobboard_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const foundUser = mockUsers.find((u) => u.email === email)
    if (foundUser && password === "password") {
      setUser(foundUser)
      localStorage.setItem("jobboard_user", JSON.stringify(foundUser))
      setLoading(false)
      return true
    }

    setLoading(false)
    return false
  }

  const register = async (
    email: string,
    password: string,
    name: string,
    role: UserRole,
    additionalData?: Partial<User>,
  ): Promise<boolean> => {
    setLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if user already exists
    if (mockUsers.find((u) => u.email === email)) {
      setLoading(false)
      return false
    }

    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      role,
      createdAt: new Date(),
      ...additionalData,
    }

    mockUsers.push(newUser)
    setUser(newUser)
    localStorage.setItem("jobboard_user", JSON.stringify(newUser))
    setLoading(false)
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("jobboard_user")
  }

  return <AuthContext.Provider value={{ user, login, register, logout, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
