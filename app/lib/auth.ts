import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies()
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    
    // Get auth token from cookies
    const accessToken = cookieStore.get('sb-access-token')?.value
    const refreshToken = cookieStore.get('sb-refresh-token')?.value
    
    if (!accessToken && !refreshToken) {
      // Try to get from auth cookie (Supabase uses different cookie names)
      const authCookie = cookieStore.get('sb-' + supabaseUrl.split('//')[1].split('.')[0] + '-auth-token')?.value
      if (!authCookie) {
        return null
      }
    }
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
      },
    })

    // Set the session if we have tokens
    if (accessToken) {
      await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken || '',
      })
    }

    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return null
    }

    // Get or create user in our database
    const { prisma } = await import('./prisma')
    
    let dbUser = await prisma.user.findUnique({
      where: { email: user.email! },
    })

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          id: user.id,
          email: user.email!,
          fullName: user.user_metadata?.full_name || user.user_metadata?.name || null,
        },
      })
    }

    return dbUser
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

// Helper function to get user ID from client-side
// This can be called from client components and passed to server actions
export async function getUserIdFromClient(): Promise<string | null> {
  // This is a workaround - we'll pass userId from client side
  // For now, return null and handle in server actions
  return null
}

