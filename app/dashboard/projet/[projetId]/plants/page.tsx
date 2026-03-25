"use client"

import { useEffect, use, useState } from "react"
import { useRouter } from "next/navigation"
import { Sprout, Search, MapPin, Leaf, CalendarDays, CheckCircle2, XCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"
import { projets, getPlantsByProjet, especes, getParcellesByProjet } from "@/lib/mock-data"
import { DashboardLayout } from "@/components/dashboard-layout"

interface Props {
  params: Promise<{ projetId: string }>
}

export default function PlantsPage({ params }: Props) {
  const { projetId } = use(params)
  const { user } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "vivant" | "mort">("all")
  const [especeFilter, setEspeceFilter] = useState<string>("all")

  const projet = projets.find((p) => p.id === projetId)
  const plants = getPlantsByProjet(projetId)
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

  const filteredPlants = plants.filter((plant) => {
    const matchesSearch =
      plant.especeNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plant.parcelleNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plant.ville.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || plant.status === statusFilter
    const matchesEspece = especeFilter === "all" || plant.especeId === especeFilter
    return matchesSearch && matchesStatus && matchesEspece
  })

  const plantsVivants = plants.filter((p) => p.status === "vivant").length
  const plantsMorts = plants.filter((p) => p.status === "mort").length

  // Get unique species in this project
  const projectEspeces = [...new Set(plants.map((p) => p.especeId))].map(
    (id) => especes.find((e) => e.id === id)!
  )

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Sprout className="w-6 h-6 text-primary" />
            Plants
          </h1>
          <p className="text-muted-foreground">
            Liste des plants du projet {projet.nom}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Sprout className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total plants</p>
                  <p className="text-2xl font-bold text-foreground">{plants.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Plants vivants</p>
                  <p className="text-2xl font-bold text-foreground">{plantsVivants}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-destructive/10 rounded-lg">
                  <XCircle className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Plants morts</p>
                  <p className="text-2xl font-bold text-foreground">{plantsMorts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <Card className="bg-card border-border">
          <CardHeader className="space-y-4">
            <CardTitle className="text-base text-foreground">
              Liste des plants ({filteredPlants.length})
            </CardTitle>
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par parcelle, ville..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-secondary border-border"
                />
              </div>
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as "all" | "vivant" | "mort")}>
                <SelectTrigger className="w-full sm:w-36 bg-secondary border-border">
                  <SelectValue placeholder="État" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les états</SelectItem>
                  <SelectItem value="vivant">Vivants</SelectItem>
                  <SelectItem value="mort">Morts</SelectItem>
                </SelectContent>
              </Select>
              <Select value={especeFilter} onValueChange={setEspeceFilter}>
                <SelectTrigger className="w-full sm:w-44 bg-secondary border-border">
                  <SelectValue placeholder="Espèce" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les espèces</SelectItem>
                  {projectEspeces.map((espece) => (
                    <SelectItem key={espece.id} value={espece.id}>
                      {espece.nomCommun}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="text-muted-foreground">ID / Espèce</TableHead>
                    <TableHead className="text-muted-foreground">Nom scientifique</TableHead>
                    <TableHead className="text-muted-foreground">Parcelle</TableHead>
                    <TableHead className="text-muted-foreground">Ville</TableHead>
                    <TableHead className="text-muted-foreground">Coordonnées GPS</TableHead>
                    <TableHead className="text-muted-foreground">Date plantation</TableHead>
                    <TableHead className="text-muted-foreground">État</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPlants.map((plant) => {
                    const especeData = especes.find((e) => e.id === plant.especeId)
                    return (
                    <TableRow key={plant.id} className="border-border">
                      <TableCell>
                        <div>
                          <div className="flex items-center gap-2">
                            <Leaf className="w-4 h-4 text-primary" />
                            <span className="font-medium text-foreground">{plant.especeNom}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{plant.id}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground italic">
                        {especeData?.nomScientifique || "-"}
                      </TableCell>
                      <TableCell className="text-foreground">{plant.parcelleNom}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-foreground">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          {plant.ville}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm text-muted-foreground">
                        {plant.coordonnees.lat.toFixed(4)}, {plant.coordonnees.lng.toFixed(4)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-foreground">
                          <CalendarDays className="w-4 h-4 text-muted-foreground" />
                          {new Date(plant.datePlantation).toLocaleDateString("fr-FR")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={plant.status === "vivant" ? "default" : "destructive"}
                          className={
                            plant.status === "vivant"
                              ? "bg-primary/20 text-primary border-primary/30"
                              : "bg-destructive/20 text-destructive border-destructive/30"
                          }
                        >
                          {plant.status === "vivant" ? (
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                          ) : (
                            <XCircle className="w-3 h-3 mr-1" />
                          )}
                          {plant.status === "vivant" ? "Vivant" : "Mort"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )})}
                  
                  {filteredPlants.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        Aucun plant trouvé
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
