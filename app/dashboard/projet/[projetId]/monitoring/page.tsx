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
import { Input } from "@/components/ui/input"
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
} from "@/lib/mock-data"
import type { MonitoringData } from "@/lib/types"
import { DashboardLayout } from "@/components/dashboard-layout"
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

interface Props {
  params: Promise<{ projetId: string }>
}

function sortHistory(history: MonitoringData["history"]) {
  return [...history].sort((a, b) => a.month.localeCompare(b.month))
}

function getLatestMetrics(entry: MonitoringData) {
  const history = sortHistory(entry.history)
  const latest = history[history.length - 1]

  if (!latest) {
    return {
      plantsMisEnTerre: entry.plantsMisEnTerre,
      plantsVivants: entry.plantsVivants,
      plantsMorts: entry.plantsMorts,
    }
  }

  return latest
}

function normalizeMonitoringEntry(entry: MonitoringData): MonitoringData {
  const latest = getLatestMetrics(entry)
  const tauxSurvie =
    latest.plantsMisEnTerre > 0
      ? Math.round((latest.plantsVivants / latest.plantsMisEnTerre) * 1000) / 10
      : 0

  return {
    ...entry,
    plantsMisEnTerre: latest.plantsMisEnTerre,
    plantsVivants: latest.plantsVivants,
    plantsMorts: latest.plantsMorts,
    tauxSurvie,
    history: sortHistory(entry.history),
  }
}

function getMonitoringByParcelleAndEspece(entries: MonitoringData[], parcelleId: string, especeId: string) {
  const entry = entries.find((item) => item.parcelleId === parcelleId && item.especeId === especeId)
  return entry ? normalizeMonitoringEntry(entry) : undefined
}

function getMonitoringByParcelle(entries: MonitoringData[], parcelleId: string): MonitoringData | null {
  const parcelleEntries = entries.filter((item) => item.parcelleId === parcelleId)
  if (parcelleEntries.length === 0) return null

  const historyByMonth = new Map<string, { plantsMisEnTerre: number; plantsVivants: number; plantsMorts: number }>()

  for (const entry of parcelleEntries) {
    for (const snapshot of entry.history) {
      const current = historyByMonth.get(snapshot.month) ?? {
        plantsMisEnTerre: 0,
        plantsVivants: 0,
        plantsMorts: 0,
      }

      current.plantsMisEnTerre += snapshot.plantsMisEnTerre
      current.plantsVivants += snapshot.plantsVivants
      current.plantsMorts += snapshot.plantsMorts
      historyByMonth.set(snapshot.month, current)
    }
  }

  const history = [...historyByMonth.entries()]
    .map(([month, values]) => ({ month, ...values }))
    .sort((a, b) => a.month.localeCompare(b.month))

  const latest = history[history.length - 1]
  const documentation = parcelleEntries
    .flatMap((entry) => entry.documentation ?? [])
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return {
    especeId: "all",
    parcelleId,
    plantsMisEnTerre: latest?.plantsMisEnTerre ?? 0,
    plantsVivants: latest?.plantsVivants ?? 0,
    plantsMorts: latest?.plantsMorts ?? 0,
    tauxSurvie:
      latest && latest.plantsMisEnTerre > 0
        ? Math.round((latest.plantsVivants / latest.plantsMisEnTerre) * 1000) / 10
        : 0,
    history,
    documentation,
  }
}

function formatMonthLabel(month: string) {
  const [year, monthNumber] = month.split("-").map(Number)
  const date = new Date(year, (monthNumber || 1) - 1, 1)

  return date.toLocaleDateString("fr-FR", {
    month: "short",
    year: "numeric",
  })
}

