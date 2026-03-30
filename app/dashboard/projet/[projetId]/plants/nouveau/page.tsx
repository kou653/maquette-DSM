"use client"

import { useState, use, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sprout, MapPin, Leaf, CheckCircle2, ArrowLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"
import { projets, especes, getParcellesByProjet, addPlant, addEspeceDocumentation } from "@/lib/mock-data"
import { DashboardLayout } from "@/components/dashboard-layout"

interface Props {
  params: Promise<{ projetId: string }>
}

export default function NouveauPlantPage({ params }: Props) {
  const { projetId } = use(params)
  const { user } = useAuth()
  const router = useRouter()
  
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  const [especeId, setEspeceId] = useState("")
  const [parcelleId, setParcelleId] = useState("")
  const [ville, setVille] = useState("")
  const [lat, setLat] = useState("")
  const [lng, setLng] = useState("")
  const [etat, setEtat] = useState<"vivant" | "mort">("vivant")
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isClient) return null

  const projet = projets.find((p) => p.id === projetId)
  const parcelles = getParcellesByProjet(projetId)

  if (!user || !projet) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const espece = especes.find((e) => e.id === especeId)
    const parcelle = parcelles.find((p) => p.id === parcelleId)

    if (espece && parcelle) {
      // Create Plant
      addPlant({
        especeId,
        especeNom: espece.nomCommun,
        parcelleId,
        parcelleNom: parcelle.nom,
        ville,
        coordonnees: { lat: parseFloat(lat), lng: parseFloat(lng) },
        datePlantation: new Date().toISOString().split("T")[0],
        status: etat,
      })

      // Add Documentation if notes provided
      if (notes.trim()) {
        addEspeceDocumentation({
          projetId,
          especeId,
          etat,
          notes,
          auteur: user.nom,
          date: new Date().toISOString(),
        })
      }

      router.push(`/dashboard/projet/${projetId}/plants`)
    } else {
      setIsSubmitting(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 max-w-3xl mx-auto">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Ajouter un plant</h1>
            <p className="text-muted-foreground">Enregistrer un nouveau plant dans le projet {projet.nom}</p>
          </div>
        </div>

        <Card className="bg-card border-border shadow-sm">
          <CardHeader>
            <CardTitle>Informations du plant</CardTitle>
            <CardDescription>Remplissez les détails du plant et ajoutez une documentation optionnelle sur son état actuel.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Espèce <span className="text-destructive">*</span></Label>
                  <Select value={especeId} onValueChange={setEspeceId} required>
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="Sélectionner une espèce" />
                    </SelectTrigger>
                    <SelectContent>
                      {especes.map((e) => (
                        <SelectItem key={e.id} value={e.id}>{e.nomCommun}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Parcelle <span className="text-destructive">*</span></Label>
                  <Select value={parcelleId} onValueChange={setParcelleId} required>
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="Sélectionner une parcelle" />
                    </SelectTrigger>
                    <SelectContent>
                      {parcelles.map((p) => (
                        <SelectItem key={p.id} value={p.id}>{p.nom} - {p.ville}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Ville <span className="text-destructive">*</span></Label>
                  <Input 
                    placeholder="Ex: Ouagadougou" 
                    value={ville} 
                    onChange={(e) => setVille(e.target.value)} 
                    required 
                    className="bg-secondary border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label>État <span className="text-destructive">*</span></Label>
                  <Select value={etat} onValueChange={(v: "vivant" | "mort") => setEtat(v)} required>
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="État actuel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vivant">Vivant</SelectItem>
                      <SelectItem value="mort">Mort</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Latitude <span className="text-destructive">*</span></Label>
                  <Input 
                    type="number" 
                    step="any" 
                    placeholder="Ex: 12.3714" 
                    value={lat} 
                    onChange={(e) => setLat(e.target.value)} 
                    required 
                    className="bg-secondary border-border font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Longitude <span className="text-destructive">*</span></Label>
                  <Input 
                    type="number" 
                    step="any" 
                    placeholder="Ex: -1.5197" 
                    value={lng} 
                    onChange={(e) => setLng(e.target.value)} 
                    required 
                    className="bg-secondary border-border font-mono"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Documentation / Observations relatives à l'état</Label>
                <Textarea 
                  placeholder="Ex: Le plant est en très bon état. L'acclimatation se fait rapidement..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[100px] bg-secondary border-border"
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button 
                  type="submit" 
                  disabled={isSubmitting || !especeId || !parcelleId || !ville || !lat || !lng}
                  className="bg-primary hover:bg-[var(--forest-green-hover)] text-primary-foreground"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Enregistrement..." : "Enregistrer le plant"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
