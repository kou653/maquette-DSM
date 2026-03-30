import type { Projet, Parcelle, Plant, Espece, Cooperative, User, MonitoringData, EspeceDocumentation, Objectif } from "./types"

export const projets: Projet[] = [
  {
    id: "1",
    nom: "Reboisement Sahel 2024",
    description: "Programme de reboisement dans la région du Sahel pour lutter contre la désertification",
    dateDebut: "2024-01-15",
    dateFin: "2026-12-31",
    region: "Sahel",
    status: "actif",
    totalParcelles: 45,
    totalPlants: 12500,
    tauxSurvie: 87.5,
    objectif: "50 plants",
  },
  {
    id: "2",
    nom: "Forêt Communautaire Bénin",
    description: "Création de forêts communautaires dans le nord du Bénin",
    dateDebut: "2024-03-01",
    dateFin: "2027-02-28",
    region: "Nord Bénin",
    status: "actif",
    totalParcelles: 28,
    totalPlants: 8200,
    tauxSurvie: 92.3,
  },
  {
    id: "3",
    nom: "Agroforesterie Côte d'Ivoire",
    description: "Intégration d'arbres dans les systèmes agricoles ivoiriens",
    dateDebut: "2023-06-01",
    dateFin: "2025-05-31",
    region: "Côte d'Ivoire",
    status: "actif",
    totalParcelles: 62,
    totalPlants: 18700,
    tauxSurvie: 78.9,
  },
]

export const parcelles: Parcelle[] = [
  { id: "p1", nom: "Parcelle Nord A1", ville: "Ouagadougou", cooperative: "Coop Sahel Vert", projetId: "1", superficie: 5.2, coordonnees: { lat: 12.3714, lng: -1.5197 }, objectif: "Planter 2000 Acacias" },
  { id: "p2", nom: "Parcelle Nord A2", ville: "Ouagadougou", cooperative: "Coop Sahel Vert", projetId: "1", superficie: 4.8, coordonnees: { lat: 12.3814, lng: -1.5097 }, objectif: "Planter 1500 Baobabs" },
  { id: "p3", nom: "Parcelle Est B1", ville: "Fada N'Gourma", cooperative: "Coop Est Solidaire", projetId: "1", superficie: 6.1, coordonnees: { lat: 12.0614, lng: 0.3497 }, objectif: "Planter 3000 Karités" },
  { id: "p4", nom: "Parcelle Parakou 1", ville: "Parakou", cooperative: "Coop Borgou", projetId: "2", superficie: 3.5, coordonnees: { lat: 9.3400, lng: 2.6300 } },
  { id: "p5", nom: "Parcelle Natitingou 1", ville: "Natitingou", cooperative: "Coop Atacora", projetId: "2", superficie: 4.2, coordonnees: { lat: 10.3000, lng: 1.3800 } },
  { id: "p6", nom: "Parcelle Abidjan Nord", ville: "Abidjan", cooperative: "Coop Lagunes", projetId: "3", superficie: 7.8, coordonnees: { lat: 5.3600, lng: -4.0083 } },
  { id: "p7", nom: "Parcelle Bouaké Central", ville: "Bouaké", cooperative: "Coop Vallée Bandama", projetId: "3", superficie: 5.5, coordonnees: { lat: 7.6900, lng: -5.0300 } },
]

export const especes: Espece[] = [
  { id: "e1", nomCommun: "Acacia du Sénégal", nomScientifique: "Acacia senegal" },
  { id: "e2", nomCommun: "Baobab", nomScientifique: "Adansonia digitata" },
  { id: "e3", nomCommun: "Karité", nomScientifique: "Vitellaria paradoxa" },
  { id: "e4", nomCommun: "Néré", nomScientifique: "Parkia biglobosa" },
  { id: "e5", nomCommun: "Moringa", nomScientifique: "Moringa oleifera" },
  { id: "e6", nomCommun: "Teck", nomScientifique: "Tectona grandis" },
  { id: "e7", nomCommun: "Eucalyptus", nomScientifique: "Eucalyptus camaldulensis" },
]

