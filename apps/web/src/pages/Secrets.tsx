import { API_BASE_URL } from '../config';
import { useState, useEffect } from 'react';
import { KeyRound, EyeOff, Lock, Unlock, ShieldAlert } from 'lucide-react';

export function Secrets() {
  const [secrets, setSecrets] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/findings`)
      .then(res => res.json())
      .then(data => {
        // Filter for Secrets scanning findings
        const secretFindings = data.filter((f: any) => 
          f.scanner.toLowerCase().includes('gitleaks') || 
          f.category === 'secrets' ||
          (f.title && f.title.toLowerCase().includes('secret')) ||
          (f.title && f.title.toLowerCase().includes('token')) ||
          (f.title && f.title.toLowerCase().includes('key'))
        );
        setSecrets(secretFindings);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="bg-[#0D1017]/80 backdrop-blur-md shadow-xl rounded-xl border border-gray-800/80 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-800/80 flex justify-between items-center">
        <div>
          <h3 className="text-base font-semibold text-white">Hardcoded Secrets & Credentials</h3>
          <p className="text-xs text-gray-400 mt-0.5">API keys, tokens, and passwords leaked in your source code.</p>
        </div>
        <button className="bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-2">
          <Lock className="h-4 w-4" /> Rotate All Exposed Keys
        </button>
      </div>

      <div className="p-0">
        {secrets.length === 0 ? (
          <div className="p-12 text-center border-b border-dashed border-gray-800">
            <Lock className="h-10 w-10 text-emerald-500/50 mx-auto mb-3" />
            <h4 className="text-sm font-medium text-emerald-400">Zero Secrets Exposed</h4>
            <p className="text-xs text-gray-500 mt-1">Gitleaks did not detect any hardcoded credentials.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-800/60">
            {secrets.map((secret, idx) => (
              <div key={idx} className="p-6 hover:bg-gray-800/20 transition-colors flex flex-col md:flex-row gap-6">
                
                {/* Left metadata */}
                <div className="w-full md:w-1/3 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-red-500/10 rounded-lg text-red-400 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.15)]">
                      <KeyRound className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{secret.title}</h4>
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-red-500/10 text-red-400 border border-red-500/20 uppercase">
                        {secret.severity || 'CRITICAL'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-xs space-y-2 text-gray-400">
                    <div className="flex items-start gap-2">
                      <span className="w-16 font-medium text-gray-500">File:</span>
                      <span className="font-mono text-gray-300 break-all">{secret.file}</span>
                    </div>
                    {secret.line && (
                      <div className="flex items-start gap-2">
                        <span className="w-16 font-medium text-gray-500">Line:</span>
                        <span className="font-mono text-yellow-400/80">{secret.line}</span>
                      </div>
                    )}
                    <div className="flex items-start gap-2">
                      <span className="w-16 font-medium text-gray-500">Scanner:</span>
                      <span className="font-mono text-cyan-400">{secret.scanner}</span>
                    </div>
                  </div>
                </div>

                {/* Right snippet & actions */}
                <div className="w-full md:w-2/3 flex flex-col">
                  <div className="bg-[#050608] border border-gray-800/80 rounded-lg overflow-hidden mb-4 relative group">
                    <div className="absolute top-2 right-2 flex items-center gap-2">
                      <div className="px-2 py-1 bg-black/60 backdrop-blur rounded text-[10px] text-gray-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <EyeOff className="h-3 w-3" /> Redacted by VibeGuard
                      </div>
                    </div>
                    
                    <div className="bg-gray-900/50 px-4 py-2 border-b border-gray-800/80 flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
                      <span className="text-[10px] font-mono text-gray-500 ml-2">{secret.file}</span>
                    </div>
                    
                    <div className="p-4 overflow-x-auto">
                      <pre className="text-xs font-mono">
                        <code className="text-gray-400">
                          {secret.line ? `${secret.line - 1} | \n` : ''}
                        </code>
                        <code className="text-red-400 bg-red-500/5 block -mx-4 px-4 border-l-2 border-red-500 py-0.5">
                          {secret.line ? `${secret.line} | ` : ''} {secret.codeSnippet || secret.description}
                        </code>
                        <code className="text-gray-400">
                          {secret.line ? `${secret.line + 1} | \n` : ''}
                        </code>
                      </pre>
                    </div>
                  </div>
                  
                  <div className="mt-auto flex justify-end gap-3">
                    <button className="text-xs px-4 py-2 rounded border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors">
                      Mark as False Positive
                    </button>
                    <button className="text-xs px-4 py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-semibold shadow-[0_0_10px_rgba(6,182,212,0.3)] transition-all">
                      AI Auto-Remediate
                    </button>
                  </div>
                </div>
                
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
