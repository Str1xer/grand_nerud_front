'use client'

import { useAuth } from '@/app/context/AuthContext'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AuthForm } from '@/app/components/AuthForm'

export default function LoginPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push('/deals')
    }
  }, [user, router])


  if (loading) return <div>Проверка авторизации...</div>
  if (user) return null

  return (
    // <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <AuthForm type="login" />
    // </div>
  )
}
