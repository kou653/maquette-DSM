"use client"

import { useEffect, use, useState } from "react"
import { useRouter } from "next/navigation"
import { Leaf, Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useAuth } from "@/lib/auth-context"
import { projets, especes } from "@/lib/mock-data"
import { DashboardLayout } from "@/components/dashboard-layout"

interface Props {
  params: Promise<{ projetId: string }>
}

export default function EspecesPage({ params }: Props) {
  const { projetId } = use(params)
  const { user } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")

  const projet = projets.find((p) => p.id === projetId)

  useEffect(() => {
    if (!user) {
      router.push("/")
      return
    }
    if (user.role !== "administrateur" && !user.projetsAffectes.includes(projetId)) {
      router.push("/dashboard")
    }
  }, [user, projetId, router])

  if (!user || !projet) return null

  const filteredEspeces = especes.filter(
    (e) =>
      e.nomCommun.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.nomScientifique.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Leaf className="w-6 h-6 text-primary" />
              Espèces
            </h1>
            <p className="text-muted-foreground">
              Catalogue des espèces végétales
            </p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une espèce..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full sm:w-64 bg-secondary border-border"
            />
          </div>
        </div>

        {/* Stats */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Leaf className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total espèces référencées</p>
                <p className="text-2xl font-bold text-foreground">{especes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base text-foreground">
              Catalogue des espèces ({filteredEspeces.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="text-muted-foreground">ID</TableHead>
                    <TableHead className="text-muted-foreground">Nom commun</TableHead>
                    <TableHead className="text-muted-foreground">Nom scientifique</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEspeces.map((espece) => (
                    <TableRow key={espece.id} className="border-border">
                      <TableCell className="font-mono text-sm text-muted-foreground">
                        {espece.id}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Leaf className="w-4 h-4 text-primary" />
                          <span className="font-medium text-foreground">{espece.nomCommun}</span>
                        </div>
                      </TableCell>
                      <TableCell className="italic text-muted-foreground">
                        {espece.nomScientifique}
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredEspeces.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                        Aucune espèce trouvée
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
    
  )
  
}
