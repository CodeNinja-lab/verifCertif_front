"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
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
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadConversations()
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
        messageApi.getMyConversation(selectedConversation.id)
          .then(response => {
            if (response.success && response.messages) {
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
      const response = await messageApi.myConversations()
      if (response.success) {
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
      setLoadingMessages(true)
      const response = await messageApi.getMyConversation(conversationId)
      if (response.success && response.conversation) {
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
      setLoadingMessages(false)
    }
  }

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversation) return

    const tempMessage = messageText.trim()
    setMessageText("") // Vider immédiatement l'input pour feedback instantané
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
        setMessageText(tempMessage) // Restaurer le message en cas d'erreur
        toast({
          title: "Erreur",
          description: "Réponse invalide du serveur",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error('Erreur envoi message:', error)
      setMessageText(tempMessage) // Restaurer le message en cas d'erreur
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
    <div className="flex flex-col h-screen bg-background">
      {/* Header fixe */}
      <div className="flex-shrink-0 border-b bg-background px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Messages</h1>
            <p className="text-sm text-muted-foreground">
              Échangez avec les recruteurs
              {totalUnread > 0 && (
                <Badge variant="destructive" className="ml-2 text-xs">
                  {totalUnread}
                </Badge>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Conteneur principal - Style WhatsApp Web */}
      <div className="flex-1 flex overflow-hidden bg-muted/10">
        {/* Sidebar - Liste des conversations - 30% width */}
        <div className={`w-full md:w-[380px] flex flex-col bg-background border-r ${
          !showMobileList && selectedConversation ? "hidden md:flex" : "flex"
        }`}>
          {/* Search bar */}
          <div className="flex-shrink-0 p-3 bg-muted/5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Rechercher une conversation" 
                className="pl-10 bg-background"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Liste des conversations - scrollable */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">Aucune conversation</h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  {searchTerm 
                    ? "Aucun résultat trouvé"
                    : "Vos conversations avec les recruteurs apparaîtront ici"}
                </p>
              </div>
            ) : (
              <div>
                {filteredConversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => loadConversation(conv.id)}
                    className={`flex w-full items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors border-b ${
                      selectedConversation?.id === conv.id ? "bg-muted" : ""
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={conv.avatar || ""} alt={conv.company} />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {getInitials(conv.company)}
                        </AvatarFallback>
                      </Avatar>
                      {conv.online && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-green-500" />
                      )}
                    </div>
                    <div className="flex-1 overflow-hidden text-left">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-sm truncate">{conv.company}</span>
                        <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">{conv.time}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mb-0.5">{conv.recruiter}</div>
                      {conv.offre_titre && (
                        <div className="flex items-center gap-1 text-xs text-primary mb-1">
                          <Briefcase className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{conv.offre_titre}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm text-muted-foreground truncate flex-1">{conv.lastMessage}</p>
                        {conv.unread > 0 && (
                          <Badge className="h-5 min-w-[20px] px-1.5 bg-primary text-white rounded-full flex-shrink-0">
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

        {/* Zone de chat principale - 70% width */}
        <div className={`flex-1 flex flex-col bg-background ${
          showMobileList && !selectedConversation ? "hidden md:flex" : "flex"
        }`}>
          {!selectedConversation ? (
            <div className="flex-1 flex items-center justify-center bg-muted/5">
              <div className="text-center max-w-md p-8">
                <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <MessageSquare className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Messagerie ACADYS</h3>
                <p className="text-muted-foreground">
                  Sélectionnez une conversation pour commencer à discuter avec un recruteur
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Header conversation */}
              <div className="flex-shrink-0 flex items-center justify-between bg-muted/5 border-b px-4 py-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="md:hidden flex-shrink-0"
                    onClick={() => {
                      setShowMobileList(true)
                      setSelectedConversation(null)
                    }}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {getInitials(selectedConversation.company)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{selectedConversation.company}</div>
                    <div className="text-xs text-muted-foreground truncate">{selectedConversation.recruiter}</div>
                    {selectedConversation.offre_titre && (
                      <div className="flex items-center gap-1 text-xs text-primary">
                        <Briefcase className="h-3 w-3" />
                        <span className="truncate">{selectedConversation.offre_titre}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Search className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Zone des messages - scrollable avec fond */}
              <div className="flex-1 overflow-y-auto bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDAsIDAsIDAsIDAuMDIpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] p-4">
                {loadingMessages ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <p className="text-sm text-muted-foreground">Chargement des messages...</p>
                    </div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                        <MessageSquare className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground font-medium mb-1">Aucun message</p>
                      <p className="text-sm text-muted-foreground">Envoyez le premier message à ce recruteur !</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 max-w-4xl mx-auto">
                    {messages.map((message) => (
                      <div 
                        key={message.id} 
                        className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[65%] rounded-lg px-3 py-2 shadow-sm ${
                            message.sender === "me"
                              ? "bg-primary text-primary-foreground rounded-br-none"
                              : "bg-white dark:bg-muted border rounded-bl-none"
                          }`}
                        >
                          <p className="text-[15px] leading-relaxed break-words">{message.content}</p>
                          <p
                            className={`mt-1 text-[11px] ${
                              message.sender === "me" 
                                ? "text-primary-foreground/70 text-right" 
                                : "text-muted-foreground text-right"
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
              </div>

              {/* Input zone - fixe en bas */}
              <div className="flex-shrink-0 bg-muted/5 border-t px-4 py-3">
                <div className="flex items-end gap-2 max-w-4xl mx-auto">
                  <Button variant="ghost" size="icon" className="h-10 w-10 flex-shrink-0">
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Tapez un message"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      className="pr-12 min-h-[42px] resize-none"
                      disabled={sending}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                    />
                  </div>
                  <Button 
                    size="icon"
                    className="h-10 w-10 rounded-full bg-primary hover:bg-primary/90 flex-shrink-0"
                    onClick={handleSendMessage}
                    disabled={sending || !messageText.trim()}
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
          )}
        </div>
      </div>
    </div>
  )
}
