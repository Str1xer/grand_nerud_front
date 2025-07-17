'use client'

import Link from 'next/link'
import { Deal } from '@/lib/types'

export const DealCard = ({ deal }: { deal: Deal }) => {
  const getServiceName = (serviceId: string) => {
    // Здесь можно добавить логику для получения названия услуги по ID
    // Пока просто возвращаем ID
    return serviceId
  }

  const getStageName = (stageId: string) => {
    // Здесь можно добавить логику для получения названия этапа по ID
    // Пока просто возвращаем ID
    return stageId
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800">
            {getServiceName(deal.serviceId)}
          </h3>
          <span className={`px-2 py-1 text-xs rounded-full ${
            deal.is_deleted ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
          }`}>
            {deal.is_deleted ? 'Удалена' : 'Активна'}
          </span>
        </div>
        
        <div className="text-sm text-gray-600 mb-3">
          <p>Создано: {formatDate(deal.createdAt)}</p>
          <p>Этап: {getStageName(deal.stageId)}</p>
          {deal.quantity && (
            <p>Количество: {deal.quantity} {deal.unitMeasurement || 'ед.'}</p>
          )}
          {deal.totalAmount && (
            <p>Сумма: {deal.totalAmount.toLocaleString()} ₽</p>
          )}
        </div>
        
        <div className="flex justify-between items-center">
          <Link 
            href={`/deals/${deal._id}`}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Подробнее
          </Link>
          <span className="text-xs text-gray-500">
            {formatDate(deal.updated_at)}
          </span>
        </div>
      </div>
    </div>
  )
}