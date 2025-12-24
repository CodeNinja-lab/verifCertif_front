"use client"

import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface LogoProps {
  href?: string
  size?: "sm" | "md" | "lg" | "xl"
  showText?: boolean
  className?: string
}

const sizeConfig = {
  sm: {
    container: "h-9 w-9",
    text: "text-lg",
    subtitle: "text-[8px]",
    gap: "gap-2",
  },
  md: {
    container: "h-11 w-11",
    text: "text-xl",
    subtitle: "text-[9px]",
    gap: "gap-2.5",
  },
  lg: {
    container: "h-14 w-14",
    text: "text-2xl",
    subtitle: "text-[10px]",
    gap: "gap-3",
  },
  xl: {
    container: "h-16 w-16",
    text: "text-3xl",
    subtitle: "text-xs",
    gap: "gap-3",
  },
}

export function Logo({ href = "/", size = "md", showText = true, className }: LogoProps) {
  const config = sizeConfig[size]

  const content = (
    <div className={cn("flex items-center group", config.gap, className)}>
      {/* Logo avec conteneur élégant */}
      <div className={cn(
        "relative flex-shrink-0 rounded-2xl overflow-hidden",
        "bg-white dark:bg-gray-100",
        "shadow-lg shadow-blue-500/20 dark:shadow-blue-400/10",
        "ring-2 ring-white/80 dark:ring-gray-200",
        "transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-blue-500/30",
        config.container
      )}>
        <Image
          src="/logo-acadys.png"
          alt="ACADYS - Certification Académique"
          fill
          className="object-cover"
          priority
        />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={cn(
            "font-bold tracking-tight",
            "bg-gradient-to-r from-[#1e3a5f] to-[#3b82f6] bg-clip-text text-transparent",
            config.text
          )}>
            ACADYS
          </span>
          <span className={cn(
            "text-muted-foreground font-medium -mt-0.5 tracking-wide uppercase",
            config.subtitle
          )}>
            Certification Académique
          </span>
        </div>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="inline-flex focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg">
        {content}
      </Link>
    )
  }

  return content
}

// Variante pour les sidebars
interface SidebarLogoProps {
  href?: string
  collapsed?: boolean
  variant?: "default" | "admin" | "university" | "candidate"
  subtitle?: string
  className?: string
}

export function SidebarLogo({ 
  href = "/", 
  collapsed = false, 
  variant = "default",
  subtitle = "Certification Académique",
  className 
}: SidebarLogoProps) {
  const content = (
    <div className={cn("flex items-center gap-2.5 group", className)}>
      <div className={cn(
        "h-10 w-10 relative flex-shrink-0 rounded-xl overflow-hidden",
        "bg-white dark:bg-gray-100",
        "shadow-md shadow-blue-500/20",
        "ring-2 ring-white/80 dark:ring-gray-200",
        "transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg"
      )}>
        <Image
          src="/logo-acadys.png"
          alt="ACADYS Logo"
          fill
          className="object-cover"
          priority
        />
      </div>
      {!collapsed && (
        <div className="flex flex-col">
          <span className="text-sm font-bold tracking-tight bg-gradient-to-r from-[#1e3a5f] to-[#3b82f6] bg-clip-text text-transparent">
            ACADYS
          </span>
          <span className="text-[10px] text-muted-foreground font-medium -mt-0.5 uppercase tracking-wide">
            {subtitle}
          </span>
        </div>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="inline-flex focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg">
        {content}
      </Link>
    )
  }

  return content
}
