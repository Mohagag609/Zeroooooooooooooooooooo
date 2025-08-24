'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Settings, 
  Save, 
  Database, 
  Cloud, 
  Shield, 
  Bell, 
  Palette,
  Globe,
  FileText,
  Users,
  Building
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function GeneralSettingsPage() {
  const [settings, setSettings] = React.useState({
    companyName: 'شركة المقاولات المتحدة',
    companyCode: 'COMP-001',
    fiscalYearStart: '01-01',
    defaultCurrency: 'SAR',
    language: 'ar',
    theme: 'system',
    backupFrequency: 'daily',
    backupRetention: '30',
    emailNotifications: true,
    smsNotifications: false,
    autoBackup: true,
  })

  const handleSave = () => {
    console.log('Saving settings:', settings)
    // TODO: Implement save functionality
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">الإعدادات العامة</h1>
          <p className="text-muted-foreground">
            إعدادات النظام والشركة الأساسية
          </p>
        </div>
        <Button onClick={handleSave}>
          <Save className="ml-2 h-4 w-4" />
          حفظ الإعدادات
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              معلومات الشركة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">اسم الشركة</Label>
              <Input
                id="companyName"
                value={settings.companyName}
                onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyCode">رمز الشركة</Label>
              <Input
                id="companyCode"
                value={settings.companyCode}
                onChange={(e) => setSettings({ ...settings, companyCode: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fiscalYearStart">بداية السنة المالية</Label>
              <Input
                id="fiscalYearStart"
                type="date"
                value={settings.fiscalYearStart}
                onChange={(e) => setSettings({ ...settings, fiscalYearStart: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="defaultCurrency">العملة الافتراضية</Label>
              <Select
                value={settings.defaultCurrency}
                onValueChange={(value) => setSettings({ ...settings, defaultCurrency: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SAR">ريال سعودي (SAR)</SelectItem>
                  <SelectItem value="USD">دولار أمريكي (USD)</SelectItem>
                  <SelectItem value="EUR">يورو (EUR)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              إعدادات النظام
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="language">اللغة</Label>
              <Select
                value={settings.language}
                onValueChange={(value) => setSettings({ ...settings, language: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ar">العربية</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="theme">المظهر</Label>
              <Select
                value={settings.theme}
                onValueChange={(value) => setSettings({ ...settings, theme: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">فاتح</SelectItem>
                  <SelectItem value="dark">داكن</SelectItem>
                  <SelectItem value="system">حسب النظام</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="backupFrequency">تكرار النسخ الاحتياطي</Label>
              <Select
                value={settings.backupFrequency}
                onValueChange={(value) => setSettings({ ...settings, backupFrequency: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">كل ساعة</SelectItem>
                  <SelectItem value="daily">يومياً</SelectItem>
                  <SelectItem value="weekly">أسبوعياً</SelectItem>
                  <SelectItem value="monthly">شهرياً</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="backupRetention">فترة الاحتفاظ بالنسخ (أيام)</Label>
              <Input
                id="backupRetention"
                type="number"
                value={settings.backupRetention}
                onChange={(e) => setSettings({ ...settings, backupRetention: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              الإشعارات
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailNotifications">إشعارات البريد الإلكتروني</Label>
                <p className="text-sm text-muted-foreground">
                  إرسال إشعارات عبر البريد الإلكتروني
                </p>
              </div>
              <Button
                variant={settings.emailNotifications ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSettings({ ...settings, emailNotifications: !settings.emailNotifications })}
              >
                {settings.emailNotifications ? 'مفعل' : 'معطل'}
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="smsNotifications">إشعارات الرسائل النصية</Label>
                <p className="text-sm text-muted-foreground">
                  إرسال إشعارات عبر الرسائل النصية
                </p>
              </div>
              <Button
                variant={settings.smsNotifications ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSettings({ ...settings, smsNotifications: !settings.smsNotifications })}
              >
                {settings.smsNotifications ? 'مفعل' : 'معطل'}
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="autoBackup">النسخ الاحتياطي التلقائي</Label>
                <p className="text-sm text-muted-foreground">
                  عمل نسخ احتياطي تلقائي حسب الجدول
                </p>
              </div>
              <Button
                variant={settings.autoBackup ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSettings({ ...settings, autoBackup: !settings.autoBackup })}
              >
                {settings.autoBackup ? 'مفعل' : 'معطل'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              حالة النظام
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">حالة قاعدة البيانات</span>
              <Badge variant="success">متصل</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">آخر نسخة احتياطية</span>
              <span className="text-sm text-muted-foreground">منذ ساعتين</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">حجم قاعدة البيانات</span>
              <span className="text-sm text-muted-foreground">2.5 GB</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">عدد المستخدمين النشطين</span>
              <span className="text-sm text-muted-foreground">3</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">إصدار النظام</span>
              <span className="text-sm text-muted-foreground">v1.0.0</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>إجراءات سريعة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Database className="h-6 w-6" />
              <span>نسخ احتياطي يدوي</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Cloud className="h-6 w-6" />
              <span>استعادة من نسخة احتياطية</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <FileText className="h-6 w-6" />
              <span>تصدير البيانات</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}