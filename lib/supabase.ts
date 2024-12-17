import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Complaints related functions
export async function getComplaints() {
  const { data, error } = await supabase
    .from('complaints')
    .select(`
      *,
      manager:managers(name),
      observer:observers(name)
    `)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function getComplaintById(id: string) {
  const { data, error } = await supabase
    .from('complaints')
    .select(`
      *,
      manager:managers(name),
      observer:observers(name)
    `)
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data
}

export async function createComplaint(complaint: any) {
  try {
    console.log('Sending complaint data:', complaint)
    
    const { data, error } = await supabase
      .from('complaints')
      .insert([complaint])
      .select()
      .single()
    
    if (error) {
      console.error('Supabase error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        complaint // Log the data that caused the error
      })
      throw error
    }

    return { data, error: null }
  } catch (err) {
    console.error('Unexpected error in createComplaint:', err)
    throw err
  }
}

export async function updateComplaint(id: string, updates: any) {
  const { data, error } = await supabase
    .from('complaints')
    .update(updates)
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data
}

export async function getComplaintHistory(complaintId: string) {
  const { data, error } = await supabase
    .from('complaint_history')
    .select('*')
    .eq('complaint_id', complaintId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function addComplaintHistory(history: any) {
  const { data, error } = await supabase
    .from('complaint_history')
    .insert(history)
    .select()
  
  if (error) throw error
  return data
}
