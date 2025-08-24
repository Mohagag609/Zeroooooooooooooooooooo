import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { materialSchema } from '@/lib/validations'
import { generateId } from '@/lib/utils'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { unit: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {}

    const [materials, total] = await Promise.all([
      prisma.material.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: { select: { materialMoves: true } },
        },
      }),
      prisma.material.count({ where }),
    ])

    // Map to UI-friendly shape
    const rows = materials.map((m) => ({
      id: m.id,
      name: m.name,
      code: m.id.slice(0, 8).toUpperCase(),
      description: null as string | null,
      unit: m.unit,
      unitPrice: m.defaultUnitCost ? Number(m.defaultUnitCost as any) : 0,
      minQuantity: 0,
      currentQuantity: 0,
      category: '',
      status: 'ACTIVE' as const,
      createdAt: m.createdAt,
      _count: { materialMoves: (m as any)._count?.materialMoves ?? 0 },
    }))

    return NextResponse.json({
      materials: rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching materials:', error)
    return NextResponse.json(
      { error: 'فشل في جلب بيانات المواد' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = materialSchema.parse(body)

    const material = await prisma.material.create({
      data: {
        id: generateId(),
        name: validated.name,
        unit: validated.unit,
        defaultUnitCost: validated.defaultUnitCost ?? null,
      },
      include: {
        _count: { select: { materialMoves: true } },
      },
    })

    const row = {
      id: material.id,
      name: material.name,
      code: material.id.slice(0, 8).toUpperCase(),
      description: null as string | null,
      unit: material.unit,
      unitPrice: material.defaultUnitCost ? Number(material.defaultUnitCost as any) : 0,
      minQuantity: 0,
      currentQuantity: 0,
      category: '',
      status: 'ACTIVE' as const,
      createdAt: material.createdAt,
      _count: { materialMoves: (material as any)._count?.materialMoves ?? 0 },
    }

    return NextResponse.json(row, { status: 201 })
  } catch (error) {
    console.error('Error creating material:', error)
    return NextResponse.json(
      { error: 'فشل في إنشاء المادة' },
      { status: 500 }
    )
  }
}