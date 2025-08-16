"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { listThreadsForUser, getThreadWith, sendMessage, Thread, ThreadWithMessages, Message } from "./actions"
import { Button } from "@/components/ui/ButtonNew"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  MessageSquare, 
  Send, 
  User,
  Clock,
  Search
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export default function MessagesPage() {
  const searchParams = useSearchParams()
  const [threads, setThreads] = useState<Thread[]>([])
  const [selectedThread, setSelectedThread] = useState<ThreadWithMessages | null>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [messageBody, setMessageBody] = useState("")
  const [error, setError] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Get userId from query params for starting a new conversation
  const targetUserId = searchParams.get('userId')

  useEffect(() => {
    const fetchThreads = async () => {
      setLoading(true)
      const data = await listThreadsForUser()
      setThreads(data)
      setLoading(false)
    }

    fetchThreads()
  }, [])

  useEffect(() => {
    // If we have a targetUserId, load that thread
    if (targetUserId) {
      loadThread(targetUserId)
    }
  }, [targetUserId])

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [selectedThread?.messages])

  const loadThread = async (userId: string) => {
    const thread = await getThreadWith(userId)
    setSelectedThread(thread)
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageBody.trim() || !selectedThread) return

    setSending(true)
    setError("")

    const result = await sendMessage(selectedThread.other_user.id, messageBody)

    if (result.success) {
      setMessageBody("")
      // Refresh the thread to show the new message
      await loadThread(selectedThread.other_user.id)
      // Refresh the threads list to update the last message
      const updatedThreads = await listThreadsForUser()
      setThreads(updatedThreads)
    } else {
      setError(result.error || "Failed to send message")
    }

    setSending(false)
  }

  const filteredThreads = threads.filter(thread =>
    thread.other_user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    thread.other_user_handle.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const formatTime = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true })
  }

  return (
    <div className="container mx-auto px-4 py-8 h-[calc(100vh-120px)]">
      <div className="flex h-full gap-6">
        {/* Left Column - Inbox */}
        <div className="w-1/3 bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
          <CardHeader className="bg-white/5 border-b border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare className="w-6 h-6 text-white" />
              <CardTitle className="text-xl font-bold text-white">Messages</CardTitle>
            </div>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder-white/50"
              />
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {loading ? (
              <div className="p-6 text-center">
                <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-white/60">Loading conversations...</p>
              </div>
            ) : filteredThreads.length === 0 ? (
              <div className="p-6 text-center">
                <MessageSquare className="w-12 h-12 text-white/40 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No conversations yet</h3>
                <p className="text-white/60">Start a conversation by messaging someone!</p>
              </div>
            ) : (
              <div className="max-h-[calc(100vh-280px)] overflow-y-auto">
                {filteredThreads.map((thread) => (
                  <button
                    key={thread.id}
                    onClick={() => loadThread(thread.other_user_id)}
                    className={`w-full p-4 text-left hover:bg-white/5 transition-colors border-b border-white/5 ${
                      selectedThread?.other_user.id === thread.other_user_id ? 'bg-white/10' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-amber-500 text-black font-semibold">
                          {getInitials(thread.other_user_name)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-white truncate">
                            {thread.other_user_name}
                          </h4>
                          <span className="text-xs text-white/50">
                            {formatTime(thread.last_message_time)}
                          </span>
                        </div>
                        
                        <p className="text-sm text-white/70 truncate mb-1">
                          @{thread.other_user_handle}
                        </p>
                        
                        <p className="text-sm text-white/80 truncate">
                          {thread.last_message}
                        </p>
                        
                        {thread.unread_count > 0 && (
                          <Badge className="mt-2 bg-amber-500 text-black text-xs">
                            {thread.unread_count} new
                          </Badge>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </div>

        {/* Right Column - Thread View */}
        <div className="flex-1 bg-white/5 rounded-2xl border border-white/10 overflow-hidden flex flex-col">
          {selectedThread ? (
            <>
              {/* Thread Header */}
              <CardHeader className="bg-white/5 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-amber-500 text-black font-semibold">
                      {getInitials(selectedThread.other_user.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg font-bold text-white">
                      {selectedThread.other_user.full_name}
                    </CardTitle>
                    <p className="text-sm text-white/70">
                      @{selectedThread.other_user.handle}
                    </p>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto max-h-[calc(100vh-400px)]">
                {selectedThread.messages.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 text-white/40 mx-auto mb-4" />
                    <p className="text-white/60">No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedThread.messages.map((message) => {
                      const isOwnMessage = message.sender_id !== selectedThread.other_user.id
                      
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                              isOwnMessage
                                ? 'bg-amber-500 text-black'
                                : 'bg-white/10 text-white'
                            }`}
                          >
                            <p className="text-sm">{message.body}</p>
                            <p className={`text-xs mt-1 ${
                              isOwnMessage ? 'text-black/60' : 'text-white/50'
                            }`}>
                              {formatTime(message.created_at)}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Compose Box */}
              <div className="p-4 border-t border-white/10">
                <form onSubmit={handleSendMessage} className="flex gap-3">
                  <Input
                    value={messageBody}
                    onChange={(e) => setMessageBody(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 bg-white/5 border-white/10 text-white placeholder-white/50"
                    maxLength={1000}
                  />
                  <Button
                    type="submit"
                    variant="brand"
                    disabled={sending || !messageBody.trim()}
                    className="px-6"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
                {error && (
                  <p className="text-red-400 text-sm mt-2">{error}</p>
                )}
                <p className="text-xs text-white/50 mt-2">
                  {messageBody.length}/1000 characters
                </p>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 text-white/40 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Select a conversation</h3>
                <p className="text-white/60">Choose a conversation from the inbox to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
