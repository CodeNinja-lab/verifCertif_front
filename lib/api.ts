// Réexport depuis api-client.ts pour compatibilité
// Ce fichier est maintenu pour la compatibilité ascendante
export * from "./api-client"

// Fonction utilitaire pour obtenir le token d'authentification
function getAuthToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("auth_token")
}

// Fonction utilitaire pour les appels API
async function apiCall(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getAuthToken()
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Une erreur est survenue" }))
    throw new Error(error.message || `Erreur ${response.status}`)
  }

  return response
}

// Service API pour les offres
export const offreApi = {
  // Liste des offres
  list: async (params?: {
    my_offres?: boolean
    statut?: string
    search?: string
    per_page?: number
  }) => {
    const queryParams = new URLSearchParams()
    if (params?.my_offres) queryParams.append("my_offres", "1")
    if (params?.statut) queryParams.append("statut", params.statut)
    if (params?.search) queryParams.append("search", params.search)
    if (params?.per_page) queryParams.append("per_page", params.per_page.toString())

    const response = await apiCall(`/offres?${queryParams.toString()}`)
    return response.json()
  },

  // Obtenir une offre
  get: async (id: number | string) => {
    const response = await apiCall(`/offres/${id}`)
    return response.json()
  },

  // Créer une offre
  create: async (data: any) => {
    const response = await apiCall("/offres", {
      method: "POST",
      body: JSON.stringify(data),
    })
    return response.json()
  },

  // Mettre à jour une offre
  update: async (id: number | string, data: any) => {
    const response = await apiCall(`/offres/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
    return response.json()
  },

  // Supprimer une offre
  delete: async (id: number | string) => {
    const response = await apiCall(`/offres/${id}`, {
      method: "DELETE",
    })
    return response.json()
  },

  // Publier une offre
  publish: async (id: number | string) => {
    const response = await apiCall(`/offres/${id}/publish`, {
      method: "POST",
    })
    return response.json()
  },

  // Archiver une offre
  archive: async (id: number | string) => {
    const response = await apiCall(`/offres/${id}/archive`, {
      method: "POST",
    })
    return response.json()
  },

  // Ajouter une compétence à une offre
  addCompetence: async (id: number | string, competenceId: number, data?: any) => {
    const response = await apiCall(`/offres/${id}/competences`, {
      method: "POST",
      body: JSON.stringify({
        competence_id: competenceId,
        ...data,
      }),
    })
    return response.json()
  },

  // Supprimer une compétence d'une offre
  removeCompetence: async (id: number | string, competenceId: number) => {
    const response = await apiCall(`/offres/${id}/competences/${competenceId}`, {
      method: "DELETE",
    })
    return response.json()
  },

  // Obtenir les matchings d'une offre
  getMatchings: async (id: number | string, params?: { per_page?: number }) => {
    const queryParams = new URLSearchParams()
    if (params?.per_page) queryParams.append("per_page", params.per_page.toString())

    const response = await apiCall(`/offres/${id}/matchings?${queryParams.toString()}`)
    return response.json()
  },
}

// Service API pour les matchings
export const matchingApi = {
  // Liste des matchings
  list: async (params?: {
    interesse?: boolean
    min_score?: number
    sort_by?: string
    sort_order?: "asc" | "desc"
    per_page?: number
  }) => {
    const queryParams = new URLSearchParams()
    if (params?.interesse !== undefined) queryParams.append("interesse", params.interesse.toString())
    if (params?.min_score) queryParams.append("min_score", params.min_score.toString())
    if (params?.sort_by) queryParams.append("sort_by", params.sort_by)
    if (params?.sort_order) queryParams.append("sort_order", params.sort_order)
    if (params?.per_page) queryParams.append("per_page", params.per_page.toString())

    const response = await apiCall(`/matchings?${queryParams.toString()}`)
    return response.json()
  },

  // Obtenir un matching
  get: async (id: number | string) => {
    const response = await apiCall(`/matchings/${id}`)
    return response.json()
  },

  // Marquer comme vu
  markAsViewed: async (id: number | string) => {
    const response = await apiCall(`/matchings/${id}/view`, {
      method: "POST",
    })
    return response.json()
  },

  // Définir l'intérêt
  setInterest: async (id: number | string, interesse: boolean) => {
    const response = await apiCall(`/matchings/${id}/interest`, {
      method: "POST",
      body: JSON.stringify({ interesse }),
    })
    return response.json()
  },
}

// Service API pour les compétences
export const competenceApi = {
  // Liste des compétences
  list: async () => {
    const response = await apiCall("/competences")
    return response.json()
  },

  // Rechercher des compétences
  search: async (query: string) => {
    const response = await apiCall(`/competences/search/${encodeURIComponent(query)}`)
    return response.json()
  },
}

// Service API pour les notifications
export const notificationApi = {
  // Liste des notifications
  list: async () => {
    const response = await apiCall("/notifications")
    return response.json()
  },

  // Notifications non lues
  unread: async () => {
    const response = await apiCall("/notifications/unread")
    return response.json()
  },

  // Obtenir une notification
  get: async (id: number | string) => {
    const response = await apiCall(`/notifications/${id}`)
    return response.json()
  },

  // Marquer comme lu
  markAsRead: async (id: number | string) => {
    const response = await apiCall(`/notifications/${id}/read`, {
      method: "POST",
    })
    return response.json()
  },

  // Marquer toutes comme lues
  markAllAsRead: async () => {
    const response = await apiCall("/notifications/read-all", {
      method: "POST",
    })
    return response.json()
  },
}

// Service API pour les statistiques recruteur
export const recruiterStatsApi = {
  // Statistiques du dashboard recruteur
  dashboard: async (params?: { periode?: number }) => {
    const queryParams = new URLSearchParams()
    if (params?.periode) queryParams.append("periode", params.periode.toString())
    const response = await apiCall(`/recruiters/statistics/dashboard?${queryParams.toString()}`)
    return response.json()
  },

  // Statistiques des offres
  offres: async (params?: { periode?: number }) => {
    const queryParams = new URLSearchParams()
    if (params?.periode) queryParams.append("periode", params.periode.toString())
    const response = await apiCall(`/recruiters/statistics/offres?${queryParams.toString()}`)
    return response.json()
  },

  // Statistiques des candidats
  candidates: async () => {
    const response = await apiCall("/recruiters/statistics/candidates")
    return response.json()
  },
}

// Service API pour l'authentification
export const authApi = {
  // Obtenir l'utilisateur actuel
  me: async () => {
    const response = await apiCall("/auth/me")
    return response.json()
  },

  // Déconnexion
  logout: async () => {
    const response = await apiCall("/auth/logout", {
      method: "POST",
    })
    return response.json()
  },
}

