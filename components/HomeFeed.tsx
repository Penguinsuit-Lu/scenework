"use client"

import Link from "next/link"
import type { FeedItem } from "../types/social"
import { timeAgo } from "../lib/timeago"

interface HomeFeedProps {
  items: FeedItem[]
}

export function HomeFeed({ items }: HomeFeedProps) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-3 flex items-center justify-between">
            <Link 
              href={`/u/${item.author.handle}`}
              className="font-semibold text-foreground hover:text-primary transition-colors"
            >
              {item.author.full_name}
            </Link>
            <span className="text-sm text-muted-foreground">
              {timeAgo(item.created_at)}
            </span>
          </div>
          <p className="text-foreground leading-relaxed whitespace-pre-wrap">
            {item.body}
          </p>
        </div>
      ))}
    </div>
  )
}
