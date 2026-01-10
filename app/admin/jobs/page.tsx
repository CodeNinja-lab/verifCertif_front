"use client"

import { useState, useEffect } from "react"
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Search, Filter, Eye, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface JobOffer {
  id: number
  titre: string
  entreprise: string
  lieu: string
  type_contrat: string
  statut: string
  created_at: string
  candidatures_count?: number
}

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<JobOffer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    loadJobs()
  }, [])

  const loadJobs = async () => {
    try {
      setLoading(true)
      const { offreApi } = await import("@/lib/api-client")
      const data = await offreApi.list({ per_page: 100 })
      setJobs(data.data || [])
    } catch (error) {
      console.error('Erreur chargement offres:', error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les offres d'emploi",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: number) => {
    try {
      const { offreApi } = await import("@/lib/api-client")
      await offreApi.update(id, { statut: 'PUBLIEE' })
      toast({
        title: "Succès",
        description: "L'offre a été approuvée",
      })
      loadJobs()
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'approuver l'offre",
        variant: "destructive",
      })
    }
  }

  const handleReject = async (id: number) => {
    try {
      const { offreApi } = await import("@/lib/api-client")
      await offreApi.update(id, { statut: 'REJETEE' })
      toast({
        title: "Succès",
        description: "L'offre a été rejetée",
      })
      loadJobs()
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de rejeter l'offre",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette offre ?")) return
    
    try {
      const { offreApi } = await import("@/lib/api-client")
      await offreApi.delete(id)
      toast({
        title: "Succès",
        description: "L'offre a été supprimée",
      })
      loadJobs()
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'offre",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: any; className?: string }> = {
      PUBLIEE: { label: "Publiée", variant: "default", className: "bg-emerald-500 hover:bg-emerald-600" },
      EN_ATTENTE: { label: "En attente", variant: "secondary", className: "bg-amber-500 hover:bg-amber-600" },
      BROUILLON: { label: "Brouillon", variant: "outline" },
      EXPIREE: { label: "Expirée", variant: "destructive" },
      REJETEE: { label: "Rejetée", variant: "destructive" },
    }
    
    const statusInfo = statusMap[status] || { label: status, variant: "outline" }
    return (
      <Badge variant={statusInfo.variant} className={statusInfo.className}>
        {statusInfo.label}
      </Badge>
    )
  }

  const filteredJobs = jobs.filter(job => 
    searchTerm === "" ||
    job.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.entreprise?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.lieu?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Offres d'emploi</h1>
          <p className="text-muted-foreground">Modérez et gérez les offres publiées sur la plateforme.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => loadJobs()}>
            <Filter className="mr-2 h-4 w-4" />
            Actualiser
          </Button>
          <Button>Exporter</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Toutes les offres</CardTitle>
          <CardDescription>
            {loading ? "Chargement..." : `${filteredJobs.length} offre(s) d'emploi`}
          </CardDescription>
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Rechercher par titre, entreprise ou mots-clés..." 
                className="pl-9 max-w-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? "Aucune offre ne correspond à votre recherche" : "Aucune offre d'emploi disponible"}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titre du poste</TableHead>
                  <TableHead>Entreprise</TableHead>
                  <TableHead>Localisation</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Candidatures</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.titre}</TableCell>
                    <TableCell>{job.entreprise || "N/A"}</TableCell>
                    <TableCell>{job.lieu || "N/A"}</TableCell>
                    <TableCell>{job.type_contrat || "N/A"}</TableCell>
                    <TableCell>{getStatusBadge(job.statut)}</TableCell>
                    <TableCell>{job.candidatures_count || 0}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/jobs/${job.id}`}>
                              <Eye className="mr-2 h-4 w-4" /> Voir l'offre
                            </Link>
                          </DropdownMenuItem>
                          {job.statut !== 'PUBLIEE' && (
                            <DropdownMenuItem onClick={() => handleApprove(job.id)}>
                              <CheckCircle className="mr-2 h-4 w-4 text-emerald-500" /> Approuver
                            </DropdownMenuItem>
                          )}
                          {job.statut !== 'REJETEE' && (
                            <DropdownMenuItem onClick={() => handleReject(job.id)}>
                              <XCircle className="mr-2 h-4 w-4 text-destructive" /> Rejeter
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDelete(job.id)}
                          >
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
