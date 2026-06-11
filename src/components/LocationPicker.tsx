'use client'

import { useEffect, useRef } from 'react'
import { MapPin } from 'lucide-react'

interface LocationPickerProps {
  initialLat?: number | string
  initialLng?: number | string
  onLocationChange: (lat: number, lng: number) => void
}

export default function LocationPicker({ initialLat, initialLng, onLocationChange }: LocationPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return

    const lat = parseFloat(String(initialLat)) || 11.2588
    const lng = parseFloat(String(initialLng)) || 75.7804

    import('leaflet').then((L) => {
      if (!containerRef.current) return

      // Destroy existing instance if present
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
        zoom: 15,
        zoomControl: true,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map)

      const marker = L.marker([lat, lng], { draggable: true }).addTo(map)
      marker.bindPopup('<b>Your Business Location</b><br/>Drag me to adjust!').openPopup()

      marker.on('dragend', (e: any) => {
        const pos = e.target.getLatLng()
        onLocationChange(pos.lat, pos.lng)
      })

      map.on('click', (e: any) => {
        marker.setLatLng(e.latlng)
        onLocationChange(e.latlng.lat, e.latlng.lng)
      })

      mapInstanceRef.current = map
    })

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [initialLat, initialLng])

  return (
    <div className="w-full rounded-xl overflow-hidden border-2 border-slate-200 shadow-sm">
      <div className="bg-[#104825]/10 border-b border-[#104825]/20 px-4 py-2.5 flex items-center gap-2">
        <MapPin className="w-4 h-4 text-[#104825] flex-shrink-0" />
        <p className="text-xs font-bold text-[#104825]">
          Click anywhere on the map or drag the marker to set your exact location
        </p>
      </div>
      <div ref={containerRef} className="w-full" style={{ height: '380px' }} />
    </div>
  )
}
