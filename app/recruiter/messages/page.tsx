"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Send, Paperclip, MoreVertical, Phone, Video, Star } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

const conversations = [
  {
    id: 1,
    candidate: "Alexandre Dupont",
    position: "Senior React Developer",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Oui, je suis disponible jeudi ou vendredi",
    time: "Il y a 2 min",
    unread: 1,
    online: true,
    starred: true,
  },
  {
    id: 2,
    candidate: "Léa Martinez",
    position: "UX Designer",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Merci pour cette opportunité",
    time: "Il y a 1h",
    unread: 0,
    online: false,
    starred: false,
  },
  {
    id: 3,
    candidate: "Julien Bernard",
    position: "Product Manager",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Je peux vous envoyer mon portfolio",
    time: "Hier",
    unread: 2,
    online: true,
    starred: true,
  },
]

const messages = [
  {
    id: 1,
    sender: "me",
    content: "Bonjour Alexandre, votre profil correspond parfaitement à notre recherche !",
    time: "10:30",
  },
  {
    id: 2,
    sender: "candidate",
    content: "Merci beaucoup pour votre message. Je suis très intéressé par cette opportunité.",
    time: "10:32",
  },
  {
    id: 3,
    sender: "me",
    content: "Super ! Nous aimerions vous rencontrer pour un entretien. Seriez-vous disponible cette semaine ?",
    time: "10:35",
  },
  {
    id: 4,
    sender: "candidate",
    content: "Oui, je suis disponible jeudi ou vendredi après-midi.",
    time: "10:37",
  },
]

export default function RecruiterMessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0])
  const [messageText, setMessageText] = useState("")

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
              <Input placeholder="Rechercher un candidat..." className="pl-9" />
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="space-y-1 p-2">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv)}
                  className={`flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors hover:bg-accent ${
                    selectedConversation.id === conv.id ? "bg-accent" : ""
                  }`}
                >
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={conv.avatar || "/placeholder.svg"} alt={conv.candidate} />
                      <AvatarFallback>{conv.candidate.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    {conv.online && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-emerald-500" />
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-sm">{conv.candidate}</div>
                      <div className="flex items-center gap-1">
                        {conv.starred && <Star className="h-3 w-3 fill-amber-500 text-amber-500" />}
                        {conv.unread > 0 && (
                          <Badge className="h-5 min-w-5 px-1.5 text-xs bg-primary">{conv.unread}</Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">{conv.position}</div>
                    <div className="truncate text-sm text-muted-foreground">{conv.lastMessage}</div>
                    <div className="text-xs text-muted-foreground">{conv.time}</div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="flex flex-1 flex-col">
          <div className="flex items-center justify-between border-b border-border p-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar>
                  <AvatarImage
                    src={selectedConversation.avatar || "/placeholder.svg"}
                    alt={selectedConversation.candidate}
                  />
                  <AvatarFallback>{selectedConversation.candidate.substring(0, 2)}</AvatarFallback>
                </Avatar>
                {selectedConversation.online && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-emerald-500" />
                )}
              </div>
              <div>
                <div className="font-semibold">{selectedConversation.candidate}</div>
                <div className="text-sm text-muted-foreground">{selectedConversation.position}</div>
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

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${
                      message.sender === "me"
                        ? "bg-gradient-to-r from-secondary to-primary text-primary-foreground"
                        : "bg-accent"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
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
            </div>
          </ScrollArea>

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
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    setMessageText("")
                  }
                }}
              />
              <Button size="icon" className="bg-gradient-to-r from-secondary to-primary">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
