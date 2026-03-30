"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { TreePine, Eye, EyeOff } from "lucide-react"
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

  const backgroundLogos = [
    { top: "5%", left: "10%", rotate: "15deg", scale: 0.6, opacity: 0.03 },
    { top: "15%", left: "85%", rotate: "-10deg", scale: 0.8, opacity: 0.04 },
    { top: "40%", left: "5%", rotate: "25deg", scale: 0.5, opacity: 0.03 },
    { top: "70%", left: "15%", rotate: "-20deg", scale: 0.7, opacity: 0.05 },
    { top: "85%", left: "80%", rotate: "10deg", scale: 0.5, opacity: 0.03 },
    { top: "30%", left: "75%", rotate: "45deg", scale: 0.9, opacity: 0.02 },
    { top: "60%", left: "90%", rotate: "-35deg", scale: 0.4, opacity: 0.04 },
    { top: "10%", left: "50%", rotate: "5deg", scale: 0.6, opacity: 0.03 },
    { top: "80%", left: "45%", rotate: "30deg", scale: 0.6, opacity: 0.04 },
    { top: "50%", left: "30%", rotate: "-15deg", scale: 0.8, opacity: 0.02 },
  ]

  return (
    <div className="min-h-screen app-gradient-shell flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Scattered Logos */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {backgroundLogos.map((style, i) => (
          <img
            key={i}
            src="/Fichier 3.png"
            alt=""
            className="absolute grayscale select-none"
            style={{
              top: style.top,
              left: style.left,
              transform: `rotate(${style.rotate}) scale(${style.scale})`,
              opacity: style.opacity,
              width: "100px",
              height: "auto",
            }}
          />
        ))}
      </div>

      <Card className="w-full max-w-md relative z-10 border-border bg-card/95 backdrop-blur shadow-lg shadow-primary/5">
        <CardHeader className="text-center pb-2">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-xl border border-primary/15">
              <TreePine className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground">DSM</h1>
          <p className="text-foreground/80 text-sm mt-1">
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
                className="bg-secondary border-border text-foreground placeholder:text-foreground/45"
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
                  className="bg-secondary border-border text-foreground placeholder:text-foreground/45 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/65 hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-sm text-foreground bg-destructive/14 border border-destructive/30 p-3 rounded-md">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-[var(--forest-green-hover)] text-primary-foreground font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Connexion en cours..." : "Se connecter"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-xs text-foreground/70 text-center">
              Comptes de démonstration :
            </p>
            <div className="mt-2 space-y-1 text-xs text-foreground/75">
              <p><span className="text-foreground font-medium">Administrateur :</span> admin@reforest.com / admin123</p>
              <p><span className="text-foreground font-medium">Agent terrain :</span> agriculteur@reforest.com / agri123</p>
              <p><span className="text-foreground font-medium">Commanditaire :</span> commanditaire@reforest.com / cmd123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