export const plants: Plant[] = [
  { id: "pl1", especeId: "e1", especeNom: "Acacia du Sénégal", parcelleId: "p1", parcelleNom: "Parcelle Nord A1", ville: "Ouagadougou", coordonnees: { lat: 12.3720, lng: -1.5200 }, datePlantation: "2024-02-15", status: "vivant" },
  { id: "pl2", especeId: "e2", especeNom: "Baobab", parcelleId: "p1", parcelleNom: "Parcelle Nord A1", ville: "Ouagadougou", coordonnees: { lat: 12.3725, lng: -1.5195 }, datePlantation: "2024-02-15", status: "vivant" },
  { id: "pl3", especeId: "e3", especeNom: "Karité", parcelleId: "p2", parcelleNom: "Parcelle Nord A2", ville: "Ouagadougou", coordonnees: { lat: 12.3820, lng: -1.5100 }, datePlantation: "2024-02-20", status: "mort" },
  { id: "pl4", especeId: "e1", especeNom: "Acacia du Sénégal", parcelleId: "p3", parcelleNom: "Parcelle Est B1", ville: "Fada N'Gourma", coordonnees: { lat: 12.0620, lng: 0.3500 }, datePlantation: "2024-03-01", status: "vivant" },
  { id: "pl5", especeId: "e5", especeNom: "Moringa", parcelleId: "p4", parcelleNom: "Parcelle Parakou 1", ville: "Parakou", coordonnees: { lat: 9.3410, lng: 2.6310 }, datePlantation: "2024-04-10", status: "vivant" },
  { id: "pl6", especeId: "e4", especeNom: "Néré", parcelleId: "p5", parcelleNom: "Parcelle Natitingou 1", ville: "Natitingou", coordonnees: { lat: 10.3010, lng: 1.3810 }, datePlantation: "2024-04-15", status: "vivant" },
  { id: "pl7", especeId: "e6", especeNom: "Teck", parcelleId: "p6", parcelleNom: "Parcelle Abidjan Nord", ville: "Abidjan", coordonnees: { lat: 5.3610, lng: -4.0090 }, datePlantation: "2024-05-01", status: "vivant" },
  { id: "pl8", especeId: "e7", especeNom: "Eucalyptus", parcelleId: "p7", parcelleNom: "Parcelle Bouaké Central", ville: "Bouaké", coordonnees: { lat: 7.6910, lng: -5.0310 }, datePlantation: "2024-05-10", status: "mort" },
]

export const cooperatives: Cooperative[] = [
  { id: "c1", nom: "Coop Sahel Vert", entreprise: "Nestlé", contact: "+226 70 12 34 56", email: "sahel.vert@coop.bf", ville: "Ouagadougou", village: "Koubri" },
  { id: "c2", nom: "Coop Est Solidaire", entreprise: "Sodefor", contact: "+226 70 23 45 67", email: "est.solidaire@coop.bf", ville: "Fada N'Gourma", village: "Diapangou" },
  { id: "c3", nom: "Coop Borgou", entreprise: "Nestlé", contact: "+229 97 12 34 56", email: "borgou@coop.bj", ville: "Parakou", village: "Nima" },
  { id: "c4", nom: "Coop Atacora", entreprise: "Nestlé", contact: "+229 97 23 45 67", email: "atacora@coop.bj", ville: "Natitingou", village: "Kotopounga" },
  { id: "c5", nom: "Coop Lagunes", entreprise: "Nestlé", contact: "+225 07 12 34 56", email: "lagunes@coop.ci", ville: "Abidjan", village: "Anyama" },
  { id: "c6", nom: "Coop Vallée Bandama", entreprise: "Anader", contact: "+225 07 23 45 67", email: "bandama@coop.ci", ville: "Bouaké", village: "Béoumi" },
]

export const users: User[] = [
  { id: "1", nom: "Jean Dupont", email: "admin@reforest.com", role: "administrateur", projetsAffectes: ["1", "2", "3"] },
  { id: "2", nom: "Marie Koné", email: "agriculteur@reforest.com", role: "agriculteur", projetsAffectes: ["1", "2"] },
  { id: "3", nom: "Pierre Mensah", email: "commanditaire@reforest.com", role: "commanditaire", projetsAffectes: ["1"] },
  { id: "4", nom: "Fatou Diallo", email: "fatou@reforest.com", role: "agriculteur", projetsAffectes: ["2", "3"] },
  { id: "5", nom: "Kwame Asante", email: "kwame@reforest.com", role: "commanditaire", projetsAffectes: ["3"] },
]

export const especeDocumentations: EspeceDocumentation[] = [
  {
    id: "ed1",
    projetId: "1",
    especeId: "e2",
    etat: "vivant",
    notes: "Les baobabs montrent une excellente résistance à la chaleur cette saison.",
    auteur: "Marie Koné",
    date: "2024-05-12T10:00:00Z"
  },
  {
    id: "ed2",
    projetId: "1",
    especeId: "e3",
    etat: "mort",
    notes: "Certains plants de karité n'ont pas survécu à cause d'attaques de termites au niveau des racines.",
    auteur: "Marie Koné",
    date: "2024-05-14T09:30:00Z"
  }
]

