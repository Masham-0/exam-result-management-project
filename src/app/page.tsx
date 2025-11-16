"use client";

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
import { User, Users, Shield } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="m-4">
        <ThemeToggle />
      </div>

      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-4">
            Exam Result Management System
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            A comprehensive platform for managing student results, teacher
            subjects, and administrative oversight
          </p>
        </motion.div>

        {/* Login Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12"
        >
          {/* Student Card */}
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Card className="h-full hover:shadow-lg transition-all duration-300 border-primary/20 hover:border-primary/40">
              <CardHeader className="text-center">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center"
                >
                  <User className="w-8 h-8 text-primary" />
                </motion.div>
                <CardTitle className="text-xl">Student</CardTitle>
                <CardDescription>
                  View your exam results and calculate CGPA
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button
                  asChild
                  className="w-full transition-all duration-300 hover:scale-105"
                >
                  <Link href="/student/login">Login</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Teacher Card */}
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Card className="h-full hover:shadow-lg transition-all duration-300 border-primary/20 hover:border-primary/40">
              <CardHeader className="text-center">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center"
                >
                  <Users className="w-8 h-8 text-primary" />
                </motion.div>
                <CardTitle className="text-xl">Teacher</CardTitle>
                <CardDescription>
                  Subject results and student data
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button
                  asChild
                  className="w-full transition-all duration-300 hover:scale-105"
                >
                  <Link href="/teacher/login">Login</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Admin Card */}
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Card className="h-full hover:shadow-lg transition-all duration-300 border-primary/20 hover:border-primary/40">
              <CardHeader className="text-center">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center"
                >
                  <Shield className="w-8 h-8 text-primary" />
                </motion.div>
                <CardTitle className="text-xl">Admin</CardTitle>
                <CardDescription>
                  Full system access and management
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button
                  asChild
                  className="w-full transition-all duration-300 hover:scale-105"
                >
                  <Link href="/admin/login">Login</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Features Section */}
        {/* <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 rounded-lg bg-muted/50"
            >
              <h3 className="font-semibold mb-2">📊 Real-time Results</h3>
              <p className="text-sm text-muted-foreground">
                Instant access to exam results and performance metrics
              </p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 rounded-lg bg-muted/50"
            >
              <h3 className="font-semibold mb-2">🔐 Secure Access</h3>
              <p className="text-sm text-muted-foreground">
                Role-based authentication for all users
              </p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 rounded-lg bg-muted/50"
            >
              <h3 className="font-semibold mb-2">📈 CGPA Calculator</h3>
              <p className="text-sm text-muted-foreground">
                Automatic grade point and CGPA calculation
              </p>
            </motion.div>
          </div>
        </motion.div> */}
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="border-t bg-muted/30 absolute bottom-0 left-0 right-0"
      >
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-sm text-muted-foreground">
            Made by <strong>Mohammad Masham</strong>,{" "}
            <strong>Ahaan Avi Arya</strong> and <strong>Krishna Agarwal</strong>{" "}
            under the guidance of <strong>Anand Gupta Sir</strong> in 2025
          </p>
        </div>
      </motion.footer>
    </div>
  );
}
