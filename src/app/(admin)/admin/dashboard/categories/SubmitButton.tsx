'use client'

import { useFormStatus } from 'react-dom'
import { Plus, Loader2 } from 'lucide-react'

export default function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button 
      type="submit" 
      disabled={pending}
      className="bg-[#111844] hover:bg-[#1e2a78] text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all disabled:opacity-70 disabled:hover:bg-[#111844]"
    >
      {pending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
      {pending ? 'Saving...' : 'Add Category'}
    </button>
  )
}
