"use client"

import { formatDistanceToNow } from "date-fns"

interface Post {
  id: string
  body: string
  created_at: string
}

interface ProfilePostFeedProps {
  items: Post[]
}

export default function ProfilePostFeed({ items }: ProfilePostFeedProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-white/60">
        <p>No posts yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {items.map((post) => (
        <div key={post.id} className="rounded-2xl bg-white/5 border border-white/10 p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="text-sm text-white/60">
              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            </div>
          </div>
          <div className="text-white/90 leading-relaxed">
            {post.body}
          </div>
        </div>
      ))}
    </div>
  )
}


