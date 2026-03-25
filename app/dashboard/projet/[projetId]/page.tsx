"use client"

import { useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Calendar, MapPin, Leaf, TrendingUp, TreePine, Layers, Users, Target } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/lib/auth-context"
import { projets, getParcellesByProjet, getPlantsByProjet, cooperatives } from "@/lib/mock-data"
import { DashboardLayout } from "@/components/dashboard-layout"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
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

  const parcelleData = parcelles.slice(0, 5).map((p) => ({
    name: p.nom.length > 15 ? p.nom.substring(0, 15) + "..." : p.nom,
    superficie: p.superficie,
  }))

  const calculateProgress = () => {
    const start = new Date(projet.dateDebut).getTime()
    const end = new Date(projet.dateFin).getTime()
    const now = Date.now()
    const progress = ((now - start) / (end - start)) * 100
    return Math.min(Math.max(progress, 0), 100)
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
                className={projet.status === "actif" ? "bg-primary/20 text-primary border-primary/30" : ""}
              >
                {projet.status === "actif" ? "Actif" : projet.status === "termine" ? "Terminé" : "En pause"}
              </Badge>
            </div>
            <p className="text-muted-foreground max-w-2xl">{projet.description}</p>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{projet.region}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(projet.dateDebut).toLocaleDateString("fr-FR")} -{" "}
                {new Date(projet.dateFin).toLocaleDateString("fr-FR")}
              </span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Avancement du projet</span>
              <span className="text-sm text-muted-foreground">{calculateProgress().toFixed(0)}%</span>
            </div>
            <Progress value={calculateProgress()} className="h-2" />
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-chart-2/10 rounded-lg">
                  <Layers className="w-5 h-5 text-chart-2" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Parcelles</p>
                  <p className="text-2xl font-bold text-foreground">{parcelles.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Leaf className="w-5 h-5 text-primary" />
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
                <div className="p-2 bg-chart-3/10 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-chart-3" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Taux de survie</p>
                  <p className="text-2xl font-bold text-foreground">{tauxSurvieCalcule.toFixed(1)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-chart-2/10 rounded-lg">
                  <Users className="w-5 h-5 text-chart-2" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Coopératives</p>
                  <p className="text-2xl font-bold text-foreground">{projectCoops.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

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

          {/* Parcelle Sizes Chart */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base text-foreground flex items-center gap-2">
                <Layers className="w-4 h-4 text-chart-2" />
                Superficie des parcelles (ha)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={parcelleData}>
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                    axisLine={{ stroke: "var(--border)" }}
                    tickLine={{ stroke: "var(--border)" }}
                  />
                  <YAxis
                    tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                    axisLine={{ stroke: "var(--border)" }}
                    tickLine={{ stroke: "var(--border)" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="superficie" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
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
                  <p className="text-sm text-muted-foreground mt-1">{coop.region}</p>
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
