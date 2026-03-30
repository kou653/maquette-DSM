"use client"

import { use, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Leaf, ArrowLeft, Files, Info } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { 
  projets, 
  getPlantsByProjet, 
  especes, 
  getDocumentationsByProjetAndEtat
} from "@/lib/mock-data"
import type { EspeceDocumentation } from "@/lib/types"

interface Props {
  params: Promise<{ projetId: string }>
}

export default function StatutDetailsPage({ params }: Props) {
  const { projetId } = use(params)
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const etat = searchParams.get("etat") as "vivant" | "mort"

  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  const projet = projets.find((p) => p.id === projetId)
  
  // Safe validation
  if (!user || !projet) return null
  if (etat !== "vivant" && etat !== "mort") {
    return (
      <DashboardLayout>
         <div className="p-6">État invalide. Veuillez retourner au tableau de bord.</div>
      </DashboardLayout>
    )
  }

  const plants = getPlantsByProjet(projetId).filter(p => p.status === etat)
  const documentations = getDocumentationsByProjetAndEtat(projetId, etat)

  // Compute stats per species
  const especeStats = new Map<string, { count: number, docs: EspeceDocumentation[] }>()
  
  plants.forEach(plant => {
    if (!especeStats.has(plant.especeId)) {
      especeStats.set(plant.especeId, { count: 0, docs: [] })
    }
    especeStats.get(plant.especeId)!.count += 1
  })

  documentations.forEach(doc => {
    if (!especeStats.has(doc.especeId)) {
      especeStats.set(doc.especeId, { count: 0, docs: [] }) // Edge case where doc exists but no plants
    }
    especeStats.get(doc.especeId)!.docs.push(doc)
  })

  const especeEntries = Array.from(especeStats.entries()).map(([especeId, data]) => {
    const espece = especes.find((e) => e.id === especeId)
    return {
      especeId,
      nomCommun: espece?.nomCommun || "Inconnue",
      nomScientifique: espece?.nomScientifique,
      count: data.count,
      docs: data.docs.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    }
  }).sort((a,b) => b.count - a.count)

  const etatLabel = etat === "vivant" ? "Plants Vivants" : "Plants Morts"
  const etatColor = etat === "vivant" ? "text-primary" : "text-destructive"
  const badgeClass = etat === "vivant" ? "bg-primary/20 text-foreground border-primary/30" : "bg-destructive/20 text-foreground border-destructive/30"

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              Détails : <span className={etatColor}>{etatLabel}</span>
            </h1>
            <p className="text-muted-foreground">Projet {projet.nom} — Total : {plants.length}</p>
          </div>
        </div>

        {especeEntries.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="py-12 flex flex-col items-center justify-center text-muted-foreground">
              <Info className="w-8 h-8 mb-4 opacity-50" />
              <p>Aucun plant {etat} ou documentation n'a été trouvé pour ce projet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {especeEntries.map((entry) => (
              <Card key={entry.especeId} className="bg-card border-border shadow-sm flex flex-col">
                <CardHeader className="pb-3 border-b border-border/50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${etat === 'vivant' ? 'bg-primary/10' : 'bg-destructive/10'}`}>
                        <Leaf className={`w-5 h-5 ${etatColor}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-foreground">{entry.nomCommun}</CardTitle>
                        {entry.nomScientifique && (
                          <p className="text-xs italic text-muted-foreground">{entry.nomScientifique}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Badge variant="outline" className={badgeClass}>
                      {entry.count} plant{entry.count > 1 ? 's' : ''} {etat}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 flex-1">
                  {entry.docs.length > 0 ? (
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-foreground flex items-center gap-2 mb-2">
                        <Files className="w-4 h-4 text-muted-foreground" />
                        Documentation & Observations ({entry.docs.length})
                      </h4>
                      <div className="grid gap-3 max-h-[300px] overflow-y-auto pr-1">
                        {entry.docs.map((doc) => (
                          <div key={doc.id} className="p-3 bg-secondary rounded-lg border border-border text-sm backdrop-blur-sm">
                            <p className="text-foreground/90 whitespace-pre-wrap">{doc.notes}</p>
                            <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground pt-3 border-t border-border/50">
                              <span>Ajouté par : <span className="font-medium text-foreground/80">{doc.auteur}</span></span>
                              <span>{new Date(doc.date).toLocaleDateString("fr-FR")}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="py-6 flex flex-col items-center justify-center h-full text-center">
                      <Info className="w-6 h-6 mb-2 text-muted-foreground/30" />
                      <p className="text-sm text-foreground/60 italic">Aucune documentation enregistrée pour cette espèce.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
