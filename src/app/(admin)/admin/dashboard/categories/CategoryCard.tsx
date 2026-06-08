'use client'

import { useState } from 'react'
import { Edit2, X, Tag, AlignLeft, Info } from 'lucide-react'
import { editCategory } from '@/app/actions/admin'
import SubmitButton from './SubmitButton'
import { CategorySchema } from '@/validations/category'

export default function CategoryCard({ cat }: { cat: any }) {
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (isEditing) {
    return (
      <div className="p-6 bg-slate-50 border-b border-slate-100 last:border-0 transition-colors">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-900">Edit Category</h3>
          <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-slate-200 rounded-full text-slate-500">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form action={async (formData) => {
          const name = formData.get('name') as string
          const description = formData.get('description') as string
          
          const validation = CategorySchema.safeParse({ name, description })
          if (!validation.success) {
            setError(validation.error.issues[0].message)
            return
          }
          
          setError(null)
          const result = await editCategory(formData)
          if (result?.error) {
            setError(result.error)
          } else {
            setIsEditing(false)
          }
        }} className="space-y-4">
          <input type="hidden" name="id" value={cat.id} />
          
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100">
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                <Tag className="w-3 h-3 text-slate-400" />
                Category Name
              </label>
              <input 
                name="name" 
                required 
                defaultValue={cat.name}
                className="w-full p-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111844]"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                <AlignLeft className="w-3 h-3 text-slate-400" />
                Tags
              </label>
              <input 
                name="tags" 
                defaultValue={cat.tags ? cat.tags.join(', ') : ''}
                className="w-full p-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111844]"
              />
            </div>
            
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                <Info className="w-3 h-3 text-slate-400" />
                Description
              </label>
              <textarea 
                name="description" 
                rows={2}
                defaultValue={cat.description || ''}
                className="w-full p-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111844]"
              />
            </div>
          </div>
          
          <div className="flex justify-end pt-2">
            <SubmitButton />
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="p-6 hover:bg-slate-50 border-b border-slate-100 last:border-0 transition-colors group">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-bold text-slate-900 text-lg">{cat.name}</h3>
          <p className="text-sm text-slate-500 mt-1">{cat.description || 'No description provided.'}</p>
          {cat.tags && cat.tags.length > 0 && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {cat.tags.map((tag: string, i: number) => (
                <span key={i} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-lg border border-indigo-100">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <button 
          onClick={() => setIsEditing(true)}
          className="p-2 bg-slate-100 hover:bg-indigo-100 text-slate-600 hover:text-[#111844] rounded-lg opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
