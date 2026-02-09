"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"

export interface LocationItem {
  id: string
  name: string
  image: string
}

type Props = {
  locations?: LocationItem[]
}

export default function LocationNavigator({ locations }: Props) {
  const data = useMemo(() => (locations && locations.length > 0 ? locations : locations), [locations])
  const [activeLocation, setActiveLocation] = useState<string | null>(data[0]?.id ?? null)
  const router = useRouter()

  useEffect(() => {
    setActiveLocation(data[0]?.id ?? null)
  }, [data])

  const activeImage = data.find((loc) => loc.id === activeLocation)?.image || data[0]?.image || ""

  return (
    <div className="relative w-full max-w-6xl mx-auto h-screen md:h-[720px] overflow-hidden">
      {/* Background image with fade */}
      <div
        key={activeImage}
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${activeImage})`, animation: "fadeImage 0.7s ease-in-out" }}
        aria-hidden
      />

      {/* Overlay for better contrast */}
      <div className="absolute inset-0 bg-black/20" aria-hidden />

      {/* Navigation sections */}
      <div className="relative z-10 grid grid-cols-3 grid-rows-2 gap-0 h-full md:flex">
        {data.map((location, index) => (
          <div
            key={location.id}
            className="relative w-full md:flex-1 flex items-start justify-center cursor-pointer group py-3"
            onMouseEnter={() => setActiveLocation(location.id)}
            onClick={() => {
              setActiveLocation(location.id)
              // Only navigate on desktop (md breakpoint = 768px)
              if (window.innerWidth >= 768) {
                router.push(`/turismo/museo/${location.id}`)
              }
            }}
            role="button"
            tabIndex={0}
            onFocus={() => setActiveLocation(location.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                setActiveLocation(location.id)
                // Only navigate on desktop
                if (window.innerWidth >= 768) {
                  router.push(`/turismo/museo/${location.id}`)
                }
              }
            }}
          >
            {/* Vertical separator line */}
            {index > 0 && <div className="absolute left-0 top-0 bottom-0 w-px bg-white/40 hidden md:block" aria-hidden />}

            {/* Yellow highlight background on hover */}
            <div
              className={`absolute inset-x-0 top-0 w-full transition-all duration-300 ${
                activeLocation === location.id ? "h-40 md:h-32 bg-amber-400" : "h-0 bg-transparent"
              }`}
              aria-hidden
            />

            {/* Text label */}
            <span
              className={`relative z-10 px-4 py-2 md:py-6 text-center text-sm font-medium transition-colors duration-300 ${
                activeLocation === location.id ? "text-gray-900" : "text-white drop-shadow-lg"
              }`}
            >
              {location.name}
            </span>
          </div>
        ))}
      </div>

      {/* Ver más button */}
      {activeLocation && (
        <button
          onClick={() => router.push(`/turismo/museo/${activeLocation}`)}
          className="md:hidden absolute bottom-6 left-6 z-20 bg-white hover:bg-gray-50 text-gray-900 px-6 py-3 rounded-lg shadow-lg flex items-center gap-0 transition-all duration-200 hover:scale-105"
          aria-label="Ver más detalles"
        >
          <span className="font-medium">Ver más</span>
          <Plus className="w-4 h-4" />
        </button>
      )}

      <style jsx>{`
        @keyframes fadeImage {
          from {
            opacity: 0.8;
            transform: scale(1.01);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  )
}
