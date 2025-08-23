import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

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
      code: 'CL001',
      status: 'ACTIVE',
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
      code: 'SUP001',
      status: 'ACTIVE',
    },
  })

  // Create sample project
  const project = await prisma.project.upsert({
    where: { id: 'sample-project-1' },
    update: {},
    create: {
      id: 'sample-project-1',
      name: 'فيلا الرياض الفاخرة',
      description: 'مشروع بناء فيلا فاخرة في الرياض',
      status: 'active',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-06-30'),
      budget: 2500000,
      clientId: client.id,
    },
  })

  // Create sample revenue
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
      accountId: 'cash-account-1', // You might need to create this account first
    },
  })

  // Create sample expense
  const expense = await prisma.expense.upsert({
    where: { id: 'sample-expense-1' },
    update: {},
    create: {
      id: 'sample-expense-1',
      amount: 250000,
      description: 'شراء مواد بناء من المورد',
      date: new Date('2024-03-10'),
      supplierId: supplier.id,
      accountId: 'cash-account-1', // You might need to create this account first
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