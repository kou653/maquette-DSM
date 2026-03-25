"use client"

import { useEffect, use, useState, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Map, Layers, Leaf, Filter, Info, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/lib/auth-context"
import {
  projets,
  getParcellesByProjet,
  getPlantsByProjet,
  monitoringData,
} from "@/lib/mock-data"
import { DashboardLayout } from "@/components/dashboard-layout"

interface Props {
  params: Promise<{ projetId: string }>
}

export default function CartePage({ params }: Props) {
  const { projetId } = use(params)
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const highlightedParcelleId = searchParams.get("parcelle")

  const [showParcelles, setShowParcelles] = useState(true)
  const [showPlants, setShowPlants] = useState(true)
  const [showMonitoring, setShowMonitoring] = useState(false)
  const [selectedParcelle, setSelectedParcelle] = useState<string | null>(highlightedParcelleId)

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

  useEffect(() => {
    if (highlightedParcelleId) {
      setSelectedParcelle(highlightedParcelleId)
    }
  }, [highlightedParcelleId])

  // Calculate survival rates per parcelle
  const parcelleStats = useMemo(() => {
    return parcelles.map((parcelle) => {
      const parcelleMonitoring = monitoringData.filter((m) => m.parcelleId === parcelle.id)
      const totalPlants = parcelleMonitoring.reduce((acc, m) => acc + m.plantsMisEnTerre, 0)
      const totalVivants = parcelleMonitoring.reduce((acc, m) => acc + m.plantsVivants, 0)
      const tauxSurvie = totalPlants > 0 ? (totalVivants / totalPlants) * 100 : 0
      return { ...parcelle, tauxSurvie, totalPlants, totalVivants }
    })
  }, [parcelles])

  // Get color based on survival rate
  const getSurvivalColor = (taux: number) => {
    if (taux >= 85) return "bg-primary"
    if (taux >= 70) return "bg-chart-3"
    if (taux >= 50) return "bg-warning"
    return "bg-destructive"
  }

  const getSurvivalLabel = (taux: number) => {
    if (taux >= 85) return "Excellent"
    if (taux >= 70) return "Bon"
    if (taux >= 50) return "Moyen"
    return "Critique"
  }

  if (!user || !projet) return null

  // Calculate map bounds
  const bounds = useMemo(() => {
    const allCoords = [
      ...parcelles.map((p) => p.coordonnees),
      ...plants.map((p) => p.coordonnees),
    ]
    if (allCoords.length === 0) return { centerLat: 12, centerLng: 0 }

    const sumLat = allCoords.reduce((acc, c) => acc + (c?.lat || 0), 0)
    const sumLng = allCoords.reduce((acc, c) => acc + (c?.lng || 0), 0)
    return { centerLat: sumLat / allCoords.length, centerLng: sumLng / allCoords.length }
  }, [parcelles, plants])

  // Convert geo coords to map position (simplified)
  const geoToMap = (lat: number, lng: number) => {
    const scale = 50
    const x = (lng - bounds.centerLng) * scale + 50
    const y = (bounds.centerLat - lat) * scale + 50
    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) }
  }

  const selectedParcelleData = selectedParcelle
    ? parcelleStats.find((p) => p.id === selectedParcelle)
    : null

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Map className="w-6 h-6 text-chart-2" />
              Carte GPS
            </h1>
            <p className="text-muted-foreground">
              Visualisation géographique des parcelles et plants
            </p>
          </div>
        </div>

        {/* Filters */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-foreground flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filtres d'affichage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-3">
                <Switch checked={showParcelles} onCheckedChange={setShowParcelles} />
                <span className="text-sm text-foreground flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-chart-2" />
                  Parcelles
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={showPlants} onCheckedChange={setShowPlants} />
                <span className="text-sm text-foreground flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  Plants
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={showMonitoring} onCheckedChange={setShowMonitoring} />
                <span className="text-sm text-foreground flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-chart-3" />
                  Taux de survie
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Map and Info */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Map Container */}
          <Card className="bg-card border-border lg:col-span-3">
            <CardContent className="p-0">
              <div className="relative w-full h-[500px] bg-secondary rounded-lg overflow-hidden">
                {/* Map Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-secondary to-muted">
                  {/* Grid lines */}
                  <svg className="w-full h-full absolute" style={{ opacity: 0.1 }}>
                    {[...Array(10)].map((_, i) => (
                      <line
                        key={`h-${i}`}
                        x1="0"
                        y1={`${i * 10}%`}
                        x2="100%"
                        y2={`${i * 10}%`}
                        stroke="currentColor"
                        strokeWidth="1"
                      />
                    ))}
                    {[...Array(10)].map((_, i) => (
                      <line
                        key={`v-${i}`}
                        x1={`${i * 10}%`}
                        y1="0"
                        x2={`${i * 10}%`}
                        y2="100%"
                        stroke="currentColor"
                        strokeWidth="1"
                      />
                    ))}
                  </svg>
                </div>

                {/* Parcelles */}
                {showParcelles &&
                  parcelleStats.map((parcelle) => {
                    const pos = geoToMap(parcelle.coordonnees.lat, parcelle.coordonnees.lng)
                    const isSelected = selectedParcelle === parcelle.id
                    return (
                      <button
                        key={parcelle.id}
                        onClick={() => setSelectedParcelle(isSelected ? null : parcelle.id)}
                        className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all z-10 ${
                          isSelected ? "scale-125" : "hover:scale-110"
                        }`}
                        style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                        title={parcelle.nom}
                      >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            showMonitoring
                              ? getSurvivalColor(parcelle.tauxSurvie)
                              : "bg-chart-2"
                          } ${isSelected ? "ring-2 ring-foreground ring-offset-2 ring-offset-background" : ""}`}
                        >
                          <Layers className="w-4 h-4 text-primary-foreground" />
                        </div>
                      </button>
                    )
                  })}

                {/* Plants */}
                {showPlants &&
                  plants.slice(0, 20).map((plant) => {
                    const pos = geoToMap(plant.coordonnees.lat, plant.coordonnees.lng)
                    return (
                      <div
                        key={plant.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2"
                        style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                        title={`${plant.especeNom} - ${plant.status}`}
                      >
                        <div
                          className={`w-3 h-3 rounded-full ${
                            plant.status === "vivant" ? "bg-primary" : "bg-destructive"
                          }`}
                        />
                      </div>
                    )
                  })}

                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur p-3 rounded-lg border border-border">
                  <p className="text-xs font-semibold text-foreground mb-2">Légende</p>
                  <div className="space-y-1.5">
                    {showParcelles && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="w-4 h-4 rounded bg-chart-2 flex items-center justify-center">
                          <Layers className="w-2.5 h-2.5 text-primary-foreground" />
                        </div>
                        Parcelles
                      </div>
                    )}
                    {showPlants && (
                      <>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="w-3 h-3 rounded-full bg-primary" />
                          Plant vivant
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="w-3 h-3 rounded-full bg-destructive" />
                          Plant mort
                        </div>
                      </>
                    )}
                    {showMonitoring && (
                      <>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="w-3 h-3 rounded bg-primary" />
                          {">"}85% survie
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="w-3 h-3 rounded bg-chart-3" />
                          70-85% survie
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="w-3 h-3 rounded bg-destructive" />
                          {"<"}70% survie
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Coordinates display */}
                <div className="absolute top-4 right-4 bg-card/90 backdrop-blur px-3 py-2 rounded-lg border border-border">
                  <p className="text-xs text-muted-foreground">
                    Centre: {bounds.centerLat.toFixed(2)}°N, {bounds.centerLng.toFixed(2)}°E
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Info Panel */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base text-foreground flex items-center gap-2">
                <Info className="w-4 h-4 text-chart-2" />
                Informations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedParcelleData ? (
                <>
                  <div className="p-3 bg-secondary rounded-lg border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <Layers className="w-4 h-4 text-chart-2" />
                      <span className="font-medium text-foreground">{selectedParcelleData.nom}</span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p className="text-muted-foreground">
                        <MapPin className="w-3 h-3 inline mr-1" />
                        {selectedParcelleData.ville}
                      </p>
                      <p className="text-muted-foreground">
                        Superficie: {selectedParcelleData.superficie} ha
                      </p>
                      <p className="text-muted-foreground">
                        Coopérative: {selectedParcelleData.cooperative}
                      </p>
                    </div>
                  </div>

                  {showMonitoring && (
                    <div className="p-3 bg-secondary rounded-lg border border-border">
                      <p className="text-sm font-medium text-foreground mb-2">Monitoring</p>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Taux de survie</span>
                          <Badge className={`${getSurvivalColor(selectedParcelleData.tauxSurvie)} text-primary-foreground`}>
                            {selectedParcelleData.tauxSurvie.toFixed(1)}%
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">État</span>
                          <span className="text-sm text-foreground">
                            {getSurvivalLabel(selectedParcelleData.tauxSurvie)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Plants</span>
                          <span className="text-sm text-foreground">
                            {selectedParcelleData.totalVivants}/{selectedParcelleData.totalPlants}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground">
                    <p>Coordonnées GPS:</p>
                    <p className="font-mono">
                      {selectedParcelleData.coordonnees.lat.toFixed(4)}°N,{" "}
                      {selectedParcelleData.coordonnees.lng.toFixed(4)}°E
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setSelectedParcelle(null)}
                  >
                    Désélectionner
                  </Button>
                </>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Cliquez sur une parcelle pour voir ses détails</p>
                </div>
              )}

              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2">Statistiques globales</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Parcelles</span>
                    <span className="text-foreground font-medium">{parcelles.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Plants affichés</span>
                    <span className="text-foreground font-medium">{Math.min(plants.length, 20)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
