import { API_BASE_URL } from '../config';
import { useState, useEffect } from 'react';
import { Box, Layers, ShieldAlert, Cpu } from 'lucide-react';

export function Containers() {
  const [containerFindings, setContainerFindings] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/findings`)
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter((f: any) => 
          f.scanner.toLowerCase().includes('trivy') || 
          f.category === 'container' ||
          (f.title && f.title.toLowerCase().includes('docker')) ||
          (f.file && f.file.toLowerCase().includes('dockerfile'))
        );
        setContainerFindings(filtered);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="bg-[#0D1017]/80 backdrop-blur-md shadow-xl rounded-xl border border-gray-800/80 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-800/80 flex justify-between items-center">
        <div>
          <h3 className="text-base font-semibold text-white">Container Security (Docker/K8s)</h3>
          <p className="text-xs text-gray-400 mt-0.5">Vulnerabilities in base images and container misconfigurations.</p>
        </div>
        <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-xs font-semibold border border-gray-700 transition-all cursor-pointer">
          Scan Images
        </button>
      </div>

      <div className="p-6">
        {containerFindings.length === 0 ? (
          <div className="py-12 text-center border border-dashed border-gray-800 rounded-xl">
            <Box className="h-10 w-10 text-emerald-500/50 mx-auto mb-3" />
            <h4 className="text-sm font-medium text-emerald-400">All Containers Secure</h4>
            <p className="text-xs text-gray-500 mt-1">No vulnerabilities found in your Docker images.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {containerFindings.map((finding, idx) => (
              <div key={idx} className="bg-[#0A0D14] border border-gray-800 rounded-xl p-5 flex flex-col hover:border-cyan-500/30 transition-colors relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-800/50 rounded-lg">
                      <Layers className="h-5 w-5 text-cyan-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{finding.title}</h4>
                      <div className="text-xs text-gray-500 font-mono mt-0.5">Image: {finding.file}</div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-bold border text-orange-400 bg-orange-500/10 border-orange-500/20">
                    {finding.severity || 'HIGH'}
                  </span>
                </div>
                
                <p className="text-xs text-gray-400 leading-relaxed mb-4">
                  {finding.description}
                </p>
                
                <div className="pt-4 border-t border-gray-800/60 flex justify-between items-center mt-auto">
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    Scanner: <span className="text-gray-300 font-mono">{finding.scanner}</span>
                  </span>
                  <button className="text-xs text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                    Rebuild Image &gt;
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
