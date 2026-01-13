"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, Search, Plus, Accessibility } from "lucide-react"
import Image from "next/image"

export type EventItem = {
  id: string | number
  title: string
  subtitle?: string
  image?: string
  date?: string
}

const defaultEvents: EventItem[] = [
  {
    id: 1,
    title: "Wheelchair Basketball Tournament",
    subtitle: "Semi Finals",
    image: "/wheelchair-basketball-tournament-orange-court.jpg",
  },
  {
    id: 2,
    title: "FAZZA Championships",
    subtitle: "Championships",
    image: "/fazza-athletics-championships-runners.jpg",
  },
  {
    id: 3,
    title: "Dubai Culture",
    subtitle: "للثقافة",
    image: "/athlete-in-blue-lighting-dubai-culture.jpg",
  },
]

export default function EventsSection({ events = defaultEvents }: { events?: EventItem[] }) {
  const list = events ?? defaultEvents
  const [selectedIndex, setSelectedIndex] = useState(0)
  const featured = list && list.length > 0 ? list[selectedIndex] : undefined
  const router = useRouter()
  return (
    <div className="relative h-[calc(100vh-80px)] bg-background text-foreground overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        {featured?.image ? (
          <Image src={featured.image} alt={featured.title} fill className="object-cover" priority unoptimized />
        ) : (
          <Image src="/asian-female-athlete-in-black-tank-top-motion-blur.jpg" alt="Athlete in motion" fill className="object-cover" priority unoptimized />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 h-full flex flex-col px-6">
        {/* Events Title */}
        <div className="pt-6 pb-4">
          <h1 className="text-7xl md:text-8xl font-bold text-white tracking-tight">Eventos</h1>
        </div>

        {/* Featured Event Card */}
        {featured && (
          <div className="w-full md:absolute md:right-6 md:left-auto md:top-1/2 md:-translate-y-1/2 md:w-auto md:px-6">
            <div className="bg-white md:rounded-2xl px-6 py-4 flex items-center gap-6 shadow-2xl">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-neutral-800 text-white text-xs font-medium rounded-full">Proximamente</span>
                <div>
                  <h3 className="text-neutral-900 font-semibold">{featured.title}</h3>
                  <p className="text-neutral-500 text-sm">{featured.date ? new Date(featured.date).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" }) : ""}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (featured) router.push(`/turismo/evento/${featured.id}`)
                  }}
                  className="w-8 h-8 rounded-full border-2 border-neutral-300 flex items-center justify-center hover:bg-neutral-100 transition-colors"
                  aria-label={`Ver más ${featured?.title ?? "evento"}`}
                >
                  <Plus className="w-4 h-4 text-neutral-600" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Section - Event Cards */}
        <div className="mt-auto md:flex md:items-end md:justify-between flex flex-col justify-end">
          {/* Event Cards */}
          <div className="flex gap-4 overflow-x-auto md:overflow-x-visible pb-2 pt-2 -mx-6 px-6 md:mx-0 md:px-0">
            {list.map((event, idx) => (
              <div
                key={event.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedIndex(idx)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setSelectedIndex(idx)
                }}
                className={`relative w-52 h-32 flex-shrink-0 rounded-xl overflow-hidden cursor-pointer group transition-transform duration-200 ${
                  selectedIndex === idx ? "scale-105 ring-2 ring-white/80" : ""
                }`}
              >
                <Image
                  src={event.image || "/placeholder.svg"}
                  alt={event.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-white text-xs font-medium truncate">{event.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
