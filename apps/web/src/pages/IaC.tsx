import { fetchApi } from '../config';
import { useState, useEffect } from 'react';
import { FileCode2, Cloud, Server, ShieldCheck } from 'lucide-react';

export function IaC() {
  const [iacFindings, setIacFindings] = useState<any[]>([]);

  useEffect(() => {
    fetchApi('/api/findings')
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter((f: any) => 
          f.scanner.toLowerCase().includes('checkov') || 
          f.category === 'iac' ||
          (f.file && f.file.toLowerCase().endsWith('.tf')) ||
          (f.title && f.title.toLowerCase().includes('s3'))
        );
        setIacFindings(filtered);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="bg-[#0D1017]/80 backdrop-blur-md shadow-xl rounded-xl border border-gray-800/80 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-800/80 flex justify-between items-center">
        <div>
          <h3 className="text-base font-semibold text-white">Infrastructure as Code (IaC)</h3>
          <p className="text-xs text-gray-400 mt-0.5">Misconfigurations in Terraform, CloudFormation, and Kubernetes manifests.</p>
        </div>
        <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-xs font-semibold border border-gray-700 transition-all cursor-pointer">
          Run Checkov
        </button>
      </div>

      <div className="p-0">
        {iacFindings.length === 0 ? (
          <div className="p-12 text-center">
            <ShieldCheck className="h-10 w-10 text-emerald-500/50 mx-auto mb-3" />
            <h4 className="text-sm font-medium text-emerald-400">Infrastructure Secure</h4>
            <p className="text-xs text-gray-500 mt-1">No misconfigurations detected in your IaC templates.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-800/60">
            {iacFindings.map((finding, idx) => (
              <div key={idx} className="p-6 hover:bg-gray-800/20 transition-colors flex items-center justify-between gap-6">
                <div className="flex items-center gap-4 w-full">
                  <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20">
                    <Cloud className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="text-sm font-bold text-white">{finding.title}</h4>
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                        {finding.severity || 'MEDIUM'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">{finding.description}</p>
                    <div className="text-[11px] font-mono text-gray-500 flex items-center gap-2">
                      <FileCode2 className="h-3 w-3" /> {finding.file} {finding.line ? `(Line ${finding.line})` : ''}
                    </div>
                  </div>
                  <div>
                    <button className="text-xs px-4 py-2 rounded bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 font-semibold border border-indigo-500/30 transition-all">
                      View Terraform
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
