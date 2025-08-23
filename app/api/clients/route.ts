import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { clientSchema } from '@/lib/validations'
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

    const [clients, total] = await Promise.all([
      prisma.client.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          projects: {
            select: {
              id: true,
              name: true,
              status: true,
            },
          },
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
              projects: true,
              invoices: true,
            },
          },
        },
      }),
      prisma.client.count({ where }),
    ])

    return NextResponse.json({
      clients,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching clients:', error)
    return NextResponse.json(
      { error: 'فشل في جلب بيانات العملاء' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = clientSchema.parse(body)

    const client = await prisma.client.create({
      data: {
        id: generateId(),
        ...validatedData,
      },
      include: {
        projects: true,
        invoices: true,
        _count: {
          select: {
            projects: true,
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
        entity: 'Client',
        entityId: client.id,
        changes: JSON.stringify(validatedData),
        userId: 'system', // Replace with actual user ID when auth is implemented
      },
    })

    return NextResponse.json(client, { status: 201 })
  } catch (error) {
    console.error('Error creating client:', error)
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني أو رقم الهاتف مستخدم بالفعل' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'فشل في إنشاء العميل' },
      { status: 500 }
    )
  }
}