export type UserRole = "administrateur" | "agriculteur" | "commanditaire"

export interface User {
  id: string
  nom: string
  email: string
  role: UserRole
  projetsAffectes: string[]
}

export interface Projet {
  id: string
  nom: string
  description: string
  dateDebut: string
  dateFin: string
  region: string
  status: "actif" | "termine" | "en_pause"
  totalParcelles: number
  totalPlants: number
  tauxSurvie: number
  objectif?: string
}

export interface Parcelle {
  id: string
  nom: string
  ville: string
  cooperative: string
  projetId: string
  superficie: number
  coordonnees: { lat: number; lng: number }
  objectif?: string
}

export interface Plant {
  id: string
  especeId: string
  especeNom: string
  parcelleId: string
  parcelleNom: string
  ville: string
  coordonnees: { lat: number; lng: number }
  datePlantation: string
  status: "vivant" | "mort"
}

export interface Espece {
  id: string
  nomCommun: string
  nomScientifique: string
}

export interface Cooperative {
  id: string
  nom: string
  entreprise: string
  contact: string
  email: string
  ville: string
  village: string
}

export interface MonitoringData {
  especeId: string
  parcelleId: string
  plantsMisEnTerre: number
  plantsVivants: number
  plantsMorts: number
  tauxSurvie: number
  history: {
    month: string
    plantsMisEnTerre: number
    plantsVivants: number
    plantsMorts: number
  }[]
  documentation?: {
    notes: string
    photos: string[]
    date: string
  }[]
}

export interface EspeceDocumentation {
  id: string
  projetId: string
  especeId: string
  etat: "vivant" | "mort"
  notes: string
  auteur: string
  date: string
}

export interface Objectif {
  id: string
  projetId: string
  parcelleId?: string
  titre: string
  valeurCible: number
  valeurActuelle: number
  unite: string
  estValide: boolean
  dateCreation: string
}

export interface EvolutionImage {
  id: string
  projetId: string
  parcelleId: string
  url: string
  description: string
  date: string
  auteur: string
}