export const objectifs: Objectif[] = [
  {
    id: "obj1",
    projetId: "1",
    parcelleId: "p1",
    titre: "",
    valeurCible: 2000,
    valeurActuelle: 1800,
    unite: "plants",
    estValide: false,
    dateCreation: "2024-01-20T08:00:00Z"
  },
  {
    id: "obj2",
    projetId: "1",
    parcelleId: "p2",
    titre: "",
    valeurCible: 1500,
    valeurActuelle: 1500,
    unite: "plants",
    estValide: true,
    dateCreation: "2024-01-21T09:00:00Z"
  },
  {
    id: "obj3",
    projetId: "1",
    parcelleId: "p3",
    titre: "",
    valeurCible: 3000,
    valeurActuelle: 2100,
    unite: "plants",
    estValide: false,
    dateCreation: "2024-01-22T10:00:00Z"
  },
]

export const monitoringData: MonitoringData[] = [
  {
    especeId: "e1",
    parcelleId: "p1",
    plantsMisEnTerre: 500,
    plantsVivants: 450,
    plantsMorts: 50,
    tauxSurvie: 90,
    history: [
      { month: "2024-02", plantsMisEnTerre: 500, plantsVivants: 482, plantsMorts: 18 },
      { month: "2024-03", plantsMisEnTerre: 500, plantsVivants: 468, plantsMorts: 32 },
      { month: "2024-04", plantsMisEnTerre: 500, plantsVivants: 450, plantsMorts: 50 },
    ],
    documentation: [
      { notes: "Croissance normale, arrosage régulier effectué", photos: [], date: "2024-03-15" },
      { notes: "Quelques plants affectés par la sécheresse", photos: [], date: "2024-04-20" },
    ],
  },
  {
    especeId: "e2",
    parcelleId: "p1",
    plantsMisEnTerre: 200,
    plantsVivants: 185,
    plantsMorts: 15,
    tauxSurvie: 92.5,
    history: [
      { month: "2024-02", plantsMisEnTerre: 200, plantsVivants: 194, plantsMorts: 6 },
      { month: "2024-03", plantsMisEnTerre: 200, plantsVivants: 190, plantsMorts: 10 },
      { month: "2024-04", plantsMisEnTerre: 200, plantsVivants: 185, plantsMorts: 15 },
    ],
    documentation: [
      { notes: "Excellente adaptation au sol", photos: [], date: "2024-03-20" },
    ],
  },
  {
    especeId: "e3",
    parcelleId: "p2",
    plantsMisEnTerre: 350,
    plantsVivants: 280,
    plantsMorts: 70,
    tauxSurvie: 80,
    history: [
      { month: "2024-02", plantsMisEnTerre: 350, plantsVivants: 330, plantsMorts: 20 },
      { month: "2024-03", plantsMisEnTerre: 350, plantsVivants: 305, plantsMorts: 45 },
      { month: "2024-04", plantsMisEnTerre: 350, plantsVivants: 280, plantsMorts: 70 },
    ],
    documentation: [
      { notes: "Mortalité due aux attaques de termites", photos: [], date: "2024-04-10" },
    ],
  },
  {
    especeId: "e5",
    parcelleId: "p4",
    plantsMisEnTerre: 600,
    plantsVivants: 570,
    plantsMorts: 30,
    tauxSurvie: 95,
    history: [
      { month: "2024-04", plantsMisEnTerre: 600, plantsVivants: 590, plantsMorts: 10 },
      { month: "2024-05", plantsMisEnTerre: 600, plantsVivants: 580, plantsMorts: 20 },
      { month: "2024-06", plantsMisEnTerre: 600, plantsVivants: 570, plantsMorts: 30 },
    ],
    documentation: [],
  },
  {
    especeId: "e6",
    parcelleId: "p6",
    plantsMisEnTerre: 800,
    plantsVivants: 620,
    plantsMorts: 180,
    tauxSurvie: 77.5,
    history: [
      { month: "2024-05", plantsMisEnTerre: 800, plantsVivants: 740, plantsMorts: 60 },
      { month: "2024-06", plantsMisEnTerre: 800, plantsVivants: 690, plantsMorts: 110 },
      { month: "2024-07", plantsMisEnTerre: 800, plantsVivants: 620, plantsMorts: 180 },
    ],
    documentation: [
      { notes: "Stress hydrique important en saison sèche", photos: [], date: "2024-06-01" },
    ],
  },
]

function sortMonitoringHistory(history: MonitoringData["history"]) {
  return [...history].sort((a, b) => a.month.localeCompare(b.month))
}

function getLatestMetrics(entry: MonitoringData) {
  const history = sortMonitoringHistory(entry.history)
  const latest = history[history.length - 1]

  if (!latest) {
    return {
      plantsMisEnTerre: entry.plantsMisEnTerre,
      plantsVivants: entry.plantsVivants,
      plantsMorts: entry.plantsMorts,
    }
  }

  return {
    plantsMisEnTerre: latest.plantsMisEnTerre,
    plantsVivants: latest.plantsVivants,
    plantsMorts: latest.plantsMorts,
  }
}

