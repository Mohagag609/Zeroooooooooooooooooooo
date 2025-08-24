import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { revenueSchema } from '@/lib/validations'
import { generateId } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const projectId = searchParams.get('projectId')
    const clientId = searchParams.get('clientId')
    const fromDate = searchParams.get('fromDate')
    const toDate = searchParams.get('toDate')

    const where = {
      ...(search && {
        OR: [
          { note: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
      ...(projectId && { projectId }),
      ...(clientId && { clientId }),
      ...(fromDate && toDate && {
        date: {
          gte: new Date(fromDate),
          lte: new Date(toDate),
        },
      }),
    }

    const [revenues, total] = await Promise.all([
      prisma.revenue.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { date: 'desc' },
        include: {
          project: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
          client: {
            select: {
              id: true,
              name: true,
            },
          },
          account: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
        },
      }),
      prisma.revenue.count({ where }),
    ])

    return NextResponse.json({
      revenues,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching revenues:', error)
    return NextResponse.json(
      { error: 'فشل في جلب بيانات الإيرادات' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = revenueSchema.parse(body)

    const revenue = await prisma.revenue.create({
      data: {
        id: generateId(),
        ...validatedData,
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        client: {
          select: {
            id: true,
            name: true,
          },
        },
        account: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        id: generateId(),
        action: 'CREATE',
        entity: 'Revenue',
        entityId: revenue.id,
        meta: {
          createdRevenue: validatedData,
        },
      },
    })

    return NextResponse.json(revenue, { status: 201 })
  } catch (error) {
    console.error('Error creating revenue:', error)
    return NextResponse.json(
      { error: 'فشل في إنشاء الإيراد' },
      { status: 500 }
    )
  }
}