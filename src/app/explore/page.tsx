import ExploreClient from './ExploreClient'

export const metadata = {
  title: 'Explore Businesses | LocalDial',
}

export const dynamic = 'force-dynamic'

export default function ExplorePage() {
  return (
    <div className="w-full pb-20">
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-0">
          <h1 className="text-3xl md:text-4xl font-black text-[#1c2331] tracking-tight mb-2">Explore Local Gems</h1>
          <p className="text-slate-500 font-medium mb-8">Discover top-rated places across every category</p>
        </div>

        <ExploreClient />
      </main>
    </div>
  )
}
