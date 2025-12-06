"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Send, Paperclip, MoreVertical, Phone, Video, Star } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"

export default function RecruiterMessagesPage() {
  const searchParams = useSearchParams()
  const [conversations, setConversations] = useState<any[]>([])
  const [selectedConversation, setSelectedConversation] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [messageText, setMessageText] = useState("")
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    loadConversations()
  }, [])

  // Si un ID de conversation est passé en paramètre, le sélectionner
  useEffect(() => {
    const conversationId = searchParams.get("conversation")
    if (conversationId && conversations.length > 0) {
      const conv = conversations.find(c => c.id === parseInt(conversationId))
      if (conv) {
        setSelectedConversation(conv)
      }
    }
  }, [searchParams, conversations])

  useEffect(() => {
    if (selectedConversation?.id) {
      loadMessages(selectedConversation.id)
      // Marquer comme lu
      if (selectedConversation.unread > 0) {
        markAsRead(selectedConversation.id)
      }
    }
  }, [selectedConversation?.id])

  useEffect(() => {
    // Scroll vers le bas quand de nouveaux messages arrivent
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const loadConversations = async () => {
    try {
      setLoading(true)
      const { messageApi } = await import("@/lib/api-client")
      const data = await messageApi.conversations()
      setConversations(data.data || [])
      if (data.data && data.data.length > 0 && !selectedConversation) {
        setSelectedConversation(data.data[0])
      }
    } catch (error) {
      console.error("Erreur lors du chargement des conversations:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadMessages = async (conversationId: number | string) => {
    try {
      const { messageApi } = await import("@/lib/api-client")
      // Charger la conversation par ID
      const data = await messageApi.getConversation(conversationId)
      setMessages(data.messages || [])
      // Mettre à jour la conversation sélectionnée
      if (data.conversation) {
        const conv = conversations.find(c => c.id === conversationId)
        setSelectedConversation({
          ...(conv || {}),
          ...data.conversation,
        })
      }
    } catch (error) {
      console.error("Erreur lors du chargement des messages:", error)
      // Si la conversation n'existe pas, essayer de la créer
      const conv = conversations.find(c => c.id === conversationId)
      if (conv) {
        try {
          const { messageApi } = await import("@/lib/api-client")
          const data = await messageApi.getOrCreateConversation(conv.candidate_id, conv.offre_id)
          setMessages(data.messages || [])
          if (data.conversation) {
            setSelectedConversation({
              ...conv,
              ...data.conversation,
            })
          }
        } catch (createError) {
          console.error("Erreur lors de la création de la conversation:", createError)
        }
      }
    }
  }

  const markAsRead = async (conversationId: number | string) => {
    try {
      const { messageApi } = await import("@/lib/api-client")
      await messageApi.markAsRead(conversationId)
      // Mettre à jour la liste des conversations
      setConversations(prev => prev.map(conv => 
        conv.id === conversationId ? { ...conv, unread: 0 } : conv
      ))
    } catch (error) {
      console.error("Erreur lors du marquage comme lu:", error)
    }
  }

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversation || sending) return

    try {
      setSending(true)
      const { messageApi } = await import("@/lib/api-client")
      const data = await messageApi.sendMessage(selectedConversation.id, messageText.trim())
      
      // Ajouter le message à la liste
      setMessages(prev => [...prev, data.message])
      setMessageText("")
      
      // Mettre à jour la conversation dans la liste et la conversation sélectionnée
      const updatedConv = {
        ...selectedConversation,
        lastMessage: data.message.content,
        time: "À l'instant",
        unread: 0,
      }
      setSelectedConversation(updatedConv)
      setConversations(prev => prev.map(conv => 
        conv.id === selectedConversation.id ? updatedConv : conv
      ))
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error)
    } finally {
      setSending(false)
    }
  }

  const filteredConversations = conversations.filter(conv => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      conv.candidate.toLowerCase().includes(query) ||
      conv.position.toLowerCase().includes(query) ||
      conv.lastMessage.toLowerCase().includes(query)
    )
  })

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
          <p className="text-muted-foreground">Communiquez avec les candidats</p>
        </div>
        <Card className="flex h-[calc(100vh-16rem)] items-center justify-center">
          <div className="text-center text-muted-foreground">Chargement des conversations...</div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground">Communiquez avec les candidats</p>
      </div>

      <Card className="flex h-[calc(100vh-16rem)] overflow-hidden">
        <div className="flex w-80 flex-col border-r border-border">
          <div className="border-b border-border p-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Rechercher un candidat..." 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="space-y-1 p-2">
              {filteredConversations.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  {searchQuery ? "Aucune conversation trouvée" : "Aucune conversation pour le moment"}
                </div>
              ) : (
                filteredConversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className={`flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors hover:bg-accent ${
                      selectedConversation?.id === conv.id ? "bg-accent" : ""
                    }`}
                  >
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={conv.avatar || "/placeholder.svg"} alt={conv.candidate} />
                        <AvatarFallback>
                          {conv.candidate
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")
                            .substring(0, 2)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {conv.online && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-emerald-500" />
                      )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-sm truncate">{conv.candidate}</div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {conv.starred && <Star className="h-3 w-3 fill-amber-500 text-amber-500" />}
                          {conv.unread > 0 && (
                            <Badge className="h-5 min-w-5 px-1.5 text-xs bg-primary">{conv.unread}</Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground truncate">{conv.position}</div>
                      <div className="truncate text-sm text-muted-foreground">{conv.lastMessage}</div>
                      <div className="text-xs text-muted-foreground">{conv.time}</div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        <div className="flex flex-1 flex-col">
          {selectedConversation ? (
            <>
              <div className="flex items-center justify-between border-b border-border p-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage
                        src={selectedConversation.avatar || "/placeholder.svg"}
                        alt={selectedConversation.candidate}
                      />
                      <AvatarFallback>
                        {selectedConversation.candidate
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")
                          .substring(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {selectedConversation.online && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-emerald-500" />
                    )}
                  </div>
                  <div>
                    <div className="font-semibold">{selectedConversation.candidate}</div>
                    <div className="text-sm text-muted-foreground">
                      {selectedConversation.position}
                      {selectedConversation.offre_titre && (
                        <span className="ml-2 text-xs">• {selectedConversation.offre_titre}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {selectedConversation.offre_id && (
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/recruiter/matching?offre=${selectedConversation.offre_id}`}>
                        Voir le profil
                      </Link>
                    </Button>
                  )}
                  <Button variant="ghost" size="icon">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      Aucun message pour le moment. Commencez la conversation !
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div key={message.id} className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${
                            message.sender === "me"
                              ? "bg-gradient-to-r from-secondary to-primary text-primary-foreground"
                              : "bg-accent"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          <p
                            className={`mt-1 text-xs ${
                              message.sender === "me" ? "text-primary-foreground/70" : "text-muted-foreground"
                            }`}
                          >
                            {message.time}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <div className="border-t border-border p-4">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" disabled>
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Input
                    placeholder="Écrivez votre message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="flex-1"
                    disabled={sending}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                  />
                  <Button 
                    size="icon" 
                    className="bg-gradient-to-r from-secondary to-primary"
                    onClick={handleSendMessage}
                    disabled={!messageText.trim() || sending}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center text-muted-foreground">
              Sélectionnez une conversation pour commencer
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
