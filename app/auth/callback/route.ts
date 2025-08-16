import { redirect } from 'next/navigation'
export async function GET() {
  redirect('/auth/after-login')
}
