import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ERP نظام مقاولات محاسبي',
  description: 'نظام إدارة المشاريع والمحاسبة الشامل للمقاولات',
  keywords: ['ERP', 'مقاولات', 'محاسبة', 'مشاريع', 'إدارة'],
  authors: [{ name: 'شركة المقاولات المتحدة' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'ERP نظام مقاولات محاسبي',
    description: 'نظام إدارة المشاريع والمحاسبة الشامل للمقاولات',
    type: 'website',
    locale: 'ar_SA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ERP نظام مقاولات محاسبي',
    description: 'نظام إدارة المشاريع والمحاسبة الشامل للمقاولات',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-background font-sans antialiased">
            {children}
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}