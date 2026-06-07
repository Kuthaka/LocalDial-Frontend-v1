import { createClient } from '@/lib/supabase/server'
import { addCategory } from '@/app/actions/admin'
import { Plus, Tag, AlignLeft, Info } from 'lucide-react'
import SubmitButton from './SubmitButton'
import CategoryCard from './CategoryCard'

export default async function AdminCategoriesPage() {
  const supabase = await createClient()

  // Fetch existing categories
  const { data: categories, error } = await supabase
    .from('system_categories')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">
          <h2 className="text-lg font-semibold text-slate-900">Add New Category</h2>
          <p className="text-sm text-slate-500">Create global categories that businesses can select during onboarding.</p>
        </div>
        
        <form action={async (formData) => {
          'use server'
          await addCategory(formData)
        }} className="p-6 space-y-6">
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
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">
          <h2 className="text-lg font-semibold text-slate-900">Existing Categories</h2>
        </div>
        
        <div className="divide-y divide-slate-100">
          {error ? (
            <div className="p-8 text-center text-red-500">
              <p>Failed to load categories. Please ensure the <strong>system_categories</strong> table exists in Supabase.</p>
              <p className="text-sm mt-2 text-slate-500">Error: {error.message}</p>
            </div>
          ) : !categories || categories.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No categories found. Add your first category above.
            </div>
          ) : (
            categories.map((cat) => (
              <CategoryCard key={cat.id} cat={cat} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
