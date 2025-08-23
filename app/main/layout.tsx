'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  Users,
  Building2,
  Package,
  Warehouse,
  DollarSign,
  Receipt,
  FileText,
  ArrowLeftRight,
  UserCheck,
  CreditCard,
  Handshake,
  Settings,
  Menu,
  X,
  Home
} from 'lucide-react'

const sidebarItems = [
  {
    title: 'لوحة التحكم',
    href: '/main/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'العملاء',
    href: '/main/clients',
    icon: Users,
  },
  {
    title: 'الموردين',
    href: '/main/suppliers',
    icon: Building2,
  },
  {
    title: 'المشاريع',
    href: '/main/projects',
    icon: Package,
  },
  {
    title: 'المواد',
    href: '/main/materials',
    icon: Package,
  },
  {
    title: 'المخازن',
    href: '/main/warehouses',
    icon: Warehouse,
  },
  {
    title: 'الإيرادات',
    href: '/main/revenues',
    icon: DollarSign,
  },
  {
    title: 'المصروفات',
    href: '/main/expenses',
    icon: Receipt,
  },
  {
    title: 'الفواتير',
    href: '/main/invoices',
    icon: FileText,
  },
  {
    title: 'التحويلات',
    href: '/main/transfers',
    icon: ArrowLeftRight,
  },
  {
    title: 'الموظفين',
    href: '/main/employees',
    icon: UserCheck,
  },
  {
    title: 'المرتبات',
    href: '/main/payrolls',
    icon: CreditCard,
  },
  {
    title: 'الشركاء',
    href: '/main/partners',
    icon: Handshake,
  },
  {
    title: 'تسويات الشركاء',
    href: '/main/settlements',
    icon: Handshake,
  },
  {
    title: 'الإعدادات',
    href: '/main/settings',
    icon: Settings,
  },
]

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-6 border-b">
            <Link href="/main/dashboard" className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">نظام ERP</span>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="border-t p-4">
            <Link
              href="/"
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <Home className="h-4 w-4" />
              <span>العودة للرئيسية</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white border-b px-4 py-3 lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}