"use client"

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function NewMaterialPage() {
  const router = useRouter()
  const [name, setName] = React.useState('')
  const [unit, setUnit] = React.useState('')
  const [defaultUnitCost, setDefaultUnitCost] = React.useState<number | ''>('')
  const [submitting, setSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          unit,
          defaultUnitCost: typeof defaultUnitCost === 'number' ? defaultUnitCost : undefined,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'حدث خطأ أثناء الحفظ')
      }
      router.push('/materials')
    } catch (err: any) {
      setError(err?.message || 'خطأ غير متوقع')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto my-8">
      <Card>
        <CardHeader>
          <CardTitle>إضافة مادة جديدة</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">اسم المادة</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="unit">الوحدة</Label>
              <Input id="unit" value={unit} onChange={(e) => setUnit(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="cost">سعر الوحدة (اختياري)</Label>
              <Input
                id="cost"
                type="number"
                step="0.01"
                value={defaultUnitCost}
                onChange={(e) => setDefaultUnitCost(e.target.value === '' ? '' : Number(e.target.value))}
              />
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <div className="flex gap-2">
              <Button type="submit" disabled={submitting}>{submitting ? 'جارٍ الحفظ...' : 'حفظ'}</Button>
              <Button type="button" variant="outline" onClick={() => router.push('/materials')}>إلغاء</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}