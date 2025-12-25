import { createServerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Auto-completion and type Type-safe queries
// Compile-time error checking
import type { Database } from '@/types/database.types'

//to return a new Supabase instance per request
export async function createServerSupabase() {

  // Get the cookie stored for the current incoming HTTP request
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        //Read auth cookies from the incoming request
        getAll() {
          return cookieStore.getAll()
        },
        //Set auth cookies on the outgoing response
        // Keep the user logged in on server
        // Allows server to know who is making the request
        // by setting the appropriate cookies on the response
        setAll(cookiesToSet) {
          try {
            // Try to set cookies
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch{
          }
        },
      },
    }
  )
}
