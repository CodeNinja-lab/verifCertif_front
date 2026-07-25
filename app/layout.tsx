import type React from "react"
import type { Metadata } from "next"
import { Inter, Space_Grotesk } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
})

export const metadata: Metadata = {
  title: "ACADYS - Academic Digital System",
  description: "Plateforme de certification blockchain et matching IA pour diplômes académiques au Sénégal.",
  icons: {
    icon: [
      {
        url: "/logo-acadys.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/logo-acadys.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/logo-acadys.png",
        type: "image/png",
      },
    ],
    apple: "/logo-acadys.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <ThemeProvider defaultTheme="system" storageKey="talenthub-theme">
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
