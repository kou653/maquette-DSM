"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, TreePine, Calendar, MapPin, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function NouveauProjetPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      router.push("/dashboard")
    }, 1000)
  }

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
          Retour
        </Button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <TreePine className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Ajouter un nouveau projet</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
              <CardDescription>Définissez les détails de base de votre programme de reboisement.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nom du projet</label>
                <Input placeholder="Ex: Reboisement Sahel 2024" required className="bg-secondary border-border" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea placeholder="Décrivez les objectifs globaux du projet..." className="bg-secondary border-border min-h-[100px]" required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    Région
                  </label>
                  <Input placeholder="Ex: Sahel" required className="bg-secondary border-border" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Target className="w-4 h-4 text-muted-foreground" />
                    Objectif global (Facultatif)
                  </label>
                  <Input placeholder="Ex: Restaurer 50 hectares..." className="bg-secondary border-border" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    Date de début
                  </label>
                  <Input type="date" required className="bg-secondary border-border" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    Date de fin prévue
                  </label>
                  <Input type="date" required className="bg-secondary border-border" />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={() => router.back()}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-[var(--forest-green-hover)] text-primary-foreground px-8">
              {isSubmitting ? "Création..." : "Créer le projet"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
