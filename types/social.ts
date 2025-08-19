export type Follow = { follower_id: string; followee_id: string; created_at: string }
export type Post = { id: string; author_id: string; body: string; created_at: string }
export type FeedItem = { id: string; body: string; created_at: string; author: { id: string; full_name: string; handle: string } }


