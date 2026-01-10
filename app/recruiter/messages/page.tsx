"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  Send, 
  Paperclip, 
  MoreVertical, 
  Loader2,
  MessageSquare,
  Briefcase,
  ArrowLeft,
} from "lucide-react"
import { messageApi } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"

interface Conversation {
  id: number
  candidate: string
  candidate_id: number
  position?: string
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
  sender: "me" | "candidate"
  content: string
  time: string
  date: string
  is_read: boolean
}

interface ConversationDetail {
  id: number
  candidate: string
  candidate_id: number
  position?: string
  offre_id?: number
  offre_titre?: string
}

export default function RecruiterMessagesPage() {
  const searchParams = useSearchParams()
  const conversationIdParam = searchParams.get("conversation")
  
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<ConversationDetail | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [messageText, setMessageText] = useState("")
  const [loading, setLoading] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [sending, setSending] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [showMobileList, setShowMobileList] = useState(true)
  const [previousUnreadCount, setPreviousUnreadCount] = useState(0)
  const [conversationLoading, setConversationLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadConversations()
    // Polling pour nouvelles conversations toutes les 30 secondes
    const interval = setInterval(loadConversations, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Si un ID de conversation est passé en paramètre, la charger automatiquement
    if (conversationIdParam && conversations.length > 0) {
      const conv = conversations.find(c => c.id === parseInt(conversationIdParam))
      if (conv) {
        loadConversation(conv.id)
      }
    }
  }, [conversationIdParam, conversations])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Rafraîchir la conversation active toutes les 10 secondes pour voir les nouveaux messages
  useEffect(() => {
    if (selectedConversation) {
      const interval = setInterval(() => {
        // Recharger silencieusement (sans loader)
        messageApi.getConversation(selectedConversation.id)
          .then(response => {
            if (response && response.messages) {
              setMessages(response.messages)
            }
          })
          .catch(err => console.error('Erreur refresh messages:', err))
      }, 10000) // 10 secondes
      return () => clearInterval(interval)
    }
  }, [selectedConversation])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const loadConversations = async () => {
    try {
      setLoading(true)
      const response = await messageApi.conversations()
      if (response.data) {
        const newConversations = response.data || []
        
        // Calculer le nombre total de messages non lus
        const currentUnreadCount = newConversations.reduce((sum: number, c: Conversation) => sum + c.unread, 0)
        
        // Si on a plus de messages non lus qu'avant, afficher une notification
        if (previousUnreadCount > 0 && currentUnreadCount > previousUnreadCount) {
          const newMessagesCount = currentUnreadCount - previousUnreadCount
          toast({
            title: "Nouveau message !",
            description: `Vous avez ${newMessagesCount} nouveau${newMessagesCount > 1 ? 'x' : ''} message${newMessagesCount > 1 ? 's' : ''}`,
          })
          
          // Son de notification (optionnel)
          if (typeof Audio !== 'undefined') {
            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBzbN8viSNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBzbN8viSNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBzbN8viSNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBzbN8viSNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBzbN8viSNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBzbN8viSNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBzbN8viSNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBzbN8viSNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBzbN8viSNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBzbN8viSNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBzbN8viSNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBzbN8viSNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBzbN8viSNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAo=')
            audio.volume = 0.3
            audio.play().catch(() => {}) // Ignorer les erreurs (autoplay bloqué)
          }
        }
        
        setPreviousUnreadCount(currentUnreadCount)
        setConversations(newConversations)
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
      setConversationLoading(true)
      const response = await messageApi.getConversation(conversationId)
      if (response && response.conversation) {
        setSelectedConversation(response.conversation)
        setMessages(response.messages || [])
        setShowMobileList(false)
        
        // Mettre à jour le compteur de non lus
        setConversations(prev => 
          prev.map(c => c.id === conversationId ? { ...c, unread: 0 } : c)
        )
        
        // Marquer les messages comme lus
        await messageApi.markAsRead(conversationId).catch(err => 
          console.error('Erreur markAsRead:', err)
        )
      } else {
        toast({
          title: "Erreur",
          description: "Conversation introuvable",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("Erreur lors du chargement de la conversation:", error)
      toast({
        title: "Erreur",
        description: error.message || "Impossible de charger la conversation",
        variant: "destructive",
      })
    } finally {
      setConversationLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversation) return

    const tempMessage = messageText.trim()
    setMessageText("") // Vider immédiatement l'input
    setSending(true)

    try {
      const response = await messageApi.sendMessage(selectedConversation.id, tempMessage)
      
      console.log('Message envoyé, réponse:', response)
      
      if (response.success && response.message) {
        setMessages(prev => [...prev, response.message])
        
        // Mettre à jour le dernier message dans la liste
        setConversations(prev =>
          prev.map(c =>
            c.id === selectedConversation.id
              ? { ...c, lastMessage: tempMessage, time: "À l'instant" }
              : c
          )
        )
      } else {
        console.error('Réponse invalide:', response)
        setMessageText(tempMessage) // Restaurer le message
        toast({
          title: "Erreur",
          description: "Réponse invalide du serveur",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error('Erreur envoi message:', error)
      setMessageText(tempMessage) // Restaurer le message
      toast({
        title: "Erreur d'envoi",
        description: error.message || "Impossible d'envoyer le message. Vérifiez votre connexion.",
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
      conv.candidate?.toLowerCase().includes(search) ||
      conv.position?.toLowerCase().includes(search) ||
      conv.offre_titre?.toLowerCase().includes(search)
    )
  })

  const totalUnread = conversations.reduce((sum, c) => sum + c.unread, 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Chargement des messages...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b bg-background flex-shrink-0">
        <div className="flex items-center gap-3">
          <MessageSquare className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-xl font-bold">Messages</h1>
            <p className="text-sm text-muted-foreground">
              {totalUnread > 0 ? `${totalUnread} nouveau${totalUnread > 1 ? 'x' : ''} message${totalUnread > 1 ? 's' : ''}` : 'Aucun nouveau message'}
            </p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Liste des conversations */}
        <div className="w-full md:w-[380px] flex flex-col bg-background border-r flex-shrink-0">
          {/* Search */}
          <div className="p-4 border-b flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un candidat..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Conversations list */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                {searchTerm ? "Aucune conversation trouvée" : "Aucune conversation pour le moment"}
              </div>
            ) : (
              <div className="divide-y">
                {filteredConversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => loadConversation(conv.id)}
                    className={`w-full p-4 flex items-start gap-3 hover:bg-accent transition-colors text-left ${
                      selectedConversation?.id === conv.id ? 'bg-accent' : ''
                    }`}
                  >
                    <Avatar className="h-12 w-12 flex-shrink-0">
                      <AvatarImage src={conv.avatar} alt={conv.candidate} />
                      <AvatarFallback>{getInitials(conv.candidate)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-sm truncate">{conv.candidate}</h3>
                        <span className="text-xs text-muted-foreground flex-shrink-0">{conv.time}</span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate mb-1">
                        {conv.position}
                      </p>
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm text-muted-foreground truncate flex-1">
                          {conv.lastMessage}
                        </p>
                        {conv.unread > 0 && (
                          <Badge className="h-5 min-w-5 rounded-full px-1.5 text-xs bg-primary text-primary-foreground flex items-center justify-center">
                            {conv.unread}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col bg-background">
          {selectedConversation ? (
            <>
              {/* Chat header */}
              <div className="px-6 py-3 border-b bg-background flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={() => setSelectedConversation(null)}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedConversation.avatar} alt={selectedConversation.candidate} />
                    <AvatarFallback>{getInitials(selectedConversation.candidate)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-semibold">{selectedConversation.candidate}</h2>
                    <p className="text-sm text-muted-foreground">{selectedConversation.position}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {selectedConversation.offre_id && (
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/recruiter/matching?offre=${selectedConversation.offre_id}`}>
                        <Briefcase className="h-4 w-4 mr-2" />
                        Voir le profil
                      </Link>
                    </Button>
                  )}
                </div>
              </div>

              {/* Messages area with WhatsApp background */}
              <div className="flex-1 overflow-y-auto bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0icGF0dGVybiIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiPjxwYXRoIGQ9Ik0gMCw1MCBMIDUwLDAgTCAxMDAsNTAgTCA1MCwxMDAgWiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJoc2woMCwwJSw5NSUpIiBzdHJva2Utd2lkdGg9IjAuNSIgb3BhY2l0eT0iMC4xIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm4pIi8+PC9zdmc+')] p-4">
                {conversationLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-center">
                    <div className="max-w-sm">
                      <MessageSquare className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                      <p className="text-muted-foreground">
                        Aucun message pour le moment.<br />Commencez la conversation !
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="max-w-4xl mx-auto space-y-3">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[65%] rounded-lg px-4 py-2 ${
                            message.sender === 'me'
                              ? 'bg-primary text-primary-foreground rounded-br-none'
                              : 'bg-muted rounded-bl-none'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                          <p className={`text-xs mt-1 ${message.sender === 'me' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                            {message.time}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Input zone */}
              <div className="p-4 bg-background border-t flex-shrink-0">
                <div className="max-w-4xl mx-auto flex items-end gap-2">
                  <Button variant="ghost" size="icon" className="flex-shrink-0" disabled>
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Écrivez votre message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                      className="pr-12 min-h-[44px]"
                      disabled={sending}
                    />
                  </div>
                  <Button
                    size="icon"
                    onClick={handleSendMessage}
                    disabled={!messageText.trim() || sending}
                    className="flex-shrink-0 bg-primary hover:bg-primary/90"
                  >
                    {sending ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center p-8">
              <div className="max-w-md">
                <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Sélectionnez une conversation</h3>
                <p className="text-muted-foreground">
                  Choisissez un candidat dans la liste pour commencer à discuter
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
