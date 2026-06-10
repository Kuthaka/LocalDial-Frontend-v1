import { createClient } from '@/lib/supabase/server'
import CategoriesManagerClient from './CategoriesManagerClient'

export default async function AdminCategoriesPage() {
  const supabase = await createClient()

  // Fetch Main Categories
  const { data: mainCategories } = await supabase
    .from('main_categories')
    .select('*')
    .order('name', { ascending: true })

  // Fetch Normal Categories
  const { data: normalCategories } = await supabase
    .from('system_categories')
    .select('*')
    .order('name', { ascending: true })

  // Fetch Sub Categories
  const { data: subCategories } = await supabase
    .from('sub_categories')
    .select('*')
    .order('name', { ascending: true })

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900">Manage Categories Structure</h2>
          <p className="text-sm text-slate-500 mt-1">
            Build the taxonomy for your platform. Main Categories {'>'} Normal Categories {'>'} Sub Categories.
          </p>
        </div>
        
        <CategoriesManagerClient 
          mainCategories={mainCategories || []} 
          normalCategories={normalCategories || []} 
          subCategories={subCategories || []} 
        />
      </div>
    </div>
  )
}
