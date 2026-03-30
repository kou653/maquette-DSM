"use client"

import { use, useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Camera, 
  MapPinned, 
  Search, 
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DashboardLayout } from "@/components/dashboard-layout"
import { 
  projets, 
  getParcellesByProjet, 
} from "@/lib/mock-data"

interface Props {
  params: Promise<{ projetId: string }>
}

export default function EvolutionPage({ params }: Props) {
  const { projetId } = use(params)
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")

  const projet = projets.find((p) => p.id === projetId)
  const projectParcelles = getParcellesByProjet(projetId)

  if (!projet) return null

  const filteredParcelles = projectParcelles.filter((p) => 
    p.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.ville.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Camera className="w-6 h-6 text-primary" />
              Suivi Visuel par Parcelle
            </h1>
            <p className="text-muted-foreground font-medium">
              Sélectionnez une parcelle pour voir son évolution historique
            </p>
          </div>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une parcelle..."
              className="pl-10 bg-background border-border"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Parcels Grid (Mirroring /parcelles design) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
          {filteredParcelles.map((parcelle) => (
            <Card
              key={parcelle.id}
              className="bg-card border-border cursor-pointer transition-all hover:border-primary/50 hover:bg-accent/40 group overflow-hidden"
              onClick={() => router.push(`/dashboard/projet/${projetId}/evolution/${parcelle.id}`)}
            >
              <CardContent className="p-4 flex flex-col items-center text-center space-y-3">
                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <MapPinned className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-base text-foreground group-hover:text-primary transition-colors">{parcelle.nom}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{parcelle.superficie} Hectares</p>
                </div>
                <div className="pt-2 w-full flex justify-center">
                  <Badge variant="outline" className="text-[10px] bg-secondary/50 border-border text-muted-foreground group-hover:text-foreground">
                    Voir les photos
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {filteredParcelles.length === 0 && (
            <div className="col-span-full py-20 text-center space-y-4">
              <div className="bg-secondary/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-muted-foreground">
                <Search className="w-8 h-8" />
              </div>
              <p className="text-muted-foreground">Aucune parcelle ne correspond à votre recherche.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
