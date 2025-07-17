'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/app/context/AuthContext'
import { Deal } from '@/lib/types'
import { DealCard } from '@/app/components/DealCard'

export default function DealsPage() {
  const { user, isAdmin } = useAuth()
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return

    const fetchDeals = async () => {
      try {
        const token = localStorage.getItem('token')
        const endpoint = isAdmin 
          ? 'https://appgrand.worldautogroup.ru/deals/admin/get'
          : 'https://appgrand.worldautogroup.ru/deals'
        
        const response = await fetch(endpoint, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch deals')
        }

        const data = await response.json()
        setDeals(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load deals')
      } finally {
        setLoading(false)
      }
    }

    fetchDeals()
  }, [user, isAdmin])

  if (!user) {
    return (
      <div className="text-center py-10">
        <p>Пожалуйста, войдите чтобы просмотреть сделки</p>
        <Link href="/login" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
          Войти
        </Link>
      </div>
    )
  }

  if (loading) {
    return <div className="text-center py-10">Загрузка сделок...</div>
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {isAdmin ? 'Все сделки' : 'Мои сделки'}
        </h1>
        <Link 
          href="/new-deal"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Новая сделка
        </Link>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {deals.map((deal) => (
          <DealCard key={deal._id} deal={deal} />
        ))}
      </div>
      
      {deals.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          Нет доступных сделок
        </div>
      )}
    </div>
  )
}