'use client'

import { useEffect, useRef } from 'react'
import { MapPin, ExternalLink, Navigation } from 'lucide-react'

interface MapViewProps {
  lat: number
  lng: number
  businessName?: string
  address?: string
  googleMapsUrl?: string
}

export default function MapView({ lat, lng, businessName, address, googleMapsUrl }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return

    import('leaflet').then((L) => {
      if (!containerRef.current) return

      if ((containerRef.current as any)._leaflet_id) {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove()
          mapInstanceRef.current = null
        }
      }

      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      const map = L.map(containerRef.current!, {
        center: [lat, lng],
        zoom: 16,
        zoomControl: true,
        dragging: true,
        scrollWheelZoom: false,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map)

      const popupContent = `
        <div style="font-family:sans-serif;padding:4px 2px;">
          <b style="font-size:14px;color:#1c2331;">${businessName || 'Business Location'}</b>
          ${address ? `<p style="font-size:12px;color:#64748b;margin-top:4px;line-height:1.4">${address}</p>` : ''}
        </div>
      `

      const marker = L.marker([lat, lng]).addTo(map)
      marker.bindPopup(popupContent).openPopup()

      mapInstanceRef.current = map
    })

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [lat, lng, businessName, address])

  // "Open in Maps" uses Google Maps regardless — still free, just redirects the user
  const googleMapsLink = googleMapsUrl?.trim()
    ? googleMapsUrl
    : `https://www.google.com/maps?q=${lat},${lng}`

  const directionsLink = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#104825]/10 flex items-center justify-center">
            <MapPin className="w-4 h-4 text-[#104825]" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#1c2331]">Location</p>
            {address && (
              <p className="text-xs text-slate-400 font-medium max-w-xs truncate">{address}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={directionsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-bold text-white bg-[#104825] hover:bg-[#0c361c] px-3 py-1.5 rounded-lg transition-colors"
          >
            <Navigation className="w-3.5 h-3.5" />
            Directions
          </a>
          <a
            href={googleMapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-bold text-[#104825] border border-[#104825]/30 hover:bg-[#104825]/5 px-3 py-1.5 rounded-lg transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Open in Maps
          </a>
        </div>
      </div>

      {/* Map Canvas */}
      <div ref={containerRef} className="w-full" style={{ height: '300px' }} />

      {/* Address Footer */}
      {address && (
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-start gap-2">
          <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-slate-600 font-medium leading-snug">{address}</p>
        </div>
      )}
    </div>
  )
}
