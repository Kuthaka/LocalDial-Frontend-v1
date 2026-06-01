import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // refreshing the auth token and getting the user
  const { data: { user } } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()
  const path = url.pathname

  const isBusinessAuthRoute = path === '/business/login' || path === '/business/signup'
  const isAdminAuthRoute = path === '/admin/login'
  const isBusinessProtectedRoute = path.startsWith('/business/dashboard')
  const isAdminProtectedRoute = path.startsWith('/admin/dashboard')

  // Not logged in -> Trying to access protected routes
  if (isBusinessProtectedRoute && !user) {
    url.pathname = '/business/login'
    return NextResponse.redirect(url)
  }

  if (isAdminProtectedRoute && !user) {
    url.pathname = '/admin/login'
    return NextResponse.redirect(url)
  }

  // Logged in -> Trying to access login/signup pages
  if (user) {
    if (isBusinessAuthRoute) {
      url.pathname = '/business/dashboard'
      return NextResponse.redirect(url)
    }
    if (isAdminAuthRoute) {
      url.pathname = '/admin/dashboard'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
