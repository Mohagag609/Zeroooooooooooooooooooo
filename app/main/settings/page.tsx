export const dynamic = "force-dynamic";

'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Settings, Plus } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">الإعدادات</h1>
          <p className="text-muted-foreground">
            إدارة إعدادات النظام والشركة
          </p>
        </div>
      </div>

      {/* Settings Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>إعدادات عامة</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              إعدادات الشركة الأساسية والمعلومات العامة
            </p>
            <Button variant="outline" className="w-full">
              تعديل الإعدادات
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>إعدادات المستخدمين</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              إدارة المستخدمين والصلاحيات
            </p>
            <Button variant="outline" className="w-full">
              إدارة المستخدمين
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>إعدادات النظام</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              إعدادات النظام التقنية
            </p>
            <Button variant="outline" className="w-full">
              إعدادات النظام
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>النسخ الاحتياطية</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              إدارة النسخ الاحتياطية واستعادة البيانات
            </p>
            <Button variant="outline" className="w-full">
              إدارة النسخ الاحتياطية
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>التقارير</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              إعدادات التقارير والتصدير
            </p>
            <Button variant="outline" className="w-full">
              إعدادات التقارير
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>الأمان</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              إعدادات الأمان والخصوصية
            </p>
            <Button variant="outline" className="w-full">
              إعدادات الأمان
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}