import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { teacherID, password } = await request.json()

    if (!teacherID || !password) {
      return NextResponse.json(
        { error: 'Teacher ID and password are required' },
        { status: 400 }
      )
    }

    console.log('Looking for teacher with teacher_id:', teacherID)

    // Find teacher by ID
    const { data: teacher, error } = await supabase
      .from('teachers')
      .select('*')
      .eq('teacher_id', teacherID)
      .single()

    console.log('Teacher query result:', { teacher, error })

    if (error) {
      console.error('Teacher lookup error:', error)
      return NextResponse.json(
        { error: 'Teacher not found' },
        { status: 404 }
      )
    }

    // Verify password (plain text comparison for now)
    if (teacher.password !== password) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Get subject offerings for this teacher
    const { data: subjectOfferings, error: offeringsError } = await supabase
      .from('subject_offerings')
      .select(`
        *,
        subject:subjects (*),
        branch:branches (*),
        results:results (
          *,
          student:students (
            *,
            branch:branches (*)
          )
        )
      `)
      .eq('assigned_teacher_id', teacherID)

    console.log('Subject offerings query result:', { subjectOfferings, offeringsError })

    if (offeringsError) {
      console.error('Subject offerings lookup error:', offeringsError)
    }

    // Process subject offerings
    const processedOfferings = subjectOfferings?.map(offering => ({
      offeringID: offering.offering_id,
      subjectCode: offering.subject_code,
      subjectName: offering.subject?.subject_name || 'Unknown Subject',
      branchCode: offering.branch_code,
      branchName: offering.branch?.branch_name || 'Unknown Branch',
      semester: offering.semester,
      credits: offering.credits,
      assignedTeacherID: offering.assigned_teacher_id,
      totalStudents: offering.results?.length || 0,
      subject: offering.subject,
      branch: offering.branch,
      results: offering.results?.map(result => ({
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
          dateOfBirth: result.student.date_of_birth,
          branchCode: result.student.branch_code,
          branch: result.student.branch ? {
            branchCode: result.student.branch.branch_code,
            branchName: result.student.branch.branch_name
          } : null
        } : null
      })) || []
    })) || []

    // Return teacher data with subject offerings
    const teacherData = {
      teacherID: teacher.teacher_id,
      teacherName: teacher.teacher_name,
      subjectOfferings: processedOfferings
    }

    console.log('Login successful for:', teacherData)

    return NextResponse.json({
      message: 'Login successful',
      teacher: teacherData
    })

  } catch (error) {
    console.error('Teacher login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}