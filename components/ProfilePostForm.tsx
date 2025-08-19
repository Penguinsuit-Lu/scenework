"use client"

import { useState } from "react"
import { Button } from "./ui/ButtonNew"
import { createProfilePost } from "../app/(profile)/u/[handle]/post-actions"

interface ProfilePostFormProps {
  profileId: string
  onPostCreated: () => void
}

export default function ProfilePostForm({ profileId, onPostCreated }: ProfilePostFormProps) {
  const [body, setBody] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!body.trim()) return
    
    setIsSubmitting(true)
    try {
      await createProfilePost(body, profileId)
      setBody("")
      onPostCreated()
    } catch (error) {
      console.error('Failed to create post:', error)
      // You could add a toast notification here
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="space-y-3">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="What's happening in your creative world?"
          maxLength={1000}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/50 resize-none focus:outline-none focus:border-amber-400/50 transition-colors"
          rows={3}
        />
        <div className="flex items-center justify-between">
          <div className="text-sm text-white/60">
            {body.length}/1000
          </div>
          <Button
            type="submit"
            variant="brand"
            size="sm"
            disabled={isSubmitting || !body.trim()}
            className="px-6"
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </Button>
        </div>
      </div>
    </form>
  )
}


