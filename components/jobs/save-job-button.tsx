"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth"
import { saveJob, unsaveJob, isJobSaved } from "@/lib/saved-jobs"
import { Heart } from "lucide-react"
import { useRouter } from "next/navigation"

interface SaveJobButtonProps {
  jobId: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
}

export function SaveJobButton({ jobId, variant = "outline", size = "default" }: SaveJobButtonProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setSaved(isJobSaved(jobId, user.id))
    }
  }, [user, jobId])

  const handleToggleSave = async () => {
    if (!user) {
      router.push("/login")
      return
    }

    setLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      if (saved) {
        unsaveJob(jobId, user.id)
        setSaved(false)
      } else {
        saveJob(jobId, user.id)
        setSaved(true)
      }
    } catch (error) {
      console.error("Failed to toggle save job:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggleSave}
      disabled={loading}
      className={`${saved ? "text-red-500 border-red-500 hover:text-red-600 hover:border-red-600" : ""}`}
    >
      <Heart className={`h-4 w-4 mr-2 ${saved ? "fill-current" : ""}`} />
      {loading ? "..." : saved ? "Saved" : "Save Job"}
    </Button>
  )
}
