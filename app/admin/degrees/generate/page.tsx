"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DegreeCertificate } from "@/components/degree-certificate"
import { Printer } from "lucide-react"
import { useReactToPrint } from "react-to-print"

export default function GenerateDegreePage() {
  const [studentName, setStudentName] = useState("Mamadou Ndiaye")
  const [degreeTitle, setDegreeTitle] = useState("Master en Informatique")
  const [isGenerating, setIsGenerating] = useState(false)
  const componentRef = useRef<HTMLDivElement>(null)

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Diplome_UCAD_${studentName.replace(/\s+/g, "_")}`,
  })

  return (
    <div className="p-8 max-w-7xl mx-auto flex gap-8">
      {/* Controls */}
      <div className="w-1/3 space-y-6">
        <h1 className="text-2xl font-bold">Générateur de Diplôme</h1>
        <div className="space-y-4 p-6 bg-white rounded-lg shadow border">
          <div className="space-y-2">
            <Label>Nom de l'étudiant</Label>
            <Input value={studentName} onChange={(e) => setStudentName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Intitulé du diplôme</Label>
            <Input value={degreeTitle} onChange={(e) => setDegreeTitle(e.target.value)} />
          </div>

          <div className="pt-4 flex gap-4">
            <Button onClick={handlePrint} className="w-full bg-[#009EE0] hover:bg-[#008AC0]">
              <Printer className="mr-2 h-4 w-4" /> Imprimer / PDF
            </Button>
          </div>
        </div>
        <div className="p-4 bg-blue-50 text-blue-800 rounded text-sm">
          <p>Ce module permet de générer un PDF certifié avec hash blockchain intégré pour démonstration.</p>
        </div>
      </div>

      {/* Preview */}
      <div className="w-2/3 bg-gray-100 p-8 rounded-xl overflow-auto flex justify-center shadow-inner h-[800px]">
        <div className="scale-[0.6] origin-top">
          <DegreeCertificate
            ref={componentRef}
            studentName={studentName}
            degreeTitle={degreeTitle}
            graduationDate="15 Juillet 2024"
            certificationId="UCAD-2024-8921"
            blockchainHash="8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4"
          />
        </div>
      </div>
    </div>
  )
}
