"use client"

import { use } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Layers, MapPin, Building2, MapPinned, Leaf, CalendarDays, CheckCircle2, XCircle, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { DashboardLayout } from "@/components/dashboard-layout"
import { projets, parcelles, getPlantsByParcelle, especes } from "@/lib/mock-data"
import { useState } from "react"

interface Props {
  params: Promise<{ projetId: string, parcelleId: string }>
}

export default function ParcelleDetailPage({ params }: Props) {
  const { projetId, parcelleId } = use(params)
  const router = useRouter()
  const [columnFilters, setColumnFilters] = useState({
    espece: "all",
    nomScientifique: "all",
    etat: "all"
  })

  const projet = projets.find((p) => p.id === projetId)
  const parcelle = parcelles.find((p) => p.id === parcelleId)
  const plants = getPlantsByParcelle(parcelleId)

  if (!projet || !parcelle) return null

  const filteredPlants = plants.filter((plant: any) => {
    const especeData = especes.find((e) => e.id === plant.especeId)
    const matchesEspece = columnFilters.espece === "all" || plant.especeNom === columnFilters.espece
    const matchesScientifique = columnFilters.nomScientifique === "all" || especeData?.nomScientifique === columnFilters.nomScientifique
    const matchesEtat = columnFilters.etat === "all" || plant.status === columnFilters.etat
    return matchesEspece && matchesScientifique && matchesEtat
  })

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="text-muted-foreground hover:text-foreground mb-2"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Retour aux parcelles
        </Button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <MapPinned className="w-6 h-6 text-chart-2" />
              Détails de la parcelle: {parcelle.nom}
            </h1>
            <p className="text-muted-foreground">
              Projet: {projet.nom}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push(`/dashboard/projet/${projetId}/carte?parcelle=${parcelleId}`)}
          >
            <MapPin className="w-4 h-4 mr-2" />
            Voir sur la carte
          </Button>
        </div>
        {/* Objectif de la parcelle (At the top) */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
              Objectif de la parcelle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 rounded-lg bg-secondary/30 border border-border">
              <p className="text-foreground italic">"{parcelle.objectif || "Aucun objectif spécifique défini pour cette parcelle."}"</p>
            </div>
          </CardContent>
        </Card>

        {/* Technical Info (Condensed) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card border-border p-4 flex flex-col items-center justify-center text-center">
            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Ville</p>
            <div className="flex items-center gap-2 text-foreground font-medium">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              {parcelle.ville}
            </div>
          </Card>
          <Card className="bg-card border-border p-4 flex flex-col items-center justify-center text-center">
            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Superficie</p>
            <p className="text-foreground font-medium">{parcelle.superficie} ha</p>
          </Card>
          <Card className="bg-card border-border p-4 flex flex-col items-center justify-center text-center">
            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Coopérative</p>
            <div className="flex items-center gap-2 text-foreground font-medium">
              <Building2 className="w-4 h-4 text-muted-foreground" />
              {parcelle.cooperative}
            </div>
          </Card>
          <Card className="bg-card border-border p-4 flex flex-col items-center justify-center text-center">
            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Plants total</p>
            <p className="text-foreground font-medium">{plants.length}</p>
          </Card>
        </div>

        {/* Detailed Plants Table */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Liste des plants de la parcelle</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="text-muted-foreground">
                      <div className="flex items-center gap-2 py-1">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-auto p-0 hover:bg-transparent flex items-center gap-1 font-semibold text-muted-foreground">
                              <span>Espèce</span>
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="bg-popover border-border">
                            <DropdownMenuItem onClick={() => setColumnFilters({...columnFilters, espece: "all"})}>
                              Tout
                            </DropdownMenuItem>
                            {[...new Set(plants.map((p: any) => p.especeNom))].map((val: any) => (
                              <DropdownMenuItem key={val} onClick={() => setColumnFilters({...columnFilters, espece: val})}>
                                {val}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      <div className="flex items-center gap-2 py-1">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-auto p-0 hover:bg-transparent flex items-center gap-1 font-semibold text-muted-foreground whitespace-nowrap">
                              <span>Nom scientifique</span>
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="bg-popover border-border">
                            <DropdownMenuItem onClick={() => setColumnFilters({...columnFilters, nomScientifique: "all"})}>
                              Tout
                            </DropdownMenuItem>
                            {[...new Set(plants.map((p: any) => especes.find(e => e.id === p.especeId)?.nomScientifique))].filter(Boolean).map((val: any) => (
                              <DropdownMenuItem key={val} onClick={() => setColumnFilters({...columnFilters, nomScientifique: val})}>
                                {val}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableHead>
                    <TableHead className="text-muted-foreground">GPS</TableHead>
                    <TableHead className="text-muted-foreground">Date plantation</TableHead>
                    <TableHead className="text-muted-foreground text-right">
                      <div className="flex items-center justify-end gap-2 py-1">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-auto p-0 hover:bg-transparent flex items-center gap-1 font-semibold text-muted-foreground">
                              <span>État</span>
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-popover border-border">
                            <DropdownMenuItem onClick={() => setColumnFilters({...columnFilters, etat: "all"})}>
                              Tout
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setColumnFilters({...columnFilters, etat: "vivant"})}>
                              Vivant
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setColumnFilters({...columnFilters, etat: "mort"})}>
                              Mort
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPlants.map((plant: any) => {
                    const especeData = especes.find((e) => e.id === plant.especeId)
                    return (
                      <TableRow key={plant.id} className="border-border">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Leaf className="w-4 h-4 text-primary" />
                            <span className="font-medium text-foreground">{plant.especeNom}</span>
                          </div>
                          <p className="text-[10px] text-muted-foreground font-mono">{plant.id}</p>
                        </TableCell>
                        <TableCell className="text-muted-foreground italic text-sm">
                          {especeData?.nomScientifique || "-"}
                        </TableCell>
                        <TableCell className="font-mono text-[11px] text-muted-foreground">
                          {plant.coordonnees.lat.toFixed(4)}, {plant.coordonnees.lng.toFixed(4)}
                        </TableCell>
                        <TableCell className="text-sm">
                          <div className="flex items-center gap-2 text-foreground">
                            <CalendarDays className="w-3.5 h-3.5 text-muted-foreground" />
                            {new Date(plant.datePlantation).toLocaleDateString("fr-FR")}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge
                            variant={plant.status === "vivant" ? "default" : "destructive"}
                            className={
                              plant.status === "vivant"
                                ? "bg-primary/20 text-foreground border-primary/30 text-[10px]"
                                : "bg-destructive/20 text-foreground border-destructive/30 text-[10px]"
                            }
                          >
                            {plant.status === "vivant" ? "Vivant" : "Mort"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                  {filteredPlants.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-12">
                        Aucun plant trouvé pour cette parcelle.
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
