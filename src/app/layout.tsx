import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Exam Result Management System",
  description:
    "A comprehensive platform for managing student results, teacher subjects, and administrative oversight",
  keywords: [
    "Exam Results",
    "Student Management",
    "Teacher Portal",
    "Admin Dashboard",
  ],
  authors: [{ name: "Exam Management System" }],
  icons: {
    icon: "https://i.ibb.co/v46sskxd/image.png",
  },
  openGraph: {
    title: "Exam Result Management System",
    description:
      "A comprehensive platform for managing student results, teacher subjects, and administrative oversight",
    siteName: "Exam Management System",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Exam Result Management System",
    description:
      "A comprehensive platform for managing student results, teacher subjects, and administrative oversight",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <SonnerToaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
