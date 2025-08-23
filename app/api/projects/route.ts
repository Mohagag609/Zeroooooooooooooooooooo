import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { projectSchema } from '@/lib/validations'
import { generateId } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status')
    const clientId = searchParams.get('clientId')

    const where = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { code: { contains: search, mode: 'insensitive' as const } },
          { location: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
      ...(status && { status: status as 'active' | 'paused' | 'closed' }),
      ...(clientId && { clientId }),
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          client: {
            select: {
              id: true,
              name: true,
              phone: true,
            },
          },
          phases: {
            select: {
              id: true,
              name: true,
              startDate: true,
              endDate: true,
              progress: true,
            },
          },
          partners: {
            include: {
              partner: {
                select: {
                  id: true,
                  name: true,
                  type: true,
                },
              },
            },
          },
          _count: {
            select: {
              phases: true,
              partners: true,
              materialMoves: true,
            },
          },
        },
      }),
      prisma.project.count({ where }),
    ])

    return NextResponse.json({
      projects,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'فشل في جلب بيانات المشاريع' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = projectSchema.parse(body)

    const project = await prisma.project.create({
      data: {
        id: generateId(),
        ...validatedData,
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        phases: true,
        partners: {
          include: {
            partner: {
              select: {
                id: true,
                name: true,
                type: true,
              },
            },
          },
        },
        _count: {
          select: {
            phases: true,
            partners: true,
            materialMoves: true,
          },
        },
      },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        id: generateId(),
        action: 'CREATE',
        entity: 'Project',
        entityId: project.id,
        meta: {
          createdProject: validatedData,
        },
      },
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'رمز المشروع مستخدم بالفعل' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'فشل في إنشاء المشروع' },
      { status: 500 }
    )
  }
}