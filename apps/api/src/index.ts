import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import dotenv from 'dotenv';
import path from 'path';

// Load root .env and local .env
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Structured Logging Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const requestId = crypto.randomUUID();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(JSON.stringify({
      requestId,
      method: req.method,
      path: req.path,
      status: res.statusCode,
      durationMs: duration,
      timestamp: new Date().toISOString()
    }));
  });
  next();
});

// API Authentication Middleware
const authenticateApiKey = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const apiKey = process.env.VIBEGUARD_API_KEY;
  
  if (!authHeader || authHeader !== `Bearer ${apiKey}`) {
    return res.status(401).json({ error: 'Unauthorized: Invalid API Key' });
  }
  next();
};

// --- Health ---
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/ready', async (req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ status: 'ready', database: 'connected' });
  } catch (err) {
    res.status(503).json({ status: 'unavailable', database: 'disconnected' });
  }
});

app.get('/metrics', async (req: Request, res: Response) => {
  try {
    const totalScans = await prisma.scan.count();
    const successfulScans = await prisma.scan.count({ where: { status: 'COMPLETED' } });
    const failedScans = await prisma.scan.count({ where: { status: 'FAILED' } });
    
    const findingsCounts = await prisma.finding.groupBy({
      by: ['severity'],
      _count: true
    });

    const metrics = {
      totalScans,
      successfulScans,
      failedScans,
      findingsBySeverity: findingsCounts.reduce((acc: Record<string, number>, curr: any) => {
        acc[curr.severity] = curr._count;
        return acc;
      }, {} as Record<string, number>)
    };
    
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate metrics' });
  }
});

// Protect all /api routes
app.use('/api', authenticateApiKey);

// --- Repositories ---
app.get('/api/repositories', async (req: Request, res: Response) => {
  try {
    const repos = await prisma.repository.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(repos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch repositories' });
  }
});

// --- Scans ---
app.get('/api/scans', async (req: Request, res: Response) => {
  try {
    const scans = await prisma.scan.findMany({
      include: { findings: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(scans);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch scans' });
  }
});

app.post('/api/scans/upload', async (req: Request, res: Response) => {
  try {
    const { repositoryName, repositoryUrl, numericScore, score, findings } = req.body;
    
    // Find or create repository
    let repository = await prisma.repository.findFirst({
      where: { url: repositoryUrl || 'local' }
    });
    
    if (!repository) {
      repository = await prisma.repository.create({
        data: {
          name: repositoryName || 'Local Project',
          url: repositoryUrl || 'local'
        }
      });
    }
    
    // Create scan with findings
    const scan = await prisma.scan.create({
      data: {
        repositoryId: repository.id,
        status: 'COMPLETED',
        numericScore,
        score,
        completedAt: new Date(),
        findings: {
          create: (findings || []).map((f: any) => {
            const rawFingerprint = f.fingerprint || `${f.scanner}-${f.ruleId}-${f.file}-${f.line}`;
            const fingerprint = crypto.createHash('sha256').update(rawFingerprint).digest('hex');
            
            return {
              scanner: f.scanner || 'VibeGuard',
              title: f.title || 'Unknown Finding',
              description: f.description || '',
              severity: f.severity || 'INFO',
              file: f.file,
              line: f.line,
              codeSnippet: f.codeSnippet,
              ruleId: f.ruleId,
              category: f.category,
              fingerprint
            };
          })
        }
      },
      include: { findings: true }
    });
    
    res.status(201).json(scan);
  } catch (error) {
    console.error('Failed to upload scan:', error);
    res.status(500).json({ error: 'Failed to upload scan' });
  }
});

// --- Findings ---
app.get('/api/findings', async (req: Request, res: Response) => {
  try {
    const findings = await prisma.finding.findMany({
      orderBy: { createdAt: 'desc' },
      include: { scan: true }
    });
    res.json(findings);
  } catch (error) {
    console.error('Error fetching findings:', error);
    res.status(500).json({ error: 'Failed to fetch findings' });
  }
});

// --- Server Startup ---
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`VibeGuard API Server running on port ${PORT} (Prisma / SQLite)`);
  });
}

export default app;
