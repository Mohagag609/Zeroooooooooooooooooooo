export const dynamic = "force-dynamic";

'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { Handshake, Plus } from 'lucide-react'

export default function PartnersPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">إدارة الشركاء</h1>
          <p className="text-muted-foreground">
            إدارة وعرض جميع شركاء الشركة
          </p>
        </div>
        <Button>
          <Plus className="ml-2 h-4 w-4" />
          إضافة شريك جديد
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الشركاء</CardTitle>
            <Handshake className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              شريك
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الشركاء النشطين</CardTitle>
            <Handshake className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">0</div>
            <p className="text-xs text-muted-foreground">
              شريك نشط
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الاستثمارات</CardTitle>
            <Handshake className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(0)}</div>
            <p className="text-xs text-muted-foreground">
              ريال
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الأرباح</CardTitle>
            <Handshake className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(0)}</div>
            <p className="text-xs text-muted-foreground">
              ريال
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Partners List */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة الشركاء</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Handshake className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">لا توجد بيانات شركاء</h3>
            <p className="text-muted-foreground">
              لم يتم تسجيل أي شركاء بعد. ابدأ بإضافة شريك جديد.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}