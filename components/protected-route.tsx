"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import { getAuthToken, clearAuth, checkAuthStatus } from "@/lib/auth-utils"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles: string[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter()
  const pathname = usePathname()
  
  // Vérification synchrone immédiate du token (côté client uniquement)
  let initialToken: string | null = null
  let shouldRedirect = false
  
  if (typeof window !== "undefined") {
    initialToken = getAuthToken()
    if (!initialToken) {
      // Redirection synchrone immédiate
      const redirectUrl = pathname !== "/login" ? `?redirect=${encodeURIComponent(pathname)}` : ""
      window.location.replace(`/login${redirectUrl}`)
      shouldRedirect = true
    }
  }
  
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(shouldRedirect)
  const hasChecked = useRef(false)
  const redirectingRef = useRef(shouldRedirect)

  // Vérification de l'authentification au montage
  useEffect(() => {
    if (typeof window === "undefined") return
    
    setMounted(true)
    
    // Si pas de token, la redirection a déjà été faite
    if (!initialToken || shouldRedirect) {
      return
    }

    if (hasChecked.current) return

    // Si token présent, vérifier l'authentification complète
    checkAuth()
    hasChecked.current = true
  }, [pathname])

  const checkAuth = async () => {
    try {
      // Vérifier si le token existe
      const token = getAuthToken()
      if (!token) {
        redirectingRef.current = true
        setIsRedirecting(true)
        const redirectUrl = pathname !== "/login" ? `?redirect=${encodeURIComponent(pathname)}` : ""
        window.location.href = `/login${redirectUrl}`
        return
      }

      // Vérifier le rôle de l'utilisateur
      const { authenticated, user } = await checkAuthStatus()

      if (!authenticated || !user) {
        clearAuth()
        redirectingRef.current = true
        setIsRedirecting(true)
        const redirectUrl = pathname !== "/login" ? `?redirect=${encodeURIComponent(pathname)}` : ""
        window.location.href = `/login${redirectUrl}`
        return
      }

      const userRole = user.role

      if (!userRole) {
        // Pas de rôle, déconnexion
        clearAuth()
        redirectingRef.current = true
        setIsRedirecting(true)
        window.location.href = `/login?redirect=${encodeURIComponent(pathname)}`
        return
      }

      if (!allowedRoles.includes(userRole)) {
        // Rôle non autorisé, rediriger vers l'espace approprié
        redirectingRef.current = true
        setIsRedirecting(true)
        switch (userRole) {
          case "etudiant":
            window.location.href = "/candidate"
            return
          case "recruteur":
            window.location.href = "/recruiter"
            return
          case "admin":
          case "administration":
            window.location.href = "/university"
            return
          default:
            clearAuth()
            window.location.href = `/login?redirect=${encodeURIComponent(pathname)}`
            return
        }
      }

      // Authentification réussie et rôle autorisé
      setIsAuthorized(true)
    } catch (error) {
      console.error("Erreur lors de la vérification de l'authentification:", error)
      clearAuth()
      redirectingRef.current = true
      setIsRedirecting(true)
      const redirectUrl = pathname !== "/login" ? `?redirect=${encodeURIComponent(pathname)}` : ""
      window.location.href = `/login${redirectUrl}`
    } finally {
      setIsLoading(false)
    }
  }

  // Si redirection en cours, ne rien afficher
  if (shouldRedirect || isRedirecting) {
    return null
  }

  // Ne rien afficher tant que le composant n'est pas monté côté client
  // OU si on est en train de rediriger
  if (!mounted || isRedirecting) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Redirection...</p>
        </div>
      </div>
    )
  }

  // Afficher un loader pendant la vérification
  if (isLoading || !isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            {isRedirecting ? "Redirection..." : "Vérification de l'authentification..."}
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

