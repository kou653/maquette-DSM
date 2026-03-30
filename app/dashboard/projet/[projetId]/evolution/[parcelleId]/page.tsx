"use client"

import { use, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { 
  Camera, 
  CalendarDays, 
  User, 
  ChevronLeft,
  Plus,
  MessageSquare,
  Clock
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { DashboardLayout } from "@/components/dashboard-layout"
import { 
  projets, 
  parcelles, 
  getEvolutionImagesByParcelle,
  addEvolutionImage
} from "@/lib/mock-data"

interface Props {
  params: Promise<{ projetId: string, parcelleId: string }>
}

export default function ParcelleEvolutionPage({ params }: Props) {
  const { projetId, parcelleId } = use(params)
  const router = useRouter()
  
  const projet = projets.find((p) => p.id === projetId)
  const parcelle = parcelles.find((p) => p.id === parcelleId)
  
  const [images, setImages] = useState(getEvolutionImagesByParcelle(parcelleId))
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Form state
  const [newImage, setNewImage] = useState({
    description: "",
    date: new Date().toISOString().split('T')[0]
  })

  if (!projet || !parcelle) return null

  const handleAddImage = () => {
    const entry = {
      projetId,
      parcelleId,
      url: "/Fichier 3.png", // Using logo as placeholder
      description: newImage.description,
      date: new Date(newImage.date).toISOString(),
      auteur: "Utilisateur Actuel"
    }
    
    const added = addEvolutionImage(entry)
    setImages([added, ...images])
    setIsDialogOpen(false)
    setNewImage({
      description: "",
      date: new Date().toISOString().split('T')[0]
    })
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Camera className="w-6 h-6 text-primary" />
                Évolution: {parcelle.nom}
              </h1>
              <p className="text-muted-foreground font-medium">
                Historique visuel de la parcelle ({images.length} photos)
              </p>
            </div>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-white font-bold">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter une photo
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-card border-border">
              <DialogHeader>
                <DialogTitle>Nouvelle Observation</DialogTitle>
                <DialogDescription>
                  Prenez une photo pour suivre l'évolution de la parcelle {parcelle.nom}.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="date">Date d'observation</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newImage.date}
                    onChange={(e) => setNewImage({...newImage, date: e.target.value})}
                    className="bg-background border-border"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description (facultative)</Label>
                  <Textarea
                    id="description"
                    placeholder="Notes sur la croissance, santé des plants..."
                    value={newImage.description}
                    onChange={(e) => setNewImage({...newImage, description: e.target.value})}
                    className="bg-background border-border min-h-[80px]"
                  />
                </div>
                <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center text-center space-y-2 opacity-60">
                  <Camera className="w-8 h-8 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground font-medium">Capturer une photo</p>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  onClick={handleAddImage} 
                  className="w-full bg-primary text-white font-bold"
                >
                  Enregistrer la photo
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Gallery Grid - Small Frames */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((img) => {
            return (
              <Card key={img.id} className="bg-card border-border overflow-hidden group hover:border-primary/50 transition-all shadow-sm">
                <div className="relative aspect-square w-full bg-muted overflow-hidden border-b border-border">
                  <Image
                    src={img.url}
                    alt={img.description}
                    fill
                    className="object-cover transition-transform group-hover:scale-105 opacity-80"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-1 bg-background/60 backdrop-blur-sm">
                    <p className="text-[9px] text-foreground font-bold text-center uppercase tracking-tighter">
                      {new Date(img.date).toLocaleDateString("fr-FR", { day: '2-digit', month: 'short' })}
                    </p>
                  </div>
                </div>
                <CardContent className="p-2 space-y-1.5">
                  <div className="flex items-center justify-between text-[8px] text-muted-foreground font-bold uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {new Date(img.date).toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  
                  {img.description && (
                    <div className="flex gap-1.5 items-start">
                      <MessageSquare className="w-2.5 h-2.5 text-primary shrink-0 mt-0.5" />
                      <p className="text-[10px] font-medium text-foreground line-clamp-2 leading-tight italic">
                        "{img.description}"
                      </p>
                    </div>
                  )}
                  
                  <div className="pt-1 flex items-center gap-1 text-[8px] text-muted-foreground/70 font-medium">
                    <User className="w-2.5 h-2.5" />
                    {img.auteur}
                  </div>
                </CardContent>
              </Card>
            )
          })}

          {images.length === 0 && (
            <div className="col-span-full py-20 text-center space-y-4">
              <Camera className="w-12 h-12 text-muted-foreground/30 mx-auto" />
              <p className="text-muted-foreground text-sm font-medium">Aucune photo pour cette parcelle.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
