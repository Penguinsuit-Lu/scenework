"use server"

import { createClient } from "../../lib/supabase/server"
import { revalidatePath } from "next/cache"

export interface Message {
  id: string
  sender_id: string
  recipient_id: string
  body: string
  created_at: string
}

export interface Thread {
  id: string
  user_id: string
  other_user_id: string
  other_user_name: string
  other_user_handle: string
  last_message: string
  last_message_time: string
  unread_count: number
}

export interface ThreadWithMessages {
  other_user: {
    id: string
    full_name: string
    handle: string
  }
  messages: Message[]
}

export async function listThreadsForUser(): Promise<Thread[]> {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return []
  }

  // Get all messages where user is sender or recipient
  const { data: messages, error } = await supabase
    .from('messages')
    .select(`
      id,
      sender_id,
      recipient_id,
      body,
      created_at,
      sender:profiles!messages_sender_id_fkey(full_name, handle),
      recipient:profiles!messages_recipient_id_fkey(full_name, handle)
    `)
    .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch messages:', error)
    return []
  }

  // Group messages by conversation partner and create threads
  const threadMap = new Map<string, Thread>()
  
  messages?.forEach((msg) => {
    const isSender = msg.sender_id === user.id
    const otherUserId = isSender ? msg.recipient_id : msg.sender_id
    const otherUser = isSender ? msg.recipient : msg.sender
    
    if (!threadMap.has(otherUserId)) {
      threadMap.set(otherUserId, {
        id: otherUserId,
        user_id: user.id,
        other_user_id: otherUserId,
        other_user_name: otherUser?.full_name || 'Unknown User',
        other_user_handle: otherUser?.handle || 'unknown',
        last_message: msg.body,
        last_message_time: msg.created_at,
        unread_count: isSender ? 0 : 1
      })
    } else {
      const thread = threadMap.get(otherUserId)!
      if (new Date(msg.created_at) > new Date(thread.last_message_time)) {
        thread.last_message = msg.body
        thread.last_message_time = msg.created_at
        if (!isSender) {
          thread.unread_count += 1
        }
      }
    }
  })

  // Convert to array and sort by most recent
  const threads = Array.from(threadMap.values())
    .sort((a, b) => new Date(b.last_message_time).getTime() - new Date(a.last_message_time).getTime())

  return threads
}

export async function getThreadWith(userId: string): Promise<ThreadWithMessages | null> {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return null
  }

  // Get the other user's profile
  const { data: otherUser, error: userError } = await supabase
    .from('profiles')
    .select('id, full_name, handle')
    .eq('id', userId)
    .single()

  if (userError || !otherUser) {
    return null
  }

  // Get all messages between these two users
  const { data: messages, error: messagesError } = await supabase
    .from('messages')
    .select('*')
    .or(`and(sender_id.eq.${user.id},recipient_id.eq.${userId}),and(sender_id.eq.${userId},recipient_id.eq.${user.id})`)
    .order('created_at', { ascending: true })

  if (messagesError) {
    console.error('Failed to fetch thread messages:', messagesError)
    return null
  }

  return {
    other_user: otherUser,
    messages: messages || []
  }
}

export async function sendMessage(to: string, body: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: "Authentication required" }
  }

  if (!body.trim()) {
    return { success: false, error: "Message cannot be empty" }
  }

  if (body.length > 1000) {
    return { success: false, error: "Message too long (max 1000 characters)" }
  }

  // Verify the recipient exists
  const { data: recipient, error: recipientError } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', to)
    .single()

  if (recipientError || !recipient) {
    return { success: false, error: "Recipient not found" }
  }

  // Insert the message
  const { error: insertError } = await supabase
    .from('messages')
    .insert({
      sender_id: user.id,
      recipient_id: to,
      body: body.trim()
    })

  if (insertError) {
    console.error('Failed to send message:', insertError)
    return { success: false, error: "Failed to send message" }
  }

  revalidatePath('/messages')
  return { success: true }
}

