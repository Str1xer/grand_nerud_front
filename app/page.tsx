'use client'

import Link from 'next/link'
import { useAuth } from '@/app/context/AuthContext'

export default function Home() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Гранд-неруд</span>
            <span className="block text-blue-600">CRM система</span>
          </h1>

          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Управляйте сделками, клиентами и материалами в одной системе
          </p>

          <div className="mt-10 flex justify-center gap-4">
            {user ? (
              <>
                <Link
                  href="/deals"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Мои сделки
                </Link>
                {user.admin && (
                  <Link
                    href="/admin"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Админ-панель
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Войти
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Зарегистрироваться
                </Link>
              </>
            )}
          </div>
        </div>

        {!user && (
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-blue-500 mb-4">
                <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Управление клиентами</h3>
              <p className="text-gray-500">
                Добавляйте и управляйте компаниями-партнерами, заказчиками и поставщиками
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-blue-500 mb-4">
                <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Работа со сделками</h3>
              <p className="text-gray-500">
                Создавайте и отслеживайте сделки по продаже сырья, доставке и утилизации
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-blue-500 mb-4">
                <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Отчеты и аналитика</h3>
              <p className="text-gray-500">
                Получайте отчеты по сделкам, прибыли и эффективности работы менеджеров
              </p>
            </div>
          </div>
        )}

        {user && (
          <div className="mt-16 bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Быстрые действия</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/new-deal"
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-medium text-gray-900 mb-2">Создать сделку</h3>
                <p className="text-sm text-gray-500">Начните новую сделку по продаже, доставке или утилизации</p>
              </Link>

              <Link
                href="/deals"
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-medium text-gray-900 mb-2">Мои сделки</h3>
                <p className="text-sm text-gray-500">Просмотр и управление вашими текущими сделками</p>
              </Link>

              {user.admin && (
                <Link
                  href="/admin"
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <h3 className="font-medium text-gray-900 mb-2">Администрирование</h3>
                  <p className="text-sm text-gray-500">Управление пользователями и всеми сделками</p>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
