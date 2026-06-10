import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { LayoutGrid, ArrowRight, Layers } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const dynamic = 'force-dynamic'

export default async function CategoriesPage() {
  const supabase = await createClient()

  // Fetch all categories
  const { data: mainCategories } = await supabase
    .from('main_categories')
    .select('*')
    .order('name')

  const { data: normalCategories } = await supabase
    .from('system_categories')
    .select('id, name, main_category_id')
    .order('name')

  // Group normal categories by main_category_id
  const groupedCategories = mainCategories?.map(main => {
    return {
      ...main,
      children: normalCategories?.filter(cat => cat.main_category_id === main.id) || []
    }
  }) || []

  // Add "Uncategorized" for backward compatibility if any exist without main_category_id
  const uncategorized = normalCategories?.filter(cat => !cat.main_category_id) || []
  if (uncategorized.length > 0) {
    groupedCategories.push({
      id: 'uncategorized',
      name: 'Other Categories',
      children: uncategorized
    })
  }

  return (
    <div className="min-h-screen bg-[#f5f6f8] flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 md:pt-[104px]">
        {/* Header Section */}
        <div className="bg-[#1c2331] text-white py-16 md:py-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#104825]/20 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
            <h1 className="text-4xl md:text-5xl font-black mb-4">Browse by Category</h1>
            <p className="text-lg text-slate-300 max-w-2xl">
              Explore thousands of businesses structured exactly what you're looking for. From Food & Dining to Medical Professionals.
            </p>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {groupedCategories.map((main) => (
              <div key={main.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                {/* Main Category Header */}
                <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#104825]/10 flex items-center justify-center text-[#104825]">
                    <LayoutGrid className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">{main.name}</h2>
                </div>
                
                {/* Normal Categories List */}
                <div className="p-6">
                  {main.children.length > 0 ? (
                    <ul className="space-y-3">
                      {main.children.map((cat: any) => (
                        <li key={cat.id}>
                          <Link 
                            href={`/explore?category=${encodeURIComponent(cat.name)}`}
                            className="group flex items-center justify-between text-slate-600 hover:text-[#104825] font-medium transition-colors"
                          >
                            <span className="flex items-center gap-2">
                              <Layers className="w-4 h-4 text-slate-400 group-hover:text-[#104825] transition-colors" />
                              {cat.name}
                            </span>
                            <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-400 italic">No sub-categories yet.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
