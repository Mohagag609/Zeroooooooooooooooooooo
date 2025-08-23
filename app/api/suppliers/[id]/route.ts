import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { supplierSchema } from '@/lib/validations'
import { generateId } from '@/lib/utils'

interface Params {
  id: string
}

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const supplier = await prisma.supplier.findUnique({
      where: { id: params.id },
      include: {
        invoices: true,
        journalLines: {
          include: {
            entry: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            invoices: true,
            journalLines: true,
          },
        },
      },
    })

    if (!supplier) {
      return NextResponse.json(
        { error: 'المورد غير موجود' },
        { status: 404 }
      )
    }

    // Calculate supplier balance
    const balance = await prisma.journalLine.aggregate({
      where: {
        supplierId: params.id,
      },
      _sum: {
        debit: true,
        credit: true,
      },
    })

    const creditSum = balance._sum.credit ? Number(balance._sum.credit) : 0
    const debitSum = balance._sum.debit ? Number(balance._sum.debit) : 0
    const supplierBalance = creditSum - debitSum

    return NextResponse.json({
      ...supplier,
      balance: supplierBalance,
    })
  } catch (error) {
    console.error('Error fetching supplier:', error)
    return NextResponse.json(
      { error: 'فشل في جلب بيانات المورد' },
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
    const validatedData = supplierSchema.partial().parse(body)

    const existingSupplier = await prisma.supplier.findUnique({
      where: { id: params.id },
    })

    if (!existingSupplier) {
      return NextResponse.json(
        { error: 'المورد غير موجود' },
        { status: 404 }
      )
    }

    const supplier = await prisma.supplier.update({
      where: { id: params.id },
      data: validatedData,
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
        action: 'UPDATE',
        entity: 'Supplier',
        entityId: supplier.id,
        meta: {
          before: existingSupplier,
          after: validatedData,
        },
      },
    })

    return NextResponse.json(supplier)
  } catch (error) {
    console.error('Error updating supplier:', error)
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني أو رقم الهاتف مستخدم بالفعل' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'فشل في تحديث المورد' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const existingSupplier = await prisma.supplier.findUnique({
      where: { id: params.id },
      include: {
        invoices: true,
        journalLines: true,
      },
    })

    if (!existingSupplier) {
      return NextResponse.json(
        { error: 'المورد غير موجود' },
        { status: 404 }
      )
    }

    // Check if supplier has related records
    if (
      existingSupplier.invoices.length > 0 ||
      existingSupplier.journalLines.length > 0
    ) {
      return NextResponse.json(
        { error: 'لا يمكن حذف المورد لوجود معاملات مرتبطة به' },
        { status: 400 }
      )
    }

    await prisma.supplier.delete({
      where: { id: params.id },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        id: generateId(),
        action: 'DELETE',
        entity: 'Supplier',
        entityId: params.id,
        meta: {
          deletedSupplier: existingSupplier,
        },
      },
    })

    return NextResponse.json({ message: 'تم حذف المورد بنجاح' })
  } catch (error) {
    console.error('Error deleting supplier:', error)
    return NextResponse.json(
      { error: 'فشل في حذف المورد' },
      { status: 500 }
    )
  }
}