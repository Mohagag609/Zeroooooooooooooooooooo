'use client'

import { useState, useEffect } from 'react'

export default function TestPage() {
  const [status, setStatus] = useState('جاري التحقق...')
  const [clients, setClients] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    const testConnection = async () => {
      try {
        setStatus('جاري اختبار الاتصال بقاعدة البيانات...')
        
        const response = await fetch('/api/clients')
        
        if (response.ok) {
          const data = await response.json()
          setClients(data.clients || [])
          setStatus('✅ الاتصال بقاعدة البيانات يعمل بشكل صحيح!')
        } else {
          const errorData = await response.json()
          setError(`❌ خطأ في API: ${errorData.error || response.statusText}`)
          setStatus('فشل في الاتصال')
        }
      } catch (err) {
        setError(`❌ خطأ في الشبكة: ${err.message}`)
        setStatus('فشل في الاتصال')
      }
    }

    testConnection()
  }, [])

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">اختبار النظام</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">حالة قاعدة البيانات</h2>
          <p className="text-lg">{status}</p>
          {error && (
            <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded">
              <p className="text-red-700">{error}</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">بيانات العملاء</h2>
          {clients.length > 0 ? (
            <div>
              <p className="text-green-600 mb-4">✅ تم العثور على {clients.length} عميل</p>
              <div className="space-y-2">
                {clients.slice(0, 5).map((client, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded">
                    <p><strong>الاسم:</strong> {client.name || 'غير محدد'}</p>
                    <p><strong>الهاتف:</strong> {client.phone || 'غير محدد'}</p>
                    <p><strong>الرمز:</strong> {client.code || 'غير محدد'}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-500">لا توجد بيانات عملاء</p>
          )}
        </div>

        <div className="mt-6 text-center">
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            إعادة اختبار
          </button>
        </div>
      </div>
    </div>
  )
}