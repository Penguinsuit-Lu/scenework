import { createClient } from './client'

export async function testSupabaseConnection() {
  try {
    const supabase = createClient()
    
    // Try a simple auth operation
    const { data, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Supabase connection test failed:', error)
      return { success: false, error: error.message }
    }
    
    console.log('Supabase connection test successful:', { 
      hasSession: !!data.session,
      userId: data.session?.user?.id 
    })
    
    return { success: true, session: data.session }
  } catch (error) {
    console.error('Supabase connection test error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
