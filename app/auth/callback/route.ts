import { redirect } from 'next/navigation'

export async function GET(request: Request) {
  try {
    // Get the URL and search params
    const url = new URL(request.url)
    const code = url.searchParams.get('code')
    const error = url.searchParams.get('error')
    
    if (error) {
      // OAuth error occurred, redirect to sign-in with error
      redirect(`/auth/sign-in?error=oauth_${error}`)
    }
    
    if (code) {
      // OAuth code received, Supabase will process this automatically
      // Just redirect to after-login page
      redirect('/auth/after-login')
    }
    
    // No code or error, redirect to sign-in
    redirect('/auth/sign-in?error=no_code')
    
  } catch (error) {
    console.error('Unexpected error in auth callback:', error)
    redirect('/auth/sign-in?error=unexpected')
  }
}
