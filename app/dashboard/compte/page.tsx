"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { User, Mail, Shield, FolderKanban, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { projets } from "@/lib/mock-data"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function ComptePage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/")
    }
  }, [user, router])

  if (!user) return null

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "administrateur":
        return "bg-primary/20 text-primary border-primary/30"
      case "agriculteur":
        return "bg-chart-3/20 text-chart-3 border-chart-3/30"
      case "commanditaire":
        return "bg-chart-2/20 text-chart-2 border-chart-2/30"
      default:
        return ""
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "administrateur":
        return "Administrateur"
      case "agriculteur":
        return "Agriculteur"
      case "commanditaire":
        return "Commanditaire"
      default:
        return role
    }
  }

  const userProjects = projets.filter((p) => user.projetsAffectes.includes(p.id))

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <User className="w-6 h-6 text-chart-2" />
            Mon Compte
          </h1>
          <p className="text-muted-foreground">
            Consultez vos informations personnelles
          </p>
        </div>

        {/* Profile Card */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base text-foreground">Informations personnelles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar and Name */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xl font-bold text-primary">
                  {user.nom.split(" ").map((n) => n[0]).join("")}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">{user.nom}</h2>
                <Badge variant="outline" className={getRoleBadgeColor(user.role)}>
                  <Shield className="w-3 h-3 mr-1" />
                  {getRoleLabel(user.role)}
                </Badge>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-secondary rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-chart-2/10 rounded-lg">
                    <Mail className="w-5 h-5 text-chart-2" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Adresse email</p>
                    <p className="font-medium text-foreground">{user.email}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-secondary rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Rôle</p>
                    <p className="font-medium text-foreground">{getRoleLabel(user.role)}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-secondary rounded-lg border border-border md:col-span-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-chart-3/10 rounded-lg">
                    <FolderKanban className="w-5 h-5 text-chart-3" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Projets affectés</p>
                    <p className="font-medium text-foreground">
                      {user.projetsAffectes.length} projet(s)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projects List */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base text-foreground flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-chart-2" />
              Mes projets
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userProjects.map((projet) => (
                  <button
                    key={projet.id}
                    onClick={() => router.push(`/dashboard/projet/${projet.id}`)}
                    className="p-4 bg-secondary rounded-lg border border-border hover:border-primary/50 transition-colors text-left"
                  >
                    <p className="font-medium text-foreground mb-1">{projet.nom}</p>
                    <p className="text-sm text-muted-foreground mb-2">{projet.region}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(projet.dateDebut).toLocaleDateString("fr-FR")}
                      </div>
                      <Badge
                        variant={projet.status === "actif" ? "default" : "secondary"}
                        className={projet.status === "actif" ? "bg-primary/20 text-primary border-primary/30 text-xs" : "text-xs"}
                      >
                        {projet.status === "actif" ? "Actif" : "Terminé"}
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Vous n'êtes affecté à aucun projet
              </p>
            )}
          </CardContent>
        </Card>

        {/* Permissions Info */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base text-foreground">Vos permissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${user.role === "administrateur" ? "bg-primary" : "bg-muted"}`} />
                <span className={`text-sm ${user.role === "administrateur" ? "text-foreground" : "text-muted-foreground"}`}>
                  Créer, modifier et supprimer des projets
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${user.role === "administrateur" ? "bg-primary" : "bg-muted"}`} />
                <span className={`text-sm ${user.role === "administrateur" ? "text-foreground" : "text-muted-foreground"}`}>
                  Gérer les utilisateurs et les coopératives
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${user.role === "administrateur" ? "bg-primary" : "bg-muted"}`} />
                <span className={`text-sm ${user.role === "administrateur" ? "text-foreground" : "text-muted-foreground"}`}>
                  Accéder au module de monitoring
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-sm text-foreground">
                  Consulter les données des projets affectés
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-sm text-foreground">
                  Visualiser les parcelles et plants sur la carte
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
