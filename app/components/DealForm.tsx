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

interface FieldConfig {
  name: keyof Deal | string
  label: string
  type: 'text' | 'number' | 'select' | 'checkbox' | 'textarea' | 'datetime-local'
  options?: { label: string; value: string }[]
  step?: string
  min?: number
  placeholder?: string
  readonly?: boolean
  required?: boolean
  group: string
  visibleIf?: (formData: Partial<Deal>) => boolean
}

// Конфиг всех полей в одном массиве
const allFieldsConfig: FieldConfig[] = [
  // Общие поля в разные группы
  {
    name: 'serviceId',
    label: 'Услуга *',
    type: 'select',
    required: true,
    group: 'Основная информация',
  },
  {
    name: 'customerId',
    label: 'Заказчик *',
    type: 'select',
    required: true,
    group: 'Основная информация',
    visibleIf: (formData) => formData.serviceId && formData.serviceIdName != '',
  },
  // {
  //   name: 'stageId',
  //   label: 'Этап сделки *',
  //   type: 'select',
  //   required: true,
  //   group: 'Основная информация',
  // },
  {
    name: 'materialId',
    label: 'Материал',
    type: 'select',
    group: 'Основная информация',
    visibleIf: (formData) => formData.serviceId && formData.serviceIdName != '',
  },
  {
    name: 'unitMeasurement',
    label: 'Единица измерения',
    type: 'select',
    options: [
      { label: 'Кубический метр', value: 'Кубический метр' },
      { label: 'Тонна', value: 'Тонна' },
    ],
    group: 'Основная информация',
    visibleIf: (formData) => formData.serviceId && formData.serviceIdName != '',
  },
  {
    name: 'quantity',
    label: 'Количество',
    type: 'number',
    step: '0.01',
    min: 0,
    group: 'Основная информация',
    visibleIf: (formData) => formData.serviceId && formData.serviceIdName != '',
  },

  // Финансовая информация
  {
    name: 'paymentMethod',
    label: 'Тип расчета',
    type: 'select',
    options: [
      { label: 'Наличные', value: 'cash' },
      { label: 'Безналичный', value: 'cashless' },
    ],
    group: 'Финансовая информация',
    visibleIf: (formData) => formData.serviceId && formData.serviceIdName != '',
  },
  {
    name: 'companyProfit',
    label: 'Надбавка фирмы',
    type: 'number',
    step: '0.01',
    min: 0,
    group: 'Финансовая информация',
    visibleIf: (formData) => formData.serviceId && formData.serviceIdName != '',
  },
  {
    name: 'managerProfit',
    label: 'Доход менеджера',
    type: 'number',
    step: '0.01',
    min: 0,
    group: 'Финансовая информация',
    visibleIf: (formData) => formData.serviceId && formData.serviceIdName != '',
  },
  {
    name: 'totalAmount',
    label: 'Итоговая сумма',
    type: 'number',
    readonly: true,
    group: 'Финансовая информация',
    visibleIf: (formData) => formData.serviceId && formData.serviceIdName != '',
  },

  // Доставка
  {
    name: 'methodReceiving',
    label: 'Способ получения товара',
    type: 'select',
    options: [
      { label: 'Доставка', value: 'delivery' },
      { label: 'Самовывоз', value: 'pickup' },
    ],
    group: 'Доставка',
    visibleIf: (formData) => formData.serviceId && formData.serviceIdName === 'продажа сырья',
  },
  {
    name: 'amountDelivery',
    label: 'Сумма логистики',
    type: 'number',
    step: '0.01',
    min: 0,
    group: 'Доставка',
    visibleIf: (formData) => formData.methodReceiving === 'delivery',
  },
  {
    name: 'shippingAddress',
    label: 'Адрес отгрузки',
    type: 'textarea',
    group: 'Доставка',
    visibleIf: (formData) => formData.serviceId && formData.serviceIdName != '',
  },
  {
    name: 'deliveryAddress',
    label: 'Адрес доставки',
    type: 'textarea',
    group: 'Доставка',
    visibleIf: (formData) => formData.methodReceiving === 'delivery',
  },

  // Дополнительно
  {
    name: 'deadline',
    label: 'Срок выполнения',
    type: 'datetime-local',
    group: 'Дополнительно',
    visibleIf: (formData) => formData.serviceId && formData.serviceIdName != '',
  },
  {
    name: 'notes',
    label: 'Примечания',
    type: 'textarea',
    group: 'Дополнительно',
    visibleIf: (formData) => formData.serviceId && formData.serviceIdName != '',
  },

  // Специфичные поля по услуге "продажа сырья"
  {
    name: 'amountPerUnit',
    label: 'Цена за единицу',
    type: 'number',
    step: '0.01',
    min: 0,
    group: 'Дополнительно',
    visibleIf: (formData) => {
      // Найдем выбранную услугу по ID, сравним название
      return formData.serviceId && formData.serviceIdName === 'продажа сырья'
    },
  },
  {
    name: 'amountPurchase',
    label: 'Сумма закупки',
    type: 'number',
    step: '0.01',
    min: 0,
    group: 'Дополнительно',
    visibleIf: (formData) => formData.serviceId && formData.serviceIdName === 'продажа сырья',
  },

  // Специфичные поля для утилизации
  {
    name: 'OSSIG',
    label: 'ОССиГ',
    type: 'checkbox',
    group: 'Доставка',
    visibleIf: (formData) => formData.serviceIdName === 'утилизация',
  },
]

