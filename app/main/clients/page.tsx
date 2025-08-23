'use client'

export const dynamic = "force-dynamic";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Users, Plus, Phone, Mail, MapPin } from 'lucide-react'

// Mock data for clients
const mockClients = [
  {
    id: '1',
    name: 'أحمد محمد',
    email: 'ahmed@example.com',
    phone: '+966501234567',
    address: 'الرياض، المملكة العربية السعودية',
    code: 'CL001',
    status: 'ACTIVE',
    createdAt: new Date('2024-01-15'),
    balance: 125000,
    projectsCount: 3,
    invoicesCount: 8
  },
  {
    id: '2',
    name: 'فاطمة علي',
    email: 'fatima@example.com',
    phone: '+966502345678',
    address: 'جدة، المملكة العربية السعودية',
    code: 'CL002',
    status: 'ACTIVE',
    createdAt: new Date('2024-02-20'),
    balance: 75000,
    projectsCount: 2,
    invoicesCount: 5
  },
  {
    id: '3',
    name: 'محمد عبدالله',
    email: 'mohammed@example.com',
    phone: '+966503456789',
    address: 'الدمام، المملكة العربية السعودية',
    code: 'CL003',
    status: 'INACTIVE',
    createdAt: new Date('2024-01-10'),
    balance: 45000,
    projectsCount: 1,
    invoicesCount: 3
  },
  {
    id: '4',
    name: 'سارة أحمد',
    email: 'sara@example.com',
    phone: '+966504567890',
    address: 'مكة المكرمة، المملكة العربية السعودية',
    code: 'CL004',
    status: 'ACTIVE',
    createdAt: new Date('2024-03-05'),
    balance: 200000,
    projectsCount: 4,
    invoicesCount: 12
  },
  {
    id: '5',
    name: 'علي حسن',
    email: 'ali@example.com',
    phone: '+966505678901',
    address: 'المدينة المنورة، المملكة العربية السعودية',
    code: 'CL005',
    status: 'ACTIVE',
    createdAt: new Date('2024-02-28'),
    balance: 95000,
    projectsCount: 2,
    invoicesCount: 6
  }
]

export default function ClientsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">إدارة العملاء</h1>
          <p className="text-muted-foreground">
            إدارة وعرض جميع عملاء الشركة ومعلوماتهم
          </p>
        </div>
        <Button>
          <Plus className="ml-2 h-4 w-4" />
          إضافة عميل جديد
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي العملاء</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockClients.length}</div>
            <p className="text-xs text-muted-foreground">
              عميل مسجل
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">العملاء النشطين</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {mockClients.filter(c => c.status === 'ACTIVE').length}
            </div>
            <p className="text-xs text-muted-foreground">
              عميل نشط
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المشاريع</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockClients.reduce((sum, client) => sum + client.projectsCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              مشروع
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الفواتير</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockClients.reduce((sum, client) => sum + client.invoicesCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              فاتورة
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Clients List */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة العملاء</CardTitle>
        </CardHeader>
        <CardContent>
          {mockClients.length > 0 ? (
            <div className="space-y-4">
              {mockClients.map((client) => (
                <div key={client.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">{client.name}</h3>
                      <p className="text-sm text-muted-foreground">{client.code}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        {client.phone && (
                          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            <span>{client.phone}</span>
                          </div>
                        )}
                        {client.email && (
                          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            <span>{client.email}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(client.balance)}</p>
                      <p className="text-xs text-muted-foreground">الرصيد</p>
                    </div>
                    <Badge variant={client.status === 'ACTIVE' ? 'success' : 'secondary'}>
                      {client.status === 'ACTIVE' ? 'نشط' : 'غير نشط'}
                    </Badge>
                    <Button variant="outline" size="sm">
                      عرض التفاصيل
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">لا توجد بيانات عملاء</h3>
              <p className="text-muted-foreground">
                لم يتم تسجيل أي عملاء بعد. ابدأ بإضافة عميل جديد.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}