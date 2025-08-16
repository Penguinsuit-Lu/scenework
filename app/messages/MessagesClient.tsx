'use client'

import { Suspense, useMemo } from 'react'
// If you still want hooks like useSearchParams inside child pieces, you can use them here.

export default function MessagesClient({
  initialTo,
  initialThread,
}: {
  initialTo: string | null
  initialThread: string | null
}) {
  // Use the initial values passed from the server to bootstrap UI.
  // If you also read live query params on the client, keep that inside Suspense.
  // Example (optional):
  // const params = useSearchParams()
  // const liveTo = params.get('to') ?? initialTo

  return (
    <Suspense fallback={<div className="opacity-70">Loading messages…</div>}>
      <MessageLayout initialTo={initialTo} initialThread={initialThread} />
    </Suspense>
  )
}

function MessageLayout({
  initialTo,
  initialThread,
}: {
  initialTo: string | null
  initialThread: string | null
}) {
  // render your threads/list/composer using the initial values
  return (
    <div className="grid gap-4 md:grid-cols-12">
      <section className="md:col-span-4 rounded-2xl border border-border p-4">Threads</section>
      <section className="md:col-span-8 rounded-2xl border border-border p-4">
        {initialThread ? `Thread: ${initialThread}` : 'Select a conversation'}
      </section>
    </div>
  )
}
