// /src/app/deals/[id]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/AuthContext'
import { Button } from '@/app/components/ui/button'
import Link from 'next/link'
import { Deal } from '@/lib/types'


export default function DealDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [deal, setDeal] = useState<Deal | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const getCookie = (name: string) => {
    return document.cookie.split('; ').find(row => row.startsWith(`${name}=`))?.split('=')[1]
  }

  useEffect(() => {
    if (!user) return

    const fetchDeal = async () => {
      try {
        const token = getCookie('tg_news_bot_access_token')

        const response = await fetch(`https://appgrand.worldautogroup.ru/deals/${id}`, {
          headers: {
            ...(token && { 'x-user-id': token }),
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch deal')
        }

        const dealData = await response.json()
        setDeal(dealData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load deal')
      } finally {
        setLoading(false)
      }
    }

    fetchDeal()
  }, [id, user])

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Не указано'
    return new Date(dateString).toLocaleDateString('ru-RU')
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB'
    }).format(amount)
  }

  if (!user) {
    return (
      <div className="text-center py-10">
        <p>Пожалуйста, войдите чтобы просмотреть сделку</p>
      </div>
    )
  }

  if (loading) {
    return <div className="text-center py-10">Загрузка данных сделки...</div>
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>
  }

  if (!deal) {
    return <div className="text-center py-10">Сделка не найдена</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Сделка
        </h1>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/deals">Назад к списку</Link>
          </Button>
          <Button asChild>
            <Link href={`/deals/${deal._id}/edit`}>Редактировать</Link>
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Основная информация</h2>

            <div>
              <p className="text-sm text-gray-500">Тип услуги</p>
              <p className="font-medium">{deal.service.name}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Статус</p>
              <p className="font-medium">{deal.stage.name}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Дата создания</p>
              <p className="font-medium">{formatDate(deal.createdAt)}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Менеджер</p>
              <p className="font-medium">{deal.user.name} ({deal.user.email})</p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Финансовые данные</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Сумма закупки</p>
                <p className="font-medium">{formatCurrency(deal.amountPurchase)}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Доставка</p>
                <p className="font-medium">{formatCurrency(deal.amountDelivery)}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Прибыль компании</p>
                <p className="font-medium">{formatCurrency(deal.companyProfit)}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Итого</p>
                <p className="font-medium">{formatCurrency(deal.totalAmount)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold">Дополнительная информация</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Способ получения</p>
              <p className="font-medium">{deal.methodReceiving || 'Не указано'}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Способ оплаты</p>
              <p className="font-medium">{deal.paymentMethod || 'Не указано'}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Дедлайн</p>
              <p className="font-medium">{formatDate(deal.deadline)}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">ОССиГ</p>
              <p className="font-medium">{deal.OSSIG ? 'Да' : 'Нет'}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500">Примечания</p>
            <p className="font-medium whitespace-pre-line">{deal.notes || 'Нет примечаний'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}