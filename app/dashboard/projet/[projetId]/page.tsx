"use client"

import { useEffect, use, useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar, MapPin, Leaf, TrendingUp, TreePine, Layers, Users, Target, CheckSquare, Square, Edit2, Trash2, X, Check, ChevronDown, ChevronUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { projets, getParcellesByProjet, getPlantsByProjet, cooperatives, getObjectifsByProjet, addObjectif, toggleObjectifValidation, editObjectif, deleteObjectif } from "@/lib/mock-data"
import type { Objectif } from "@/lib/types"
import { DashboardLayout } from "@/components/dashboard-layout"
import {
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts"

interface Props {
  params: Promise<{ projetId: string }>
}

export default function ProjetDashboard({ params }: Props) {
  const { projetId } = use(params)
  const { user } = useAuth()
  const router = useRouter()

  const projet = projets.find((p) => p.id === projetId)
  const parcelles = getParcellesByProjet(projetId)
  const plants = getPlantsByProjet(projetId)

  const [localObjectifs, setLocalObjectifs] = useState<Objectif[]>([])

  useEffect(() => {
    setLocalObjectifs(getObjectifsByProjet(projetId))
  }, [projetId])

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

  const plantsVivants = plants.filter((p) => p.status === "vivant").length
  const plantsMorts = plants.filter((p) => p.status === "mort").length
  const tauxSurvieCalcule = plants.length > 0 ? (plantsVivants / plants.length) * 100 : 0

  // Get unique cooperatives for this project
  const uniqueCoops = [...new Set(parcelles.map((p) => p.cooperative))]
  const projectCoops = cooperatives.filter((c) => uniqueCoops.includes(c.nom))

  // Data for charts
  const statusData = [
    { name: "Vivants", value: plantsVivants, color: "var(--primary)" },
    { name: "Morts", value: plantsMorts, color: "var(--destructive)" },
  ]

  const objectifsValides = localObjectifs.filter(o => o.estValide).length
  const calculateProgress = () => {
    if (localObjectifs.length === 0) return 0
    return (objectifsValides / localObjectifs.length) * 100
  }


  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <TreePine className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">{projet.nom}</h1>
              <Badge
                variant={projet.status === "actif" ? "default" : "secondary"}
                className={projet.status === "actif" ? "bg-primary/20 text-foreground border-primary/30" : ""}
              >
                {projet.status === "actif" ? "Actif" : projet.status === "termine" ? "Terminé" : "En pause"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Unified Summary Blocks Grid (4 columns, then remaining centered or wrapping) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Objectif du projet */}
          <Card className="bg-card border-border shadow-sm h-full min-h-[100px] flex flex-col justify-center">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5 uppercase tracking-wider font-semibold line-clamp-1">Objectif Projet</p>
                  <p className="text-sm font-bold text-foreground line-clamp-2 leading-tight">{projet.objectif || "Non défini"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2. Parcelles (Moved to 2nd position) */}
          <Card
            className="bg-card border-border shadow-sm h-full min-h-[100px] flex flex-col justify-center cursor-pointer transition-colors hover:border-chart-2/50 hover:bg-accent/40"
            onClick={() => router.push(`/dashboard/projet/${projetId}/parcelles`)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-chart-2/10 rounded-lg shrink-0">
                  <Layers className="w-5 h-5 text-chart-2" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5 uppercase tracking-wider font-semibold">Parcelles</p>
                  <p className="text-2xl font-bold text-foreground">{parcelles.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3. Coopératives (Moved to 3rd position) */}
          <Card
            className="bg-card border-border shadow-sm h-full min-h-[100px] flex flex-col justify-center cursor-pointer transition-colors hover:border-chart-2/50 hover:bg-accent/40"
            onClick={() => router.push("/dashboard/cooperatives")}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-chart-2/10 rounded-lg shrink-0">
                  <Users className="w-5 h-5 text-chart-2" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5 uppercase tracking-wider font-semibold">Coopératives</p>
                  <p className="text-2xl font-bold text-foreground">{projectCoops.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 4. Évolution du projet */}
          <Card className="bg-card border-border shadow-sm h-full min-h-[100px] flex flex-col justify-center">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-chart-3/10 rounded-lg shrink-0">
                  <TrendingUp className="w-5 h-5 text-chart-3" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-0.5 uppercase tracking-wider font-semibold">Évolution</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold text-foreground">{calculateProgress().toFixed(0)}%</p>
                    <Progress value={calculateProgress()} className="h-2 flex-1" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 5. Plants vivants */}
          <Card
            className="bg-card border-border shadow-sm h-full min-h-[100px] flex flex-col justify-center cursor-pointer transition-colors hover:border-primary/50 hover:bg-accent/40"
            onClick={() => router.push(`/dashboard/projet/${projetId}/statut?etat=vivant`)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                  <Leaf className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5 uppercase tracking-wider font-semibold">Plants vivants</p>
                  <p className="text-2xl font-bold text-foreground">{plantsVivants}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 6. Taux de survie */}
          <Card
            className="bg-card border-border shadow-sm h-full min-h-[100px] flex flex-col justify-center cursor-pointer transition-colors hover:border-chart-3/50 hover:bg-accent/40"
            onClick={() => router.push(`/dashboard/projet/${projetId}/monitoring`)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-chart-3/10 rounded-lg shrink-0">
                  <TrendingUp className="w-5 h-5 text-chart-3" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5 uppercase tracking-wider font-semibold">Taux survie</p>
                  <p className="text-2xl font-bold text-foreground">{tauxSurvieCalcule.toFixed(1)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Objectives Diagram */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base text-foreground flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                Analyse des objectifs par parcelle
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={localObjectifs.map(obj => ({
                    name: obj.titre,
                    'Actuel': obj.valeurActuelle,
                    'Cible': obj.valeurCible,
                    parcelle: parcelles.find(p => p.id === obj.parcelleId)?.nom || 'N/A'
                  }))}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis
                    dataKey="name"
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="Actuel" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={40} />
                  <Bar dataKey="Cible" fill="#000000" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              {localObjectifs.map(obj => (
                <div key={obj.id} className="p-3 rounded-lg border border-border bg-secondary/30">
                  <p className="text-xs font-semibold text-primary mb-1">{parcelles.find(p => p.id === obj.parcelleId)?.nom}</p>
                  <p className="text-sm font-medium">{obj.titre}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {obj.valeurActuelle} / {obj.valeurCible} {obj.unite}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Plants Status Chart */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base text-foreground flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                État des plants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-4">
                {statusData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-muted-foreground">
                      {item.name}: {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Parcelle Sizes List */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base text-foreground flex items-center gap-2">
                <Layers className="w-4 h-4 text-chart-2" />
                Superficie des parcelles (ha)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {parcelles.map((parcelle) => (
                <button
                  key={parcelle.id}
                  onClick={() => router.push(`/dashboard/projet/${projetId}/parcelles`)}
                  className="w-full rounded-lg border border-border bg-secondary px-4 py-3 text-left transition-colors hover:border-chart-2/40 hover:bg-accent"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-medium text-foreground">{parcelle.nom}</span>
                    <span className="text-sm font-semibold text-foreground">{parcelle.superficie.toFixed(1)} ha</span>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Cooperatives List */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base text-foreground flex items-center gap-2">
              <Users className="w-4 h-4 text-chart-2" />
              Coopératives partenaires
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projectCoops.map((coop) => (
                <div
                  key={coop.id}
                  className="p-4 bg-secondary rounded-lg border border-border"
                >
                  <p className="font-medium text-foreground">{coop.nom}</p>
                  <p className="text-sm text-muted-foreground mt-1">{coop.entreprise}</p>
                  <p className="text-sm text-muted-foreground">{coop.ville} - {coop.village}</p>
                  <p className="text-sm text-muted-foreground">{coop.contact}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
