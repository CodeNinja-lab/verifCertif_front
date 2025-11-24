"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, Plus, FileCheck, Clock, Award, Download, Eye, QrCode } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

const degrees = [
  {
    id: "DEG-2024-001",
    student: "Sophie Martin",
    degree: "Master en Informatique",
    date: "2024-06-15",
    status: "certified",
    hash: "a3f5e8c2d1b4f7e9c8d5a2b6f3e1d4c7",
    verifications: 12,
  },
  {
    id: "DEG-2024-002",
    student: "Thomas Dubois",
    degree: "Licence en Mathématiques",
    date: "2024-06-14",
    status: "certified",
    hash: "b6d2c4e1f8a5d3c9e7b4f2a6d8c5e1f3",
    verifications: 8,
  },
  {
    id: "DEG-2024-003",
    student: "Marie Laurent",
    degree: "Doctorat en Physique",
    date: "2024-06-13",
    status: "pending",
    hash: null,
    verifications: 0,
  },
  {
    id: "DEG-2024-004",
    student: "Pierre Bernard",
    degree: "Master en Économie",
    date: "2024-06-12",
    status: "certified",
    hash: "c8e4d2b5f7a9c3e1d6b8f4a2e5c9d7b1",
    verifications: 5,
  },
  {
    id: "DEG-2024-005",
    student: "Julie Petit",
    degree: "Licence en Droit",
    date: "2024-06-11",
    status: "pending",
    hash: null,
    verifications: 0,
  },
]

export default function DegreesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des diplômes</h1>
          <p className="text-muted-foreground">Certifiez et gérez les diplômes de vos étudiants</p>
        </div>
        <Button asChild className="bg-gradient-to-r from-purple-500 to-pink-600 hover:opacity-90">
          <Link href="/university/certifications/new">
            <Plus className="mr-2 h-4 w-4" />
            Nouveau diplôme
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total diplômes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,256</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Certifiés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">2,891</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">En attente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">365</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Vérifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,423</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par étudiant, diplôme..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="certified">Certifié</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Étudiant</TableHead>
                <TableHead>Diplôme</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Hash blockchain</TableHead>
                <TableHead>Vérifications</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {degrees.map((degree) => (
                <TableRow key={degree.id}>
                  <TableCell className="font-mono text-sm">{degree.id}</TableCell>
                  <TableCell className="font-medium">{degree.student}</TableCell>
                  <TableCell>{degree.degree}</TableCell>
                  <TableCell>{degree.date}</TableCell>
                  <TableCell>
                    {degree.hash ? (
                      <code className="text-xs bg-muted px-2 py-1 rounded">{degree.hash.substring(0, 12)}...</code>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{degree.verifications}</Badge>
                  </TableCell>
                  <TableCell>
                    {degree.status === "certified" ? (
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400">
                        <FileCheck className="mr-1 h-3 w-3" />
                        Certifié
                      </Badge>
                    ) : (
                      <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400">
                        <Clock className="mr-1 h-3 w-3" />
                        En attente
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          Actions
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Voir les détails
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Télécharger PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <QrCode className="mr-2 h-4 w-4" />
                          Voir QR Code
                        </DropdownMenuItem>
                        {degree.status === "pending" && (
                          <DropdownMenuItem>
                            <Award className="mr-2 h-4 w-4" />
                            Certifier maintenant
                          </DropdownMenuItem>
                        )}
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
