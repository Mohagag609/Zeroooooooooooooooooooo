'use client'

import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        <Card className="w-full max-w-sm mx-auto">
          <CardContent className="p-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="mx-auto w-16 h-16 border-4 border-primary border-t-transparent rounded-full mb-4"
            />
            <h2 className="text-xl font-semibold mb-2">جاري التحميل...</h2>
            <p className="text-muted-foreground">يرجى الانتظار قليلاً</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}