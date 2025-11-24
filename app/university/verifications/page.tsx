import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileCheck, Building2, TrendingUp, Clock, CheckCircle2 } from "lucide-react"

const verifications = [
  {
    id: 1,
    company: "Tech Corp",
    student: "Sophie Martin",
    degree: "Master Informatique",
    date: "2024-01-15 14:23",
    status: "verified",
    ipAddress: "192.168.1.1",
  },
  {
    id: 2,
    company: "Innovation Labs",
    student: "Thomas Dubois",
    degree: "Licence Mathématiques",
    date: "2024-01-15 12:45",
    status: "verified",
    ipAddress: "192.168.1.2",
  },
  {
    id: 3,
    company: "Digital Solutions",
    student: "Marie Laurent",
    degree: "Doctorat Physique",
    date: "2024-01-14 16:30",
    status: "verified",
    ipAddress: "192.168.1.3",
  },
  {
    id: 4,
    company: "StartUp Inc",
    student: "Pierre Bernard",
    degree: "Master Économie",
    date: "2024-01-14 10:15",
    status: "verified",
    ipAddress: "192.168.1.4",
  },
  {
    id: 5,
    company: "Consulting Group",
    student: "Julie Petit",
    degree: "Licence Droit",
    date: "2024-01-13 15:50",
    status: "verified",
    ipAddress: "192.168.1.5",
  },
]

export default function VerificationsPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Historique des vérifications</h1>
        <p className="text-muted-foreground">
          Suivez toutes les vérifications de diplômes effectuées par les recruteurs
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Vérifications totales</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,423</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-green-500 font-medium">+24.1%</span>
              <span>ce mois-ci</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Aujourd'hui</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground mt-1">Dernière il y a 2 min</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Entreprises uniques</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <p className="text-xs text-muted-foreground mt-1">Recruteurs actifs</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vérifications récentes</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Entreprise</TableHead>
                <TableHead>Étudiant</TableHead>
                <TableHead>Diplôme vérifié</TableHead>
                <TableHead>Date & Heure</TableHead>
                <TableHead>IP</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {verifications.map((verification) => (
                <TableRow key={verification.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                        <Building2 className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-medium">{verification.company}</span>
                    </div>
                  </TableCell>
                  <TableCell>{verification.student}</TableCell>
                  <TableCell>{verification.degree}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{verification.date}</TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-2 py-1 rounded">{verification.ipAddress}</code>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Vérifié
                    </Badge>
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
