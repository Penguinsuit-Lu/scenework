import MessagesClient from './MessagesClient'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type Search = { to?: string; thread?: string }

export default async function Page({ searchParams }: { searchParams: Search }) {
  // (Optional) preload anything server-side if you want:
  const supabase = createClient()
  // e.g., you could verify the session here if needed:
  // const { data: { user } } = await supabase.auth.getUser()

  // Read query params safely on the server
  const initialTo = searchParams?.to || null
  const initialThread = searchParams?.thread || null
                      
                      return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold mb-4">Messages</h1>
      <MessagesClient initialTo={initialTo} initialThread={initialThread} />
    </main>
  )
}
