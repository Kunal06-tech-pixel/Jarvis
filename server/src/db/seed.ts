import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding demo data...');

  const passwordHash = await bcrypt.hash('demo1234', 12);

  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@jarvis.app' },
    update: {},
    create: {
      email: 'demo@jarvis.app',
      name: 'Demo User',
      passwordHash,
      timezone: 'Asia/Kolkata',
      preferences: {
        create: {
          theme: 'dark'
        }
      },
      tasks: {
        create: [
          {
            title: 'Submit MCA Project Report',
            priority: 'HIGH',
            status: 'TODO',
            dueDate: new Date(Date.now() + 86400000 * 2),
            category: 'Academic'
          },
          {
            title: 'Prepare for System Design Interview',
            priority: 'URGENT',
            status: 'IN_PROGRESS',
            category: 'Career'
          },
          {
            title: 'Buy groceries',
            priority: 'LOW',
            status: 'COMPLETED',
            category: 'Personal'
          }
        ]
      }
    }
  });

  console.log('Demo user seeded:', demoUser.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
