'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RefreshCw, Home, AlertTriangle } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
              className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4"
            >
              <AlertTriangle className="h-12 w-12 text-red-600" />
            </motion.div>
            <CardTitle className="text-2xl font-bold text-red-600">حدث خطأ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              عذراً، حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.
            </p>
            {process.env.NODE_ENV === 'development' && (
              <details className="text-left">
                <summary className="cursor-pointer text-sm text-muted-foreground">
                  تفاصيل الخطأ (للمطورين)
                </summary>
                <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto">
                  {error.message}
                </pre>
              </details>
            )}
            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={reset} className="flex-1">
                <RefreshCw className="ml-2 h-4 w-4" />
                إعادة المحاولة
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <Link href="/dashboard">
                  <Home className="ml-2 h-4 w-4" />
                  العودة للوحة التحكم
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}