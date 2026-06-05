import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Routes protégées par rôle
const protectedRoutes: Record<string, string[]> = {
  "/recruiter": ["recruteur", "admin"],
  "/candidate": ["etudiant", "admin"],
  "/admin": ["admin"],
  "/university": ["admin", "administration"],
}

// Routes accessibles à tout utilisateur connecté (peu importe le rôle).
// Les offres d'emploi ne doivent pas être visibles sans être connecté.
const authOnlyRoutes: string[] = ["/jobs"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Ignorer les routes publiques
  if (pathname.startsWith("/api") || 
      pathname.startsWith("/_next") || 
      pathname.startsWith("/login") ||
      pathname.startsWith("/signup") ||
      pathname.startsWith("/verify") ||
      pathname === "/") {
    return NextResponse.next()
  }

  // Vérifier si la route est protégée (par rôle ou simplement par connexion)
  const protectedRoute = Object.keys(protectedRoutes).find((route) =>
    pathname.startsWith(route)
  )
  const authOnlyRoute = authOnlyRoutes.find((route) =>
    pathname.startsWith(route)
  )

  if (!protectedRoute && !authOnlyRoute) {
    return NextResponse.next()
  }

  // Récupérer le token depuis les cookies
  const token = request.cookies.get("auth_token")?.value

  // Si pas de token, rediriger vers login
  if (!token) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Le composant ProtectedRoute fera la vérification complète du rôle
  // Le middleware vérifie juste la présence du token pour bloquer l'accès immédiatement
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/recruiter/:path*",
    "/candidate/:path*",
    "/admin/:path*",
    "/university/:path*",
    "/jobs/:path*",
    "/jobs",
  ],
}

