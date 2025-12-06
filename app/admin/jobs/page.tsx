import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Search, Filter, Eye, CheckCircle, XCircle } from "lucide-react"

export default function AdminJobsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Offres d'emploi</h1>
          <p className="text-muted-foreground">Modérez et gérez les offres publiées sur la plateforme.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filtrer
          </Button>
          <Button>Exporter</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Toutes les offres</CardTitle>
          <CardDescription>Liste complète des offres d'emploi.</CardDescription>
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Rechercher par titre, entreprise ou mots-clés..." className="pl-9 max-w-sm" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
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
              {[
                {
                  title: "Senior React Developer",
                  company: "Entreprise Sénégal",
                  location: "Dakar (Hybride)",
                  type: "CDI",
                  status: "Active",
                  applicants: 45,
                },
                {
                  title: "Product Manager",
                  company: "FinTech Pro",
                  location: "Lyon",
                  type: "CDI",
                  status: "En attente",
                  applicants: 0,
                },
                {
                  title: "Marketing Intern",
                  company: "Creative Agency",
                  location: "Bordeaux",
                  type: "Stage",
                  status: "Active",
                  applicants: 12,
                },
                {
                  title: "DevOps Engineer",
                  company: "CloudSystems",
                  location: "Remote",
                  type: "Freelance",
                  status: "Expirée",
                  applicants: 28,
                },
                {
                  title: "Sales Representative",
                  company: "Growth Co",
                  location: "Marseille",
                  type: "CDI",
                  status: "Rejetée",
                  applicants: 0,
                },
              ].map((job, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{job.title}</TableCell>
                  <TableCell>{job.company}</TableCell>
                  <TableCell>{job.location}</TableCell>
                  <TableCell>{job.type}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        job.status === "Active"
                          ? "default"
                          : job.status === "En attente"
                            ? "secondary"
                            : job.status === "Rejetée" || job.status === "Expirée"
                              ? "destructive"
                              : "outline"
                      }
                      className={
                        job.status === "Active"
                          ? "bg-emerald-500 hover:bg-emerald-600"
                          : job.status === "En attente"
                            ? "bg-amber-500 hover:bg-amber-600"
                            : ""
                      }
                    >
                      {job.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{job.applicants}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" /> Voir l'offre
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <CheckCircle className="mr-2 h-4 w-4 text-emerald-500" /> Approuver
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <XCircle className="mr-2 h-4 w-4 text-destructive" /> Rejeter
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Supprimer</DropdownMenuItem>
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
