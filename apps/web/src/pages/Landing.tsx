import { Link } from 'react-router-dom';
import OrbitalSphereBackground from '../components/ui/orbital-sphere';

export default function Landing() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#05030a]">
      {/* Background Sphere */}
      <OrbitalSphereBackground className="absolute inset-0 opacity-80" />
      
      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-8 px-6 text-center">
        
        <div className="space-y-4">
          <span className="text-sm uppercase tracking-[0.3em] text-violet-400 font-semibold shadow-violet-500/50 drop-shadow-md">
            The Next Evolution of Security
          </span>
          <h1 className="max-w-4xl text-5xl md:text-7xl font-bold tracking-tight text-white drop-shadow-xl">
            VibeGuard
          </h1>
          <p className="mx-auto max-w-2xl text-lg md:text-xl text-slate-300 drop-shadow">
            A deterministic DevSecOps orchestration engine. Scan code, secrets, containers, and cloud infrastructure instantly. Powered by AI remediation.
          </p>
        </div>

        <div className="flex gap-6 mt-10">
          <Link
            to="/dashboard"
            className="rounded-full bg-white/5 border border-white/10 backdrop-blur-md px-8 py-3 text-sm font-medium tracking-wide text-white transition-all hover:bg-white/10 hover:border-white/20 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] active:scale-95"
          >
            Enter Dashboard
          </Link>
          <a
            href="https://github.com/Maverickrd007/VibeGuard"
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-transparent border border-white/5 backdrop-blur-sm px-8 py-3 text-sm font-medium tracking-wide text-slate-300 transition-all hover:bg-white/5 hover:text-white hover:border-white/10 active:scale-95"
          >
            View GitHub
          </a>
        </div>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-5xl w-full">
          {[
            { title: "7 Modular Scanners", desc: "SAST, DAST, SCA, Secrets, Containers, and CSPM." },
            { title: "Deterministic Math", desc: "A mathematically pure A-F scoring algorithm." },
            { title: "AI Remediation", desc: "No hallucinations. Just context-aware code fixes." }
          ].map((feat, i) => (
            <div key={i} className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-2xl p-6 text-left">
              <h3 className="text-violet-300 font-semibold mb-2">{feat.title}</h3>
              <p className="text-slate-400 text-sm">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
