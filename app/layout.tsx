import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/lib/auth"
import { Header } from "@/components/layout/header"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "JobBoard - Find Your Next Opportunity",
  description: "Connect employers with talented job seekers",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <AuthProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <Header />
            <main className="min-h-screen">{children}</main>
          </Suspense>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
