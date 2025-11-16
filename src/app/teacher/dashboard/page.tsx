"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { motion } from "framer-motion"
import { ArrowLeft, Users, BookOpen, Search } from "lucide-react"
import { toast } from "sonner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TeacherData {
  teacherID: string
  teacherName: string
  subjectOfferings: Array<{
    offeringID: string
    subject: {
      subjectCode: string
      subjectName: string
    }
    branch: {
      branchCode: string
      branchName: string
    }
    semester: string
    credits: string
    results: Array<{
      student: {
        rollNo: string
        firstName: string
        lastName: string
        dateOfBirth: string
        branch: {
          branchCode: string
          branchName: string
        }
      }
      theoryMarks: string
      internalMarks: string
      totalMarks: string
      gradePoint: string
      status: string
    }>
  }>
}

export default function TeacherDashboard() {
  const [teacherData, setTeacherData] = useState<TeacherData | null>(null)
  const [selectedOffering, setSelectedOffering] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<string>("rollNo")
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const data = localStorage.getItem("teacherData")
    if (!data) {
      toast.error("Please login first")
      router.push("/teacher/login")
      return
    }

    try {
      const parsedData = JSON.parse(data)
      setTeacherData(parsedData)
    } catch (error) {
      toast.error("Invalid session data")
      router.push("/teacher/login")
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("teacherData")
    toast.success("Logged out successfully")
    router.push("/")
  }

  const getSortedResults = (results: any[]) => {
    const sorted = [...results].sort((a, b) => {
      switch (sortBy) {
        case "rollNo":
          const rollA = a.student?.rollNo || ''
          const rollB = b.student?.rollNo || ''
          return rollA.localeCompare(rollB)
        case "totalMarks":
          const marksA = parseInt(a.totalMarks || '0')
          const marksB = parseInt(b.totalMarks || '0')
          return marksB - marksA
        case "dateOfBirth":
          const dobA = a.student?.dateOfBirth || ''
          const dobB = b.student?.dateOfBirth || ''
          return dobA.localeCompare(dobB)
        default:
          return 0
      }
    })
    return sorted
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (!teacherData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">No teacher data found</p>
          <Button asChild>
            <Link href="/teacher/login">Go to Login</Link>
          </Button>
        </div>
      </div>
    )
  }

  const selectedOfferingData = teacherData.subjectOfferings.find(
    offering => offering.offeringID === selectedOffering
  )

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
                <Users className="w-5 h-5 text-primary" />
                <span className="font-semibold">{teacherData.teacherName}</span>
                <span className="text-muted-foreground">({teacherData.teacherID})</span>
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
        {/* Subject Offerings Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold mb-4">Your Subject Offerings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teacherData.subjectOfferings.map((offering, index) => (
              <motion.div
                key={offering.offeringID}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="cursor-pointer"
                onClick={() => setSelectedOffering(offering.offeringID)}
              >
                <Card className={`h-full hover:shadow-lg transition-all duration-300 ${
                  selectedOffering === offering.offeringID ? 'ring-2 ring-primary' : 'border-primary/20 hover:border-primary/40'
                }`}>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-5 h-5 text-primary" />
                      <CardTitle className="text-lg">{offering.subject.subjectCode}</CardTitle>
                    </div>
                    <CardDescription>{offering.subject.subjectName}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Branch:</span>
                        <span className="font-medium">{offering.branch.branchCode}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Semester:</span>
                        <span className="font-medium">{offering.semester}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Credits:</span>
                        <span className="font-medium">{offering.credits}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Students:</span>
                        <span className="font-medium">{offering.results.length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Student Results Table */}
        {selectedOfferingData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Student Results</CardTitle>
                    <CardDescription>
                      {selectedOfferingData.subject.subjectCode} - {selectedOfferingData.subject.subjectName}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-muted-foreground" />
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rollNo">Roll Number</SelectItem>
                        <SelectItem value="totalMarks">Total Marks</SelectItem>
                        <SelectItem value="dateOfBirth">Date of Birth</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Roll No</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Branch</TableHead>
                      <TableHead>Theory Marks</TableHead>
                      <TableHead>Internal Marks</TableHead>
                      <TableHead>Total Marks</TableHead>
                      <TableHead>Grade Point</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getSortedResults(selectedOfferingData.results).map((result, index) => (
                      <motion.tr
                        key={result.student?.rollNo || index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <TableCell className="font-medium">{result.student?.rollNo || 'N/A'}</TableCell>
                        <TableCell>
                          {result.student?.firstName || ''} {result.student?.lastName || ''}
                        </TableCell>
                        <TableCell>{result.student?.branch?.branchCode || 'N/A'}</TableCell>
                        <TableCell>{result.theoryMarks || '0'}</TableCell>
                        <TableCell>{result.internalMarks || '0'}</TableCell>
                        <TableCell className="font-semibold">{result.totalMarks || '0'}</TableCell>
                        <TableCell>{result.gradePoint || '0'}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              result.status === "Pass"
                                ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                                : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                            }`}
                          >
                            {result.status || 'N/A'}
                          </span>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  )
}