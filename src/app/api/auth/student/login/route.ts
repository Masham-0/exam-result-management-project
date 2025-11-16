import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { rollNo, dateOfBirth } = await request.json()

    if (!rollNo || !dateOfBirth) {
      return NextResponse.json(
        { error: 'Roll number and date of birth are required' },
        { status: 400 }
      )
    }

    console.log('Looking for student with roll_no:', rollNo)

    // Find student with branch information
    const { data: student, error } = await supabase
      .from('students')
      .select(`
        *,
        branch:branches (*)
      `)
      .eq('roll_no', rollNo)
      .single()

    console.log('Student query result:', { student, error })

    if (error) {
      console.error('Student lookup error:', error)
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      )
    }

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      )
    }

    // Verify date of birth (YYYYMMDD format)
    if (student.date_of_birth !== dateOfBirth) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Get student results with subject information
    const { data: results, error: resultsError } = await supabase
      .from('results')
      .select(`
        *,
        offering:subject_offerings (
          *,
          subject:subjects (*)
        )
      `)
      .eq('roll_no', rollNo)

    console.log('Results query result:', { results, resultsError })

    if (resultsError) {
      console.error('Results lookup error:', resultsError)
    }

    // Calculate CGPA
    let totalCredits = 0
    let weightedGradePoints = 0

    const resultsWithGrades = results?.map(result => {
      const credits = parseInt(result.offering?.credits || '0')
      const gradePoint = parseFloat(result.grade_point || '0')
      
      totalCredits += credits
      weightedGradePoints += credits * gradePoint

      return {
        offering: {
          offeringID: result.offering?.offering_id || 'N/A',
          subject: {
            subjectCode: result.offering?.subject?.subject_code || 'N/A',
            subjectName: result.offering?.subject?.subject_name || 'N/A'
          },
          semester: result.offering?.semester || 'N/A',
          credits: result.offering?.credits || '0'
        },
        theoryMarks: result.theory_marks || '0',
        internalMarks: result.internal_marks || '0',
        totalMarks: result.total_marks || '0',
        gradePoint: result.grade_point || '0',
        status: result.status || 'N/A',
        credits: credits,
        gradePoint: gradePoint
      }
    }) || []

    const cgpa = totalCredits > 0 ? (weightedGradePoints / totalCredits).toFixed(2) : '0.00'

    // Return student data with branch and results
    const studentData = {
      rollNo: student.roll_no,
      firstName: student.first_name,
      lastName: student.last_name,
      branchCode: student.branch_code,
      branch: student.branch ? {
        branchCode: student.branch.branch_code,
        branchName: student.branch.branch_name
      } : null,
      results: resultsWithGrades,
      cgpa
    }

    console.log('Login successful for:', studentData)

    return NextResponse.json({
      message: 'Login successful',
      student: studentData
    })

  } catch (error) {
    console.error('Student login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}