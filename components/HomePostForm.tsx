"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "./ui/ButtonNew"
import { createPost } from "../app/home-feed/actions"

export function HomePostForm() {
  const [body, setBody] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!body.trim()) return
    
    setIsSubmitting(true)
    
    try {
      await createPost(body)
      setBody("")
      router.refresh()
    } catch (error) {
      console.error("Failed to create post:", error)
      // You could add toast notification here
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="What's on your mind?"
        className="w-full min-h-[100px] p-4 rounded-2xl border border-border bg-card text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        maxLength={1000}
      />
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {body.length}/1000
        </span>
        <Button
          type="submit"
          disabled={!body.trim() || isSubmitting}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {isSubmitting ? "Posting..." : "Post"}
        </Button>
      </div>
    </form>
  )
}

