const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log(' Starting database seeding...');

  console.log('Creating tenants...');
  
  const acmeTenant = await prisma.tenant.upsert({
    where: { slug: 'acme' },
    update: {},
    create: {
      name: 'Acme Corp',
      slug: 'acme',
      subscription: 'free'
    }
  });

  const globexTenant = await prisma.tenant.upsert({
    where: { slug: 'globex' },
    update: {},
    create: {
      name: 'Globex Corporation',
      slug: 'globex',
      subscription: 'free'
    }
  });

  console.log(`Created tenants: ${acmeTenant.name}, ${globexTenant.name}`);

  const hashedPassword = await bcrypt.hash('password', 10);

  console.log('Creating users...');

  const users = [
    {
      email: 'admin@acme.test',
      password: hashedPassword,
      role: 'admin',
      tenantId: acmeTenant.id
    },
    {
      email: 'user@acme.test',
      password: hashedPassword,
      role: 'member',
      tenantId: acmeTenant.id
    },
    {
      email: 'admin@globex.test',
      password: hashedPassword,
      role: 'admin',
      tenantId: globexTenant.id
    },
    {
      email: 'user@globex.test',
      password: hashedPassword,
      role: 'member',
      tenantId: globexTenant.id
    }
  ];

  for (const userData of users) {
    await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: userData
    });
    console.log(`✅ Created user: ${userData.email} (${userData.role})`);
  }

  console.log('Creating sample notes...');

  const acmeUser = await prisma.user.findFirst({
    where: { email: 'user@acme.test' }
  });

  const globexUser = await prisma.user.findFirst({
    where: { email: 'user@globex.test' }
  });

  const sampleNotes = [
    {
      title: 'Welcome to Acme Notes',
      content: 'This is your first note in the Acme workspace.',
      userId: acmeUser.id,
      tenantId: acmeTenant.id
    },
    {
      title: 'Meeting Notes',
      content: 'Notes from the weekly team meeting.',
      userId: acmeUser.id,
      tenantId: acmeTenant.id
    },
    {
      title: 'Welcome to Globex Notes',
      content: 'This is your first note in the Globex workspace.',
      userId: globexUser.id,
      tenantId: globexTenant.id
    }
  ];

  for (const noteData of sampleNotes) {
    await prisma.note.create({
      data: noteData
    });
    console.log(` Created note: ${noteData.title}`);
  }

  console.log(' Database seeding completed successfully!');
  
  console.log('\n Test Accounts Created:');
  console.log('Email: admin@acme.test | Password: password | Role: Admin | Tenant: Acme');
  console.log('Email: user@acme.test | Password: password | Role: Member | Tenant: Acme');
  console.log('Email: admin@globex.test | Password: password | Role: Admin | Tenant: Globex');
  console.log('Email: user@globex.test | Password: password | Role: Member | Tenant: Globex');
}

main()
  .catch((e) => {
    console.error(' Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });