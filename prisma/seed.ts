import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create default accounts
  const assetAccount = await prisma.account.upsert({
    where: { code: '1000' },
    update: {},
    create: {
      code: '1000',
      name: 'النقد في الصندوق',
      type: 'asset',
    },
  })

  const revenueAccount = await prisma.account.upsert({
    where: { code: '4000' },
    update: {},
    create: {
      code: '4000',
      name: 'إيرادات المشاريع',
      type: 'revenue',
    },
  })

  const expenseAccount = await prisma.account.upsert({
    where: { code: '5000' },
    update: {},
    create: {
      code: '5000',
      name: 'مصروفات المشاريع',
      type: 'expense',
    },
  })

  // Create default warehouse
  const warehouse = await prisma.warehouse.upsert({
    where: { id: 'default-warehouse' },
    update: {},
    create: {
      id: 'default-warehouse',
      name: 'المخزن الرئيسي',
      location: 'المكتب الرئيسي',
    },
  })

  // Create default cashbox
  const cashbox = await prisma.cashbox.upsert({
    where: { code: 'CASH-001' },
    update: {},
    create: {
      code: 'CASH-001',
      name: 'الصندوق الرئيسي',
      type: 'cash',
      accountId: assetAccount.id,
    },
  })

  console.log('Database seeded successfully')
  console.log({ assetAccount, revenueAccount, expenseAccount, warehouse, cashbox })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })