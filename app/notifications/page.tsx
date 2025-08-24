'use client'

import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { formatDate } from '@/lib/utils'
import { Bell, Eye, Trash2, Check, AlertTriangle, Info, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Define the Notification type
interface Notification {
  id: string
  title: string
  message: string
  type: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS'
  category: 'SYSTEM' | 'FINANCIAL' | 'PROJECT' | 'INVENTORY' | 'USER'
  isRead: boolean
  createdAt: Date
  readAt: Date | null
}

const columns: ColumnDef<Notification>[] = [
  {
    accessorKey: 'type',
    header: 'النوع',
    cell: ({ row }) => {
      const type = row.getValue('type') as string
      const typeConfig = {
        INFO: { label: 'معلومات', variant: 'default' as const, icon: Info },
        WARNING: { label: 'تحذير', variant: 'warning' as const, icon: AlertTriangle },
        ERROR: { label: 'خطأ', variant: 'destructive' as const, icon: AlertTriangle },
        SUCCESS: { label: 'نجح', variant: 'success' as const, icon: Check },
      }
      const config = typeConfig[type as keyof typeof typeConfig]
      const Icon = config.icon
      
      return (
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4" />
          <Badge variant={config.variant} className="text-xs">
            {config.label}
          </Badge>
        </div>
      )
    },
  },
  {
    accessorKey: 'title',
    header: 'العنوان',
    cell: ({ row }) => {
      const notification = row.original
      return (
        <div className="flex flex-col">
          <div className={`font-medium ${!notification.isRead ? 'font-bold' : ''}`}>
            {notification.title}
          </div>
          <div className="text-sm text-muted-foreground">
            {notification.message}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'category',
    header: 'الفئة',
    cell: ({ row }) => {
      const category = row.getValue('category') as string
      const categoryConfig = {
        SYSTEM: { label: 'النظام', variant: 'outline' as const },
        FINANCIAL: { label: 'مالي', variant: 'outline' as const },
        PROJECT: { label: 'مشروع', variant: 'outline' as const },
        INVENTORY: { label: 'مخزون', variant: 'outline' as const },
        USER: { label: 'مستخدم', variant: 'outline' as const },
      }
      const config = categoryConfig[category as keyof typeof categoryConfig]
      
      return (
        <Badge variant={config.variant} className="text-xs">
          {config.label}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'isRead',
    header: 'الحالة',
    cell: ({ row }) => {
      const isRead = row.getValue('isRead') as boolean
      return (
        <Badge variant={isRead ? 'secondary' : 'default'} className="text-xs">
          {isRead ? 'مقروء' : 'جديد'}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'التاريخ',
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-1 text-sm">
          <Calendar className="h-3 w-3 text-muted-foreground" />
          {formatDate(row.getValue('createdAt'))}
        </div>
      )
    },
  },
  {
    id: 'actions',
    header: 'الإجراءات',
    cell: ({ row }) => {
      const notification = row.original
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleMarkAsRead(notification.id)}
            disabled={notification.isRead}
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleView(notification.id)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(notification.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    },
  },
]

// Mock functions for actions
const handleMarkAsRead = (id: string) => {
  console.log('Mark as read:', id)
}

const handleView = (id: string) => {
  console.log('View notification:', id)
}

const handleDelete = (id: string) => {
  console.log('Delete notification:', id)
}

const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
  console.log('Export notifications:', format)
}

const handlePrint = () => {
  console.log('Print notifications')
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = React.useState<Notification[]>([])
  const [loading, setLoading] = React.useState(true)

  // Mock data - replace with actual API call
  React.useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data
      const mockNotifications: Notification[] = [
        {
          id: '1',
          title: 'فاتورة جديدة',
          message: 'تم إنشاء فاتورة جديدة للعميل أحمد محمد',
          type: 'INFO',
          category: 'FINANCIAL',
          isRead: false,
          createdAt: new Date('2024-03-15T10:30:00'),
          readAt: null,
        },
        {
          id: '2',
          title: 'مشروع مكتمل',
          message: 'تم الانتهاء من مرحلة الأساسات في مشروع فيلا الرياض',
          type: 'SUCCESS',
          category: 'PROJECT',
          isRead: false,
          createdAt: new Date('2024-03-15T09:15:00'),
          readAt: null,
        },
        {
          id: '3',
          title: 'تحذير مخزون',
          message: 'كمية الأسمنت في المخزن الرئيسي أقل من الحد الأدنى',
          type: 'WARNING',
          category: 'INVENTORY',
          isRead: true,
          createdAt: new Date('2024-03-14T16:45:00'),
          readAt: new Date('2024-03-14T17:00:00'),
        },
        {
          id: '4',
          title: 'خطأ في النظام',
          message: 'حدث خطأ أثناء معالجة المعاملة المالية',
          type: 'ERROR',
          category: 'SYSTEM',
          isRead: false,
          createdAt: new Date('2024-03-14T14:20:00'),
          readAt: null,
        },
        {
          id: '5',
          title: 'نسخة احتياطية مكتملة',
          message: 'تم إنشاء نسخة احتياطية جديدة بنجاح',
          type: 'SUCCESS',
          category: 'SYSTEM',
          isRead: true,
          createdAt: new Date('2024-03-14T02:00:00'),
          readAt: new Date('2024-03-14T08:30:00'),
        },
        {
          id: '6',
          title: 'تحديث النظام',
          message: 'تم تحديث النظام إلى الإصدار الجديد',
          type: 'INFO',
          category: 'SYSTEM',
          isRead: true,
          createdAt: new Date('2024-03-13T12:00:00'),
          readAt: new Date('2024-03-13T12:05:00'),
        },
      ]
      
      setNotifications(mockNotifications)
      setLoading(false)
    }

    fetchNotifications()
  }, [])

  // Calculate statistics
  const totalNotifications = notifications.length
  const unreadNotifications = notifications.filter(n => !n.isRead).length
  const readNotifications = notifications.filter(n => n.isRead).length

  const typeFilters = [
    { label: 'معلومات', value: 'INFO' },
    { label: 'تحذير', value: 'WARNING' },
    { label: 'خطأ', value: 'ERROR' },
    { label: 'نجح', value: 'SUCCESS' },
  ]

  const categoryFilters = [
    { label: 'النظام', value: 'SYSTEM' },
    { label: 'مالي', value: 'FINANCIAL' },
    { label: 'مشروع', value: 'PROJECT' },
    { label: 'مخزون', value: 'INVENTORY' },
    { label: 'مستخدم', value: 'USER' },
  ]

  const statusFilters = [
    { label: 'جديد', value: 'false' },
    { label: 'مقروء', value: 'true' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">الإشعارات</h1>
          <p className="text-muted-foreground">
            عرض وإدارة جميع إشعارات النظام
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            تحديد الكل كمقروء
          </Button>
          <Button variant="outline">
            حذف المقروءة
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الإشعارات</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalNotifications}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إشعارات جديدة</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{unreadNotifications}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إشعارات مقروءة</CardTitle>
            <Check className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{readNotifications}</div>
          </CardContent>
        </Card>
      </div>

      <DataTable
        columns={columns}
        data={notifications}
        searchPlaceholder="البحث في الإشعارات..."
        filters={[
          {
            key: 'type',
            label: 'النوع',
            options: typeFilters,
          },
          {
            key: 'category',
            label: 'الفئة',
            options: categoryFilters,
          },
          {
            key: 'isRead',
            label: 'الحالة',
            options: statusFilters,
          },
        ]}
        onExport={handleExport}
        onPrint={handlePrint}
        enableSelection={true}
        title="قائمة الإشعارات"
        description={`إجمالي ${totalNotifications} إشعار`}
        loading={loading}
        emptyMessage="لا توجد إشعارات"
      />
    </motion.div>
  )
}