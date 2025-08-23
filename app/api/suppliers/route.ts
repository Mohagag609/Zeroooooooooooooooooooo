import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { supplierSchema } from '@/lib/validations'
import { generateId } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status')

    const where = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } },
          { phone: { contains: search, mode: 'insensitive' as const } },
          { code: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
      ...(status && { status }),
    }

    const [suppliers, total] = await Promise.all([
      prisma.supplier.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          invoices: {
            select: {
              id: true,
              number: true,
              status: true,
              total: true,
            },
          },
          _count: {
            select: {
              invoices: true,
            },
          },
        },
      }),
      prisma.supplier.count({ where }),
    ])

    return NextResponse.json({
      suppliers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching suppliers:', error)
    return NextResponse.json(
      { error: 'فشل في جلب بيانات الموردين' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = supplierSchema.parse(body)

    const supplier = await prisma.supplier.create({
      data: {
        id: generateId(),
        ...validatedData,
      },
      include: {
        invoices: true,
        _count: {
          select: {
            invoices: true,
          },
        },
      },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        id: generateId(),
        action: 'CREATE',
        entity: 'Supplier',
        entityId: supplier.id,
        meta: {
          createdSupplier: validatedData,
        },
      },
    })

    return NextResponse.json(supplier, { status: 201 })
  } catch (error) {
    console.error('Error creating supplier:', error)
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني أو رقم الهاتف مستخدم بالفعل' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'فشل في إنشاء المورد' },
      { status: 500 }
    )
  }
}