import { createClient } from './supabase/server'
import { redirect } from 'next/navigation'

export async function getSession() {
  const supabase = await createClient()
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    return session
  } catch (error) {
    console.error('Error getting session:', error)
    return null
  }
}

export async function requireUser() {
  const session = await getSession()
  if (!session) {
    redirect('/auth/sign-in')
  }
  return session.user
}
