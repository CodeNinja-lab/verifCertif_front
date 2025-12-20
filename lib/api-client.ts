"use client"

// Fichier client-side uniquement pour les appels API
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"

// Fonction utilitaire pour obtenir le token d'authentification
function getAuthToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("auth_token")
}

// Fonction utilitaire pour obtenir l'URL de l'API
function getApiUrl(): string {
  return API_URL
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
    const errorWithResponse = new Error(error.message || `Erreur ${response.status}`) as any
    errorWithResponse.response = response
    errorWithResponse.status = response.status
    errorWithResponse.errors = error.errors || error.message
    throw errorWithResponse
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
    // Si my_offres est demandé, utiliser la route authentifiée
    if (params?.my_offres) {
      const queryParams = new URLSearchParams()
      if (params?.statut) queryParams.append("statut", params.statut)
      if (params?.search) queryParams.append("search", params.search)
      if (params?.per_page) queryParams.append("per_page", params.per_page.toString())

      const response = await apiCall(`/offres/my-offres?${queryParams.toString()}`)
      return response.json()
    }
    
    // Sinon, utiliser la route publique
    const queryParams = new URLSearchParams()
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

// Service API pour les messages
export const messageApi = {
  // Liste des conversations (recruteur)
  conversations: async () => {
    const response = await apiCall("/messages/conversations")
    return response.json()
  },

  // Liste des conversations (étudiant)
  myConversations: async () => {
    const response = await apiCall("/messages/my-conversations")
    return response.json()
  },

  // Obtenir une conversation par ID (étudiant)
  getMyConversation: async (conversationId: number | string) => {
    const response = await apiCall(`/messages/my-conversation/${conversationId}`)
    return response.json()
  },

  // Obtenir une conversation par ID
  getConversation: async (conversationId: number | string) => {
    const response = await apiCall(`/messages/conversation/${conversationId}`)
    return response.json()
  },

  // Obtenir ou créer une conversation
  getOrCreateConversation: async (etudiantId: number | string, offreId?: number | string) => {
    const url = offreId 
      ? `/messages/conversation/${etudiantId}/${offreId}/create`
      : `/messages/conversation/${etudiantId}/create`
    const response = await apiCall(url)
    return response.json()
  },

  // Envoyer un message
  sendMessage: async (conversationId: number | string, content: string) => {
    const response = await apiCall(`/messages/conversation/${conversationId}/send`, {
      method: "POST",
      body: JSON.stringify({ content }),
    })
    return response.json()
  },

  // Marquer comme lu
  markAsRead: async (conversationId: number | string) => {
    const response = await apiCall(`/messages/conversation/${conversationId}/read`, {
      method: "POST",
    })
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

  // Mettre à jour le profil
  updateProfile: async (data: {
    prenom?: string
    nom?: string
    nom_entreprise?: string
    email?: string
    telephone?: string
    photo_url?: string
    langue?: string
  }) => {
    const response = await apiCall("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    })
    return response.json()
  },

  // Upload de photo de profil
  uploadPhoto: async (file: File) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null
    const formData = new FormData()
    formData.append("photo", file)

    const headers: HeadersInit = {}
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(`${API_URL}/auth/upload-photo`, {
      method: "POST",
      headers,
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Erreur lors de l'upload" }))
      throw new Error(error.message || `Erreur ${response.status}`)
    }

    return response.json()
  },

  // Supprimer la photo de profil
  deletePhoto: async () => {
    const response = await apiCall("/auth/delete-photo", {
      method: "DELETE",
    })
    return response.json()
  },

  // Changer le mot de passe
  changePassword: async (data: {
    current_password: string
    new_password: string
  }) => {
    const response = await apiCall("/auth/change-password", {
      method: "POST",
      body: JSON.stringify(data),
    })
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

// Service API pour le profil étudiant
export const profilEtudiantApi = {
  // Obtenir le profil
  get: async () => {
    const response = await apiCall("/profil-etudiant")
    return response.json()
  },

  // Créer un profil
  create: async (data: {
    bio?: string
    cv_url?: string
    linkedin_url?: string
    github_url?: string
    portfolio_url?: string
    disponibilite?: string
    localisation_actuelle?: string
    localisation_souhaitee?: string[]
    mobilite?: string
    salaire_minimum_souhaite?: number
    types_contrat_souhaites?: string[]
    profil_public?: boolean
  }) => {
    const response = await apiCall("/profil-etudiant", {
      method: "POST",
      body: JSON.stringify(data),
    })
    return response.json()
  },

  // Mettre à jour le profil
  update: async (data: {
    bio?: string
    cv_url?: string
    linkedin_url?: string
    github_url?: string
    portfolio_url?: string
    disponibilite?: string
    localisation_actuelle?: string
    localisation_souhaitee?: string[]
    mobilite?: string
    salaire_minimum_souhaite?: number
    types_contrat_souhaites?: string[]
    profil_public?: boolean
  }) => {
    const response = await apiCall("/profil-etudiant", {
      method: "PUT",
      body: JSON.stringify(data),
    })
    return response.json()
  },

  // Supprimer le profil
  delete: async () => {
    const response = await apiCall("/profil-etudiant", {
      method: "DELETE",
    })
    return response.json()
  },

  // Obtenir les compétences
  getCompetences: async () => {
    const response = await apiCall("/profil-etudiant/competences")
    return response.json()
  },

  // Ajouter une compétence
  addCompetence: async (data: {
    competence_id: number
    niveau?: string
    annees_experience?: number
  }) => {
    const response = await apiCall("/profil-etudiant/competences", {
      method: "POST",
      body: JSON.stringify(data),
    })
    return response.json()
  },

  // Supprimer une compétence
  removeCompetence: async (competenceId: number) => {
    const response = await apiCall(`/profil-etudiant/competences/${competenceId}`, {
      method: "DELETE",
    })
    return response.json()
  },
}

// Service API pour les documents/diplômes
export const documentApi = {
  // Liste des documents de l'utilisateur connecté
  list: async (params?: {
    statut?: string
    type_document?: string
    search?: string
    per_page?: number
  }) => {
    const queryParams = new URLSearchParams()
    if (params?.statut) queryParams.append("statut", params.statut)
    if (params?.type_document) queryParams.append("type_document", params.type_document)
    if (params?.search) queryParams.append("search", params.search)
    if (params?.per_page) queryParams.append("per_page", params.per_page.toString())

    const response = await apiCall(`/documents?${queryParams.toString()}`)
    return response.json()
  },

  // Mes diplômes (pour les étudiants - recherche par ID et numero_etudiant)
  myDocuments: async (params?: {
    type_document?: string
    per_page?: number
  }) => {
    const queryParams = new URLSearchParams()
    if (params?.type_document) queryParams.append("type_document", params.type_document)
    if (params?.per_page) queryParams.append("per_page", params.per_page.toString())

    const response = await apiCall(`/documents/my-documents?${queryParams.toString()}`)
    return response.json()
  },

  // Obtenir un document
  get: async (id: number | string) => {
    const response = await apiCall(`/documents/${id}`)
    return response.json()
  },

  // Télécharger un document
  download: async (id: number | string) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null
    const headers: HeadersInit = {
      'Accept': 'application/pdf, application/octet-stream, */*',
    }
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(`${API_URL}/documents/${id}/download`, {
      headers,
    })

    if (!response.ok) {
      // Essayer de récupérer le message d'erreur du backend
      let errorMessage = "Erreur lors du téléchargement"
      try {
        const errorData = await response.json()
        errorMessage = errorData.message || errorMessage
      } catch {
        // Si la réponse n'est pas du JSON, utiliser le message par défaut
      }
      throw new Error(errorMessage)
    }

    return response.blob()
  },

  // Vérifier un document par UUID
  verify: async (uuid: string) => {
    const response = await fetch(`${API_URL}/documents/${uuid}/verify`)
    return response.json()
  },
}

// Service API pour le CV (expériences, formations, certifications)
export const cvApi = {
  // Obtenir toutes les données du CV
  getAll: async () => {
    const response = await apiCall("/cv")
    return response.json()
  },

  // ========== EXPERIENCES ==========
  
  // Liste des expériences
  getExperiences: async () => {
    const response = await apiCall("/cv/experiences")
    return response.json()
  },

  // Créer une expérience
  createExperience: async (data: {
    titre: string
    entreprise: string
    localisation?: string
    date_debut: string
    date_fin?: string
    poste_actuel?: boolean
    description?: string
    realisations?: string[]
  }) => {
    const response = await apiCall("/cv/experiences", {
      method: "POST",
      body: JSON.stringify(data),
    })
    return response.json()
  },

  // Mettre à jour une expérience
  updateExperience: async (id: number, data: {
    titre?: string
    entreprise?: string
    localisation?: string
    date_debut?: string
    date_fin?: string
    poste_actuel?: boolean
    description?: string
    realisations?: string[]
  }) => {
    const response = await apiCall(`/cv/experiences/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
    return response.json()
  },

  // Supprimer une expérience
  deleteExperience: async (id: number) => {
    const response = await apiCall(`/cv/experiences/${id}`, {
      method: "DELETE",
    })
    return response.json()
  },

  // ========== FORMATIONS ==========
  
  // Liste des formations
  getFormations: async () => {
    const response = await apiCall("/cv/formations")
    return response.json()
  },

  // Créer une formation
  createFormation: async (data: {
    diplome: string
    etablissement: string
    localisation?: string
    date_debut: string
    date_fin?: string
    en_cours?: boolean
    description?: string
  }) => {
    const response = await apiCall("/cv/formations", {
      method: "POST",
      body: JSON.stringify(data),
    })
    return response.json()
  },

  // Mettre à jour une formation
  updateFormation: async (id: number, data: {
    diplome?: string
    etablissement?: string
    localisation?: string
    date_debut?: string
    date_fin?: string
    en_cours?: boolean
    description?: string
  }) => {
    const response = await apiCall(`/cv/formations/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
    return response.json()
  },

  // Supprimer une formation
  deleteFormation: async (id: number) => {
    const response = await apiCall(`/cv/formations/${id}`, {
      method: "DELETE",
    })
    return response.json()
  },

  // ========== CERTIFICATIONS ==========
  
  // Liste des certifications
  getCertifications: async () => {
    const response = await apiCall("/cv/certifications")
    return response.json()
  },

  // Créer une certification
  createCertification: async (data: {
    nom: string
    organisme: string
    date_obtention: string
    date_expiration?: string
    identifiant?: string
    url_verification?: string
  }) => {
    const response = await apiCall("/cv/certifications", {
      method: "POST",
      body: JSON.stringify(data),
    })
    return response.json()
  },

  // Mettre à jour une certification
  updateCertification: async (id: number, data: {
    nom?: string
    organisme?: string
    date_obtention?: string
    date_expiration?: string
    identifiant?: string
    url_verification?: string
  }) => {
    const response = await apiCall(`/cv/certifications/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
    return response.json()
  },

  // Supprimer une certification
  deleteCertification: async (id: number) => {
    const response = await apiCall(`/cv/certifications/${id}`, {
      method: "DELETE",
    })
    return response.json()
  },
}

// Service API pour les candidatures
export const candidatureApi = {
  // Liste des candidatures de l'étudiant
  list: async (statut?: string) => {
    const queryParams = new URLSearchParams()
    if (statut) queryParams.append("statut", statut)
    const response = await apiCall(`/candidatures?${queryParams.toString()}`)
    return response.json()
  },

  // Obtenir une candidature spécifique
  get: async (id: number) => {
    const response = await apiCall(`/candidatures/${id}`)
    return response.json()
  },

  // Créer une candidature (postuler à une offre)
  create: async (data: {
    offre_id: number
    lettre_motivation?: string
    cv_url?: string
  }) => {
    const response = await apiCall("/candidatures", {
      method: "POST",
      body: JSON.stringify(data),
    })
    return response.json()
  },

  // Retirer/annuler une candidature
  delete: async (id: number) => {
    const response = await apiCall(`/candidatures/${id}`, {
      method: "DELETE",
    })
    return response.json()
  },

  // Pour recruteurs : candidatures pour une offre
  forOffre: async (offreId: number) => {
    const response = await apiCall(`/candidatures/offre/${offreId}`)
    return response.json()
  },

  // Pour recruteurs : mettre à jour le statut
  updateStatus: async (id: number, data: {
    statut: string
    date_entretien?: string
    feedback?: string
    notes_recruteur?: string
  }) => {
    const response = await apiCall(`/candidatures/${id}/status`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
    return response.json()
  },
}

// Service API pour les favoris
export const favoriApi = {
  // Liste des favoris
  list: async () => {
    const response = await apiCall("/favoris")
    return response.json()
  },

  // Ajouter aux favoris
  add: async (offreId: number) => {
    const response = await apiCall("/favoris", {
      method: "POST",
      body: JSON.stringify({ offre_id: offreId }),
    })
    return response.json()
  },

  // Retirer des favoris
  remove: async (offreId: number) => {
    const response = await apiCall(`/favoris/${offreId}`, {
      method: "DELETE",
    })
    return response.json()
  },

  // Toggle favori
  toggle: async (offreId: number) => {
    const response = await apiCall("/favoris/toggle", {
      method: "POST",
      body: JSON.stringify({ offre_id: offreId }),
    })
    return response.json()
  },

  // Vérifier si une offre est en favori
  check: async (offreId: number) => {
    const response = await apiCall(`/favoris/check/${offreId}`)
    return response.json()
  },
}

