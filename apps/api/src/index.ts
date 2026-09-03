import express, { Request, Response } from 'express';
import cors from 'cors';
import crypto from 'crypto';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// In-memory storage
let repositories: any[] = [];
let scans: any[] = [];
let findings: any[] = [];

// --- Repositories ---
app.get('/api/repositories', (req: Request, res: Response) => {
  res.json(repositories);
});

app.post('/api/repositories', (req: Request, res: Response) => {
  const { name, url } = req.body;
  const repo = { id: crypto.randomUUID(), name, url, createdAt: new Date() };
  repositories.push(repo);
  res.status(201).json(repo);
});

// --- Scans ---
app.get('/api/scans', (req: Request, res: Response) => {
  // Return sorted scans with nested findings
  const populatedScans = scans.map(scan => ({
    ...scan,
    findings: findings.filter(f => f.scanId === scan.id)
  })).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  res.json(populatedScans);
});

app.post('/api/scans/upload', (req: Request, res: Response) => {
  try {
    const { repositoryName, repositoryUrl, numericScore, score, findings: newFindings } = req.body;
    
    // Find or create repository
    let repository = repositories.find(r => r.url === repositoryUrl);
    if (!repository) {
      repository = { id: crypto.randomUUID(), name: repositoryName || 'Local Project', url: repositoryUrl || 'local', createdAt: new Date() };
      repositories.push(repository);
    }
    
    // Create scan
    const scanId = crypto.randomUUID();
    const scan = {
      id: scanId,
      repositoryId: repository.id,
      status: 'COMPLETED',
      numericScore,
      score,
      createdAt: new Date(),
      completedAt: new Date()
    };
    scans.push(scan);
    
    // Create findings
    const createdFindings = (newFindings || []).map((f: any) => ({
      id: crypto.randomUUID(),
      scanId,
      scanner: f.scanner || 'VibeGuard',
      title: f.title,
      description: f.description,
      severity: f.severity,
      file: f.file,
      line: f.line,
      codeSnippet: f.codeSnippet,
      ruleId: f.ruleId,
      category: f.category,
      createdAt: new Date()
    }));
    findings.push(...createdFindings);
    
    res.status(201).json({ ...scan, findings: createdFindings });
  } catch (error) {
    console.error('Failed to upload scan:', error);
    res.status(500).json({ error: 'Failed to upload scan' });
  }
});

// --- Findings ---
app.get('/api/findings', (req: Request, res: Response) => {
  const sortedFindings = [...findings].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  res.json(sortedFindings);
});

// --- Server Startup ---
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`VibeGuard API Server running on port ${PORT} (In-Memory Mode)`);
  });
}

export default app;
