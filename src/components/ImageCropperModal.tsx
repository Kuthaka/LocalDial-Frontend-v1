'use client'

import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import getCroppedImg from '@/utils/cropImage'
import { X } from 'lucide-react'

interface ImageCropperModalProps {
  isOpen: boolean
  onClose: () => void
  imageSrc: string
  aspect: number
  onCropComplete: (croppedFile: File) => void
}

export default function ImageCropperModal({ isOpen, onClose, imageSrc, aspect, onCropComplete }: ImageCropperModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const generateCrop = async () => {
    if (!croppedAreaPixels) return
    setIsProcessing(true)
    try {
      const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels)
      onCropComplete(croppedFile)
    } catch (e) {
      console.error(e)
    } finally {
      setIsProcessing(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-slate-100 shrink-0">
          <h2 className="text-xl font-black text-[#1c2331]">Crop Image</h2>
          <button 
            onClick={onClose} 
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-500 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="relative flex-1 bg-slate-900 w-full min-h-[300px] sm:min-h-[400px]">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onCropComplete={handleCropComplete}
            onZoomChange={setZoom}
          />
        </div>

        <div className="p-4 sm:p-6 bg-white space-y-4 sm:space-y-6 border-t border-slate-100 shrink-0">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 sm:mb-3">Zoom: {zoom.toFixed(1)}x</label>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => {
                setZoom(Number(e.target.value))
              }}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#104825]"
            />
          </div>
          
          <div className="flex justify-end gap-3">
            <button 
              onClick={onClose}
              className="px-5 py-2.5 sm:px-6 sm:py-3 font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={generateCrop}
              disabled={isProcessing}
              className="px-6 py-2.5 sm:px-8 sm:py-3 font-bold text-white bg-[#104825] rounded-xl hover:bg-[#0c361c] transition-colors shadow-lg hover:shadow-[#104825]/30 disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 'Apply Crop'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
