'use client'

import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">نظام ERP للمقاولات</h1>
        
        <p className="text-gray-600 mb-8 text-lg">
          نظام متكامل لإدارة المشاريع والمقاولات
        </p>

        <div className="space-y-4">
          <Link 
            href="/dashboard" 
            className="block w-full px-6 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
          >
            🏠 الذهاب إلى لوحة التحكم
          </Link>
          
          <Link 
            href="/clients" 
            className="block w-full px-6 py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold"
          >
            👥 إدارة العملاء
          </Link>
          
          <Link 
            href="/projects" 
            className="block w-full px-6 py-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-semibold"
          >
            🏗️ إدارة المشاريع
          </Link>
          
          <Link 
            href="/suppliers" 
            className="block w-full px-6 py-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold"
          >
            🏪 إدارة الموردين
          </Link>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            نظام متطور لإدارة جميع جوانب أعمال المقاولات
          </p>
        </div>
      </div>
    </div>
  )
}