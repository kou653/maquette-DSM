"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Users, Search, Mail, Shield, FolderKanban, Plus, Pencil, Trash2, ChevronDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/lib/auth-context"
import { users, projets } from "@/lib/mock-data"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function UtilisateursPage() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newUserRole, setNewUserRole] = useState<string>("")
  const [selectedProjects, setSelectedProjects] = useState<string[]>([])
  const [columnFilters, setColumnFilters] = useState({
    nom: "all",
    role: "all"
  })

  useEffect(() => {
    if (!user) {
      router.push("/")
      return
    }
    if (user.role !== "administrateur") {
      router.push("/dashboard")
    }
  }, [user, router])

  if (!user || user.role !== "administrateur") return null

  const roleFilter = searchParams.get("role")

  const filteredUsers = users.filter((u) => {
    const matchesGlobal =
      u.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesColumnNom = columnFilters.nom === "all" || u.nom === columnFilters.nom
    const matchesColumnRole = columnFilters.role === "all" || u.role === columnFilters.role

    const matchesRole =
      !roleFilter ||
      roleFilter === "all" ||
      u.role === roleFilter

    return matchesGlobal && matchesColumnNom && matchesColumnRole && matchesRole
  })

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "administrateur":
        return "bg-primary/20 text-foreground border-primary/30"
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
        return "Agent terrain"
      case "commanditaire":
        return "Commanditaire"
      default:
        return role
    }
  }

  const handleProjectToggle = (projetId: string) => {
    setSelectedProjects((prev) =>
      prev.includes(projetId) ? prev.filter((id) => id !== projetId) : [...prev, projetId]
    )
  }

  const adminCount = users.filter((u) => u.role === "administrateur").length
  const agriculteurCount = users.filter((u) => u.role === "agriculteur").length
  const commanditaireCount = users.filter((u) => u.role === "commanditaire").length

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Users className="w-6 h-6 text-chart-2" />
              Gestion des Utilisateurs
            </h1>
            <p className="text-muted-foreground">
              Gérer les accès et les affectations des utilisateurs
            </p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-full sm:w-48 bg-secondary border-border"
              />
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-[var(--forest-green-hover)]">
                  <Plus className="w-4 h-4 mr-2" />
                  Créer
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Créer un utilisateur</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Nom complet</label>
                    <Input placeholder="Nom de l'utilisateur" className="bg-secondary border-border" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Email</label>
                    <Input type="email" placeholder="email@exemple.com" className="bg-secondary border-border" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Mot de passe</label>
                    <Input type="password" placeholder="••••••••" className="bg-secondary border-border" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Rôle</label>
                    <Select value={newUserRole} onValueChange={setNewUserRole}>
                      <SelectTrigger className="bg-secondary border-border">
                        <SelectValue placeholder="Sélectionner un rôle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="administrateur">Administrateur</SelectItem>
                        <SelectItem value="agriculteur">Agent terrain</SelectItem>
                        <SelectItem value="commanditaire">Commanditaire</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Projets affectés</label>
                    <div className="border border-border rounded-md p-3 space-y-2 max-h-40 overflow-y-auto bg-secondary">
                      {projets.map((projet) => (
                        <div key={projet.id} className="flex items-center gap-2">
                          <Checkbox
                            id={`projet-${projet.id}`}
                            checked={selectedProjects.includes(projet.id)}
                            onCheckedChange={() => handleProjectToggle(projet.id)}
                          />
                          <label
                            htmlFor={`projet-${projet.id}`}
                            className="text-sm text-foreground cursor-pointer"
                          >
                            {projet.nom}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button className="bg-primary hover:bg-[var(--forest-green-hover)]">Créer l'utilisateur</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Admin Badge */}
        <Badge className="bg-primary/20 text-foreground border-primary/30">
          Accès Administrateur uniquement
        </Badge>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card
            className="bg-card border-border cursor-pointer transition-colors hover:border-chart-2/40 hover:bg-accent/40"
            onClick={() => router.push("/dashboard/utilisateurs?role=all#users-list")}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-chart-2/10 rounded-lg">
                  <Users className="w-5 h-5 text-chart-2" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total utilisateurs</p>
                  <p className="text-2xl font-bold text-foreground">{users.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card
            className="bg-card border-border cursor-pointer transition-colors hover:border-primary/40 hover:bg-accent/40"
            onClick={() => router.push("/dashboard/utilisateurs?role=administrateur#users-list")}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Administrateurs</p>
                  <p className="text-2xl font-bold text-foreground">{adminCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card
            className="bg-card border-border cursor-pointer transition-colors hover:border-chart-3/40 hover:bg-accent/40"
            onClick={() => router.push("/dashboard/utilisateurs?role=agriculteur#users-list")}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-chart-3/10 rounded-lg">
                  <Users className="w-5 h-5 text-chart-3" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Agents terrain</p>
                  <p className="text-2xl font-bold text-foreground">{agriculteurCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card
            className="bg-card border-border cursor-pointer transition-colors hover:border-chart-2/40 hover:bg-accent/40"
            onClick={() => router.push("/dashboard/utilisateurs?role=commanditaire#users-list")}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-chart-2/10 rounded-lg">
                  <Users className="w-5 h-5 text-chart-2" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Commanditaires</p>
                  <p className="text-2xl font-bold text-foreground">{commanditaireCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <Card id="users-list" className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base text-foreground">
              Liste des utilisateurs ({filteredUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="text-muted-foreground">
                      <div className="flex items-center gap-2 py-2">
                        <span>Nom</span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <ChevronDown className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="bg-popover border-border">
                            <DropdownMenuItem onClick={() => setColumnFilters({ ...columnFilters, nom: "all" })}>
                              Tout
                            </DropdownMenuItem>
                            {[...new Set(users.map(u => u.nom))].map(val => (
                              <DropdownMenuItem key={val} onClick={() => setColumnFilters({ ...columnFilters, nom: val })}>
                                {val}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      <div className="flex items-center gap-2 py-2">
                        <span>Email</span>
                      </div>
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      <div className="flex items-center gap-2 py-2">
                        <span>Rôle</span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <ChevronDown className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="bg-popover border-border">
                            <DropdownMenuItem onClick={() => setColumnFilters({ ...columnFilters, role: "all" })}>
                              Tout
                            </DropdownMenuItem>
                            {["administrateur", "agriculteur", "commanditaire"].map(val => (
                              <DropdownMenuItem key={val} onClick={() => setColumnFilters({ ...columnFilters, role: val })}>
                                {val === "agriculteur" ? "Agent terrain" : val.charAt(0) + val.slice(1)}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableHead>
                    <TableHead className="text-muted-foreground">Projets affectés</TableHead>
                    <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((u) => (
                    <TableRow key={u.id} className="border-border">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-xs font-medium text-foreground">
                              {u.nom.split(" ").map((n) => n[0]).join("")}
                            </span>
                          </div>
                          <span className="font-medium text-foreground">{u.nom}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-foreground">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          {u.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getRoleBadgeColor(u.role)}>
                          {getRoleLabel(u.role)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-foreground">
                          <FolderKanban className="w-4 h-4 text-muted-foreground" />
                          {u.projetsAffectes.length} projet(s)
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Pencil className="w-4 h-4 text-muted-foreground" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            disabled={u.id === user.id}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredUsers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        Aucun utilisateur trouvé
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
