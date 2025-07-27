'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/app/context/AuthContext'
import { Deal } from '@/lib/types'

export default function DealsPage() {
  const { user, isAdmin } = useAuth()
  const [deals, setDeals] = useState<Deal[]>([])
  const [filteredDeals, setFilteredDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Фильтры
  const [stageFilter, setStageFilter] = useState('')
  const [serviceFilter, setServiceFilter] = useState('')
  const [userFilter, setUserFilter] = useState('')

  const getCookie = (name: string) => {
    return document.cookie.split('; ').find(row => row.startsWith(`${name}=`))?.split('=')[1]
  }

  useEffect(() => {
    if (!user) return

    const fetchDeals = async () => {
      try {
        const token = getCookie('tg_news_bot_access_token');
        const endpoint = isAdmin
          ? 'https://appgrand.worldautogroup.ru/deals/admin/get'
          : 'https://appgrand.worldautogroup.ru/deals'

        const response = await fetch(endpoint, {
          headers: {
            ...(token && { 'x-user-id': token })
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch deals')
        }

        const data: Deal[] = await response.json()

        const sorted = data.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )

        setDeals(sorted)
        setFilteredDeals(sorted)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load deals')
      } finally {
        setLoading(false)
      }
    }

    fetchDeals()
  }, [user, isAdmin])

  useEffect(() => {
    let filtered = [...deals]

    if (stageFilter) {
      filtered = filtered.filter((d) => d.stage?.name === stageFilter)
    }
    if (serviceFilter) {
      filtered = filtered.filter((d) => d.service?.name === serviceFilter)
    }
    if (userFilter) {
      filtered = filtered.filter((d) => d.user?.name === userFilter)
    }

    setFilteredDeals(filtered)
  }, [stageFilter, serviceFilter, userFilter, deals])

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

  if (loading) return <div className="text-center py-10">Загрузка сделок...</div>
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>

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

      {/* Фильтры в одну строку */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          className="border px-3 py-2 rounded min-w-[200px]"
        >
          <option value="">Все стадии</option>
          {[...new Set(deals.map((d) => d.stage?.name).filter(Boolean))].map((stage) => (
            <option key={stage} value={stage}>{stage}</option>
          ))}
        </select>

        <select
          value={serviceFilter}
          onChange={(e) => setServiceFilter(e.target.value)}
          className="border px-3 py-2 rounded min-w-[200px]"
        >
          <option value="">Все услуги</option>
          {[...new Set(deals.map((d) => d.service?.name).filter(Boolean))].map((service) => (
            <option key={service} value={service}>{service}</option>
          ))}
        </select>

        <select
          value={userFilter}
          onChange={(e) => setUserFilter(e.target.value)}
          // className="border px-3 py-2 rounded min-w-[200px]"
          className="py-3 px-4 pe-9 min-w-[200px] block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
        >
          <option value="">Все менеджеры</option>
          {[...new Set(deals.map((d) => d.user?.name).filter(Boolean))].map((userName) => (
            <option key={userName} value={userName}>{userName}</option>
          ))}
        </select>
      </div>

      {/* Таблица сделок */}
      <div className="flex flex-col shadow-xl">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                <thead className="bg-gray-100 text-left">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Дата создания</th>
                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Услуга</th>
                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Статус</th>
                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Менеджер</th>
                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Сумма</th>
                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Дедлайн</th>
                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Действие</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDeals.map((deal) => (
                    <tr key={deal._id} className="odd:bg-white even:bg-gray-100 hover:bg-gray-100 dark:odd:bg-neutral-800 dark:even:bg-neutral-700 dark:hover:bg-neutral-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{new Date(deal.createdAt).toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{deal.service?.name || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{deal.stage?.name || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{deal.user?.name || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{deal.totalAmount?.toFixed(2) || '0.00'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{deal.deadline || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                        {
                          <Link href={`/deals/${deal._id}`}>
                            <button type="button" style={{ cursor: "pointer" }} className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 focus:outline-hidden focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400 dark:focus:text-blue-400">Просмотр</button>
                          </Link>
                        }
                        <br></br>
                        {
                          <Link href={`/deals/${deal._id}/edit`}><button style={{ cursor: "pointer" }} type="button" className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 focus:outline-hidden focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400 dark:focus:text-blue-400">Редактировать</button></Link>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {filteredDeals.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          Нет сделок по текущим фильтрам
        </div>
      )}
    </div>
  )
}
