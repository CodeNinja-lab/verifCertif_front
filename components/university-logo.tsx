"use client"

import { GraduationCap } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

interface UniversityLogoProps {
  src: string
  alt: string
  fallbackColor: string
}

export function UniversityLogo({ src, alt, fallbackColor }: UniversityLogoProps) {
  const [imageError, setImageError] = useState(false)

  if (imageError) {
    return <GraduationCap className={`h-16 w-16 ${fallbackColor}`} />
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={80}
      height={80}
      className="w-full h-full object-contain"
      onError={() => setImageError(true)}
    />
  )
}
