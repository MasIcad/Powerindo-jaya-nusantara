import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// NAMA HARUS 'middleware' agar terbaca oleh Next.js
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Menggunakan metode yang lebih stabil untuk sinkronisasi sesi login
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Mengambil data user untuk verifikasi login
  const { data: { user } } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname;

  // LOGIKA 1: Jika sudah login, paksa pindah ke dashboard saat buka /login
  if (user && path === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // LOGIKA 2: Proteksi Folder Admin & Dashboard (Jika BELUM login)
  // Menambahkan pengecekan '/admin' agar rute dashboard kamu tidak bisa ditembus langsung
  const isProtectedPath = path.startsWith('/dashboard') || path.startsWith('/admin');
  
  if (!user && isProtectedPath) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

export const config = {
  // Lindungi semua rute kecuali yang diabaikan (assets, api, dll)
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}