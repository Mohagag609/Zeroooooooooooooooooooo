import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { clientSchema } from '@/lib/validations'
import { generateId } from '@/lib/utils'

interface Params {
  id: string
}

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const client = await prisma.client.findUnique({
      where: { id: params.id },
      include: {
        projects: {
          include: {
            phases: true,
            _count: {
              select: {
                phases: true,
              },
            },
          },
        },
        invoices: {
          include: {
            lines: true,
          },
        },
        journalLines: {
          include: {
            journalEntry: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            projects: true,
            invoices: true,
            journalLines: true,
          },
        },
      },
    })

    if (!client) {
      return NextResponse.json(
        { error: 'العميل غير موجود' },
        { status: 404 }
      )
    }

    // Calculate client balance
    const balance = await prisma.journalLine.aggregate({
      where: {
        clientId: params.id,
      },
      _sum: {
        debit: true,
        credit: true,
      },
    })

    const clientBalance = (balance._sum.debit || 0) - (balance._sum.credit || 0)

    return NextResponse.json({
      ...client,
      balance: clientBalance,
    })
  } catch (error) {
    console.error('Error fetching client:', error)
    return NextResponse.json(
      { error: 'فشل في جلب بيانات العميل' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const body = await request.json()
    const validatedData = clientSchema.partial().parse(body)

    const existingClient = await prisma.client.findUnique({
      where: { id: params.id },
    })

    if (!existingClient) {
      return NextResponse.json(
        { error: 'العميل غير موجود' },
        { status: 404 }
      )
    }

    const client = await prisma.client.update({
      where: { id: params.id },
      data: validatedData,
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
        action: 'UPDATE',
        entity: 'Client',
        entityId: client.id,
        changes: JSON.stringify({
          before: existingClient,
          after: validatedData,
        }),
        userId: 'system', // Replace with actual user ID when auth is implemented
      },
    })

    return NextResponse.json(client)
  } catch (error) {
    console.error('Error updating client:', error)
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني أو رقم الهاتف مستخدم بالفعل' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'فشل في تحديث العميل' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const existingClient = await prisma.client.findUnique({
      where: { id: params.id },
      include: {
        projects: true,
        invoices: true,
        journalLines: true,
      },
    })

    if (!existingClient) {
      return NextResponse.json(
        { error: 'العميل غير موجود' },
        { status: 404 }
      )
    }

    // Check if client has related records
    if (
      existingClient.projects.length > 0 ||
      existingClient.invoices.length > 0 ||
      existingClient.journalLines.length > 0
    ) {
      return NextResponse.json(
        { error: 'لا يمكن حذف العميل لوجود معاملات مرتبطة به' },
        { status: 400 }
      )
    }

    await prisma.client.delete({
      where: { id: params.id },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        id: generateId(),
        action: 'DELETE',
        entity: 'Client',
        entityId: params.id,
        changes: JSON.stringify(existingClient),
        userId: 'system', // Replace with actual user ID when auth is implemented
      },
    })

    return NextResponse.json({ message: 'تم حذف العميل بنجاح' })
  } catch (error) {
    console.error('Error deleting client:', error)
    return NextResponse.json(
      { error: 'فشل في حذف العميل' },
      { status: 500 }
    )
  }
}