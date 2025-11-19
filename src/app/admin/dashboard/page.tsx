"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Shield,
  Users,
  BookOpen,
  Search,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AdminData {
  adminID: string;
  username: string;
  students: Array<{
    rollNo: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    branch: {
      branchCode: string;
      branchName: string;
    };
    results: Array<{
      offering: {
        offeringID: string;
        subject: {
          subjectCode: string;
          subjectName: string;
        };
        branch: {
          branchCode: string;
          branchName: string;
        };
        semester: string;
        credits: string;
      };
      theoryMarks: string;
      internalMarks: string;
      totalMarks: string;
      gradePoint: string;
      status: string;
    }>;
  }>;
  teachers: Array<{
    teacherID: string;
    teacherName: string;
    subjectOfferings: Array<{
      offeringID: string;
      subject: {
        subjectCode: string;
        subjectName: string;
      };
      branch: {
        branchCode: string;
        branchName: string;
      };
      semester: string;
      credits: string;
    }>;
  }>;
  branches: Array<{
    branchCode: string;
    branchName: string;
    students: Array<any>;
    subjectOfferings: Array<any>;
  }>;
  subjects: Array<{
    subjectCode: string;
    subjectName: string;
    subjectOfferings: Array<{
      branch: {
        branchCode: string;
        branchName: string;
      };
      teacher: {
        teacherID: string;
        teacherName: string;
      };
    }>;
  }>;
  subjectOfferings: Array<{
    offeringID: string;
    subject: {
      subjectCode: string;
      subjectName: string;
    };
    branch: {
      branchCode: string;
      branchName: string;
    };
    semester: string;
    credits: string;
    teacher: {
      teacherID: string;
      teacherName: string;
    };
    results: Array<{
      student: {
        rollNo: string;
        firstName: string;
        lastName: string;
      };
    }>;
  }>;
  results: Array<{
    student: {
      rollNo: string;
      firstName: string;
      lastName: string;
      branch: {
        branchCode: string;
        branchName: string;
      };
    };
    offering: {
      offeringID: string;
      subject: {
        subjectCode: string;
        subjectName: string;
      };
      branch: {
        branchCode: string;
        branchName: string;
      };
    };
    theoryMarks: string;
    internalMarks: string;
    totalMarks: string;
    gradePoint: string;
    status: string;
  }>;
}

export default function AdminDashboard() {
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const data = localStorage.getItem("adminData");
    if (!data) {
      toast.error("Please login first");
      router.push("/admin/login");
      return;
    }

    try {
      const parsedData = JSON.parse(data);
      setAdminData(parsedData);
    } catch (error) {
      toast.error("Invalid session data");
      router.push("/admin/login");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("adminData");
    toast.success("Logged out successfully");
    router.push("/");
  };

  const getFilteredResults = () => {
    if (!adminData) return [];

    let filtered = adminData.results || [];

    const term = (searchTerm || "").trim().toLowerCase();

    if (term) {
      filtered = filtered.filter((result) => {
        const roll = result?.student?.rollNo ?? "";
        const first = result?.student?.firstName ?? "";
        const last = result?.student?.lastName ?? "";
        const subjCode = result?.offering?.subject?.subjectCode ?? "";
        const subjName = result?.offering?.subject?.subjectName ?? "";
        const branchCode = result?.student?.branch?.branchCode ?? "";

        return (
          roll.toLowerCase().includes(term) ||
          first.toLowerCase().includes(term) ||
          last.toLowerCase().includes(term) ||
          subjCode.toLowerCase().includes(term) ||
          subjName.toLowerCase().includes(term) ||
          branchCode.toLowerCase().includes(term)
        );
      });
    }

    if (filterBy !== "all") {
      filtered = filtered.filter((result) => {
        const branchCode = result?.student?.branch?.branchCode ?? "";
        const subjCode = result?.offering?.subject?.subjectCode ?? "";
        const status = result?.status ?? "";

        switch (filterBy) {
          case "branch":
            return branchCode.toLowerCase().includes(term);
          case "subject":
            return subjCode.toLowerCase().includes(term);
          case "status":
            return status.toLowerCase().includes(term);
          default:
            return true;
        }
      });
    }

    return filtered;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!adminData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">No admin data found</p>
          <Button asChild>
            <Link href="/admin/login">Go to Login</Link>
          </Button>
        </div>
      </div>
    );
  }

  const filteredResults = getFilteredResults();

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
                <Shield className="w-5 h-5 text-primary" />
                <span className="font-semibold">Admin Dashboard</span>
                <span className="text-muted-foreground">
                  ({adminData.adminID})
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
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Students
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {adminData.students?.length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Registered students
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Teachers
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {adminData.teachers?.length || 0}
              </div>
              <p className="text-xs text-muted-foreground">Active teachers</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Branches
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {adminData.branches?.length || 0}
              </div>
              <p className="text-xs text-muted-foreground">Academic branches</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Results
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {adminData.results?.length || 0}
              </div>
              <p className="text-xs text-muted-foreground">Exam results</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Branch Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold mb-4">Branch Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminData.branches?.map((branch, index) => (
              <motion.div
                key={branch.branchCode}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-primary/20 hover:border-primary/40">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {branch.branchCode}
                    </CardTitle>
                    <CardDescription>{branch.branchName}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Students:</span>
                        <span className="font-medium">
                          {adminData.students?.filter((s) => {
                            const studentBranchCode =
                              (s as any)?.branch?.branchCode ??
                              (s as any)?.branchCode ??
                              "";
                            return studentBranchCode === branch.branchCode;
                          }).length || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subjects:</span>
                        <span className="font-medium">
                          {adminData.subjectOfferings?.filter((o) => {
                            const offeringBranchCode =
                              (o as any)?.branch?.branchCode ??
                              (o as any)?.branchCode ??
                              "";
                            return offeringBranchCode === branch.branchCode;
                          }).length || 0}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Search Results</CardTitle>
              <CardDescription>
                Search by roll number, name, subject, or branch
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="w-40">
                  <Select value={filterBy} onValueChange={setFilterBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="branch">Branch</SelectItem>
                      <SelectItem value="subject">Subject</SelectItem>
                      <SelectItem value="status">Status</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Roll No</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Total Marks</TableHead>
                    <TableHead>Grade Point</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResults.slice(0, 10).map((result, index) => (
                    <motion.tr
                      key={`${result.student.rollNo}-${result.offering.offeringID}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <TableCell className="font-medium">
                        {result.student.rollNo}
                      </TableCell>
                      <TableCell>
                        {result.student.firstName} {result.student.lastName}
                      </TableCell>
                      <TableCell>{result.student.branch.branchCode}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {result.offering.subject.subjectCode}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {result.offering.subject.subjectName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {result.totalMarks}
                      </TableCell>
                      <TableCell>{result.gradePoint}</TableCell>
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

              {filteredResults.length > 10 && (
                <div className="text-center mt-4 text-sm text-muted-foreground">
                  Showing 10 of {filteredResults.length} results
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
