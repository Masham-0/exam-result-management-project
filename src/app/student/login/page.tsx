"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ThemeToggle } from "@/components/theme-toggle"
import { motion } from "framer-motion"
import { ArrowLeft, User, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

export default function StudentLogin() {
  const [rollNo, setRollNo] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/student/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rollNo, dateOfBirth }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Login successful! Redirecting...")
        // Store student data in localStorage for dashboard use
        localStorage.setItem("studentData", JSON.stringify(data.student))
        
        // Add a small delay for better UX
        setTimeout(() => {
          router.push("/student/dashboard")
        }, 1000)
      } else {
        toast.error(data.error || "Login failed")
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
      <ThemeToggle />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-lg border-primary/20">
          <CardHeader className="text-center">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center"
            >
              <User className="w-8 h-8 text-primary" />
            </motion.div>
            <CardTitle className="text-2xl">Student Login</CardTitle>
            <CardDescription>
              Enter your roll number and date of birth to access your results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rollNo">Roll Number</Label>
                <Input
                  id="rollNo"
                  type="text"
                  placeholder="e.g., 2024UCM2376"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  required
                  className="transition-all duration-300 focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth (YYYYMMDD)</Label>
                <Input
                  id="dateOfBirth"
                  type="text"
                  placeholder="e.g., 20050521"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  required
                  className="transition-all duration-300 focus:ring-2 focus:ring-primary"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full transition-all duration-300 hover:scale-105" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <Button asChild variant="outline" className="transition-all duration-300">
                <Link href="/" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}