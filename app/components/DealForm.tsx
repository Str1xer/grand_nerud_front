'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Deal, Service, Stage, Material, Company } from '@/lib/types'

interface DealFormProps {
  initialData?: Deal
  services: Service[]
  stages: Stage[]
  materials: Material[]
  companies: Company[]
}

export const DealForm = ({ initialData, services, stages, materials, companies }: DealFormProps) => {
  const router = useRouter()
  const [formData, setFormData] = useState<Partial<Deal>>(initialData || {
    serviceId: '',
    customerId: '',
    stageId: '',
    materialId: '',
    unitMeasurement: '',
    quantity: 0,
    methodReceiving: '',
    paymentMethod: '',
    shippingAddress: '',
    deliveryAddress: '',
    amountPurchase: 0,
    amountDelivery: 0,
    companyProfit: 0,
    totalAmount: 0,
    managerProfit: 0,
    deadline: '',
    notes: '',
    OSSIG: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [serviceSelected, setServiceSelected] = useState(false)

  const getCookie = (name: string) => {
    return document.cookie.split('; ').find(row => row.startsWith(`${name}=`))?.split('=')[1]
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined

    if (name === 'serviceId') {
      setServiceSelected(!!value)
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked
        : type === 'number' ? parseFloat(value) || 0
          : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const token = getCookie('tg_news_bot_access_token');
      const url = initialData
        ? `https://appgrand.worldautogroup.ru/deals/${initialData._id}`
        : 'https://appgrand.worldautogroup.ru/deals'

      const method = initialData ? 'PATCH' : 'POST'

      // Преобразуем все числовые поля в обычные числа (не Decimal)
      const dataToSend = {
        ...formData,
        amountPurchase: Number(formData.amountPurchase),
        amountDelivery: Number(formData.amountDelivery),
        companyProfit: Number(formData.companyProfit),
        totalAmount: Number(formData.totalAmount),
        managerProfit: Number(formData.managerProfit),
        quantity: Number(formData.quantity),
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null
      }

      // Удаляем undefined/null поля
      Object.keys(dataToSend).forEach(key => {
        if (dataToSend[key] === undefined || dataToSend[key] === null) {
          delete dataToSend[key]
        }
      })

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'x-user-id': token }),
        },
        body: JSON.stringify(dataToSend)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || (initialData ? 'Failed to update deal' : 'Failed to create deal'))
      }

      router.push('/deals')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const calculateTotal = () => {
    const purchase = formData.amountPurchase || 0
    const delivery = formData.amountDelivery || 0
    const profit = formData.companyProfit || 0
    return purchase + delivery + profit
  }

  useEffect(() => {
    if (formData.amountPurchase !== undefined ||
      formData.amountDelivery !== undefined ||
      formData.companyProfit !== undefined) {
      setFormData(prev => ({
        ...prev,
        totalAmount: calculateTotal()
      }))
    }
  }, [formData.amountPurchase, formData.amountDelivery, formData.companyProfit])

  const renderServiceSpecificFields = () => {
    if (!formData.serviceId) return null

    const service = services.find(s => s._id === formData.serviceId)
    if (!service) return null

    switch (service.name) {
      case 'продажа сырья':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Цена за единицу
              </label>
              <input
                type="number"
                name="amountPerUnit"
                value={formData.amountPerUnit || ''}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Способ получения товара
              </label>
              <select
                name="methodReceiving"
                value={formData.methodReceiving || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Выберите способ</option>
                <option value="delivery">Доставка</option>
                <option value="pickup">Самовывоз</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Сумма закупки за весь объем
              </label>
              <input
                type="number"
                name="amountPurchase"
                value={formData.amountPurchase || ''}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </>
        )
      case 'доставка':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Сумма логистики
            </label>
            <input
              type="number"
              name="amountDelivery"
              value={formData.amountDelivery || ''}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )
      case 'утилизация':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              name="OSSIG"
              checked={formData.OSSIG || false}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              ОССиГ
            </label>
          </div>
        )
      default:
        return null
    }
  }

  const renderCommonFields = () => {
    if (!serviceSelected) return null

    return (
      <>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Дата создания сделки *
          </label>
          <input
            type="datetime-local"
            name="createdAt"
            value={formData.createdAt || ''}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Заказчик *
          </label>
          <select
            name="customerId"
            value={formData.customerId || ''}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Выберите заказчика</option>
            {companies.filter(c => !c.is_deleted).map(company => (
              <option key={company._id} value={company._id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Этап сделки *
          </label>
          <select
            name="stageId"
            value={formData.stageId || ''}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Выберите этап</option>
            {stages.filter(s => !s.is_deleted).map(stage => (
              <option key={stage._id} value={stage._id}>
                {stage.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Материал
          </label>
          <select
            name="materialId"
            value={formData.materialId || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Выберите материал</option>
            {materials.filter(m => !m.is_deleted).map(material => (
              <option key={material._id} value={material._id}>
                {material.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Единица измерения
          </label>
          <input
            type="text"
            name="unitMeasurement"
            value={formData.unitMeasurement || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Количество
          </label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity || ''}
            onChange={handleChange}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Тип расчета
          </label>
          <select
            name="paymentMethod"
            value={formData.paymentMethod || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Выберите способ</option>
            <option value="cash">Наличные</option>
            <option value="cashless">Безналичный</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Адрес отправления
          </label>
          <input
            type="text"
            name="shippingAddress"
            value={formData.shippingAddress || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Адрес доставки
          </label>
          <input
            type="text"
            name="deliveryAddress"
            value={formData.deliveryAddress || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Надбавка фирмы
          </label>
          <input
            type="number"
            name="companyProfit"
            value={formData.companyProfit || ''}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Итоговая сумма
          </label>
          <input
            type="number"
            name="totalAmount"
            value={formData.totalAmount || ''}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Доход менеджера
          </label>
          <input
            type="number"
            name="managerProfit"
            value={formData.managerProfit || ''}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Дедлайн
          </label>
          <input
            type="datetime-local"
            name="deadline"
            value={formData.deadline || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Примечания
          </label>
          <textarea
            name="notes"
            value={formData.notes || ''}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {renderServiceSpecificFields()}
      </>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">
        {initialData ? 'Редактирование сделки' : 'Новая сделка'}
      </h2>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Услуга *
            </label>
            <select
              name="serviceId"
              value={formData.serviceId || ''}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Выберите услугу</option>
              {services.map(service => (
                <option key={service._id} value={service._id}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>

          {renderCommonFields()}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push('/deals')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </form>
    </div>
  )
}