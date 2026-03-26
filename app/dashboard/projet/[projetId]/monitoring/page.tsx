"use client"

import { useEffect, use, useState } from "react"
import { useRouter } from "next/navigation"
import {
  BarChart3,
  Sprout,
  CheckCircle2,
  XCircle,
  TrendingUp,
  FileText,
  Plus,
  Calendar,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useAuth } from "@/lib/auth-context"
import {
  projets,
  getParcellesByProjet,
  especes,
  monitoringData,
  getMonitoringByParcelleAndEspece,
  getMonitoringByParcelle,
} from "@/lib/mock-data"
import { DashboardLayout } from "@/components/dashboard-layout"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"

interface Props {
  params: Promise<{ projetId: string }>
}

export default function MonitoringPage({ params }: Props) {
  const { projetId } = use(params)
  const { user } = useAuth()
  const router = useRouter()
  const [selectedParcelle, setSelectedParcelle] = useState<string>("")
  const [selectedEspece, setSelectedEspece] = useState<string>("")
  const [newNote, setNewNote] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)

  const projet = projets.find((p) => p.id === projetId)
  const parcelles = getParcellesByProjet(projetId)

  useEffect(() => {
    if (!user) {
      router.push("/")
      return
    }
    if (user.role !== "administrateur") {
      router.push(`/dashboard/projet/${projetId}`)
    }
  }, [user, projetId, router])

  // Reset espece filter when parcelle changes
  useEffect(() => {
    setSelectedEspece("all")
  }, [selectedParcelle])

  if (!user || !projet) return null
  if (user.role !== "administrateur") return null

  // Get monitoring data: if espece is selected, filter by espece; otherwise show all parcelle data
  const selectedMonitoring = selectedParcelle
    ? selectedEspece && selectedEspece !== "all"
      ? getMonitoringByParcelleAndEspece(selectedParcelle, selectedEspece)
      : getMonitoringByParcelle(selectedParcelle)
    : null

  const kpiData = selectedMonitoring
    ? [
        { name: "Mis en terre", value: selectedMonitoring.plantsMisEnTerre, color: "var(--chart-2)" },
        { name: "Vivants", value: selectedMonitoring.plantsVivants, color: "var(--primary)" },
        { name: "Morts", value: selectedMonitoring.plantsMorts, color: "var(--destructive)" },
      ]
    : []

  const handleAddNote = () => {
    // In a real app, this would save to the database
    console.log("[v0] Adding note:", newNote)
    setNewNote("")
    setDialogOpen(false)
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-chart-2" />
            Monitoring
          </h1>
          <p className="text-muted-foreground">
            Suivi détaillé des KPI par espèce et parcelle
          </p>
        </div>

        {/* Admin Badge */}
        <Badge className="bg-primary/20 text-foreground border-primary/30">
          Accès Administrateur uniquement
        </Badge>

        {/* Filters */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base text-foreground">Sélection des filtres</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Parcelle</label>
                <Select value={selectedParcelle} onValueChange={setSelectedParcelle}>
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue placeholder="Sélectionner une parcelle" />
                  </SelectTrigger>
                  <SelectContent>
                    {parcelles.map((parcelle) => (
                      <SelectItem key={parcelle.id} value={parcelle.id}>
                        {parcelle.nom} - {parcelle.ville}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Espèce (optionnel)</label>
                <Select value={selectedEspece} onValueChange={setSelectedEspece}>
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue placeholder="Toutes les espèces" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les espèces</SelectItem>
                    {especes.map((espece) => (
                      <SelectItem key={espece.id} value={espece.id}>
                        {espece.nomCommun}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPI Display */}
        {selectedMonitoring ? (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-chart-2/10 rounded-lg">
                      <Sprout className="w-5 h-5 text-chart-2" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Plants mis en terre</p>
                      <p className="text-2xl font-bold text-foreground">
                        {selectedMonitoring.plantsMisEnTerre}
                      </p>
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
                      <p className="text-2xl font-bold text-foreground">
                        {selectedMonitoring.plantsVivants}
                      </p>
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
                      <p className="text-2xl font-bold text-foreground">
                        {selectedMonitoring.plantsMorts}
                      </p>
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
                      <p className="text-2xl font-bold text-foreground">
                        {selectedMonitoring.tauxSurvie}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chart */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base text-foreground">Visualisation des KPI</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={kpiData}>
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
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {kpiData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Documentation */}
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base text-foreground flex items-center gap-2">
                  <FileText className="w-4 h-4 text-chart-2" />
                  Documentation sur la mortalité
                </CardTitle>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-primary hover:bg-[var(--forest-green-hover)]">
                      <Plus className="w-4 h-4 mr-1" />
                      Ajouter une note
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Ajouter une documentation</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <Textarea
                        placeholder="Décrivez les observations sur la mortalité..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        rows={4}
                      />
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>
                          Annuler
                        </Button>
                        <Button onClick={handleAddNote} className="bg-primary hover:bg-[var(--forest-green-hover)]">
                          Enregistrer
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {selectedMonitoring.documentation && selectedMonitoring.documentation.length > 0 ? (
                  <div className="space-y-4">
                    {selectedMonitoring.documentation.map((doc, index) => (
                      <div key={index} className="p-4 bg-secondary rounded-lg border border-border">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <Calendar className="w-4 h-4" />
                          {new Date(doc.date).toLocaleDateString("fr-FR")}
                        </div>
                        <p className="text-foreground">{doc.notes}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    Aucune documentation disponible pour cette sélection
                  </p>
                )}
              </CardContent>
            </Card>
          </>
        ) : (
          <Card className="bg-card border-border">
            <CardContent className="p-8">
              <p className="text-muted-foreground text-center">
                Sélectionnez une parcelle pour afficher les données de monitoring
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
