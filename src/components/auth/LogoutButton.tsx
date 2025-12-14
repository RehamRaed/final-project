'use client'

import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LogoutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    setLoading(false)
    router.push('/auth/login')
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="btn btn-secondary"
    >
      {loading ? 'Logging out...' : 'Logout'}
    </button>
  )
}
