"use client"

import { use, useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Layers, MapPin, Building2, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DashboardLayout } from "@/components/dashboard-layout"
import { projets, cooperatives } from "@/lib/mock-data"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Props {
  params: Promise<{ projetId: string }>
}

export default function NouvelleParcellePage({ params }: Props) {
  const { projetId } = use(params)
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const projet = projets.find(p => p.id === projetId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      router.push(`/dashboard/projet/${projetId}/parcelles`)
    }, 1000)
  }

  if (!projet) return null

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="text-muted-foreground hover:text-foreground mb-2"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Retour aux parcelles
        </Button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-chart-2/10 rounded-lg">
            <Layers className="w-6 h-6 text-chart-2" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Ajouter une parcelle</h1>
            <p className="text-muted-foreground">Projet: {projet.nom}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Détails de la parcelle</CardTitle>
              <CardDescription>Informations géographiques et contractuelles de la nouvelle zone.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nom de la parcelle</label>
                  <Input placeholder="Ex: Parcelle Sud B2" required className="bg-secondary border-border" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Superficie (ha)</label>
                  <Input type="number" step="0.1" placeholder="Ex: 5.5" required className="bg-secondary border-border" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    Ville / Localité
                  </label>
                  <Input placeholder="Ex: Bouaké" required className="bg-secondary border-border" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    Coopérative partenaire
                  </label>
                  <Select required>
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="Sélectionner une coopérative" />
                    </SelectTrigger>
                    <SelectContent>
                      {cooperatives.map(coop => (
                        <SelectItem key={coop.id} value={coop.id}>{coop.nom}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Target className="w-4 h-4 text-muted-foreground" />
                  Objectif de la parcelle
                </label>
                <Input placeholder="Ex: Planter 500 Tecks..." required className="bg-secondary border-border" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Latitude</label>
                  <Input type="number" step="0.000001" placeholder="0.000000" className="bg-secondary border-border" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Longitude</label>
                  <Input type="number" step="0.000001" placeholder="0.000000" className="bg-secondary border-border" />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={() => router.back()}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-[var(--forest-green-hover)] text-primary-foreground px-8">
              {isSubmitting ? "Enregistrement..." : "Ajouter la parcelle"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
