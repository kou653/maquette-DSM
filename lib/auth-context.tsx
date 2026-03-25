"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { User } from "./types"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users for demo
const mockUsers: (User & { password: string })[] = [
  {
    id: "1",
    nom: "Jean Dupont",
    email: "admin@reforest.com",
    password: "admin123",
    role: "administrateur",
    projetsAffectes: ["1", "2", "3"],
  },
  {
    id: "2",
    nom: "Marie Koné",
    email: "agriculteur@reforest.com",
    password: "agri123",
    role: "agriculteur",
    projetsAffectes: ["1", "2"],
  },
  {
    id: "3",
    nom: "Pierre Mensah",
    email: "commanditaire@reforest.com",
    password: "cmd123",
    role: "commanditaire",
    projetsAffectes: ["1"],
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    const foundUser = mockUsers.find((u) => u.email === email && u.password === password)

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
