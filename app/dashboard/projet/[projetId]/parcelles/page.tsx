"use client"

import { useEffect, use, useState } from "react"
import { useRouter } from "next/navigation"
import { MapPin, Search, Layers, Building2, MapPinned, Plus, ChevronRight, Leaf, Sprout, CalendarDays, CheckCircle2, XCircle, ChevronDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/auth-context"
import { projets, getParcellesByProjet, getPlantsByProjet, especes } from "@/lib/mock-data"
import { DashboardLayout } from "@/components/dashboard-layout"

interface Props {
  params: Promise<{ projetId: string }>
}

export default function ParcellesPage({ params }: Props) {
  const { projetId } = use(params)
  const { user } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [columnFilters, setColumnFilters] = useState({
    espece: "all",
    parcelle: "all",
    ville: "all"
  })

  const projet = projets.find((p) => p.id === projetId)
  const parcelles = getParcellesByProjet(projetId)
  const plants = getPlantsByProjet(projetId)

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
    const parcel = parcelles.find(p => p.id === plant.parcelleId)

    const matchesGlobal =
      plant.especeNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plant.parcelleNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plant.ville.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesColumnEspece = columnFilters.espece === "all" || plant.especeNom === columnFilters.espece
    const matchesColumnParcelle = columnFilters.parcelle === "all" || plant.parcelleNom === columnFilters.parcelle
    const matchesColumnVille = columnFilters.ville === "all" || plant.ville === columnFilters.ville

    return matchesGlobal && matchesColumnEspece && matchesColumnParcelle && matchesColumnVille
  })

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
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une parcelle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-full sm:w-64 bg-secondary border-border"
              />
            </div>
            <Button
              className="bg-primary hover:bg-[var(--forest-green-hover)] text-primary-foreground"
              onClick={() => router.push(`/dashboard/projet/${projetId}/parcelles/nouveau`)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* ... existing stats cards ... */}
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

        {/* Parcels Grid (3 columns, stretching to full width) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
          {filteredPlants.reduce((acc: any[], plant) => {
            const parcel = parcelles.find(p => p.id === plant.parcelleId)
            if (parcel && !acc.find(p => p.id === parcel.id)) {
              acc.push(parcel)
            }
            return acc
          }, []).map((parcelle) => (
            <Card
              key={parcelle.id}
              className="bg-card border-border cursor-pointer transition-all hover:border-primary/50 hover:bg-accent/40 group overflow-hidden"
              onClick={() => router.push(`/dashboard/projet/${projetId}/parcelles/${parcelle.id}`)}
            >
              <CardContent className="p-3 flex flex-col items-center text-center space-y-2">
                <div className="p-1.5 bg-chart-2/10 rounded-md group-hover:bg-primary/10 transition-colors">
                  <MapPinned className="w-4 h-4 text-chart-2 group-hover:text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm line-clamp-1">{parcelle.nom}</p>
                  <p className="text-xs text-muted-foreground">{parcelle.superficie} ha</p>
                </div>
              </CardContent>
            </Card>
          ))}
          {parcelles.length === 0 && (
            <div className="col-span-full py-20 text-center bg-secondary/20 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center space-y-3">
              <Layers className="w-10 h-10 text-muted-foreground/30" />
              <p className="text-muted-foreground">Aucune parcelle trouvée pour ce projet.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
