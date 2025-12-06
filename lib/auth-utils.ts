"use client"

// Utilitaires d'authentification côté client uniquement

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("auth_token")
}

export function getCurrentUser(): any | null {
  if (typeof window === "undefined") return null
  const userStr = localStorage.getItem("current_user")
  if (!userStr) return null
  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

export function clearAuth(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem("auth_token")
  localStorage.removeItem("current_user")
  // Supprimer aussi le cookie
  document.cookie = "auth_token=; path=/; max-age=0; SameSite=Lax"
}

export async function checkAuthStatus(): Promise<{ authenticated: boolean; user?: any }> {
  const token = getAuthToken()
  if (!token) {
    return { authenticated: false }
  }

  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      clearAuth()
      return { authenticated: false }
    }

    const data = await response.json()
    const user = data.user || data
    return { authenticated: true, user }
  } catch (error) {
    clearAuth()
    return { authenticated: false }
  }
}

