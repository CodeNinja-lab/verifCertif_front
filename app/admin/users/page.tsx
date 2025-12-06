import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal, Search, Filter } from "lucide-react"

export default function AdminUsersPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Utilisateurs</h1>
          <p className="text-muted-foreground">Gérez les candidats et les recruteurs de la plateforme.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filtrer
          </Button>
          <Button>Ajouter un utilisateur</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des utilisateurs</CardTitle>
          <CardDescription>Consultez et gérez les comptes utilisateurs.</CardDescription>
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Rechercher par nom, email ou entreprise..." className="pl-9 max-w-sm" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Inscription</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                {
                  name: "Sophie Martin",
                  email: "sophie.m@example.com",
                  role: "Candidat",
                  status: "Actif",
                  date: "24 Nov 2023",
                  avatar: "/placeholder.svg?height=40&width=40",
                },
                {
                  name: "Thomas Dubois",
                  email: "t.dubois@entreprise.sn",
                  role: "Recruteur",
                  status: "Actif",
                  date: "23 Nov 2023",
                  avatar: "/placeholder.svg?height=40&width=40",
                },
                {
                  name: "Marie Leroy",
                  email: "marie.leroy@example.com",
                  role: "Candidat",
                  status: "Inactif",
                  date: "20 Nov 2023",
                  avatar: "/placeholder.svg?height=40&width=40",
                },
                {
                  name: "Jean Pierre",
                  email: "jean.pierre@startup.io",
                  role: "Recruteur",
                  status: "Vérification",
                  date: "18 Nov 2023",
                  avatar: "/placeholder.svg?height=40&width=40",
                },
                {
                  name: "Lucas Bernard",
                  email: "lucas.b@example.com",
                  role: "Candidat",
                  status: "Banni",
                  date: "15 Nov 2023",
                  avatar: "/placeholder.svg?height=40&width=40",
                },
              ].map((user, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">{user.name}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={user.role === "Recruteur" ? "border-primary text-primary" : ""}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.status === "Actif"
                          ? "default"
                          : user.status === "Banni"
                            ? "destructive"
                            : user.status === "Vérification"
                              ? "secondary"
                              : "outline"
                      }
                      className={user.status === "Actif" ? "bg-emerald-500 hover:bg-emerald-600" : ""}
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.date}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Voir le profil</DropdownMenuItem>
                        <DropdownMenuItem>Modifier</DropdownMenuItem>
                        <DropdownMenuItem>Envoyer un message</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Suspendre le compte</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
