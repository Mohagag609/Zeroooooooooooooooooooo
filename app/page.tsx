'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function HomePage() {
  const [systemStatus, setSystemStatus] = useState('جاري التحقق...')

  useEffect(() => {
    const checkSystem = async () => {
      try {
        const response = await fetch('/api/test')
        if (response.ok) {
          setSystemStatus('النظام يعمل بشكل صحيح ✅')
        } else {
          setSystemStatus('هناك مشكلة في النظام ❌')
        }
      } catch (error) {
        setSystemStatus('خطأ في الاتصال ❌')
      }
    }

    checkSystem()
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center max-w-md mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">نظام ERP للمقاولات</h1>
        
        <div className="mb-6 p-4 bg-gray-100 rounded-lg">
          <p className="text-lg">{systemStatus}</p>
        </div>

        <div className="space-y-4">
          <Link 
            href="/dashboard" 
            className="block w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            الذهاب إلى لوحة التحكم
          </Link>
          
          <Link 
            href="/test" 
            className="block w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            اختبار النظام
          </Link>
          
          <Link 
            href="/clients" 
            className="block w-full px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            إدارة العملاء
          </Link>
        </div>
      </div>
    </div>
  )
}