const Section = ({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) => (
  <div className="mb-8">
    <h3 className="text-lg font-semibold mb-4 border-b border-gray-300 pb-1 text-gray-800">
      {title}
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
  </div>
)

export const DealForm = ({
  initialData,
  services,
  stages,
  materials,
  companies,
}: DealFormProps) => {
  const router = useRouter()
  const [formData, setFormData] = useState<Partial<Deal & { serviceIdName?: string }>>(
    initialData
      ? {
        ...initialData,
        serviceIdName: '',
      }
      : {
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
        serviceIdName: '',
      }
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const floatFieldNames = [
    'amountPurchase',
    'amountDelivery',
    'companyProfit',
    'totalAmount',
    'managerProfit',
    'quantity',
    'amountPerUnit',
  ]

  const getCookie = (name: string) =>
    document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${name}=`))
      ?.split('=')[1]

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined

    if (type === 'number' || floatFieldNames.includes(name)) {
      const valid = /^-?\d*\.?\d*$/.test(value)
      if (!valid && value !== '') return
    }

    let valToSet: any = type === 'checkbox' ? checked : value

    setFormData((prev) => {
      // Если меняется serviceId, дописываем имя услуги для удобства visibleIf
      if (name === 'serviceId') {
        const foundService = services.find((s) => s._id === valToSet)
        return {
          ...prev,
          [name]: valToSet,
          serviceIdName: foundService?.name || '',
        }
      }
      return {
        ...prev,
        [name]: valToSet,
      }
    })
  }

  const handleFloatKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = [
      'Backspace',
      'Delete',
      'ArrowLeft',
      'ArrowRight',
      'Tab',
      'Enter',
      'Home',
      'End',
      '-',
      '.',
    ]
    if (!allowedKeys.includes(e.key) && !(e.key >= '0' && e.key <= '9')) e.preventDefault()
  }

  const handlePasteFloatOnly = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const paste = e.clipboardData.getData('text')
    if (!/^[-]?\d*\.?\d*$/.test(paste)) e.preventDefault()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const token = getCookie('tg_news_bot_access_token')
      const url = initialData
        ? `https://appgrand.worldautogroup.ru/deals/${initialData._id}`
        : 'https://appgrand.worldautogroup.ru/deals'

      const method = initialData ? 'PATCH' : 'POST'

      const dataToSend = {
        ...formData,
        amountPurchase: Number(formData.amountPurchase),
        amountDelivery: Number(formData.amountDelivery),
        companyProfit: Number(formData.companyProfit),
        totalAmount: Number(formData.totalAmount),
        managerProfit: Number(formData.managerProfit),
        quantity: Number(formData.quantity),
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
      }

      Object.keys(dataToSend).forEach((key) => {
        if (dataToSend[key] === undefined || dataToSend[key] === null) delete dataToSend[key]
      })

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'x-user-id': token }),
        },
        body: JSON.stringify(dataToSend),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Ошибка сохранения сделки')
      }

      router.push('/deals')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка')
    } finally {
      setLoading(false)
    }
  }

  const calculateTotal = () => {
    const purchase = Number(formData.amountPurchase) || 0
    const delivery = Number(formData.amountDelivery) || 0
    const profit = Number(formData.companyProfit) || 0
    return purchase + delivery + profit
  }

  useEffect(() => {
    if (
      formData.amountPurchase !== undefined ||
      formData.amountDelivery !== undefined ||
      formData.companyProfit !== undefined
    ) {
      setFormData((prev) => ({
        ...prev,
        totalAmount: calculateTotal(),
      }))
    }
  }, [formData.amountPurchase, formData.amountDelivery, formData.companyProfit])

  // Группируем поля по группе
  const groupedFields = allFieldsConfig.reduce<Record<string, FieldConfig[]>>((acc, field) => {
    if (!acc[field.group]) acc[field.group] = []
    acc[field.group].push(field)
    return acc
  }, {})

  const renderFields = (fields: FieldConfig[]) => {
    return fields.map((field) => {
      // Проверяем видимость
      if (field.visibleIf && !field.visibleIf(formData)) return null

      const value =
        formData[field.name as keyof Deal] ??
        (field.type === 'checkbox' ? false : '')

      const commonProps = {
        name: field.name,
        value: field.type === 'checkbox' ? undefined : value,
        checked: field.type === 'checkbox' ? Boolean(value) : undefined,
        onChange: handleChange,
        className: field.type === 'checkbox'
          ? 'sr-only peer'
          : 'w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500',
        placeholder: field.placeholder,
        readOnly: field.readonly,
        min: field.min,
        step: field.step,
        required: field.required,
      }

      switch (field.type) {
        case 'text':
          return (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              <input type="text" {...commonProps} />
            </div>
          )
        case 'number':
          return (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              <input
                type="number"
                {...commonProps}
                onKeyDown={handleFloatKeyDown}
                onPaste={handlePasteFloatOnly}
              />
            </div>
          )
        case 'select':
          if (
            ['customerId', 'stageId', 'materialId', 'serviceId'].includes(
              field.name
            )
          ) {
            let optionsList: { label: string; value: string }[] = []

            if (field.name === 'customerId') {
              optionsList = companies
                .filter((c) => !c.is_deleted)
                .map((c) => ({ label: c.name, value: c._id }))
            } else if (field.name === 'stageId') {
              optionsList = stages
                .filter((s) => !s.is_deleted)
                .map((s) => ({ label: s.name, value: s._id }))
            } else if (field.name === 'materialId') {
              optionsList = materials
                .filter((m) => !m.is_deleted)
                .map((m) => ({ label: m.name, value: m._id }))
            } else if (field.name === 'serviceId') {
              optionsList = services.map((s) => ({
                label: s.name,
                value: s._id,
              }))
            }

            return (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                </label>
                <select {...commonProps}>
                  <option value="">Выберите</option>
                  {optionsList.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            )
          }

          return (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              <select {...commonProps}>
                <option value="">Выберите</option>
                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )
        case 'checkbox':
          return (

            <div key={field.name} className="flex items-center space-x-3">
              <label className="inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  {...commonProps}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-gray-300 rounded-full peer-checked:bg-blue-600 relative transition-colors duration-200 ease-in-out">
                  <span className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                </div>
              </label>
              <span className="text-sm text-gray-700">{field.label}</span>
            </div>
          )
        case 'textarea':
          return (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              <textarea {...commonProps} rows={3} />
            </div>
          )
        case 'datetime-local':
          return (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              <input type="datetime-local" {...commonProps} />
            </div>
          )
        default:
          return null
      }
    })
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">
        {initialData ? 'Редактирование сделки' : 'Новая сделка'}
      </h2>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {Object.entries(groupedFields).map(([groupName, fields]) => {
          // Фильтруем поля с учетом видимости
          const visibleFields = fields.filter(
            (field) => !field.visibleIf || field.visibleIf(formData)
          )
          if (visibleFields.length === 0) return null

          return (
            <Section key={groupName} title={groupName}>
              {renderFields(visibleFields)}
            </Section>
          )
        })}

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
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Сохраняем...' : 'Сохранить'}
          </button>
        </div>
      </form>
    </div>
  )
}
