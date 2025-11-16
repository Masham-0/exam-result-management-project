import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jwjdwtcewkzpggimoews.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3amR3dGNld2t6cGdnaW1vZXdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzMDAyMjcsImV4cCI6MjA3ODg3NjIyN30.Pc86H_O1SIU6J7M_jdxI2oeQvWB7Fh5XmqpB-gO_hcU'

console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Key exists:', !!supabaseAnonKey)

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Test function to verify connection
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('branches').select('count').single()
    if (error) {
      console.error('Supabase connection error:', error)
      return false
    }
    console.log('Supabase connection successful')
    return true
  } catch (err) {
    console.error('Supabase test error:', err)
    return false
  }
}