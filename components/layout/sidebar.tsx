'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  Building2,
  FolderOpen,
  Package,
  Warehouse,
  TrendingUp,
  TrendingDown,
  FileText,
  Wallet,
  ArrowLeftRight,
  UserCheck,
  DollarSign,
  UsersIcon,
  FileBarChart,
  Settings,
  Bell,
  HardDrive,
  ChevronLeft,
  ChevronRight,
  Menu,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface SidebarProps {
  className?: string
}

const navigationItems = [
  {
    title: 'لوحة التحكم',
    href: '/dashboard',
    icon: LayoutDashboard,
    badge: null,
  },
  {
    title: 'إدارة العملاء',
    icon: Users,
    children: [
      { title: 'قائمة العملاء', href: '/clients' },
      { title: 'إضافة عميل', href: '/clients/new' },
    ],
  },
  {
    title: 'إدارة الموردين',
    icon: Building2,
    children: [
      { title: 'قائمة الموردين', href: '/suppliers' },
      { title: 'إضافة مورد', href: '/suppliers/new' },
    ],
  },
  {
    title: 'إدارة المشاريع',
    icon: FolderOpen,
    children: [
      { title: 'قائمة المشاريع', href: '/projects' },
      { title: 'إضافة مشروع', href: '/projects/new' },
      { title: 'مراحل المشاريع', href: '/projects/phases' },
    ],
  },
  {
    title: 'إدارة المواد',
    icon: Package,
    children: [
      { title: 'قائمة المواد', href: '/materials' },
      { title: 'إضافة مادة', href: '/materials/new' },
      { title: 'حركات المواد', href: '/materials/moves' },
    ],
  },
  {
    title: 'إدارة المخازن',
    icon: Warehouse,
    children: [
      { title: 'قائمة المخازن', href: '/warehouses' },
      { title: 'إضافة مخزن', href: '/warehouses/new' },
      { title: 'تقارير المخزون', href: '/warehouses/reports' },
    ],
  },
  {
    title: 'الإيرادات',
    icon: TrendingUp,
    children: [
      { title: 'قائمة الإيرادات', href: '/revenues' },
      { title: 'إضافة إيراد', href: '/revenues/new' },
    ],
  },
  {
    title: 'المصروفات',
    icon: TrendingDown,
    children: [
      { title: 'قائمة المصروفات', href: '/expenses' },
      { title: 'إضافة مصروف', href: '/expenses/new' },
    ],
  },
  {
    title: 'الفواتير',
    icon: FileText,
    children: [
      { title: 'فواتير العملاء', href: '/invoices/clients' },
      { title: 'فواتير الموردين', href: '/invoices/suppliers' },
      { title: 'إنشاء فاتورة', href: '/invoices/new' },
    ],
  },
  {
    title: 'الخزائن والبنوك',
    icon: Wallet,
    children: [
      { title: 'قائمة الخزائن', href: '/cashboxes' },
      { title: 'إضافة خزينة', href: '/cashboxes/new' },
    ],
  },
  {
    title: 'التحويلات',
    icon: ArrowLeftRight,
    children: [
      { title: 'قائمة التحويلات', href: '/transfers' },
      { title: 'إنشاء تحويل', href: '/transfers/new' },
    ],
  },
  {
    title: 'إدارة الموظفين',
    icon: UserCheck,
    children: [
      { title: 'قائمة الموظفين', href: '/employees' },
      { title: 'إضافة موظف', href: '/employees/new' },
    ],
  },
  {
    title: 'المرتبات',
    icon: DollarSign,
    children: [
      { title: 'قائمة المرتبات', href: '/payrolls' },
      { title: 'إنشاء مرتب', href: '/payrolls/new' },
    ],
  },
  {
    title: 'إدارة الشركاء',
    icon: UsersIcon,
    children: [
      { title: 'قائمة الشركاء', href: '/partners' },
      { title: 'إضافة شريك', href: '/partners/new' },
      { title: 'التسويات', href: '/partners/settlements' },
    ],
  },
  {
    title: 'التقارير المالية',
    icon: FileBarChart,
    children: [
      { title: 'ميزان المراجعة', href: '/reports/trial-balance' },
      { title: 'قائمة الدخل', href: '/reports/income-statement' },
      { title: 'الميزانية العمومية', href: '/reports/balance-sheet' },
      { title: 'أعمار الديون', href: '/reports/aging' },
      { title: 'تكاليف المراحل', href: '/reports/phase-costing' },
      { title: 'تقرير المواد', href: '/reports/materials' },
      { title: 'التدفق النقدي', href: '/reports/cashflow' },
    ],
  },
  {
    title: 'الإعدادات',
    icon: Settings,
    children: [
      { title: 'الإعدادات العامة', href: '/settings/general' },
      { title: 'دليل الحسابات', href: '/settings/accounts' },
      { title: 'النسخ الاحتياطي', href: '/settings/backup' },
      { title: 'إعادة تعيين البيانات', href: '/settings/reset' },
    ],
  },
  {
    title: 'الإشعارات',
    href: '/notifications',
    icon: Bell,
    badge: 3,
  },
]

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = React.useState(false)
  const [openItems, setOpenItems] = React.useState<string[]>([])

  const toggleCollapsed = () => {
    setCollapsed(!collapsed)
    if (!collapsed) {
      setOpenItems([])
    }
  }

  const toggleItem = (title: string) => {
    if (collapsed) return
    
    setOpenItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  const isItemActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  const isParentActive = (children: { href: string }[]) => {
    return children.some(child => isItemActive(child.href))
  }

  return (
    <motion.div
      animate={{
        width: collapsed ? 80 : 280,
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={cn(
        'flex flex-col border-l bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        className
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <HardDrive className="h-6 w-6 text-primary" />
            <span className="font-bold">نظام المحاسبة</span>
          </motion.div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleCollapsed}
          className="h-8 w-8"
        >
          {collapsed ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-4">
        {navigationItems.map((item) => {
          if (item.children) {
            const isOpen = openItems.includes(item.title)
            const isActive = isParentActive(item.children)
            
            return (
              <div key={item.title} className="space-y-1">
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start gap-2 h-10',
                    collapsed && 'justify-center px-2'
                  )}
                  onClick={() => toggleItem(item.title)}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-right">{item.title}</span>
                      <motion.div
                        animate={{ rotate: isOpen ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </motion.div>
                    </>
                  )}
                </Button>
                
                <AnimatePresence>
                  {isOpen && !collapsed && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-1 pr-6">
                        {item.children.map((child) => (
                          <Link key={child.href} href={child.href}>
                            <Button
                              variant={isItemActive(child.href) ? 'secondary' : 'ghost'}
                              className="w-full justify-start text-sm h-8"
                            >
                              {child.title}
                            </Button>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          }

          return (
            <Link key={item.href} href={item.href!}>
              <Button
                variant={isItemActive(item.href!) ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start gap-2 h-10',
                  collapsed && 'justify-center px-2'
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-right">{item.title}</span>
                    {item.badge && (
                      <Badge variant="destructive" className="h-5 w-5 p-0 text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </Button>
            </Link>
          )
        })}
      </nav>
    </motion.div>
  )
}