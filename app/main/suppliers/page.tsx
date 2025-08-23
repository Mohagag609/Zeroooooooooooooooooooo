'use client'

export const dynamic = "force-dynamic";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { Building2, Plus, Phone, Mail, MapPin } from 'lucide-react'

// Mock data for suppliers
const mockSuppliers = [
  {
    id: '1',
    name: 'شركة مواد البناء المتحدة',
    email: 'info@building-materials.com',
    phone: '+966501234567',
    address: 'الرياض، المملكة العربية السعودية',
    code: 'SUP001',
    status: 'ACTIVE',
    balance: 85000,
    invoicesCount: 12,
    materialsCount: 25
  },
  {
    id: '2',
    name: 'مؤسسة الخدمات الهندسية',
    email: 'contact@engineering-services.com',
    phone: '+966502345678',
    address: 'جدة، المملكة العربية السعودية',
    code: 'SUP002',
    status: 'ACTIVE',
    balance: 125000,
    invoicesCount: 8,
    materialsCount: 15
  },
  {
    id: '3',
    name: 'شركة المعدات الثقيلة',
    email: 'sales@heavy-equipment.com',
    phone: '+966503456789',
    address: 'الدمام، المملكة العربية السعودية',
    code: 'SUP003',
    status: 'INACTIVE',
    balance: 45000,
    invoicesCount: 5,
    materialsCount: 8
  }
]

export default function SuppliersPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">إدارة الموردين</h1>
          <p className="text-muted-foreground">
            إدارة وعرض جميع موردي الشركة ومعلوماتهم
          </p>
        </div>
        <Button>
          <Plus className="ml-2 h-4 w-4" />
          إضافة مورد جديد
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الموردين</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockSuppliers.length}</div>
            <p className="text-xs text-muted-foreground">
              مورد مسجل
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الموردين النشطين</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {mockSuppliers.filter(s => s.status === 'ACTIVE').length}
            </div>
            <p className="text-xs text-muted-foreground">
              مورد نشط
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الفواتير</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockSuppliers.reduce((sum, supplier) => sum + supplier.invoicesCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              فاتورة
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المواد</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockSuppliers.reduce((sum, supplier) => sum + supplier.materialsCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              مادة
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Suppliers List */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة الموردين</CardTitle>
        </CardHeader>
        <CardContent>
          {mockSuppliers.length > 0 ? (
            <div className="space-y-4">
              {mockSuppliers.map((supplier) => (
                <div key={supplier.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">{supplier.name}</h3>
                      <p className="text-sm text-muted-foreground">{supplier.code}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        {supplier.phone && (
                          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            <span>{supplier.phone}</span>
                          </div>
                        )}
                        {supplier.email && (
                          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            <span>{supplier.email}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(supplier.balance)}</p>
                      <p className="text-xs text-muted-foreground">الرصيد</p>
                    </div>
                    <Badge variant={supplier.status === 'ACTIVE' ? 'success' : 'secondary'}>
                      {supplier.status === 'ACTIVE' ? 'نشط' : 'غير نشط'}
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
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">لا توجد بيانات موردين</h3>
              <p className="text-muted-foreground">
                لم يتم تسجيل أي موردين بعد. ابدأ بإضافة مورد جديد.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}