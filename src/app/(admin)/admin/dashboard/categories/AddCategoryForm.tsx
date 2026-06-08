'use client'

import { useState } from 'react'
import { Tag, AlignLeft, Info } from 'lucide-react'
import { addCategory } from '@/app/actions/admin'
import SubmitButton from './SubmitButton'
import { CategorySchema } from '@/validations/category'

export default function AddCategoryForm() {
  const [error, setError] = useState<string | null>(null)
  
  async function handleSubmit(formData: FormData) {
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    
    // 1. Client-side validation
    const validation = CategorySchema.safeParse({ name, description })
    if (!validation.success) {
      setError(validation.error.issues[0].message)
      return
    }
    
    // 2. Server-side action
    setError(null)
    const result = await addCategory(formData)
    
    if (result?.error) {
      setError(result.error)
    } else {
      // Clear form on success
      const form = document.getElementById('add-category-form') as HTMLFormElement
      form?.reset()
    }
  }

  return (
    <form id="add-category-form" action={handleSubmit} className="p-6 space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Tag className="w-4 h-4 text-slate-400" />
            Category Name
          </label>
          <input 
            name="name" 
            required 
            placeholder="e.g. Real Estate, AC Repair" 
            className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#111844]"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <AlignLeft className="w-4 h-4 text-slate-400" />
            Tags (Comma separated)
          </label>
          <input 
            name="tags" 
            placeholder="e.g. home, repair, maintenance" 
            className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#111844]"
          />
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Info className="w-4 h-4 text-slate-400" />
            Small Description
          </label>
          <textarea 
            name="description" 
            rows={3}
            placeholder="Briefly describe this category..." 
            className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#111844]"
          />
        </div>
      </div>
      
      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  )
}
