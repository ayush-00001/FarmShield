'use client'

import { supabase } from './supabase-client'
import { useEffect, useState } from 'react'

export interface User {
  id: string
  email: string
  fullName?: string | null
}

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getUser() {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser()
        
        if (authUser) {
          // Get or create user in database
          const response = await fetch('/api/user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: authUser.id,
              email: authUser.email,
              fullName: authUser.user_metadata?.full_name || authUser.user_metadata?.name || null,
            }),
          })

          if (response.ok) {
            const dbUser = await response.json()
            setUser(dbUser)
          } else {
            // If API doesn't exist, just use auth user
            setUser({
              id: authUser.id,
              email: authUser.email!,
              fullName: authUser.user_metadata?.full_name || authUser.user_metadata?.name || null,
            })
          }
        }
      } catch (error) {
        console.error('Error getting user:', error)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          fullName: session.user.user_metadata?.full_name || session.user.user_metadata?.name || null,
        })
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return { user, loading }
}

export async function getCurrentUserId(): Promise<string | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    return user?.id || null
  } catch (error) {
    console.error('Error getting current user ID:', error)
    return null
  }
}

