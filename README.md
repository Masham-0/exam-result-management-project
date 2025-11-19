🎓 Exam Result Management System

A modern, clean, role-based academic result management system built using Next.js, TypeScript, TailwindCSS, shadcn/ui, and Prisma.
This platform provides separate dashboards for Students, Teachers, and Admins, each with highly specific functionality.

https://examresult.vercel.app/

About the Project :
https://docs.google.com/document/d/1rV3lXFI_HmSxuWDrZ4a4SjcP2QV1xc89XR3UJcDVxBE/edit?usp=sharing

Test Login Credentials for the Project :
As a Student : 
ID - 2024UCM2376
Password - 20050521

As a teacher - 
ID - T

🚀 Key Features
🔵 Student

Subject-wise result view
Date-of-birth login (YYYYMMDD)
Automatic credit-weighted CG calculation
Pass/Fail status per subject
Minimal, distraction-free dashboard

🟢 Teacher

TeacherID-based login
View results of assigned subject offerings
Sortable result tables (by marks, age, roll number)
Clean interface customized for academic staff

🔴 Admin

Complete access to all results and student data
Search by name, roll number, subject, or branch
Branch overview dashboard
Absolute control over academic records

🧱 Tech Stack

Next.js (App Router)
TypeScript
TailwindCSS + shadcn/ui
Prisma ORM
SQL Database
Framer Motion Animations
Vercel for hosting

🗃 Database Schema (Core Models)
Table	Fields
STUDENT	rollNo (PK), firstName, lastName, dateOfBirth, branchCode (FK)
BRANCH	branchCode (PK), branchName
SUBJECT	subjectCode (PK), subjectName
SUBJECTOFFERING	offeringID (PK), subjectCode (FK), branchCode (FK), semester, credits, assignedTeacherID (FK)
TEACHER	teacherID (PK), teacherName, password
TEACHERSUBJECT	teacherID (FK), offeringID (FK), PK(teacherID, offeringID)
RESULT	rollNo (FK), offeringID (FK), theoryMarks, internalMarks, totalMarks, gradePoint, status, PK(rollNo, offeringID)
ADMIN	adminID (PK), username, password
🏛 System Architecture

Frontend: Next.js App Router, Server Components, TailwindCSS, shadcn UI
Backend: Next.js Route Handlers, Prisma Client, Secure Authentication
Database: Fully normalized SQL schema with relational integrity
Deployment: Vercel (auto-build, auto-routing, edge support)

▶️ Running Locally

Clone the repository
git clone https://github.com/Masham-0/exam-result-management-project
Install dependencies
npm install

Run development server
npm run dev
App starts at: [http://localhost:3000](https://examresult.vercel.app/)

Build for production
npm run build

🌐 Deploy on Vercel (Recommended)

Select "Import Git Repository" on Vercel
Choose your project
Vercel auto-detects Next.js and deploys automatically
Your app becomes instantly accessible via HTTPS

🧩 Project Structure
project/
 ├── app/
 ├── components/
 ├── lib/
 ├── prisma/
 ├── public/
 ├── styles/
 ├── next.config.ts
 ├── tailwind.config.ts
 ├── package.json
 └── README.md

🎯 Future Enhancements

CSV bulk upload
PDF marksheet generator
Teacher remarks system
Parent login portal
Branch-wise analytics dashboard

📝 License

This project is intended for academic and educational use.

❤️ Acknowledgments

Next.js
Vercel
Prisma
TailwindCSS
Shadcn UI
