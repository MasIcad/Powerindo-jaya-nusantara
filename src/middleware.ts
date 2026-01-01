import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options) {
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // 🔥 PAKAI getSession, BUKAN getUser
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const path = request.nextUrl.pathname
  const isProtectedPath =
    path.startsWith('/dashboard') || path.startsWith('/admin')

  // ❌ Belum login tapi masuk area admin
  if (!session && isProtectedPath) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // ✅ Sudah login tapi buka /login
  if (session && path === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
