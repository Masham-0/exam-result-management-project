"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { motion } from "framer-motion"
import { ArrowLeft, User, BookOpen, Award, TrendingUp } from "lucide-react"
import { toast } from "sonner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface StudentData {
  rollNo: string
  firstName: string
  lastName: string
  branchCode?: string
  branch?: {
    branchCode: string
    branchName: string
  }
  results: Array<{
    offering: {
      offeringID: string
      subject: {
        subjectCode: string
        subjectName: string
      }
      semester: string
      credits: string
    }
    theoryMarks: string
    internalMarks: string
    totalMarks: string
    gradePoint: string
    status: string
    credits: number
    gradePoint: number
  }>
  cgpa: string
}

export default function StudentDashboard() {
  const [studentData, setStudentData] = useState<StudentData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const data = localStorage.getItem("studentData")
    if (!data) {
      toast.error("Please login first")
      router.push("/student/login")
      return
    }

    try {
      const parsedData = JSON.parse(data)
      setStudentData(parsedData)
    } catch (error) {
      toast.error("Invalid session data")
      router.push("/student/login")
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("studentData")
    toast.success("Logged out successfully")
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (!studentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">No student data found</p>
          <Button asChild>
            <Link href="/student/login">Go to Login</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <header className="border-b bg-background/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button asChild variant="outline" size="sm">
                <Link href="/" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Home
                </Link>
              </Button>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                <span className="font-semibold">
                  {studentData.firstName} {studentData.lastName}
                </span>
                <span className="text-muted-foreground">
                  ({studentData.rollNo})
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button onClick={handleLogout} variant="outline" size="sm">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Student Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Branch</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studentData.branch?.branchCode || studentData.branchCode || 'N/A'}</div>
              <p className="text-xs text-muted-foreground">{studentData.branch?.branchName || 'Branch not assigned'}</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studentData.results?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Enrolled subjects</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">CGPA</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studentData.cgpa}</div>
              <p className="text-xs text-muted-foreground">Cumulative Grade Point</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Pass</div>
              <p className="text-xs text-muted-foreground">Overall Status</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Subject Results</CardTitle>
              <CardDescription>
                Detailed view of your performance across all subjects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject Code</TableHead>
                    <TableHead>Subject Name</TableHead>
                    <TableHead>Semester</TableHead>
                    <TableHead>Theory Marks</TableHead>
                    <TableHead>Internal Marks</TableHead>
                    <TableHead>Total Marks</TableHead>
                    <TableHead>Grade Point</TableHead>
                    <TableHead>Credits</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentData.results?.map((result, index) => (
                    <motion.tr
                      key={result.offering.offeringID}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <TableCell className="font-medium">{result.offering.subject.subjectCode}</TableCell>
                      <TableCell>{result.offering.subject.subjectName}</TableCell>
                      <TableCell>{result.offering.semester}</TableCell>
                      <TableCell>{result.theoryMarks}</TableCell>
                      <TableCell>{result.internalMarks}</TableCell>
                      <TableCell className="font-semibold">{result.totalMarks}</TableCell>
                      <TableCell>{result.gradePoint}</TableCell>
                      <TableCell>{result.credits}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            result.status === "Pass"
                              ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                              : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                          }`}
                        >
                          {result.status}
                        </span>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}