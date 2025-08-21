'use client'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale } from 'react-datepicker';
import { ru } from 'date-fns/locale';
registerLocale('ru', ru);

import { useState, useEffect, useMemo } from 'react'
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
  type: 'text' | 'number' | 'select' | 'checkbox' | 'textarea' | 'datepicker'
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
    visibleIf: (formData) => !!formData.serviceId,
  },
  {
    name: 'stageId',
    label: 'Этап сделки *',
    type: 'select',
    required: true,
    group: 'Основная информация',
    visibleIf: (formData) => !!formData.serviceId,
  },
  {
    name: 'materialId',
    label: 'Материал',
    type: 'select',
    group: 'Основная информация',
    visibleIf: (formData) => !!formData.serviceId,
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
    visibleIf: (formData) => !!formData.serviceId,
  },
  {
    name: 'quantity',
    label: 'Количество',
    type: 'number',
    step: '1',
    min: 1,
    group: 'Основная информация',
    visibleIf: (formData) => !!formData.serviceId,
  },
  {
    name: 'amountPerUnit',
    label: 'Цена за единицу',
    type: 'number',
    step: '0.01',
    min: 1,
    group: 'Основная информация',
    visibleIf: (formData) => !!(formData.serviceId && formData.serviceIdName === 'продажа сырья'),
  },
  {
    name: 'amountPurchase',
    label: 'Итоговая сумм закупки',
    type: 'number',
    step: '0.01',
    min: 0,
    readonly: true,
    group: 'Основная информация',
    visibleIf: (formData) => !!(formData.serviceId && formData.serviceIdName === 'продажа сырья'),
  },

  // Финансовая информация
  {
    name: 'paymentMethod',
    label: 'Тип расчета',
    required: true,
    type: 'select',
    options: [
      { label: 'Наличные', value: 'Наличные' },
      { label: 'Безналичный', value: 'Безналичный' },
    ],
    group: 'Финансовая информация',
    visibleIf: (formData) => !!formData.serviceId,
  },
  {
    name: 'companyProfit',
    label: 'Надбавка фирмы',
    type: 'number',
    step: '0.01',
    min: 0,
    readonly: true,
    group: 'Финансовая информация',
    visibleIf: (formData) => !!formData.serviceId,
  },
  {
    name: 'managerProfit',
    label: 'Доход менеджера',
    type: 'number',
    step: '0.01',
    min: 0,
    readonly: true,
    group: 'Финансовая информация',
    visibleIf: (formData) => !!formData.serviceId,
  },
  {
    name: 'totalAmount',
    label: 'Итоговая сумма',
    type: 'number',
    readonly: true,
    group: 'Финансовая информация',
    visibleIf: (formData) => !!formData.serviceId,
  },

  // Доставка
  {
    name: 'methodReceiving',
    label: 'Способ получения товара',
    type: 'select',
    options: [
      { label: 'Доставка', value: 'Доставка' },
      { label: 'Самовывоз', value: 'Самовывоз' },
    ],
    group: 'Доставка',
    visibleIf: (formData) => !!(formData.serviceId && formData.serviceIdName === 'продажа сырья'),
  },
  {
    name: 'amountDelivery',
    label: 'Сумма логистики',
    type: 'number',
    step: '0.01',
    min: 0,
    group: 'Доставка',
    visibleIf: (formData) => formData.methodReceiving === 'Доставка',
  },
  {
    name: 'shippingAddress',
    label: 'Адрес отгрузки',
    type: 'textarea',
    group: 'Доставка',
    visibleIf: (formData) => !!(formData.serviceId && formData.serviceIdName != ''),
  },
  {
    name: 'deliveryAddress',
    label: 'Адрес доставки',
    type: 'textarea',
    group: 'Доставка',
    visibleIf: (formData) => formData.methodReceiving === 'Доставка',
  },

  // Дополнительно
  {
    name: 'deadline',
    label: 'Срок выполнения',
    type: 'datepicker',
    group: 'Дополнительно',
    visibleIf: (formData) => !!formData.serviceId,
  },
  {
    name: 'notes',
    label: 'Примечания',
    type: 'textarea',
    group: 'Дополнительно',
    visibleIf: (formData) => !!formData.serviceId,
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
  companies: initialCompanies,
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
        quantity: 1,
        methodReceiving: '',
        paymentMethod: '',
        shippingAddress: '',
        deliveryAddress: '',
        amountPurchase: 0,
        amountPerUnit: 0,
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
  const [companySearch, setCompanySearch] = useState('')
  const [foundCompany, setFoundCompany] = useState<{
    inn: string
    name: string
    abbreviatedName: string
  } | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [companies, setCompanies] = useState<Company[]>(initialCompanies)
  const [showCompaniesList, setShowCompaniesList] = useState(false);

  const filteredCompanies = useMemo(() => {
    if (!companySearch.trim()) {
      return companies.filter(c => !c.is_deleted);
    }

    const searchLower = companySearch.toLowerCase().trim();
    return companies.filter(c => {
      if (c.is_deleted) return false;

      // Проверяем название и сокращенное название
      const nameMatch = c.name.toLowerCase().includes(searchLower);
      const abbrevMatch = c.abbreviatedName &&
        c.abbreviatedName.toLowerCase().includes(searchLower);

      // Преобразуем ИНН в строку для безопасной проверки
      const innString = c.inn ? c.inn.toString() : '';
      const innMatch = innString.includes(companySearch.trim());

      return nameMatch || abbrevMatch || innMatch;
    });
  }, [companies, companySearch]);



  const handleSearchCompany = async () => {
    if (!companySearch) return

    try {
      setLoading(true)
      const response = await fetch(`https://appgrand.worldautogroup.ru/companies/get_company_info/${companySearch}`)

      if (!response.ok) {
        throw new Error('Компания не найдена')
      }

      const data = await response.json()
      const companyInfo = data.items[0]['ЮЛ']

      setFoundCompany({
        inn: companyInfo['ИНН'],
        name: companyInfo['НаимПолнЮЛ'],
        abbreviatedName: companyInfo['НаимСокрЮЛ'] || companyInfo['НаимПолнЮЛ']
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка поиска компании')
      setFoundCompany(null)
    } finally {
      setLoading(false)
    }
  }

  const handleAddCompany = async () => {
    if (!foundCompany) return

    try {
      setLoading(true)
      const token = getCookie('tg_news_bot_access_token')

      const response = await fetch('https://appgrand.worldautogroup.ru/companies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'x-user-id': token }),
        },
        body: JSON.stringify({
          name: foundCompany.name,
          abbreviatedName: foundCompany.abbreviatedName,
          inn: foundCompany.inn
        })
      })

      if (!response.ok) {
        throw new Error('Ошибка добавления компании')
      }

      const newCompany = await response.json()

      // Обновляем список компаний
      setCompanies(prev => [...prev, newCompany])

      // Выбираем новую компанию
      setFormData(prev => ({
        ...prev,
        customerId: newCompany._id
      }))

      // Сбрасываем состояние поиска
      setCompanySearch('')
      setFoundCompany(null)
      setShowAddForm(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка добавления компании')
    } finally {
      setLoading(false)
    }
  }

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
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : undefined,
      }

      for (const key in dataToSend) {
        if (dataToSend[key as keyof Deal] === undefined || dataToSend[key as keyof Deal] === null) {
          delete dataToSend[key as keyof Deal];
        }
      }

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
    const quantity1 = Number(formData.quantity) || 0
    const amountPerUnit2 = Number(formData.amountPerUnit) || 0
    const delivery = Number(formData.amountDelivery) || 0
    var purchase = (quantity1 * amountPerUnit2) // Number(formData.amountPurchase) || 0
    var sum_without_profit = (purchase + delivery)
    var profit_company = sum_without_profit * 0.2 // Number(formData.companyProfit) || 0
    var total = sum_without_profit + profit_company
    var profit_manager = profit_company * 0.5
    return { total: total, profit: profit_company, profit_manager: profit_manager, purchase: purchase }
  }

  useEffect(() => {
    if (
      formData.quantity !== undefined ||
      formData.amountPerUnit !== undefined ||
      formData.amountPurchase !== undefined ||
      formData.amountDelivery !== undefined ||
      formData.companyProfit !== undefined
    ) {
      const { total, profit, profit_manager, purchase } = calculateTotal()
      setFormData((prev) => ({
        ...prev,
        companyProfit: Number(profit.toFixed(2)),
        totalAmount: total,
        managerProfit: Number(profit_manager.toFixed(2)),
        amountPurchase: purchase,
      }))
    }
  }, [formData.quantity, formData.amountPerUnit, formData.amountPurchase, formData.amountDelivery, formData.companyProfit])

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

      if (field.name === 'customerId') {
        return (
          <div key={field.name} className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
            </label>

            <div className="relative">
              <input
                type="text"
                placeholder="Начните вводить название или ИНН"
                value={showAddForm ? '' : companySearch}
                onChange={(e) => {
                  setCompanySearch(e.target.value);
                  setShowAddForm(false);
                  setShowCompaniesList(true); // Показываем список при вводе
                }}
                onFocus={() => {
                  setShowCompaniesList(true);
                  setShowAddForm(false);
                }}
                onBlur={() => {
                  // Задержка для обработки клика по элементу списка
                  setTimeout(() => setShowCompaniesList(false), 200);
                }}
                className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500"
              />

              {!showAddForm && showCompaniesList && ( // Добавляем условие showCompaniesList
                <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                  <div
                    className="px-4 py-2 border-t bg-gray-50 hover:bg-gray-100 cursor-pointer text-blue-600 font-medium"
                    onClick={() => {
                      setShowAddForm(true);
                      setCompanySearch('');
                      setShowCompaniesList(false);
                    }}
                    onMouseDown={(e) => e.preventDefault()} // Предотвращаем onBlur поля ввода
                  >
                    + Добавить новую компанию
                  </div>
                  {filteredCompanies.length > 0 ? (
                    filteredCompanies.map((company) => (
                      <div
                        key={company._id}
                        className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${formData.customerId === company._id ? 'bg-blue-50' : ''}`}
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            customerId: company._id
                          }));
                          setCompanySearch(company.name);
                          setShowCompaniesList(false); // Закрываем список после выбора
                        }}
                        onMouseDown={(e) => e.preventDefault()} // Предотвращаем onBlur поля ввода
                      >
                        <div className="font-medium">{company.name}</div>
                        {company.abbreviatedName && (
                          <div className="text-sm text-gray-600">{company.abbreviatedName}</div>
                        )}
                        {company.inn && (
                          <div className="text-sm text-gray-500">ИНН: {company.inn.toString()}</div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-gray-500">
                      {companySearch ? 'Ничего не найдено' : 'Введите для поиска'}
                    </div>
                  )}
                </div>
              )}
            </div>

            {showAddForm && (
              <div className="mt-4 p-4 border rounded-md bg-gray-50">
                <div className="flex items-center space-x-2 mb-4">
                  <input
                    type="text"
                    placeholder="Введите ИНН для поиска"
                    value={companySearch}
                    onChange={(e) => setCompanySearch(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleSearchCompany}
                    disabled={!companySearch || loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    Найти
                  </button>
                </div>

                {foundCompany && (
                  <div className="p-3 bg-white rounded-md border mb-4">
                    <div className="font-medium mb-2">Найдена компания:</div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm">
                        <span className="text-gray-500">ИНН:</span> {foundCompany.inn}
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">Полное название:</span> {foundCompany.name}
                      </div>
                      {foundCompany.abbreviatedName && (
                        <div className="text-sm col-span-2">
                          <span className="text-gray-500">Сокращенное название:</span> {foundCompany.abbreviatedName}
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => {
                          setFoundCompany(null)
                          setCompanySearch('')
                        }}
                        className="px-4 py-2 border rounded-md hover:bg-gray-100"
                      >
                        Отмена
                      </button>
                      <button
                        type="button"
                        onClick={handleAddCompany}
                        disabled={loading}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                      >
                        {loading ? 'Добавление...' : 'Добавить компанию'}
                      </button>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false)
                    setCompanySearch('')
                    setFoundCompany(null)
                  }}
                  className="mt-2 text-sm text-gray-500 hover:text-gray-700"
                >
                  ← Вернуться к списку
                </button>
              </div>
            )}

            {/* Скрытое поле для формы */}
            <input
              type="hidden"
              name="customerId"
              value={formData.customerId || ''}
            />
          </div>
        )
      }

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
                type="text"
                {...commonProps}
                value={
                  formData[field.name] !== undefined && formData[field.name] !== ''
                    ? formData[field.name] + ' ₽'
                    : ''
                }
                onChange={(e) => {
                  // убираем все нечисловые символы
                  const cleanValue = e.target.value.replace(/[^\d.,]/g, '').replace(',', '.')
                  setFormData((prev) => ({
                    ...prev,
                    [field.name]: cleanValue ? parseFloat(cleanValue) : ''
                  }))
                }}
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
        // case 'datetime-local':
        //   return (
        //     <div key={field.name}>
        //       <label className="block text-sm font-medium text-gray-700 mb-1">
        //         {field.label}
        //       </label>
        //       <input type="datetime-local" {...commonProps} />
        //     </div>
        //   )
        case 'datepicker':
          return (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              <DatePicker
                selected={formData.deadline ? new Date(formData.deadline) : null}
                onChange={(date: Date | null) => { // Добавляем тип null
                  setFormData(prev => ({
                    ...prev,
                    deadline: date ? date.toISOString() : null // Проверяем на null
                  }))
                }}
                locale="ru"
                dateFormat="dd.MM.yyyy HH:mm"
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500"
                placeholderText="Выберите дату и время"
                minDate={new Date()}
                isClearable
              />
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
