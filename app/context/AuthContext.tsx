'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User } from '@/lib/types'

interface AuthContextType {
    user: User | null
    login: (email: string, password: string) => Promise<void>
    register: (email: string, password: string) => Promise<void>
    logout: () => Promise<void>
    loading: boolean
    isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('token')
                if (token) {
                    const response = await fetch('https://appgrand.worldautogroup.ru/auth/me', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })
                    if (response.ok) {
                        const userData = await response.json()
                        setUser(userData)
                        setIsAdmin(userData.role === 'admin') // Предполагаем, что в ответе есть поле role
                    }
                }
            } catch (error) {
                console.error('Auth check failed:', error)
            } finally {
                setLoading(false)
            }
        }

        checkAuth()
    }, [])

    const login = async (email: string, password: string) => {
        const response = await fetch('https://appgrand.worldautogroup.ru/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })

        if (!response.ok) {
            throw new Error('Login failed')
        }

        const data = await response.json()
        localStorage.setItem('token', data.token)
        setUser(data.user)
        setIsAdmin(data.user.role === 'admin')
    }

    const register = async (email: string, password: string) => {
        const response = await fetch('https://appgrand.worldautogroup.ru/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })

        if (!response.ok) {
            throw new Error('Registration failed')
        }

        const data = await response.json()
        localStorage.setItem('token', data.token)
        setUser(data.user)
        setIsAdmin(false)
    }

    const logout = async () => {
        const token = localStorage.getItem('token')
        if (token) {
            await fetch('https://appgrand.worldautogroup.ru/auth/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
        }
        localStorage.removeItem('token')
        setUser(null)
        setIsAdmin(false)
    }

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, isAdmin }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}