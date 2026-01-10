"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, Plus, FileCheck, Clock, Award, Download, Eye, QrCode, Loader2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { documentApi } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"

interface Document {
  id: number
  uuid_document: string
  titre: string
  type_document: string
  date_emission: string
  statut: string
  hash_sha256: string | null
  blockchain_tx_hash: string | null
  etudiant: {
    id: number
    prenom: string
    nom: string
  }
  verification_count?: number
}

export default function DegreesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    certified: 0,
    pending: 0,
    verifications: 0,
  })
  const { toast } = useToast()

  useEffect(() => {
    loadDocuments()
  }, [])

  const loadDocuments = async () => {
    try {
      setLoading(true)
      const response = await documentApi.list({
        type_document: "diplome",
      })

      const docs = response.data || []
      setDocuments(docs)

      // Calculate stats
      const total = docs.length
      const certified = docs.filter((d: Document) => d.statut === "ACTIF").length
      const pending = docs.filter((d: Document) => d.statut === "EN_ATTENTE" || d.statut === "BROUILLON").length
      const verifications = docs.reduce((sum: number, d: Document) => sum + (d.verification_count || 0), 0)

      setStats({ total, certified, pending, verifications })
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de charger les diplômes",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      searchQuery === "" ||
      doc.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${doc.etudiant?.prenom} ${doc.etudiant?.nom}`.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "certified" && doc.statut === "ACTIF") ||
      (filterStatus === "pending" && (doc.statut === "EN_ATTENTE" || doc.statut === "BROUILLON"))

    return matchesSearch && matchesStatus
  })

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("fr-FR")
  }

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Chargement des diplômes...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des diplômes</h1>
          <p className="text-muted-foreground">Certifiez et gérez les diplômes de vos étudiants</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadDocuments}>
            Actualiser
          </Button>
          <Button asChild className="bg-gradient-to-r from-purple-500 to-pink-600 hover:opacity-90">
            <Link href="/university/certifications/new">
              <Plus className="mr-2 h-4 w-4" />
              Nouveau diplôme
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total diplômes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Certifiés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.certified}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">En attente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Vérifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.verifications}</div>
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
              {filteredDocuments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    Aucun diplôme trouvé
                  </TableCell>
                </TableRow>
              ) : (
                filteredDocuments.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-mono text-sm">{doc.uuid_document}</TableCell>
                    <TableCell className="font-medium">
                      {doc.etudiant ? `${doc.etudiant.prenom} ${doc.etudiant.nom}` : "N/A"}
                    </TableCell>
                    <TableCell>{doc.titre}</TableCell>
                    <TableCell>{formatDate(doc.date_emission)}</TableCell>
                    <TableCell>
                      {doc.blockchain_tx_hash ? (
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {doc.blockchain_tx_hash.substring(0, 12)}...
                        </code>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{doc.verification_count || 0}</Badge>
                    </TableCell>
                    <TableCell>
                      {doc.statut === "ACTIF" ? (
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
                          <DropdownMenuItem asChild>
                            <Link href={`/university/certifications/${doc.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              Voir les détails
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={async () => {
                              try {
                                const blob = await documentApi.download(doc.id)
                                const url = window.URL.createObjectURL(blob)
                                const a = document.createElement('a')
                                a.href = url
                                a.download = `${doc.titre}_${doc.etudiant?.nom || 'diplome'}.pdf`
                                document.body.appendChild(a)
                                a.click()
                                window.URL.revokeObjectURL(url)
                                document.body.removeChild(a)
                                toast({
                                  title: "Succès",
                                  description: "Diplôme téléchargé avec succès",
                                })
                              } catch (error: any) {
                                toast({
                                  title: "Erreur lors du téléchargement",
                                  description: error.message || "Impossible de télécharger le diplôme",
                                  variant: "destructive",
                                })
                              }
                            }}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Télécharger PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/verify/${doc.uuid_document}`}>
                              <QrCode className="mr-2 h-4 w-4" />
                              Voir QR Code
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
