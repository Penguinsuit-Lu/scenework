import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/sign-in')
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('handle, full_name')
    .eq('id', user.id)
    .maybeSingle()

  if (error) {
    redirect('/profiles') // safe fallback if DB not ready
  }

  if (!data || !data.handle || !data.full_name) {
    redirect('/profile/edit')
  }

  redirect('/profiles')
}
