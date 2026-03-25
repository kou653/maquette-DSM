import type { Projet, Parcelle, Plant, Espece, Cooperative, User, MonitoringData } from "./types"

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
  { id: "p1", nom: "Parcelle Nord A1", ville: "Ouagadougou", cooperative: "Coop Sahel Vert", projetId: "1", superficie: 5.2, coordonnees: { lat: 12.3714, lng: -1.5197 } },
  { id: "p2", nom: "Parcelle Nord A2", ville: "Ouagadougou", cooperative: "Coop Sahel Vert", projetId: "1", superficie: 4.8, coordonnees: { lat: 12.3814, lng: -1.5097 } },
  { id: "p3", nom: "Parcelle Est B1", ville: "Fada N'Gourma", cooperative: "Coop Est Solidaire", projetId: "1", superficie: 6.1, coordonnees: { lat: 12.0614, lng: 0.3497 } },
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
  { id: "c1", nom: "Coop Sahel Vert", contact: "+226 70 12 34 56", region: "Centre", email: "sahel.vert@coop.bf" },
  { id: "c2", nom: "Coop Est Solidaire", contact: "+226 70 23 45 67", region: "Est", email: "est.solidaire@coop.bf" },
  { id: "c3", nom: "Coop Borgou", contact: "+229 97 12 34 56", region: "Borgou", email: "borgou@coop.bj" },
  { id: "c4", nom: "Coop Atacora", contact: "+229 97 23 45 67", region: "Atacora", email: "atacora@coop.bj" },
  { id: "c5", nom: "Coop Lagunes", contact: "+225 07 12 34 56", region: "Lagunes", email: "lagunes@coop.ci" },
  { id: "c6", nom: "Coop Vallée Bandama", contact: "+225 07 23 45 67", region: "Vallée du Bandama", email: "bandama@coop.ci" },
]

export const users: User[] = [
  { id: "1", nom: "Jean Dupont", email: "admin@reforest.com", role: "administrateur", projetsAffectes: ["1", "2", "3"] },
  { id: "2", nom: "Marie Koné", email: "agriculteur@reforest.com", role: "agriculteur", projetsAffectes: ["1", "2"] },
  { id: "3", nom: "Pierre Mensah", email: "commanditaire@reforest.com", role: "commanditaire", projetsAffectes: ["1"] },
  { id: "4", nom: "Fatou Diallo", email: "fatou@reforest.com", role: "agriculteur", projetsAffectes: ["2", "3"] },
  { id: "5", nom: "Kwame Asante", email: "kwame@reforest.com", role: "commanditaire", projetsAffectes: ["3"] },
]

export const monitoringData: MonitoringData[] = [
  {
    especeId: "e1",
    parcelleId: "p1",
    plantsMisEnTerre: 500,
    plantsVivants: 450,
    plantsMorts: 50,
    tauxSurvie: 90,
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
    documentation: [],
  },
  {
    especeId: "e6",
    parcelleId: "p6",
    plantsMisEnTerre: 800,
    plantsVivants: 620,
    plantsMorts: 180,
    tauxSurvie: 77.5,
    documentation: [
      { notes: "Stress hydrique important en saison sèche", photos: [], date: "2024-06-01" },
    ],
  },
]

export function getParcellesByProjet(projetId: string): Parcelle[] {
  return parcelles.filter((p) => p.projetId === projetId)
}

export function getPlantsByProjet(projetId: string): Plant[] {
  const projetParcelles = parcelles.filter((p) => p.projetId === projetId).map((p) => p.id)
  return plants.filter((p) => projetParcelles.includes(p.parcelleId))
}

export function getMonitoringByParcelleAndEspece(parcelleId: string, especeId: string): MonitoringData | undefined {
  return monitoringData.find((m) => m.parcelleId === parcelleId && m.especeId === especeId)
}

export function getMonitoringByParcelle(parcelleId: string): MonitoringData | null {
  const parcelleMonitoring = monitoringData.filter((m) => m.parcelleId === parcelleId)
  if (parcelleMonitoring.length === 0) return null
  
  const aggregated: MonitoringData = {
    especeId: "all",
    parcelleId: parcelleId,
    plantsMisEnTerre: parcelleMonitoring.reduce((sum, m) => sum + m.plantsMisEnTerre, 0),
    plantsVivants: parcelleMonitoring.reduce((sum, m) => sum + m.plantsVivants, 0),
    plantsMorts: parcelleMonitoring.reduce((sum, m) => sum + m.plantsMorts, 0),
    tauxSurvie: 0,
    documentation: parcelleMonitoring.flatMap((m) => m.documentation || []).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  }
  aggregated.tauxSurvie = aggregated.plantsMisEnTerre > 0 
    ? Math.round((aggregated.plantsVivants / aggregated.plantsMisEnTerre) * 1000) / 10 
    : 0
  
  return aggregated
}
