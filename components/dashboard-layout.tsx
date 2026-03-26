"use client"

import { useState } from "react"
import { useRouter, usePathname, useParams } from "next/navigation"
import {
  TreePine,
  LayoutDashboard,
  Map,
  Leaf,
  Users,
  Building2,
  BarChart3,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Layers,
  Sprout,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/auth-context"
import { projets } from "@/lib/mock-data"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const projetId = params?.projetId as string | undefined
  const currentProjet = projetId ? projets.find((p) => p.id === projetId) : null

  const isAdmin = user?.role === "administrateur"

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "administrateur":
        return "bg-primary/15 text-foreground border-primary/30"
      case "agriculteur":
        return "bg-chart-3/18 text-foreground border-chart-3/40"
      case "commanditaire":
        return "bg-chart-2/18 text-foreground border-chart-2/40"
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

  const mainNavItems = [
    { href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  ]

  const projetNavItems = currentProjet
    ? [
        { href: `/dashboard/projet/${projetId}`, label: "Vue d'ensemble", icon: LayoutDashboard },
        { href: `/dashboard/projet/${projetId}/parcelles`, label: "Parcelles", icon: Layers },
        { href: `/dashboard/projet/${projetId}/plants`, label: "Plants", icon: Sprout },
        { href: `/dashboard/projet/${projetId}/especes`, label: "Espèces", icon: Leaf },
        { href: `/dashboard/projet/${projetId}/carte`, label: "Carte GPS", icon: Map },
        ...(isAdmin
          ? [
              { href: `/dashboard/projet/${projetId}/monitoring`, label: "Monitoring", icon: BarChart3 },
            ]
          : []),
      ]
    : []

  const adminNavItems = isAdmin
    ? [
        { href: "/dashboard/cooperatives", label: "Coopératives", icon: Building2 },
        { href: "/dashboard/utilisateurs", label: "Utilisateurs", icon: Users },
      ]
    : []

  const accountNavItems = [
    { href: "/dashboard/compte", label: "Mon compte", icon: User },
  ]

  const NavLink = ({ href, label, icon: Icon }: { href: string; label: string; icon: React.ComponentType<{ className?: string }> }) => {
    const isActive = pathname === href
    return (
      <button
        onClick={() => {
          router.push(href)
          setMobileMenuOpen(false)
        }}
        className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors w-full text-left ${
          isActive
            ? "bg-primary/12 text-foreground border border-primary/25"
            : "text-foreground hover:text-foreground hover:bg-accent"
        }`}
      >
        <Icon className="w-4 h-4" />
        {label}
      </button>
    )
  }

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-4 border-b border-sidebar-border">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-3"
        >
          <div className="p-2 bg-primary/10 rounded-lg border border-primary/15">
            <TreePine className="w-5 h-5 text-primary" />
          </div>
          <span className="font-bold text-sidebar-foreground">DSM</span>
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Main Nav */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Principal
          </p>
          <nav className="space-y-1">
            {mainNavItems.map((item) => (
              <NavLink key={item.href} {...item} />
            ))}
          </nav>
        </div>

        {/* Project Nav */}
        {currentProjet && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Projet: {currentProjet.nom}
            </p>
            <nav className="space-y-1">
              {projetNavItems.map((item) => (
                <NavLink key={item.href} {...item} />
              ))}
            </nav>
          </div>
        )}

        {/* Admin Nav */}
        {isAdmin && adminNavItems.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Administration
            </p>
            <nav className="space-y-1">
              {adminNavItems.map((item) => (
                <NavLink key={item.href} {...item} />
              ))}
            </nav>
          </div>
        )}

        {/* Account Nav */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Compte
          </p>
          <nav className="space-y-1">
            {accountNavItems.map((item) => (
              <NavLink key={item.href} {...item} />
            ))}
          </nav>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.nom}</p>
            <Badge variant="outline" className={`text-xs ${getRoleBadgeColor(user?.role || "")}`}>
              {getRoleLabel(user?.role || "")}
            </Badge>
          </div>
        </div>
      </div>
    </>
  )

  return (
    <div className="min-h-screen app-gradient-shell flex">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col bg-sidebar/92 backdrop-blur-md border-r border-sidebar-border transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-0"
        }`}
      >
        {sidebarOpen && <SidebarContent />}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-background/70 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-sidebar/96 backdrop-blur-md border-r border-sidebar-border transform transition-transform duration-300 md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-14 border-b border-border bg-card/95 backdrop-blur flex items-center justify-between px-4 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            {currentProjet && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground hidden sm:inline">Projet:</span>
                <span className="font-medium text-foreground">{currentProjet.nom}</span>
              </div>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <span className="hidden sm:inline text-sm">{user?.nom}</span>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{user?.nom}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/dashboard/compte")}>
                <User className="w-4 h-4 mr-2" />
                Mon compte
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="w-4 h-4 mr-2" />
                Se déconnecter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
