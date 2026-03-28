// "use client"

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useUser } from './useUser'

export function useProfile() {
  const { user } = useUser()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    supabase
      .from('students')
      .select('*')
      .eq('user_id', user.id)
      .single()
      .then(({ data }) => {
        setProfile(data)
        setLoading(false)
      })
  }, [user])

  return { profile, loading }
}