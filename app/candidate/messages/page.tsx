"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  Send, 
  Paperclip, 
  MoreVertical, 
  Phone, 
  Video, 
  Loader2,
  MessageSquare,
  Briefcase,
  ArrowLeft,
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { messageApi } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"

interface Conversation {
  id: number
  company: string
  recruiter: string
  recruiter_id: number
  avatar?: string
  lastMessage: string
  time: string
  unread: number
  online: boolean
  offre_id?: number
  offre_titre?: string
}

interface Message {
  id: number
  sender: "me" | "recruiter"
  content: string
  time: string
  date: string
  is_read: boolean
}

interface ConversationDetail {
  id: number
  company: string
  recruiter: string
  recruiter_id: number
  offre_id?: number
  offre_titre?: string
}

export default function CandidateMessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<ConversationDetail | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [messageText, setMessageText] = useState("")
  const [loading, setLoading] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [sending, setSending] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [showMobileList, setShowMobileList] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadConversations()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const loadConversations = async () => {
    try {
      setLoading(true)
      const response = await messageApi.myConversations()
      if (response.success) {
        setConversations(response.data || [])
      }
    } catch (error: any) {
      console.error("Erreur lors du chargement des conversations:", error)
      toast({
        title: "Erreur",
        description: "Impossible de charger vos conversations",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadConversation = async (conversationId: number) => {
    try {
      setLoadingMessages(true)
      const response = await messageApi.getMyConversation(conversationId)
      if (response.success) {
        setSelectedConversation(response.conversation)
        setMessages(response.messages || [])
        setShowMobileList(false)
        
        // Mettre à jour le compteur de non lus
        setConversations(prev => 
          prev.map(c => c.id === conversationId ? { ...c, unread: 0 } : c)
        )
      }
    } catch (error: any) {
      console.error("Erreur lors du chargement de la conversation:", error)
      toast({
        title: "Erreur",
        description: "Impossible de charger la conversation",
        variant: "destructive",
      })
    } finally {
      setLoadingMessages(false)
    }
  }

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversation) return

    try {
      setSending(true)
      const response = await messageApi.sendMessage(selectedConversation.id, messageText.trim())
      
      if (response.message) {
        setMessages(prev => [...prev, response.message])
        setMessageText("")
        
        // Mettre à jour le dernier message dans la liste
        setConversations(prev =>
          prev.map(c =>
            c.id === selectedConversation.id
              ? { ...c, lastMessage: messageText.trim(), time: "À l'instant" }
              : c
          )
        )
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message",
        variant: "destructive",
      })
    } finally {
      setSending(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const filteredConversations = conversations.filter((conv) => {
    const search = searchTerm.toLowerCase()
    return (
      conv.company?.toLowerCase().includes(search) ||
      conv.recruiter?.toLowerCase().includes(search) ||
      conv.offre_titre?.toLowerCase().includes(search)
    )
  })

  const totalUnread = conversations.reduce((sum, c) => sum + c.unread, 0)

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Chargement des messages...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
          <p className="text-muted-foreground">
            Échangez avec les recruteurs
            {totalUnread > 0 && (
              <Badge variant="destructive" className="ml-2">
                {totalUnread} non lu{totalUnread > 1 ? "s" : ""}
              </Badge>
            )}
          </p>
        </div>
      </div>

      <Card className="flex h-[calc(100vh-16rem)] overflow-hidden">
        {/* Liste des conversations */}
        <div className={`flex w-full md:w-80 flex-col border-r border-border ${
          !showMobileList && selectedConversation ? "hidden md:flex" : "flex"
        }`}>
          <div className="border-b border-border p-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Rechercher une conversation..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <ScrollArea className="flex-1">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Aucune conversation</h3>
                <p className="text-sm text-muted-foreground">
                  {searchTerm 
                    ? "Aucune conversation ne correspond à votre recherche."
                    : "Vous n'avez pas encore de messages. Les recruteurs peuvent vous contacter via vos candidatures."}
                </p>
              </div>
            ) : (
              <div className="space-y-1 p-2">
                {filteredConversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => loadConversation(conv.id)}
                    className={`flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors hover:bg-accent ${
                      selectedConversation?.id === conv.id ? "bg-accent" : ""
                    }`}
                  >
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={conv.avatar || ""} alt={conv.company} />
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20">
                          {getInitials(conv.company)}
                        </AvatarFallback>
                      </Avatar>
                      {conv.online && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-emerald-500" />
                      )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-sm truncate">{conv.company}</div>
                        {conv.unread > 0 && (
                          <Badge className="h-5 min-w-5 px-1.5 text-xs bg-primary">{conv.unread}</Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">{conv.recruiter}</div>
                      {conv.offre_titre && (
                        <div className="flex items-center gap-1 text-xs text-primary mt-1">
                          <Briefcase className="h-3 w-3" />
                          <span className="truncate">{conv.offre_titre}</span>
                        </div>
                      )}
                      <div className="truncate text-sm text-muted-foreground mt-1">{conv.lastMessage}</div>
                      <div className="text-xs text-muted-foreground">{conv.time}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Zone de chat */}
        <div className={`flex flex-1 flex-col ${
          showMobileList && !selectedConversation ? "hidden md:flex" : "flex"
        }`}>
          {!selectedConversation ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center p-8">
                <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Sélectionnez une conversation</h3>
                <p className="text-muted-foreground">
                  Choisissez une conversation dans la liste pour afficher les messages.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Header de la conversation */}
              <div className="flex items-center justify-between border-b border-border p-4">
                <div className="flex items-center gap-3">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="md:hidden"
                    onClick={() => {
                      setShowMobileList(true)
                      setSelectedConversation(null)
                    }}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <Avatar>
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20">
                      {getInitials(selectedConversation.company)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{selectedConversation.company}</div>
                    <div className="text-sm text-muted-foreground">{selectedConversation.recruiter}</div>
                    {selectedConversation.offre_titre && (
                      <div className="flex items-center gap-1 text-xs text-primary">
                        <Briefcase className="h-3 w-3" />
                        {selectedConversation.offre_titre}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
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

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                {loadingMessages ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-center">
                    <div>
                      <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Aucun message pour le moment.</p>
                      <p className="text-sm text-muted-foreground">Envoyez le premier message !</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div 
                        key={message.id} 
                        className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
                      >
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
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </ScrollArea>

              {/* Zone de saisie */}
              <div className="border-t border-border p-4">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
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
                    disabled={sending || !messageText.trim()}
                  >
                    {sending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  )
}
