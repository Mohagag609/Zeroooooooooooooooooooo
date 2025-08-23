import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Test basic functionality
    const timestamp = new Date().toISOString()
    
    return NextResponse.json({
      status: 'success',
      message: 'النظام يعمل بشكل صحيح',
      timestamp,
      environment: process.env.NODE_ENV,
      database: process.env.DATABASE_URL ? 'متصل' : 'غير متصل'
    })
  } catch (error) {
    console.error('Test API Error:', error)
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'خطأ في النظام',
        error: error instanceof Error ? error.message : 'خطأ غير معروف'
      },
      { status: 500 }
    )
  }
}