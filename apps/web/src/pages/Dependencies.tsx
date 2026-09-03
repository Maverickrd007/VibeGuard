import { API_BASE_URL } from '../config';
import { useState, useEffect } from 'react';
import { Package, ExternalLink, ShieldAlert, AlertTriangle, ArrowUpCircle } from 'lucide-react';

export function Dependencies() {
  const [dependencies, setDependencies] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/findings`)
      .then(res => res.json())
      .then(data => {
        // Filter for SCA / Dependency related findings
        const scaFindings = data.filter((f: any) => 
          f.scanner.toLowerCase().includes('npm') || 
          f.scanner.toLowerCase().includes('trivy') || 
          f.category === 'dependency' ||
          (f.title && f.title.toLowerCase().includes('dependency'))
        );
        setDependencies(scaFindings);
      })
      .catch(console.error);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch ((severity || '').toUpperCase()) {
      case 'CRITICAL': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'HIGH': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      case 'MEDIUM': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      default: return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
    }
  };

  return (
    <div className="bg-[#0D1017]/80 backdrop-blur-md shadow-xl rounded-xl border border-gray-800/80 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-800/80 flex justify-between items-center">
        <div>
          <h3 className="text-base font-semibold text-white">Software Composition Analysis (SCA)</h3>
          <p className="text-xs text-gray-400 mt-0.5">Known vulnerabilities in open-source dependencies (CVEs).</p>
        </div>
        <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-xs font-semibold border border-gray-700 transition-all cursor-pointer">
          Scan Dependencies
        </button>
      </div>

      <div className="p-6">
        {dependencies.length === 0 ? (
          <div className="py-12 text-center border border-dashed border-gray-800 rounded-xl">
            <Package className="h-10 w-10 text-emerald-500/50 mx-auto mb-3" />
            <h4 className="text-sm font-medium text-emerald-400">All Dependencies Secure</h4>
            <p className="text-xs text-gray-500 mt-1">No vulnerable open-source packages detected in your stack.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dependencies.map((dep, idx) => (
              <div key={idx} className="bg-[#0A0D14] border border-gray-800 rounded-xl p-5 flex flex-col hover:border-gray-700 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-800/50 rounded-lg">
                      <Package className="h-5 w-5 text-gray-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{dep.title}</h4>
                      <div className="text-xs text-gray-500 font-mono mt-0.5">Found in {dep.file} {dep.line ? `:${dep.line}` : ''}</div>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${getSeverityColor(dep.severity)}`}>
                    {dep.severity}
                  </span>
                </div>
                
                <p className="text-xs text-gray-400 leading-relaxed mb-4 flex-grow">
                  {dep.description}
                </p>
                
                {dep.codeSnippet && (
                  <div className="mb-4 bg-[#06080C] border border-gray-800/80 rounded p-3 overflow-x-auto">
                    <pre className="text-[11px] font-mono text-gray-300"><code>{dep.codeSnippet}</code></pre>
                  </div>
                )}
                
                <div className="pt-4 border-t border-gray-800/60 flex justify-between items-center mt-auto">
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    Scanner: <span className="text-gray-300 font-mono">{dep.scanner}</span>
                  </span>
                  <button className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1.5 transition-colors">
                    <ArrowUpCircle className="h-4 w-4" /> Auto-Update Package
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
