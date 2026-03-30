"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, TreePine, Leaf, MapPin, TrendingUp, FolderKanban, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { projets } from "@/lib/mock-data"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  
  // État pour le carrousel
  const [currentImage, setCurrentImage] = useState(0)
  const carouselImages = [
    {
      url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1200",
      title: "Restauration des écosystèmes locaux",
    },
    {
      url: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&q=80&w=1200",
      title: "Suivi de croissance des jeunes pousses",
    },
    {
      url: "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&q=80&w=1200",
      title: "Impact environnemental positif",
    },
  ]

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % carouselImages.length)
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)

  useEffect(() => {
    if (!user) {
      router.push("/")
    }
  }, [user, router])

  if (!user) return null

  const isAdmin = user.role === "administrateur"

  const canAccessProject = (projetId: string) => {
    return isAdmin || user.projetsAffectes.includes(projetId)
  }

  const totalParcelles = projets.reduce((acc, p) => acc + p.totalParcelles, 0)
  const totalPlants = projets.reduce((acc, p) => acc + p.totalPlants, 0)
  const avgSurvival = projets.reduce((acc, p) => acc + p.tauxSurvie, 0) / projets.length

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 forest-surface">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Tableau de bord</h1>
            <p className="text-foreground/70">Vue d'ensemble de tous les projets</p>
          </div>
          {isAdmin && (
            <Button 
              className="bg-primary hover:bg-[var(--forest-green-hover)] text-primary-foreground"
              onClick={() => router.push("/dashboard/projet/nouveau")}
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un projet
            </Button>
          )}
        </div>

        {/* Carrousel d'images */}
        <Card className="bg-card border-border overflow-hidden relative group shadow-sm shadow-primary/5">
          <div className="relative aspect-[21/9] w-full">
            {carouselImages.map((img, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  index === currentImage ? "opacity-100" : "opacity-0"
                }`}
              >
                <img
                  src={img.url}
                  alt={img.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent flex items-end p-8">
                  <div className="forest-highlight max-w-xl rounded-xl px-4 py-3">
                    <h3 className="text-foreground font-semibold text-xl md:text-2xl">{img.title}</h3>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Contrôles */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-accent text-foreground border border-border p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-accent text-foreground border border-border p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            
            {/* Indicateurs */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {carouselImages.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentImage ? "bg-primary w-6" : "bg-primary/25"
                  }`}
                />
              ))}
            </div>
          </div>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card border-border shadow-sm shadow-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FolderKanban className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-foreground/70">Projets actifs</p>
                  <p className="text-2xl font-bold text-foreground">{projets.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border shadow-sm shadow-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-chart-2/10 rounded-lg">
                  <MapPin className="w-5 h-5 text-chart-2" />
                </div>
                <div>
                  <p className="text-sm text-foreground/70">Total parcelles</p>
                  <p className="text-2xl font-bold text-foreground">{totalParcelles}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border shadow-sm shadow-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-chart-3/10 rounded-lg">
                  <Leaf className="w-5 h-5 text-chart-3" />
                </div>
                <div>
                  <p className="text-sm text-foreground/70">Total plants</p>
                  <p className="text-2xl font-bold text-foreground">{totalPlants.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border shadow-sm shadow-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-foreground/70">Taux de survie moyen</p>
                  <p className="text-2xl font-bold text-foreground">{avgSurvival.toFixed(1)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects List */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Tous les projets</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {projets.map((projet) => {
              const hasAccess = canAccessProject(projet.id)
              return (
                <Card
                  key={projet.id}
                  className={`bg-card border-border transition-all ${
                    hasAccess
                      ? "cursor-pointer hover:border-primary/50 hover:bg-accent/40"
                      : "opacity-50 cursor-not-allowed"
                  }`}
                  onClick={() => hasAccess && router.push(`/dashboard/projet/${projet.id}`)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <TreePine className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-base text-foreground">{projet.nom}</CardTitle>
                          <p className="text-xs text-foreground/65">{projet.region}</p>
                        </div>
                      </div>
                      <Badge
                        variant={projet.status === "actif" ? "default" : "secondary"}
                        className={projet.status === "actif" ? "bg-primary/20 text-foreground border-primary/30" : ""}
                      >
                        {projet.status === "actif" ? "Actif" : projet.status === "termine" ? "Terminé" : "En pause"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-foreground/70 mb-4 line-clamp-2">{projet.description}</p>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-lg font-semibold text-foreground">{projet.totalParcelles}</p>
                        <p className="text-xs text-foreground/65">Parcelles</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-foreground">{projet.totalPlants.toLocaleString()}</p>
                        <p className="text-xs text-foreground/65">Plants</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-foreground">{projet.tauxSurvie}%</p>
                        <p className="text-xs text-foreground/65">Survie</p>
                      </div>
                    </div>
                    {!hasAccess && (
                      <p className="text-xs text-foreground/65 mt-3 text-center italic">
                        Vous n'avez pas accès à ce projet
                      </p>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
