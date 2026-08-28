import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// --- Repositories ---

app.get('/api/repositories', async (req: Request, res: Response) => {
  try {
    const repos = await prisma.repository.findMany({
      include: {
        scans: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });
    res.json(repos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch repositories' });
  }
});

app.post('/api/repositories', async (req: Request, res: Response) => {
  try {
    const { name, url } = req.body;
    const repo = await prisma.repository.create({
      data: { name, url }
    });
    res.status(201).json(repo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create repository' });
  }
});

// --- Scans ---

app.get('/api/scans', async (req: Request, res: Response) => {
  try {
    const scans = await prisma.scan.findMany({
      include: { repository: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(scans);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch scans' });
  }
});

app.post('/api/scans', async (req: Request, res: Response) => {
  try {
    const { repositoryId } = req.body;
    const scan = await prisma.scan.create({
      data: {
        repositoryId,
        status: 'PENDING'
      }
    });
    // In a real system, this would trigger an async job or GitHub Action
    res.status(202).json(scan);
  } catch (error) {
    res.status(500).json({ error: 'Failed to trigger scan' });
  }
});

// --- Findings ---

app.get('/api/findings', async (req: Request, res: Response) => {
  try {
    const findings = await prisma.finding.findMany({
      include: { scan: { include: { repository: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(findings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch findings' });
  }
});

app.get('/api/scans/:scanId/findings', async (req: Request, res: Response) => {
  try {
    const { scanId } = req.params;
    const findings = await prisma.finding.findMany({
      where: { scanId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(findings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch findings for scan' });
  }
});

// --- Server Startup ---

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`VibeGuard API Server running on port ${PORT}`);
  });
}

export default app;
