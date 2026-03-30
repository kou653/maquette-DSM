"use client"

import { useEffect, use, useState } from "react"
import { useRouter } from "next/navigation"
import { Leaf, Search, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
import { useAuth } from "@/lib/auth-context"
import { projets, especes } from "@/lib/mock-data"
import { DashboardLayout } from "@/components/dashboard-layout"

interface Props {
  params: Promise<{ projetId: string }>
}

export default function EspecesPage({ params }: Props) {
  const { projetId } = use(params)
  const { user } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [columnFilters, setColumnFilters] = useState({
    nomCommun: "all",
    nomScientifique: "all"
  })

  const projet = projets.find((p) => p.id === projetId)

  useEffect(() => {
    if (!user) {
      router.push("/")
      return
    }
    if (user.role !== "administrateur" && !user.projetsAffectes.includes(projetId)) {
      router.push("/dashboard")
    }
  }, [user, projetId, router])

  if (!user || !projet) return null

  const filteredEspeces = especes.filter((e) => {
    const matchesGlobal =
      e.nomCommun.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.nomScientifique.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesColumnNom = columnFilters.nomCommun === "all" || e.nomCommun === columnFilters.nomCommun
    const matchesColumnScientifique = columnFilters.nomScientifique === "all" || e.nomScientifique === columnFilters.nomScientifique

    return matchesGlobal && matchesColumnNom && matchesColumnScientifique
  })

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Leaf className="w-6 h-6 text-primary" />
              Espèces
            </h1>
            <p className="text-muted-foreground">
              Catalogue des espèces végétales
            </p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une espèce..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full sm:w-64 bg-secondary border-border"
            />
          </div>
        </div>

        {/* Stats */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Leaf className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total espèces référencées</p>
                <p className="text-2xl font-bold text-foreground">{especes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base text-foreground">
              Catalogue des espèces ({filteredEspeces.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="text-muted-foreground w-20">ID</TableHead>
                    <TableHead className="text-muted-foreground">
                      <div className="flex items-center gap-2 py-1">
                        <span>Nom commun</span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <ChevronDown className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="bg-popover border-border">
                            <DropdownMenuItem onClick={() => setColumnFilters({ ...columnFilters, nomCommun: "all" })}>
                              Tout
                            </DropdownMenuItem>
                            {[...new Set(especes.map(e => e.nomCommun))].map(val => (
                              <DropdownMenuItem key={val} onClick={() => setColumnFilters({ ...columnFilters, nomCommun: val })}>
                                {val}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      <div className="flex items-center gap-2 py-1">
                        <span>Nom scientifique</span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <ChevronDown className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="bg-popover border-border">
                            <DropdownMenuItem onClick={() => setColumnFilters({ ...columnFilters, nomScientifique: "all" })}>
                              Tout
                            </DropdownMenuItem>
                            {[...new Set(especes.map(e => e.nomScientifique))].map(val => (
                              <DropdownMenuItem key={val} onClick={() => setColumnFilters({ ...columnFilters, nomScientifique: val })}>
                                {val}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEspeces.map((espece) => (
                    <TableRow key={espece.id} className="border-border">
                      <TableCell className="font-mono text-sm text-muted-foreground">
                        {espece.id}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Leaf className="w-4 h-4 text-primary" />
                          <span className="font-medium text-foreground">{espece.nomCommun}</span>
                        </div>
                      </TableCell>
                      <TableCell className="italic text-muted-foreground">
                        {espece.nomScientifique}
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredEspeces.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                        Aucune espèce trouvée
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
