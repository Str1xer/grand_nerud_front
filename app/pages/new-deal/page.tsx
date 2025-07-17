'use client'

import { useState, useEffect } from 'react'
import { DealForm } from '@/app/components/DealForm'
import { Service, Stage, Material, Company } from '@/lib/types'
import { useAuth } from '@/app/context/AuthContext'

export default function NewDealPage() {
  const { user } = useAuth()
  const [services, setServices] = useState<Service[]>([])
  const [stages, setStages] = useState<Stage[]>([])
  const [materials, setMaterials] = useState<Material[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token')
        
        const [servicesRes, stagesRes, materialsRes, companiesRes] = await Promise.all([
          fetch('https://appgrand.worldautogroup.ru/services', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('https://appgrand.worldautogroup.ru/stages', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('https://appgrand.worldautogroup.ru/materials', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('https://appgrand.worldautogroup.ru/companies', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ])

        if (!servicesRes.ok || !stagesRes.ok || !materialsRes.ok || !companiesRes.ok) {
          throw new Error('Failed to fetch required data')
        }

        const [servicesData, stagesData, materialsData, companiesData] = await Promise.all([
          servicesRes.json(),
          stagesRes.json(),
          materialsRes.json(),
          companiesRes.json()
        ])

        setServices(servicesData)
        setStages(stagesData)
        setMaterials(materialsData)
        setCompanies(companiesData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  if (!user) {
    return (
      <div className="text-center py-10">
        <p>Пожалуйста, войдите чтобы создать сделку</p>
      </div>
    )
  }

  if (loading) {
    return <div className="text-center py-10">Загрузка данных...</div>
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>
  }

  return (
    <div className="py-8">
      <DealForm 
        services={services} 
        stages={stages} 
        materials={materials}
        companies={companies}
      />
    </div>
  )
}