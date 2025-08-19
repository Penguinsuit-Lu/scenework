import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    console.log('🔄 Starting sign-out process...')
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('❌ Sign out error:', error)
    } else {
      console.log('✅ Sign out successful')
    }
  } catch (error) {
    console.error('❌ Sign out error:', error)
  }
  
  // Always redirect to home page
  console.log('🔄 Redirecting to home...')
  redirect('/')
}
