import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
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
  });

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
  });

  // Create sample project
  const project = await prisma.project.upsert({
    where: { id: 'sample-project-1' },
    update: {},
    create: {
      id: 'sample-project-1',
      code: 'PROJ-001',
      name: 'فيلا الرياض الفاخرة',
      status: 'active',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-06-30'),
      budget: 2500000,
      clientId: client.id,
    },
  });

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
      accountId: 'cash-account-1', // This might fail if a default account isn't set up
    },
  });

  // Create sample expense
  const expense = await prisma.expense.upsert({
    where: { id: 'sample-expense-1' },
    update: {},
    create: {
      id: 'sample-expense-1',
      amount: 250000,
      note: 'شراء مواد بناء من المورد',
      date: new Date('2024-03-10'),
      supplierId: supplier.id,
      accountId: 'cash-account-1', // This might fail if a default account isn't set up
    },
  });
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })