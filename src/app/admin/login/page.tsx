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
import { ArrowLeft, Shield, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function AdminLogin() {
  const [adminID, setAdminID] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ adminID, password }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Login successful! Redirecting...")
        localStorage.setItem("adminData", JSON.stringify(data.admin))
        
        // Add a small delay for better UX
        setTimeout(() => {
          router.push("/admin/dashboard")
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
              <Shield className="w-8 h-8 text-primary" />
            </motion.div>
            <CardTitle className="text-2xl">Admin Login</CardTitle>
            <CardDescription>
              Enter your admin credentials to access the full system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="adminID">Admin ID</Label>
                <Input
                  id="adminID"
                  type="text"
                  placeholder="e.g., ADMIN001"
                  value={adminID}
                  onChange={(e) => setAdminID(e.target.value)}
                  required
                  className="transition-all duration-300 focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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