export default function MonitoringPage({ params }: Props) {
  const { projetId } = use(params)
  const { user } = useAuth()
  const router = useRouter()
  const [selectedParcelle, setSelectedParcelle] = useState<string>("")
  const [selectedEspece, setSelectedEspece] = useState<string>("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newNote, setNewNote] = useState("")
  const [entryMonth, setEntryMonth] = useState("2024-08")
  const [plantedCount, setPlantedCount] = useState("")
  const [aliveCount, setAliveCount] = useState("")
  const [deadCount, setDeadCount] = useState("")
  const [monitoringEntries, setMonitoringEntries] = useState<MonitoringData[]>(
    monitoringData.map((entry) => ({
      ...entry,
      history: sortHistory(entry.history),
      documentation: entry.documentation ?? [],
    }))
  )

  const projet = projets.find((p) => p.id === projetId)
  const parcelles = getParcellesByProjet(projetId)

  useEffect(() => {
    if (!user) {
      router.push("/")
      return
    }
  }, [user, projetId, router])

  useEffect(() => {
    setSelectedEspece("all")
  }, [selectedParcelle])

  if (!user || !projet) return null

  const selectedMonitoring = selectedParcelle
    ? selectedEspece && selectedEspece !== "all"
      ? getMonitoringByParcelleAndEspece(monitoringEntries, selectedParcelle, selectedEspece)
      : getMonitoringByParcelle(monitoringEntries, selectedParcelle)
    : null

  const selectedEspeceData = especes.find((espece) => espece.id === selectedEspece)
  const evolutionData =
    selectedMonitoring?.history.map((snapshot) => ({
      mois: formatMonthLabel(snapshot.month),
      month: snapshot.month,
      plantes: snapshot.plantsMisEnTerre,
      vivants: snapshot.plantsVivants,
      morts: snapshot.plantsMorts,
    })) ?? []

  const handleAddMonthlyEntry = () => {
    if (!selectedParcelle || !selectedEspece || selectedEspece === "all") return

    const planted = Number(plantedCount)
    const alive = Number(aliveCount)
    const dead = Number(deadCount)

    if (!entryMonth || Number.isNaN(planted) || Number.isNaN(alive) || Number.isNaN(dead)) return

    setMonitoringEntries((currentEntries) => {
      const nextEntries = [...currentEntries]
      const existingIndex = nextEntries.findIndex(
        (entry) => entry.parcelleId === selectedParcelle && entry.especeId === selectedEspece
      )

      const monthlySnapshot = {
        month: entryMonth,
        plantsMisEnTerre: planted,
        plantsVivants: alive,
        plantsMorts: dead,
      }

      const documentationEntry = newNote.trim()
        ? {
            notes: newNote.trim(),
            photos: [],
            date: `${entryMonth}-01`,
          }
        : null

      if (existingIndex >= 0) {
        const existing = nextEntries[existingIndex]
        const historyWithoutMonth = existing.history.filter((item) => item.month !== entryMonth)
        const updatedHistory = sortHistory([...historyWithoutMonth, monthlySnapshot])
        const latest = updatedHistory[updatedHistory.length - 1]

        nextEntries[existingIndex] = {
          ...existing,
          plantsMisEnTerre: latest.plantsMisEnTerre,
          plantsVivants: latest.plantsVivants,
          plantsMorts: latest.plantsMorts,
          tauxSurvie:
            latest.plantsMisEnTerre > 0
              ? Math.round((latest.plantsVivants / latest.plantsMisEnTerre) * 1000) / 10
              : 0,
          history: updatedHistory,
          documentation: documentationEntry
            ? [...(existing.documentation ?? []), documentationEntry]
            : existing.documentation ?? [],
        }
      } else {
        nextEntries.push({
          especeId: selectedEspece,
          parcelleId: selectedParcelle,
          plantsMisEnTerre: planted,
          plantsVivants: alive,
          plantsMorts: dead,
          tauxSurvie: planted > 0 ? Math.round((alive / planted) * 1000) / 10 : 0,
          history: [monthlySnapshot],
          documentation: documentationEntry ? [documentationEntry] : [],
        })
      }

      return nextEntries
    })

    setPlantedCount("")
    setAliveCount("")
    setDeadCount("")
    setNewNote("")
    setDialogOpen(false)
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-chart-2" />
            Monitoring
          </h1>
          <p className="text-muted-foreground">
            Suivi detaille de l'evolution mensuelle par espece et parcelle
          </p>
        </div>

        {user.role === "commanditaire" ? (
          <Badge variant="secondary" className="bg-secondary text-muted-foreground border-border">
            Vue en lecture seule
          </Badge>
        ) : (
          <Badge className="bg-primary/20 text-foreground border-primary/30">
            Accès complet
          </Badge>
        )}

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base text-foreground">Selection des filtres</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Parcelle</label>
                <Select value={selectedParcelle} onValueChange={setSelectedParcelle}>
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue placeholder="Selectionner une parcelle" />
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
                <label className="text-sm font-medium text-foreground">Espece</label>
                <Select value={selectedEspece} onValueChange={setSelectedEspece}>
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue placeholder="Toutes les especes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les especes</SelectItem>
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

        {selectedMonitoring ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-chart-2/10 rounded-lg">
                      <Sprout className="w-5 h-5 text-chart-2" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Plants plantes</p>
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

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-base text-foreground">
                    Evolution mensuelle {selectedEspeceData ? `de ${selectedEspeceData.nomCommun}` : "des especes"}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Le graphique montre l'evolution mensuelle des plants plantes, vivants et morts.
                  </p>
                </div>
                {user.role !== "commanditaire" && (
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        className="bg-primary hover:bg-[var(--forest-green-hover)]"
                        disabled={!selectedParcelle || !selectedEspece || selectedEspece === "all"}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Ajouter un releve
                      </Button>
                    </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Ajouter un releve mensuel</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Mois</label>
                        <Input
                          type="month"
                          value={entryMonth}
                          onChange={(e) => setEntryMonth(e.target.value)}
                          className="bg-secondary border-border"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">Nombre plante</label>
                          <Input
                            type="number"
                            min="0"
                            value={plantedCount}
                            onChange={(e) => setPlantedCount(e.target.value)}
                            className="bg-secondary border-border"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">Nombre vivant</label>
                          <Input
                            type="number"
                            min="0"
                            value={aliveCount}
                            onChange={(e) => setAliveCount(e.target.value)}
                            className="bg-secondary border-border"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">Nombre mort</label>
                          <Input
                            type="number"
                            min="0"
                            value={deadCount}
                            onChange={(e) => setDeadCount(e.target.value)}
                            className="bg-secondary border-border"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Observation</label>
                        <Textarea
                          placeholder="Ajoutez un commentaire sur l'evolution de cette espece..."
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          rows={4}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>
                          Annuler
                        </Button>
                        <Button onClick={handleAddMonthlyEntry} className="bg-primary hover:bg-[var(--forest-green-hover)]">
                          Enregistrer
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                  </Dialog>
                )}
              </CardHeader>
              <CardContent>
                {selectedEspece === "all" ? (
                  <p className="text-sm text-muted-foreground mb-4">
                    Selectionnez une espece precise pour ajouter un nouveau releve mensuel.
                  </p>
                ) : null}
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={evolutionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis
                      dataKey="mois"
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
                    <Legend />
                    <Line type="monotone" dataKey="plantes" name="Plantes" stroke="var(--chart-2)" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="vivants" name="Vivants" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="morts" name="Morts" stroke="var(--destructive)" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base text-foreground flex items-center gap-2">
                  <FileText className="w-4 h-4 text-chart-2" />
                  Documentation
                </CardTitle>
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
                    Aucune documentation disponible pour cette selection
                  </p>
                )}
              </CardContent>
            </Card>
          </>
        ) : (
          <Card className="bg-card border-border">
            <CardContent className="p-8">
              <p className="text-muted-foreground text-center">
                Selectionnez une parcelle pour afficher les donnees de monitoring
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
