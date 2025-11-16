// Supabase Configuration for Exam Result Management System
// This file contains the schema and setup instructions for migrating to Supabase

/*
MIGRATION STEPS TO SUPABASE:

1. Create a new Supabase project
2. Run the following SQL in the Supabase SQL Editor:

-- Create Branches table
CREATE TABLE branches (
  branch_code VARCHAR(10) PRIMARY KEY,
  branch_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Subjects table
CREATE TABLE subjects (
  subject_code VARCHAR(20) PRIMARY KEY,
  subject_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Teachers table
CREATE TABLE teachers (
  teacher_id VARCHAR(20) PRIMARY KEY,
  teacher_name VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL, -- In production, use hashed passwords
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Students table
CREATE TABLE students (
  roll_no VARCHAR(20) PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  date_of_birth VARCHAR(8) NOT NULL, -- YYYYMMDD format
  branch_code VARCHAR(10) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (branch_code) REFERENCES branches(branch_code)
);

-- Create Subject Offerings table
CREATE TABLE subject_offerings (
  offering_id VARCHAR(20) PRIMARY KEY,
  subject_code VARCHAR(20) NOT NULL,
  branch_code VARCHAR(10) NOT NULL,
  semester VARCHAR(10) NOT NULL,
  credits VARCHAR(5) NOT NULL,
  assigned_teacher_id VARCHAR(20) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (subject_code) REFERENCES subjects(subject_code),
  FOREIGN KEY (branch_code) REFERENCES branches(branch_code),
  FOREIGN KEY (assigned_teacher_id) REFERENCES teachers(teacher_id)
);

-- Create Teacher-Subject assignments table
CREATE TABLE teacher_subjects (
  teacher_id VARCHAR(20) NOT NULL,
  offering_id VARCHAR(20) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (teacher_id, offering_id),
  FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id),
  FOREIGN KEY (offering_id) REFERENCES subject_offerings(offering_id)
);

-- Create Results table
CREATE TABLE results (
  roll_no VARCHAR(20) NOT NULL,
  offering_id VARCHAR(20) NOT NULL,
  theory_marks VARCHAR(5) NOT NULL,
  internal_marks VARCHAR(5) NOT NULL,
  total_marks VARCHAR(5) NOT NULL,
  grade_point VARCHAR(5) NOT NULL,
  status VARCHAR(10) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (roll_no, offering_id),
  FOREIGN KEY (roll_no) REFERENCES students(roll_no),
  FOREIGN KEY (offering_id) REFERENCES subject_offerings(offering_id)
);

-- Create Admin table
CREATE TABLE admins (
  admin_id VARCHAR(20) PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL, -- In production, use hashed passwords
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_students_branch ON students(branch_code);
CREATE INDEX idx_students_roll_no ON students(roll_no);
CREATE INDEX idx_subject_offerings_subject ON subject_offerings(subject_code);
CREATE INDEX idx_subject_offerings_branch ON subject_offerings(branch_code);
CREATE INDEX idx_subject_offerings_teacher ON subject_offerings(assigned_teacher_id);
CREATE INDEX idx_results_student ON results(roll_no);
CREATE INDEX idx_results_offering ON results(offering_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_branches_updated_at BEFORE UPDATE ON branches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subjects_updated_at BEFORE UPDATE ON subjects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teachers_updated_at BEFORE UPDATE ON teachers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subject_offerings_updated_at BEFORE UPDATE ON subject_offerings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teacher_subjects_updated_at BEFORE UPDATE ON teacher_subjects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_results_updated_at BEFORE UPDATE ON results FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

3. Update the .env file with Supabase credentials:
   DATABASE_URL="postgresql://username:password@host:port/database"
   NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"

4. Update the Prisma schema to use PostgreSQL:
   Change provider from "sqlite" to "postgresql"

5. Run: npx prisma db push

6. Update the database client configuration if needed

SECURITY NOTES:
- In production, always hash passwords using bcrypt
- Use Row Level Security (RLS) in Supabase
- Implement proper JWT token handling
- Use environment variables for sensitive data
- Consider using Supabase Auth for authentication

PERFORMANCE OPTIMIZATIONS:
- The indexes above will improve query performance
- Consider connection pooling for high traffic
- Use Supabase Edge Functions for complex business logic
- Implement proper caching strategies

*/

export const SUPABASE_CONFIG = {
  // This configuration will be used when migrating to Supabase
  database: {
    provider: "postgresql",
    url: process.env.DATABASE_URL,
  },
  auth: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  // Connection pooling configuration
  pool: {
    min: 2,
    max: 10,
  },
}

// Migration helper functions
export const migrateToSupabase = {
  // Function to check if Supabase is configured
  isConfigured: () => {
    return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  },
  
  // Function to get database provider
  getProvider: () => {
    return process.env.DATABASE_URL?.includes('postgresql') ? 'postgresql' : 'sqlite'
  },
  
  // Function to validate configuration
  validateConfig: () => {
    const required = ['DATABASE_URL']
    const optional = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY']
    
    const missing = required.filter(key => !process.env[key])
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
    }
    
    return true
  }
}