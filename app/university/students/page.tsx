"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, UserPlus, Mail, Phone, MoreVertical, GraduationCap } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const students = [
  {
    id: 1,
    name: "Sophie Martin",
    email: "sophie.martin@univ.fr",
    phone: "+221 77 123 45 67",
    program: "Master Informatique",
    year: "2024",
    status: "active",
    degrees: 2,
  },
  {
    id: 2,
    name: "Thomas Dubois",
    email: "thomas.dubois@univ.fr",
    phone: "+221 77 234 56 78",
    program: "Licence Mathématiques",
    year: "2024",
    status: "active",
    degrees: 1,
  },
  {
    id: 3,
    name: "Marie Laurent",
    email: "marie.laurent@univ.fr",
    phone: "+221 77 345 67 89",
    program: "Doctorat Physique",
    year: "2023",
    status: "graduated",
    degrees: 3,
  },
  {
    id: 4,
    name: "Pierre Bernard",
    email: "pierre.bernard@univ.fr",
    phone: "+221 77 456 78 90",
    program: "Master Économie",
    year: "2024",
    status: "active",
    degrees: 1,
  },
  {
    id: 5,
    name: "Julie Petit",
    email: "julie.petit@univ.fr",
    phone: "+221 77 567 89 01",
    program: "Licence Droit",
    year: "2025",
    status: "active",
    degrees: 0,
  },
]

export default function StudentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterProgram, setFilterProgram] = useState("all")

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des étudiants</h1>
          <p className="text-muted-foreground">Gérez les profils et diplômes de vos étudiants</p>
        </div>
        <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:opacity-90">
          <UserPlus className="mr-2 h-4 w-4" />
          Ajouter un étudiant
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total étudiants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,847</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">9,234</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Diplômés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,613</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Nouveaux (ce mois)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">287</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="graduated">Diplômé</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterProgram} onValueChange={setFilterProgram}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Programme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les programmes</SelectItem>
                  <SelectItem value="master">Master</SelectItem>
                  <SelectItem value="licence">Licence</SelectItem>
                  <SelectItem value="doctorat">Doctorat</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Étudiant</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Programme</TableHead>
                <TableHead>Année</TableHead>
                <TableHead>Diplômes</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-semibold text-white">
                          {student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{student.name}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">{student.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">{student.phone}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      <span>{student.program}</span>
                    </div>
                  </TableCell>
                  <TableCell>{student.year}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {student.degrees} diplôme{student.degrees > 1 ? "s" : ""}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {student.status === "active" ? (
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400">Actif</Badge>
                    ) : (
                      <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400">Diplômé</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Voir le profil</DropdownMenuItem>
                        <DropdownMenuItem>Modifier</DropdownMenuItem>
                        <DropdownMenuItem>Ajouter un diplôme</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Désactiver</DropdownMenuItem>
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
