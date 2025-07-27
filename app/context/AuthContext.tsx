'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

// Утилита для работы с куками
const setCookie = (name: string, value: string) => {
  const domain = process.env.NODE_ENV === 'development'
    ? 'localhost'
    : '.worldautogroup.ru';

  document.cookie = `${name}=${value}; path=/; domain=${domain}; ${process.env.NODE_ENV === 'production' ? 'Secure; SameSite=None' : 'SameSite=Lax'
    }`;
}

const getCookie = (name: string) => {
  return document.cookie.split('; ').find(row => row.startsWith(`${name}=`))?.split('=')[1]
}

const removeCookie = (name: string) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
}

interface User {
  _id: string
  email: string
  admin: boolean | null
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  loading: boolean
  isAdmin: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<{
    user: User | null
    loading: boolean
    isAdmin: boolean
    error: string | null
  }>({
    user: null,
    loading: true,
    isAdmin: false,
    error: null
  })

  const router = useRouter()

  const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
    const token = getCookie('tg_news_bot_access_token');

    const headers = {
      'Content-Type': 'application/json',
      // ...(token && { 'Authorization': `Bearer ${token}` }),
      ...(token && { 'x-user-id': token }),
      ...options.headers
    };

    try {
      const response = await fetch(`https://appgrand.worldautogroup.ru${endpoint}`, {
        ...options,
        headers,
        credentials: 'include',
        mode: 'cors' // Явно указываем режим CORS
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Fetch error for ${endpoint}:`, error);
      throw error instanceof Error ? error : new Error('Network request failed');
    }
  };

  // Добавьте этот метод для обработки OPTIONS-запросов
  const handlePreflight = async (endpoint: string) => {
    await fetch(`https://appgrand.worldautogroup.ru${endpoint}`, {
      method: 'OPTIONS',
      headers: {
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type,Authorization',
        'Origin': window.location.origin
      }
    });
  };

  const checkAuth = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      // Сначала обрабатываем preflight
      await handlePreflight('/auth/me');

      // Затем основной запрос
      const userData = await fetchWithAuth('/auth/me');
      setState({
        user: userData,
        isAdmin: userData?.admin === true,
        loading: false,
        error: null
      });
    } catch (error) {
      setState({
        user: null,
        isAdmin: false,
        loading: false,
        error: error instanceof Error ? error.message : 'Auth check failed'
      });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))

      const response = await fetch('https://appgrand.worldautogroup.ru/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData?.detail || 'Login failed')
      }

      const { access_token } = await response.json()

      // Сохраняем токен в куки
      setCookie('tg_news_bot_access_token', access_token)

      // Проверяем что кука установилась
      if (!getCookie('tg_news_bot_access_token')) {
        throw new Error('Failed to set auth cookie')
      }

      await checkAuth()
      router.push('/deals')
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Login failed'
      }))
      throw error
    }
  }

  const logout = async () => {
    try {
      await fetchWithAuth('/auth/logout', { method: 'POST' })
    } finally {
      removeCookie('tg_news_bot_access_token')
      setState({
        user: null,
        isAdmin: false,
        loading: false,
        error: null
      })
      router.push('/login')
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  return (
    <AuthContext.Provider value={{
      user: state.user,
      login,
      logout,
      loading: state.loading,
      isAdmin: state.isAdmin,
      error: state.error
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}