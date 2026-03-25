"use client"

import { useEffect, use, useState } from "react"
import { useRouter } from "next/navigation"
import { MapPin, Search, Layers, Building2, MapPinned } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useAuth } from "@/lib/auth-context"
import { projets, getParcellesByProjet } from "@/lib/mock-data"
import { DashboardLayout } from "@/components/dashboard-layout"

interface Props {
  params: Promise<{ projetId: string }>
}

export default function ParcellesPage({ params }: Props) {
  const { projetId } = use(params)
  const { user } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")

  const projet = projets.find((p) => p.id === projetId)
  const parcelles = getParcellesByProjet(projetId)

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

  const filteredParcelles = parcelles.filter(
    (p) =>
      p.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.ville.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.cooperative.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalSuperficie = parcelles.reduce((acc, p) => acc + p.superficie, 0)

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Layers className="w-6 h-6 text-chart-2" />
              Parcelles
            </h1>
            <p className="text-muted-foreground">
              Liste des parcelles du projet {projet.nom}
            </p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une parcelle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full sm:w-64 bg-secondary border-border"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-chart-2/10 rounded-lg">
                  <Layers className="w-5 h-5 text-chart-2" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total parcelles</p>
                  <p className="text-2xl font-bold text-foreground">{parcelles.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Superficie totale</p>
                  <p className="text-2xl font-bold text-foreground">{totalSuperficie.toFixed(1)} ha</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-chart-3/10 rounded-lg">
                  <Building2 className="w-5 h-5 text-chart-3" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Coopératives</p>
                  <p className="text-2xl font-bold text-foreground">
                    {[...new Set(parcelles.map((p) => p.cooperative))].length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base text-foreground">
              Liste des parcelles ({filteredParcelles.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="text-muted-foreground">Nom / ID</TableHead>
                    <TableHead className="text-muted-foreground">Ville</TableHead>
                    <TableHead className="text-muted-foreground">Coopérative</TableHead>
                    <TableHead className="text-muted-foreground">Superficie</TableHead>
                    <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredParcelles.map((parcelle) => (
                    <TableRow key={parcelle.id} className="border-border">
                      <TableCell>
                        <div>
                          <p className="font-medium text-foreground">{parcelle.nom}</p>
                          <p className="text-xs text-muted-foreground">{parcelle.id}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-foreground">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          {parcelle.ville}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-foreground">
                          <Building2 className="w-4 h-4 text-muted-foreground" />
                          {parcelle.cooperative}
                        </div>
                      </TableCell>
                      <TableCell className="text-foreground">{parcelle.superficie} ha</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/dashboard/projet/${projetId}/carte?parcelle=${parcelle.id}`)}
                          className="text-primary hover:text-primary/80"
                        >
                          <MapPinned className="w-4 h-4 mr-1" />
                          Voir sur la carte
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredParcelles.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        Aucune parcelle trouvée
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
