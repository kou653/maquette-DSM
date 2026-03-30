"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Building2, Search, MapPin, Phone, Mail, Plus, Pencil, Trash2, ChevronDown } from "lucide-react"
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
import { useAuth } from "@/lib/auth-context"
import { cooperatives } from "@/lib/mock-data"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function CooperativesPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [columnFilters, setColumnFilters] = useState({
    nom: "all",
    entreprise: "all",
    ville: "all",
    village: "all"
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

  const filteredCooperatives = cooperatives.filter((c) => {
    const matchesGlobal =
      c.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.entreprise.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.ville.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.contact.includes(searchTerm)

    const matchesColumnNom = columnFilters.nom === "all" || c.nom === columnFilters.nom
    const matchesColumnEntreprise = columnFilters.entreprise === "all" || c.entreprise === columnFilters.entreprise
    const matchesColumnVille = columnFilters.ville === "all" || c.ville === columnFilters.ville
    const matchesColumnVillage = columnFilters.village === "all" || c.village === columnFilters.village

    return matchesGlobal && matchesColumnNom && matchesColumnEntreprise && matchesColumnVille && matchesColumnVillage
  })

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Building2 className="w-6 h-6 text-chart-2" />
              Gestion des Cooperatives
            </h1>
            <p className="text-muted-foreground">
              Liste de toutes les cooperatives partenaires
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
                  Ajouter
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajouter une cooperative</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Nom</label>
                    <Input placeholder="Nom de la cooperative" className="bg-secondary border-border" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Entreprise</label>
                    <Input placeholder="Entreprise partenaire" className="bg-secondary border-border" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Contact</label>
                    <Input placeholder="+XXX XX XX XX XX" className="bg-secondary border-border" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Email</label>
                    <Input type="email" placeholder="email@coop.com" className="bg-secondary border-border" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Ville</label>
                      <Input placeholder="Ville" className="bg-secondary border-border" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Village</label>
                      <Input placeholder="Village" className="bg-secondary border-border" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button className="bg-primary hover:bg-[var(--forest-green-hover)]">Enregistrer</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Badge className="bg-primary/20 text-foreground border-primary/30">
          Acces Administrateur uniquement
        </Badge>

        <Card
          className="bg-card border-border cursor-pointer transition-colors hover:border-primary/40 hover:bg-accent/40"
          onClick={() =>
            document.getElementById("cooperatives-list")?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            })
          }
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-chart-2/10 rounded-lg">
                <Building2 className="w-5 h-5 text-chart-2" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total cooperatives</p>
                <p className="text-2xl font-bold text-foreground">{cooperatives.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card id="cooperatives-list" className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base text-foreground">
              Liste des cooperatives ({filteredCooperatives.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="text-muted-foreground min-w-[150px]">
                      <div className="flex items-center gap-2 py-1">
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
                            {[...new Set(cooperatives.map(c => c.nom))].map(val => (
                              <DropdownMenuItem key={val} onClick={() => setColumnFilters({ ...columnFilters, nom: val })}>
                                {val}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableHead>
                    <TableHead className="text-muted-foreground min-w-[150px]">
                      <div className="flex items-center gap-2 py-1">
                        <span>Entreprise</span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <ChevronDown className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="bg-popover border-border">
                            <DropdownMenuItem onClick={() => setColumnFilters({ ...columnFilters, entreprise: "all" })}>
                              Tout
                            </DropdownMenuItem>
                            {[...new Set(cooperatives.map(c => c.entreprise))].map(val => (
                              <DropdownMenuItem key={val} onClick={() => setColumnFilters({ ...columnFilters, entreprise: val })}>
                                {val}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableHead>
                    <TableHead className="text-muted-foreground min-w-[120px]">Contact</TableHead>
                    <TableHead className="text-muted-foreground min-w-[180px]">Email</TableHead>
                    <TableHead className="text-muted-foreground min-w-[100px]">
                      <div className="flex items-center gap-2 py-1">
                        <span>Ville</span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <ChevronDown className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="bg-popover border-border">
                            <DropdownMenuItem onClick={() => setColumnFilters({ ...columnFilters, ville: "all" })}>
                              Tout
                            </DropdownMenuItem>
                            {[...new Set(cooperatives.map(c => c.ville))].map(val => (
                              <DropdownMenuItem key={val} onClick={() => setColumnFilters({ ...columnFilters, ville: val })}>
                                {val}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableHead>
                    <TableHead className="text-muted-foreground min-w-[100px]">
                      <div className="flex items-center gap-2 py-1">
                        <span>Village</span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <ChevronDown className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="bg-popover border-border">
                            <DropdownMenuItem onClick={() => setColumnFilters({ ...columnFilters, village: "all" })}>
                              Tout
                            </DropdownMenuItem>
                            {[...new Set(cooperatives.map(c => c.village))].map(val => (
                              <DropdownMenuItem key={val} onClick={() => setColumnFilters({ ...columnFilters, village: val })}>
                                {val}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableHead>
                    <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCooperatives.map((coop) => (
                    <TableRow key={coop.id} className="border-border">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-chart-2" />
                          <span className="font-medium text-foreground">{coop.nom}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-foreground">{coop.entreprise}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-foreground">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          {coop.contact}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-foreground">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          {coop.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-foreground">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          {coop.ville}
                        </div>
                      </TableCell>
                      <TableCell className="text-foreground">{coop.village}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Pencil className="w-4 h-4 text-muted-foreground" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredCooperatives.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        Aucune cooperative trouvee
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
