import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Minimal chart of accounts
  // Root accounts
  const assets = await prisma.account.upsert({
    where: { code: '1000' },
    update: {},
    create: { id: 'acc-assets', code: '1000', name: 'الأصول', type: 'asset' },
  })
  const revenuesRoot = await prisma.account.upsert({
    where: { code: '4000' },
    update: {},
    create: { id: 'acc-revenues', code: '4000', name: 'الإيرادات', type: 'revenue' },
  })
  const expensesRoot = await prisma.account.upsert({
    where: { code: '5000' },
    update: {},
    create: { id: 'acc-expenses', code: '5000', name: 'المصروفات', type: 'expense' },
  })

  // Cash account under assets
  const cashAccount = await prisma.account.upsert({
    where: { code: '1010' },
    update: {},
    create: {
      id: 'acc-cash-1010',
      code: '1010',
      name: 'الصندوق النقدي',
      type: 'asset',
      parentId: assets.id,
    },
  })

  // Create a default cashbox linked to the cash account
  await prisma.cashbox.upsert({
    where: { code: 'SAFE-1' },
    update: {},
    create: {
      id: 'cashbox-1',
      name: 'الخزينة الرئيسية',
      type: 'cash',
      code: 'SAFE-1',
      accountId: cashAccount.id,
    },
  })

  // Create sample client
  const client = await prisma.client.upsert({
    where: { id: 'sample-client-1' },
    update: {},
    create: {
      id: 'sample-client-1',
      name: 'أحمد محمد',
      email: 'ahmed@example.com',
      phone: '+966501234567',
      address: 'الرياض، المملكة العربية السعودية',
    },
  })

  // Create sample supplier
  const supplier = await prisma.supplier.upsert({
    where: { id: 'sample-supplier-1' },
    update: {},
    create: {
      id: 'sample-supplier-1',
      name: 'شركة مواد البناء المتحدة',
      email: 'info@building-materials.com',
      phone: '+966502345678',
      address: 'جدة، المملكة العربية السعودية',
    },
  })

  // Create sample project
  const project = await prisma.project.upsert({
    where: { id: 'sample-project-1' },
    update: {},
    create: {
      id: 'sample-project-1',
      code: 'PRJ-0001',
      name: 'فيلا الرياض الفاخرة',
      status: 'active',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-06-30'),
      budget: 2500000,
      clientId: client.id,
    },
  })

  // Create sample revenue (credit revenue, debit cash via account link only)
  const revenue = await prisma.revenue.upsert({
    where: { id: 'sample-revenue-1' },
    update: {},
    create: {
      id: 'sample-revenue-1',
      amount: 500000,
      note: 'دفعة أولى من مشروع فيلا الرياض',
      date: new Date('2024-03-15'),
      projectId: project.id,
      clientId: client.id,
      accountId: revenuesRoot.id,
    },
  })

  // Create sample expense (debit expense, credit cash)
  const expense = await prisma.expense.upsert({
    where: { id: 'sample-expense-1' },
    update: {},
    create: {
      id: 'sample-expense-1',
      amount: 250000,
      note: 'شراء مواد بناء من المورد',
      date: new Date('2024-03-10'),
      supplierId: supplier.id,
      accountId: expensesRoot.id,
    },
  })

  console.log('✅ Database seeded successfully!')
  console.log('📊 Created:')
  console.log(`   - Client: ${client.name}`)
  console.log(`   - Supplier: ${supplier.name}`)
  console.log(`   - Project: ${project.name}`)
  console.log(`   - Revenue: ${revenue.amount} SAR`)
  console.log(`   - Expense: ${expense.amount} SAR`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })