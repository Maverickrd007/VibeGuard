import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  
  const repo = await prisma.repository.create({
    data: {
      name: 'VibeGuard',
      url: 'https://github.com/Maverickrd007/VibeGuard'
    }
  });

  const scan = await prisma.scan.create({
    data: {
      repositoryId: repo.id,
      status: 'COMPLETED',
      score: 'C',
      numericScore: 75,
    }
  });

  await prisma.finding.createMany({
    data: [
      {
        scanId: scan.id,
        scanner: 'Semgrep',
        title: 'SQL Injection',
        description: 'Found user input appended directly to SQL query string.',
        severity: 'HIGH',
        file: 'src/api/users.ts',
        line: 42
      },
      {
        scanId: scan.id,
        scanner: 'Gitleaks',
        title: 'Hardcoded JWT Secret',
        description: 'Detected a hardcoded JSON Web Token secret.',
        severity: 'CRITICAL',
        file: '.env.test',
        line: 1
      },
      {
        scanId: scan.id,
        scanner: 'npm-audit',
        title: 'Vulnerable express package',
        description: 'Outdated package with known vulnerability.',
        severity: 'MEDIUM',
        file: 'package.json',
        line: 12
      }
    ]
  });

  console.log('Seed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
