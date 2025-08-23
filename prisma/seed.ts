import { PrismaClient, AccountType, ProjectStatus, MaterialMoveType, InvoiceStatus, CashboxType } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 بدء تهيئة البيانات الأولية...')

  // إنشاء Chart of Accounts
  console.log('📊 إنشاء دليل الحسابات...')
  
  const accounts = await Promise.all([
    // Assets
    prisma.account.create({
      data: { code: '1000', name: 'النقدية', type: AccountType.asset }
    }),
    prisma.account.create({
      data: { code: '1010', name: 'البنك', type: AccountType.asset }
    }),
    prisma.account.create({
      data: { code: '1100', name: 'الذمم المدينة', type: AccountType.asset }
    }),
    prisma.account.create({
      data: { code: '1200', name: 'مخزون المواد', type: AccountType.asset }
    }),
    
    // Liabilities
    prisma.account.create({
      data: { code: '2000', name: 'الذمم الدائنة', type: AccountType.liability }
    }),
    prisma.account.create({
      data: { code: '2100', name: 'أجور مستحقة', type: AccountType.liability }
    }),
    
    // Equity
    prisma.account.create({
      data: { code: '3000', name: 'رأس المال', type: AccountType.equity }
    }),
    
    // Revenue
    prisma.account.create({
      data: { code: '4000', name: 'إيرادات المبيعات', type: AccountType.revenue }
    }),
    prisma.account.create({
      data: { code: '4100', name: 'إيرادات أخرى', type: AccountType.revenue }
    }),
    
    // Expenses
    prisma.account.create({
      data: { code: '5000', name: 'المصروفات التشغيلية', type: AccountType.expense }
    }),
    prisma.account.create({
      data: { code: '5100', name: 'تكاليف المشاريع', type: AccountType.expense }
    }),
    prisma.account.create({
      data: { code: '5200', name: 'تسويات المخزون', type: AccountType.expense }
    })
  ])

  // إنشاء الخزائن
  console.log('💰 إنشاء الخزائن...')
  
  const cashAccount = accounts.find(a => a.code === '1000')!
  const bankAccount = accounts.find(a => a.code === '1010')!
  
  const cashboxes = await Promise.all([
    prisma.cashbox.create({
      data: {
        name: 'الصندوق النقدي',
        type: CashboxType.cash,
        code: 'CASH001',
        accountId: cashAccount.id
      }
    }),
    prisma.cashbox.create({
      data: {
        name: 'البنك الرئيسي',
        type: CashboxType.bank,
        code: 'BANK001',
        accountId: bankAccount.id,
        branch: 'الفرع الرئيسي'
      }
    })
  ])

  // إنشاء العملاء
  console.log('👥 إنشاء العملاء...')
  
  const clients = await Promise.all([
    prisma.client.create({
      data: {
        name: 'أحمد محمد علي',
        phone: '0501234567',
        email: 'ahmed@example.com',
        address: 'شارع الملك فهد، الرياض',
        city: 'الرياض'
      }
    }),
    prisma.client.create({
      data: {
        name: 'فاطمة عبدالله',
        phone: '0502345678',
        email: 'fatima@example.com',
        address: 'شارع التحلية، جدة',
        city: 'جدة'
      }
    }),
    prisma.client.create({
      data: {
        name: 'خالد سعد',
        phone: '0503456789',
        email: 'khalid@example.com',
        address: 'شارع العليا، الدمام',
        city: 'الدمام'
      }
    }),
    prisma.client.create({
      data: {
        name: 'نورا حسن',
        phone: '0504567890',
        email: 'noura@example.com',
        address: 'شارع الملك عبدالله، المدينة',
        city: 'المدينة'
      }
    }),
    prisma.client.create({
      data: {
        name: 'عمر يوسف',
        phone: '0505678901',
        email: 'omar@example.com',
        address: 'شارع الملك خالد، تبوك',
        city: 'تبوك'
      }
    })
  ])

  // إنشاء الموردين
  console.log('🏢 إنشاء الموردين...')
  
  const suppliers = await Promise.all([
    prisma.supplier.create({
      data: {
        name: 'شركة مواد البناء المتحدة',
        phone: '0112345678',
        email: 'info@buildingmaterials.com',
        address: 'المنطقة الصناعية، الرياض',
        taxId: '300123456789'
      }
    }),
    prisma.supplier.create({
      data: {
        name: 'مؤسسة الحديد والصلب',
        phone: '0123456789',
        email: 'sales@steel.com',
        address: 'المنطقة الصناعية، جدة',
        taxId: '300234567890'
      }
    }),
    prisma.supplier.create({
      data: {
        name: 'شركة الخرسانة الجاهزة',
        phone: '0134567890',
        email: 'info@concrete.com',
        address: 'المنطقة الصناعية، الدمام',
        taxId: '300345678901'
      }
    }),
    prisma.supplier.create({
      data: {
        name: 'مؤسسة الأدوات الكهربائية',
        phone: '0145678901',
        email: 'sales@electrical.com',
        address: 'المنطقة الصناعية، المدينة',
        taxId: '300456789012'
      }
    }),
    prisma.supplier.create({
      data: {
        name: 'شركة الدهانات الحديثة',
        phone: '0156789012',
        email: 'info@paints.com',
        address: 'المنطقة الصناعية، تبوك',
        taxId: '300567890123'
      }
    })
  ])

  // إنشاء المشاريع
  console.log('🏗️ إنشاء المشاريع...')
  
  const projects = await Promise.all([
    prisma.project.create({
      data: {
        code: 'PRJ001',
        name: 'مجمع سكني الرياض',
        status: ProjectStatus.active,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        budget: 5000000,
        clientId: clients[0].id
      }
    }),
    prisma.project.create({
      data: {
        code: 'PRJ002',
        name: 'فندق فاخر جدة',
        status: ProjectStatus.active,
        startDate: new Date('2024-02-01'),
        endDate: new Date('2025-01-31'),
        budget: 8000000,
        clientId: clients[1].id
      }
    })
  ])

  // إنشاء مراحل المشاريع
  console.log('📋 إنشاء مراحل المشاريع...')
  
  const phases = await Promise.all([
    // مراحل المشروع الأول
    prisma.projectPhase.create({
      data: {
        projectId: projects[0].id,
        name: 'الأساسات',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-03-31'),
        progress: 100
      }
    }),
    prisma.projectPhase.create({
      data: {
        projectId: projects[0].id,
        name: 'الهيكل الخرساني',
        startDate: new Date('2024-04-01'),
        endDate: new Date('2024-08-31'),
        progress: 75
      }
    }),
    prisma.projectPhase.create({
      data: {
        projectId: projects[0].id,
        name: 'الإنهاءات',
        startDate: new Date('2024-09-01'),
        endDate: new Date('2024-12-31'),
        progress: 25
      }
    }),
    
    // مراحل المشروع الثاني
    prisma.projectPhase.create({
      data: {
        projectId: projects[1].id,
        name: 'الحفر والأساسات',
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-05-31'),
        progress: 100
      }
    }),
    prisma.projectPhase.create({
      data: {
        projectId: projects[1].id,
        name: 'الهيكل الإنشائي',
        startDate: new Date('2024-06-01'),
        endDate: new Date('2024-10-31'),
        progress: 60
      }
    }),
    prisma.projectPhase.create({
      data: {
        projectId: projects[1].id,
        name: 'التشطيبات',
        startDate: new Date('2024-11-01'),
        endDate: new Date('2025-01-31'),
        progress: 10
      }
    })
  ])

  // إنشاء المواد
  console.log('🧱 إنشاء المواد...')
  
  const materials = await Promise.all([
    prisma.material.create({
      data: {
        name: 'أسمنت',
        unit: 'كيس',
        defaultUnitCost: 25.00
      }
    }),
    prisma.material.create({
      data: {
        name: 'حديد تسليح',
        unit: 'طن',
        defaultUnitCost: 2500.00
      }
    }),
    prisma.material.create({
      data: {
        name: 'رمل',
        unit: 'متر مكعب',
        defaultUnitCost: 50.00
      }
    }),
    prisma.material.create({
      data: {
        name: 'حصى',
        unit: 'متر مكعب',
        defaultUnitCost: 80.00
      }
    }),
    prisma.material.create({
      data: {
        name: 'طوب',
        unit: 'قطعة',
        defaultUnitCost: 2.50
      }
    }),
    prisma.material.create({
      data: {
        name: 'بلاط',
        unit: 'متر مربع',
        defaultUnitCost: 45.00
      }
    }),
    prisma.material.create({
      data: {
        name: 'دهان',
        unit: 'لتر',
        defaultUnitCost: 35.00
      }
    }),
    prisma.material.create({
      data: {
        name: 'كابلات كهربائية',
        unit: 'متر',
        defaultUnitCost: 15.00
      }
    })
  ])

  // إنشاء المخازن
  console.log('🏪 إنشاء المخازن...')
  
  const warehouses = await Promise.all([
    prisma.warehouse.create({
      data: {
        name: 'المخزن المركزي',
        location: 'المنطقة الصناعية، الرياض'
      }
    }),
    prisma.warehouse.create({
      data: {
        name: 'مخزن الموقع',
        location: 'موقع المشروع، الرياض'
      }
    })
  ])

  // إنشاء حركات المواد
  console.log('📦 إنشاء حركات المواد...')
  
  const materialMoves = await Promise.all([
    // حركات دخول للمخزن المركزي
    prisma.materialMove.create({
      data: {
        projectId: projects[0].id,
        materialId: materials[0].id,
        type: MaterialMoveType.in,
        qty: 1000,
        unitCost: 25.00,
        date: new Date('2024-01-15'),
        toWarehouseId: warehouses[0].id,
        note: 'شراء أسمنت للمشروع'
      }
    }),
    prisma.materialMove.create({
      data: {
        projectId: projects[0].id,
        materialId: materials[1].id,
        type: MaterialMoveType.in,
        qty: 50,
        unitCost: 2500.00,
        date: new Date('2024-01-20'),
        toWarehouseId: warehouses[0].id,
        note: 'شراء حديد تسليح'
      }
    }),
    
    // حركات خروج من المخزن المركزي إلى موقع المشروع
    prisma.materialMove.create({
      data: {
        projectId: projects[0].id,
        materialId: materials[0].id,
        type: MaterialMoveType.out,
        qty: 200,
        unitCost: 25.00,
        date: new Date('2024-02-01'),
        fromWarehouseId: warehouses[0].id,
        toWarehouseId: warehouses[1].id,
        phaseId: phases[0].id,
        note: 'نقل أسمنت للموقع'
      }
    }),
    prisma.materialMove.create({
      data: {
        projectId: projects[0].id,
        materialId: materials[1].id,
        type: MaterialMoveType.out,
        qty: 10,
        unitCost: 2500.00,
        date: new Date('2024-02-05'),
        fromWarehouseId: warehouses[0].id,
        toWarehouseId: warehouses[1].id,
        phaseId: phases[0].id,
        note: 'نقل حديد تسليح للموقع'
      }
    }),
    
    // حركات استخدام في المشروع
    prisma.materialMove.create({
      data: {
        projectId: projects[0].id,
        materialId: materials[0].id,
        type: MaterialMoveType.out,
        qty: 150,
        unitCost: 25.00,
        date: new Date('2024-02-10'),
        fromWarehouseId: warehouses[1].id,
        phaseId: phases[0].id,
        note: 'استخدام أسمنت في الأساسات'
      }
    }),
    prisma.materialMove.create({
      data: {
        projectId: projects[0].id,
        materialId: materials[1].id,
        type: MaterialMoveType.out,
        qty: 8,
        unitCost: 2500.00,
        date: new Date('2024-02-15'),
        fromWarehouseId: warehouses[1].id,
        phaseId: phases[0].id,
        note: 'استخدام حديد تسليح في الأساسات'
      }
    })
  ])

  // إنشاء الإيرادات
  console.log('💰 إنشاء الإيرادات...')
  
  const revenueAccount = accounts.find(a => a.code === '4000')!
  
  const revenues = await Promise.all([
    prisma.revenue.create({
      data: {
        date: new Date('2024-01-15'),
        amount: 500000,
        projectId: projects[0].id,
        clientId: clients[0].id,
        phaseId: phases[0].id,
        accountId: revenueAccount.id,
        note: 'دفعة مقدمة للمشروع'
      }
    }),
    prisma.revenue.create({
      data: {
        date: new Date('2024-02-15'),
        amount: 300000,
        projectId: projects[0].id,
        clientId: clients[0].id,
        phaseId: phases[0].id,
        accountId: revenueAccount.id,
        note: 'دفعة مرحلة الأساسات'
      }
    }),
    prisma.revenue.create({
      data: {
        date: new Date('2024-03-15'),
        amount: 400000,
        projectId: projects[0].id,
        clientId: clients[0].id,
        phaseId: phases[1].id,
        accountId: revenueAccount.id,
        note: 'دفعة مرحلة الهيكل'
      }
    }),
    prisma.revenue.create({
      data: {
        date: new Date('2024-02-01'),
        amount: 1000000,
        projectId: projects[1].id,
        clientId: clients[1].id,
        phaseId: phases[3].id,
        accountId: revenueAccount.id,
        note: 'دفعة مقدمة للمشروع'
      }
    }),
    prisma.revenue.create({
      data: {
        date: new Date('2024-03-01'),
        amount: 600000,
        projectId: projects[1].id,
        clientId: clients[1].id,
        phaseId: phases[3].id,
        accountId: revenueAccount.id,
        note: 'دفعة مرحلة الحفر'
      }
    })
  ])

  // إنشاء المصروفات
  console.log('💸 إنشاء المصروفات...')
  
  const expenseAccount = accounts.find(a => a.code === '5100')!
  
  const expenses = await Promise.all([
    prisma.expense.create({
      data: {
        date: new Date('2024-01-20'),
        amount: 25000,
        projectId: projects[0].id,
        supplierId: suppliers[0].id,
        phaseId: phases[0].id,
        accountId: expenseAccount.id,
        note: 'شراء أسمنت'
      }
    }),
    prisma.expense.create({
      data: {
        date: new Date('2024-01-25'),
        amount: 125000,
        projectId: projects[0].id,
        supplierId: suppliers[1].id,
        phaseId: phases[0].id,
        accountId: expenseAccount.id,
        note: 'شراء حديد تسليح'
      }
    }),
    prisma.expense.create({
      data: {
        date: new Date('2024-02-01'),
        amount: 15000,
        projectId: projects[0].id,
        supplierId: suppliers[2].id,
        phaseId: phases[0].id,
        accountId: expenseAccount.id,
        note: 'شراء خرسانة جاهزة'
      }
    }),
    prisma.expense.create({
      data: {
        date: new Date('2024-02-01'),
        amount: 80000,
        projectId: projects[1].id,
        supplierId: suppliers[0].id,
        phaseId: phases[3].id,
        accountId: expenseAccount.id,
        note: 'شراء مواد بناء'
      }
    }),
    prisma.expense.create({
      data: {
        date: new Date('2024-02-15'),
        amount: 45000,
        projectId: projects[1].id,
        supplierId: suppliers[1].id,
        phaseId: phases[3].id,
        accountId: expenseAccount.id,
        note: 'شراء حديد تسليح'
      }
    })
  ])

  // إنشاء الفواتير
  console.log('🧾 إنشاء الفواتير...')
  
  const invoices = await Promise.all([
    prisma.invoice.create({
      data: {
        number: 'INV-001',
        date: new Date('2024-01-15'),
        dueDate: new Date('2024-02-15'),
        projectId: projects[0].id,
        clientId: clients[0].id,
        total: 500000,
        status: InvoiceStatus.paid,
        note: 'فاتورة دفعة مقدمة'
      }
    }),
    prisma.invoice.create({
      data: {
        number: 'INV-002',
        date: new Date('2024-02-15'),
        dueDate: new Date('2024-03-15'),
        projectId: projects[0].id,
        clientId: clients[0].id,
        total: 300000,
        status: InvoiceStatus.paid,
        note: 'فاتورة مرحلة الأساسات'
      }
    }),
    prisma.invoice.create({
      data: {
        number: 'INV-003',
        date: new Date('2024-03-15'),
        dueDate: new Date('2024-04-15'),
        projectId: projects[0].id,
        clientId: clients[0].id,
        total: 400000,
        status: InvoiceStatus.posted,
        note: 'فاتورة مرحلة الهيكل'
      }
    }),
    prisma.invoice.create({
      data: {
        number: 'INV-004',
        date: new Date('2024-01-20'),
        dueDate: new Date('2024-02-20'),
        projectId: projects[0].id,
        supplierId: suppliers[0].id,
        total: 25000,
        status: InvoiceStatus.paid,
        note: 'فاتورة شراء أسمنت'
      }
    }),
    prisma.invoice.create({
      data: {
        number: 'INV-005',
        date: new Date('2024-01-25'),
        dueDate: new Date('2024-02-25'),
        projectId: projects[0].id,
        supplierId: suppliers[1].id,
        total: 125000,
        status: InvoiceStatus.paid,
        note: 'فاتورة شراء حديد'
      }
    }),
    prisma.invoice.create({
      data: {
        number: 'INV-006',
        date: new Date('2024-02-01'),
        dueDate: new Date('2024-03-01'),
        projectId: projects[1].id,
        supplierId: suppliers[0].id,
        total: 80000,
        status: InvoiceStatus.posted,
        note: 'فاتورة شراء مواد بناء'
      }
    })
  ])

  // إنشاء الموظفين
  console.log('👷 إنشاء الموظفين...')
  
  const employees = await Promise.all([
    prisma.employee.create({
      data: {
        name: 'محمد أحمد',
        nationalId: '1234567890',
        role: 'مدير مشروع',
        baseSalary: 8000
      }
    }),
    prisma.employee.create({
      data: {
        name: 'علي حسن',
        nationalId: '1234567891',
        role: 'مهندس موقع',
        baseSalary: 6000
      }
    }),
    prisma.employee.create({
      data: {
        name: 'أحمد سعد',
        nationalId: '1234567892',
        role: 'مشرف عمال',
        baseSalary: 4000
      }
    }),
    prisma.employee.create({
      data: {
        name: 'خالد يوسف',
        nationalId: '1234567893',
        role: 'عامل بناء',
        baseSalary: 2500
      }
    }),
    prisma.employee.create({
      data: {
        name: 'فهد عبدالله',
        nationalId: '1234567894',
        role: 'عامل بناء',
        baseSalary: 2500
      }
    }),
    prisma.employee.create({
      data: {
        name: 'سعد محمد',
        nationalId: '1234567895',
        role: 'عامل بناء',
        baseSalary: 2500
      }
    }),
    prisma.employee.create({
      data: {
        name: 'يوسف أحمد',
        nationalId: '1234567896',
        role: 'عامل بناء',
        baseSalary: 2500
      }
    }),
    prisma.employee.create({
      data: {
        name: 'عبدالله خالد',
        nationalId: '1234567897',
        role: 'عامل بناء',
        baseSalary: 2500
      }
    }),
    prisma.employee.create({
      data: {
        name: 'حسن فهد',
        nationalId: '1234567898',
        role: 'عامل بناء',
        baseSalary: 2500
      }
    }),
    prisma.employee.create({
      data: {
        name: 'ماجد سعد',
        nationalId: '1234567899',
        role: 'عامل بناء',
        baseSalary: 2500
      }
    })
  ])

  // إنشاء المرتبات
  console.log('💼 إنشاء المرتبات...')
  
  const payrolls = await Promise.all([
    prisma.payroll.create({
      data: {
        employeeId: employees[0].id,
        projectId: projects[0].id,
        phaseId: phases[0].id,
        month: '2024-01',
        gross: 8000,
        deductions: 400,
        net: 7600,
        paid: true,
        date: new Date('2024-01-31')
      }
    }),
    prisma.payroll.create({
      data: {
        employeeId: employees[1].id,
        projectId: projects[0].id,
        phaseId: phases[0].id,
        month: '2024-01',
        gross: 6000,
        deductions: 300,
        net: 5700,
        paid: true,
        date: new Date('2024-01-31')
      }
    }),
    prisma.payroll.create({
      data: {
        employeeId: employees[2].id,
        projectId: projects[0].id,
        phaseId: phases[0].id,
        month: '2024-01',
        gross: 4000,
        deductions: 200,
        net: 3800,
        paid: true,
        date: new Date('2024-01-31')
      }
    }),
    prisma.payroll.create({
      data: {
        employeeId: employees[3].id,
        projectId: projects[0].id,
        phaseId: phases[0].id,
        month: '2024-01',
        gross: 2500,
        deductions: 125,
        net: 2375,
        paid: true,
        date: new Date('2024-01-31')
      }
    }),
    prisma.payroll.create({
      data: {
        employeeId: employees[4].id,
        projectId: projects[0].id,
        phaseId: phases[0].id,
        month: '2024-01',
        gross: 2500,
        deductions: 125,
        net: 2375,
        paid: true,
        date: new Date('2024-01-31')
      }
    })
  ])

  // إنشاء الشركاء
  console.log('🤝 إنشاء الشركاء...')
  
  const partners = await Promise.all([
    prisma.partner.create({
      data: {
        name: 'عبدالرحمن محمد',
        phone: '0501234567',
        note: 'شريك مؤسس'
      }
    }),
    prisma.partner.create({
      data: {
        name: 'سعد عبدالله',
        phone: '0502345678',
        note: 'شريك'
      }
    }),
    prisma.partner.create({
      data: {
        name: 'خالد أحمد',
        phone: '0503456789',
        note: 'شريك'
      }
    })
  ])

  // إنشاء شركاء المشاريع
  console.log('📋 إنشاء شركاء المشاريع...')
  
  const projectPartners = await Promise.all([
    prisma.projectPartner.create({
      data: {
        projectId: projects[0].id,
        partnerId: partners[0].id,
        sharePct: 40,
        walletId: 'WALLET001'
      }
    }),
    prisma.projectPartner.create({
      data: {
        projectId: projects[0].id,
        partnerId: partners[1].id,
        sharePct: 35,
        walletId: 'WALLET002'
      }
    }),
    prisma.projectPartner.create({
      data: {
        projectId: projects[0].id,
        partnerId: partners[2].id,
        sharePct: 25,
        walletId: 'WALLET003'
      }
    }),
    prisma.projectPartner.create({
      data: {
        projectId: projects[1].id,
        partnerId: partners[0].id,
        sharePct: 50,
        walletId: 'WALLET004'
      }
    }),
    prisma.projectPartner.create({
      data: {
        projectId: projects[1].id,
        partnerId: partners[1].id,
        sharePct: 50,
        walletId: 'WALLET005'
      }
    })
  ])

  // إنشاء تسوية شركاء
  console.log('💱 إنشاء تسوية الشركاء...')
  
  const settlement = await prisma.settlement.create({
    data: {
      projectId: projects[0].id,
      date: new Date('2024-01-31'),
      note: 'تسوية شهر يناير 2024'
    }
  })

  const settlementLines = await Promise.all([
    prisma.settlementLine.create({
      data: {
        settlementId: settlement.id,
        fromPartnerId: partners[1].id,
        toPartnerId: partners[0].id,
        amount: 50000
      }
    }),
    prisma.settlementLine.create({
      data: {
        settlementId: settlement.id,
        fromPartnerId: partners[2].id,
        toPartnerId: partners[0].id,
        amount: 25000
      }
    })
  ])

  // إنشاء الإشعارات
  console.log('🔔 إنشاء الإشعارات...')
  
  const notifications = await Promise.all([
    prisma.notification.create({
      data: {
        type: 'invoice_due',
        message: 'فاتورة INV-003 مستحقة الدفع خلال 5 أيام'
      }
    }),
    prisma.notification.create({
      data: {
        type: 'project_status',
        message: 'مرحلة الأساسات في مشروع مجمع سكني الرياض اكتملت بنسبة 100%'
      }
    }),
    prisma.notification.create({
      data: {
        type: 'backup_ok',
        message: 'تم إنشاء نسخة احتياطية بنجاح في 2024-01-31'
      }
    }),
    prisma.notification.create({
      data: {
        type: 'overdue',
        message: 'فاتورة INV-006 متأخرة الدفع منذ 5 أيام'
      }
    })
  ])

  // إنشاء الإعدادات
  console.log('⚙️ إنشاء الإعدادات...')
  
  const settings = await Promise.all([
    prisma.setting.create({
      data: {
        key: 'currency',
        value: 'SAR'
      }
    }),
    prisma.setting.create({
      data: {
        key: 'companyName',
        value: 'شركة المقاولات المتحدة'
      }
    }),
    prisma.setting.create({
      data: {
        key: 'lock',
        value: 'false'
      }
    })
  ])

  console.log('✅ تم إنشاء جميع البيانات الأولية بنجاح!')
  console.log(`📊 تم إنشاء:
  - ${accounts.length} حساب
  - ${cashboxes.length} خزنة
  - ${clients.length} عميل
  - ${suppliers.length} مورد
  - ${projects.length} مشروع
  - ${phases.length} مرحلة
  - ${materials.length} مادة
  - ${warehouses.length} مخزن
  - ${materialMoves.length} حركة مواد
  - ${revenues.length} إيراد
  - ${expenses.length} مصروف
  - ${invoices.length} فاتورة
  - ${employees.length} موظف
  - ${payrolls.length} مرتب
  - ${partners.length} شريك
  - ${notifications.length} إشعار
  - ${settings.length} إعداد`)
}

main()
  .catch((e) => {
    console.error('❌ خطأ في تهيئة البيانات:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })