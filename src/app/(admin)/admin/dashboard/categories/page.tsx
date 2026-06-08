import { createClient } from '@/lib/supabase/server'
import { addCategory } from '@/app/actions/admin'
import CategoryCard from './CategoryCard'
import AddCategoryForm from './AddCategoryForm'

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
        
        <AddCategoryForm />
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