export function getParcellesByProjet(projetId: string): Parcelle[] {
  return parcelles.filter((p) => p.projetId === projetId)
}

export function getPlantsByProjet(projetId: string): Plant[] {
  const projetParcelles = parcelles.filter((p) => p.projetId === projetId).map((p) => p.id)
  return plants.filter((p) => projetParcelles.includes(p.parcelleId))
}

export function getPlantsByParcelle(parcelleId: string): Plant[] {
  return plants.filter((p) => p.parcelleId === parcelleId)
}

export function getMonitoringByParcelleAndEspece(parcelleId: string, especeId: string): MonitoringData | undefined {
  const entry = monitoringData.find((m) => m.parcelleId === parcelleId && m.especeId === especeId)
  if (!entry) return undefined

  const latest = getLatestMetrics(entry)
  const tauxSurvie =
    latest.plantsMisEnTerre > 0
      ? Math.round((latest.plantsVivants / latest.plantsMisEnTerre) * 1000) / 10
      : 0

  return {
    ...entry,
    ...latest,
    tauxSurvie,
    history: sortMonitoringHistory(entry.history),
  }
}

export function getMonitoringByParcelle(parcelleId: string): MonitoringData | null {
  const parcelleMonitoring = monitoringData.filter((m) => m.parcelleId === parcelleId)
  if (parcelleMonitoring.length === 0) return null

  const historyByMonth = new Map<string, { plantsMisEnTerre: number; plantsVivants: number; plantsMorts: number }>()

  for (const entry of parcelleMonitoring) {
    for (const snapshot of entry.history) {
      const current = historyByMonth.get(snapshot.month) ?? {
        plantsMisEnTerre: 0,
        plantsVivants: 0,
        plantsMorts: 0,
      }

      current.plantsMisEnTerre += snapshot.plantsMisEnTerre
      current.plantsVivants += snapshot.plantsVivants
      current.plantsMorts += snapshot.plantsMorts
      historyByMonth.set(snapshot.month, current)
    }
  }

  const history = [...historyByMonth.entries()]
    .map(([month, values]) => ({ month, ...values }))
    .sort((a, b) => a.month.localeCompare(b.month))

  const latest = history[history.length - 1]
  const aggregated: MonitoringData = {
    especeId: "all",
    parcelleId: parcelleId,
    plantsMisEnTerre: latest?.plantsMisEnTerre ?? 0,
    plantsVivants: latest?.plantsVivants ?? 0,
    plantsMorts: latest?.plantsMorts ?? 0,
    tauxSurvie: 0,
    history,
    documentation: parcelleMonitoring.flatMap((m) => m.documentation || []).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  }
  aggregated.tauxSurvie = aggregated.plantsMisEnTerre > 0
    ? Math.round((aggregated.plantsVivants / aggregated.plantsMisEnTerre) * 1000) / 10
    : 0

  return aggregated
}

export function addPlant(plant: Omit<Plant, "id">): Plant {
  const newPlant = { ...plant, id: `pl${plants.length + 1}-${Date.now()}` }
  plants.push(newPlant)
  return newPlant
}

export function addEspeceDocumentation(doc: Omit<EspeceDocumentation, "id">): EspeceDocumentation {
  const newDoc = { ...doc, id: `ed${especeDocumentations.length + 1}-${Date.now()}` }
  especeDocumentations.push(newDoc)
  return newDoc
}

export function getDocumentationsByProjetAndEtat(projetId: string, etat: "vivant" | "mort"): EspeceDocumentation[] {
  return especeDocumentations.filter((d) => d.projetId === projetId && d.etat === etat)
}

export function addObjectif(obj: Omit<Objectif, "id">): Objectif {
  const newObj = { ...obj, id: `obj${objectifs.length + 1}-${Date.now()}` }
  objectifs.push(newObj)
  return newObj
}

export function toggleObjectifValidation(id: string): void {
  const obj = objectifs.find(o => o.id === id)
  if (obj) {
    obj.estValide = !obj.estValide
  }
}

export function editObjectif(id: string, titre: string): void {
  const obj = objectifs.find(o => o.id === id)
  if (obj) {
    obj.titre = titre
  }
}

export function deleteObjectif(id: string): void {
  const index = objectifs.findIndex(o => o.id === id)
  if (index !== -1) {
    objectifs.splice(index, 1)
  }
}

export function getObjectifsByProjet(projetId: string): Objectif[] {
  return objectifs.filter(o => o.projetId === projetId)
}
