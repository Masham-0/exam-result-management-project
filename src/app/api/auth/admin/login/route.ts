import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { adminID, password } = await request.json()

    if (!adminID || !password) {
      return NextResponse.json(
        { error: 'Admin ID and password are required' },
        { status: 400 }
      )
    }

    console.log('Looking for admin with admin_id:', adminID)

    // Find admin by ID
    const { data: admin, error } = await supabase
      .from('admins')
      .select('*')
      .eq('admin_id', adminID)
      .single()

    console.log('Admin query result:', { admin, error })

    if (error) {
      console.error('Admin lookup error:', error)
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404 }
      )
    }

    // Verify password (plain text comparison for now)
    if (admin.password !== password) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Get all data for admin dashboard
    const [studentsResult, teachersResult, branchesResult, subjectsResult, subjectOfferingsResult, resultsResult] = await Promise.all([
      supabase.from('students').select(`
        *,
        branch:branches (*)
      `),
      supabase.from('teachers').select('*'),
      supabase.from('branches').select('*'),
      supabase.from('subjects').select('*'),
      supabase.from('subject_offerings').select(`
        *,
        subject:subjects (*),
        branch:branches (*),
        teacher:teachers (*)
      `),
      supabase.from('results').select(`
        *,
        student:students (
          *,
          branch:branches (*)
        ),
        offering:subject_offerings (
          *,
          subject:subjects (*),
          branch:branches (*)
        )
      `)
    ])

    // Transform data to match frontend expectations
    const students = studentsResult.data?.map(student => ({
      rollNo: student.roll_no,
      firstName: student.first_name,
      lastName: student.last_name,
      dateOfBirth: student.date_of_birth,
      branchCode: student.branch_code,
      branch: student.branch ? {
        branchCode: student.branch.branch_code,
        branchName: student.branch.branch_name
      } : null
    })) || []

    const teachers = teachersResult.data?.map(teacher => ({
      teacherID: teacher.teacher_id,
      teacherName: teacher.teacher_name,
      password: teacher.password
    })) || []

    const branches = branchesResult.data?.map(branch => ({
      branchCode: branch.branch_code,
      branchName: branch.branch_name
    })) || []

    const subjects = subjectsResult.data?.map(subject => ({
      subjectCode: subject.subject_code,
      subjectName: subject.subject_name
    })) || []

    const subjectOfferings = subjectOfferingsResult.data?.map(offering => ({
      offeringID: offering.offering_id,
      subjectCode: offering.subject_code,
      branchCode: offering.branch_code,
      semester: offering.semester,
      credits: offering.credits,
      assignedTeacherID: offering.assigned_teacher_id,
      subject: offering.subject,
      branch: offering.branch,
      teacher: offering.teacher
    })) || []

    const results = resultsResult.data?.map(result => ({
      rollNo: result.roll_no,
      offeringID: result.offering_id,
      theoryMarks: result.theory_marks,
      internalMarks: result.internal_marks,
      totalMarks: result.total_marks,
      gradePoint: result.grade_point,
      status: result.status,
      student: result.student ? {
        rollNo: result.student.roll_no,
        firstName: result.student.first_name,
        lastName: result.student.last_name,
        branch: result.student.branch ? {
          branchCode: result.student.branch.branch_code,
          branchName: result.student.branch.branch_name
        } : null
      } : null,
      offering: result.offering ? {
        offeringID: result.offering.offering_id,
        subject: result.offering.subject,
        branch: result.offering.branch
      } : null
    })) || []

    // Return admin data with all dashboard data
    const adminData = {
      adminID: admin.admin_id,
      username: admin.username,
      students,
      teachers,
      branches,
      subjects,
      subjectOfferings,
      results
    }

    console.log('Login successful for admin:', adminData)

    return NextResponse.json({
      message: 'Login successful',
      admin: adminData
    })

  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}