import { forwardRef } from "react"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface DegreeCertificateProps {
  studentName: string
  degreeTitle: string
  graduationDate: string
  certificationId: string
  blockchainHash: string
  className?: string
}

export const DegreeCertificate = forwardRef<HTMLDivElement, DegreeCertificateProps>(
  ({ studentName, degreeTitle, graduationDate, certificationId, blockchainHash, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "w-[210mm] h-[297mm] bg-white text-black p-12 relative mx-auto shadow-2xl print:shadow-none",
          className,
        )}
        style={{ fontFamily: "'Times New Roman', serif" }}
      >
        {/* Border */}
        <div className="absolute inset-8 border-4 border-[#009EE0] pointer-events-none" />
        <div className="absolute inset-10 border border-[#009EE0]/30 pointer-events-none" />

        {/* Content */}
        <div className="h-full flex flex-col items-center text-center pt-16 relative z-10">
          {/* Logo */}
          <div className="mb-8 w-32 h-32 relative">
            <Image src="/ucad-logo.png" alt="Logo UCAD" fill className="object-contain" />
          </div>

          <div className="space-y-2 mb-12">
            <h1 className="text-3xl font-bold uppercase tracking-wider text-[#009EE0]">République du Sénégal</h1>
            <h2 className="text-xl">Un Peuple - Un But - Une Foi</h2>
            <div className="w-32 h-1 bg-[#009EE0] mx-auto my-4" />
            <h2 className="text-4xl font-bold uppercase mt-8">Université Cheikh Anta Diop</h2>
            <h3 className="text-2xl font-light italic">de Dakar</h3>
          </div>

          <div className="mb-12">
            <p className="text-xl mb-4">Le Recteur et le Conseil de l'Université certifient que</p>
            <h2 className="text-4xl font-bold italic mb-4 font-serif">{studentName}</h2>
            <p className="text-xl mb-6">a satisfait aux exigences du programme et a obtenu le diplôme de</p>
            <h1 className="text-5xl font-bold text-[#009EE0] mb-6">{degreeTitle}</h1>
            <p className="text-xl">Fait à Dakar, le {graduationDate}</p>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-32 w-full px-20 mt-auto mb-20">
            <div className="text-center">
              <p className="font-bold mb-12">Le Doyen</p>
              <div className="h-0.5 w-40 bg-black mx-auto mb-2" />
              <p className="font-script text-2xl text-gray-600">Pr. Mamadou Fall</p>
            </div>
            <div className="text-center">
              <p className="font-bold mb-12">Le Recteur</p>
              <div className="h-0.5 w-40 bg-black mx-auto mb-2" />
              <p className="font-script text-2xl text-gray-600">Pr. Ahmadou Aly Mbaye</p>
            </div>
          </div>

          {/* Blockchain Footer */}
          <div className="absolute bottom-8 left-12 right-12 text-xs text-gray-500 font-mono border-t pt-4 flex justify-between items-end">
            <div className="text-left">
              <p>
                ID Certification: <span className="font-bold text-black">{certificationId}</span>
              </p>
              <p className="mt-1">
                Vérifiable sur: <span className="text-[#009EE0]">verify.ucad.sn</span>
              </p>
            </div>
            <div className="text-right max-w-xs break-all">
              <p className="mb-1">Blockchain Hash (SHA-256):</p>
              <p>{blockchainHash}</p>
            </div>
            {/* QR Code Placeholder */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-white p-2">
              <div className="w-24 h-24 border-2 border-black flex items-center justify-center">
                <span className="text-[10px] text-center">
                  QR Code
                  <br />
                  Securisé
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
)
DegreeCertificate.displayName = "DegreeCertificate"
