🎓 Exam Result Management System

A modern, clean, role-based academic result management system built using Next.js, TypeScript, TailwindCSS, shadcn/ui, and Prisma.
This platform provides separate dashboards for Students, Teachers, and Admins, each with highly specific functionality.

https://examresult.vercel.app/

About the Project :
https://docs.google.com/document/d/1rV3lXFI_HmSxuWDrZ4a4SjcP2QV1xc89XR3UJcDVxBE/edit?usp=sharing

Test Login Credentials for the Project :<br />
As a Student : <br />
ID - 2024UCM2376<br />
Password - 20050521<br />

As a teacher - T010<br />
ID - password123<br />

As an Admin - <br />
ID - ADMIN001<br />
password - admin123<br />

🚀 Key Features<br />
🔵 Student<br />

Subject-wise result view<br />
Date-of-birth login (YYYYMMDD)<br />
Automatic credit-weighted CG calculation<br />
Pass/Fail status per subject<br />
Minimal, distraction-free dashboard<br />

🟢 Teacher<br />

TeacherID-based login<br />
View results of assigned subject offerings<br />
Sortable result tables (by marks, age, roll number)<br />
Clean interface customized for academic staff<br />

🔴 Admin<br />

Complete access to all results and student data<br />
Search by name, roll number, subject, or branch<br />
Branch overview dashboard<br />
Absolute control over academic records<br />

🧱 Tech Stack<br />

Next.js (App Router)<br />
TypeScript<br />
TailwindCSS + shadcn/ui<br />
Prisma ORM<br />
SQL Database<br />
Vercel for hosting<br />

🗃 Database Schema (Core Models)<br />
Table	Fields<br />
STUDENT	rollNo (PK), firstName, lastName, dateOfBirth, branchCode (FK)<br />
BRANCH	branchCode (PK), branchName<br />
SUBJECT	subjectCode (PK), subjectName<br />
SUBJECTOFFERING	offeringID (PK), subjectCode (FK), branchCode (FK), semester, credits, assignedTeacherID (FK)<br />
TEACHER	teacherID (PK), teacherName, password<br />
TEACHERSUBJECT	teacherID (FK), offeringID (FK), PK(teacherID, offeringID)<br />
RESULT	rollNo (FK), offeringID (FK), theoryMarks, internalMarks, totalMarks, gradePoint, status, PK(rollNo, offeringID)<br />
ADMIN	adminID (PK), username, password<br />
🏛 System Architecture<br />

Frontend: Next.js App Router, Server Components, TailwindCSS, shadcn UI<br />
Backend: Next.js Route Handlers, Prisma Client, Secure Authentication<br />
Database: Fully normalized SQL schema with relational integrity<br />
Deployment: Vercel (auto-build, auto-routing, edge support)<br />

▶️ Running Locally<br />

Clone the repository<br />
git clone https://github.com/Masham-0/exam-result-management-project<br />
Install dependencies<br />
npm install<br />

Run development server<br />
npm run dev<br />
App starts at: [http://localhost:3000](https://examresult.vercel.app/)<br />

Build for production<br />
npm run build<br />

🧩 Project Structure
project/<br />
 ├── app/<br />
 ├── components/<br />
 ├── lib/<br />
 ├── public/<br />
 ├── styles/<br />
 ├── next.config.ts<br />
 ├── tailwind.config.ts<br />
 ├── package.json<br />
 └── README.md<br />

🎯 Future Enhancements<br />

CSV bulk upload<br />
PDF marksheet generator<br />
Teacher remarks system<br />
Parent login portal<br />
Branch-wise analytics dashboard<br />

📝 License<br />

This project is intended for academic and educational use.<br />

❤️ Acknowledgments<br />

Next.js<br />
Vercel<br />
Supabase<br />
TailwindCSS<br />
Shadcn UI<br />
