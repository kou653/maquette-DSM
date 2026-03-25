"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { TreePine, Leaf, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const { login, isLoading } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const success = await login(email, password)
    if (success) {
      router.push("/dashboard")
    } else {
      setError("Email ou mot de passe incorrect")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 opacity-10">
          <TreePine className="w-32 h-32 text-primary" />
        </div>
        <div className="absolute bottom-20 right-10 opacity-10">
          <Leaf className="w-24 h-24 text-primary" />
        </div>
        <div className="absolute top-1/2 left-1/4 opacity-5">
          <TreePine className="w-48 h-48 text-primary" />
        </div>
      </div>

      <Card className="w-full max-w-md relative z-10 border-border bg-card/95 backdrop-blur">
        <CardHeader className="text-center pb-2">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <TreePine className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground">DSM</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Plateforme de suivi-évaluation des projets de reboisement
          </p>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Adresse email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-secondary border-border"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Mot de passe
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-secondary border-border pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Connexion en cours..." : "Se connecter"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              Comptes de démonstration :
            </p>
            <div className="mt-2 space-y-1 text-xs text-muted-foreground">
              <p><span className="text-foreground font-medium">Admin :</span> admin@reforest.com / admin123</p>
              <p><span className="text-foreground font-medium">Agriculteur :</span> agriculteur@reforest.com / agri123</p>
              <p><span className="text-foreground font-medium">Commanditaire :</span> commanditaire@reforest.com / cmd123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
