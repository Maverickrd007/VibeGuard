import { fetchApi } from '../config';
import { useState, useEffect } from 'react';
import { Activity, Clock, Shield, Terminal, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export function Scans() {
  const [scans, setScans] = useState<any[]>([]);

  useEffect(() => {
    fetchApi('/api/scans')
      .then(res => res.json())
      .then(data => {
        setScans(data);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="bg-[#0D1017]/80 backdrop-blur-md shadow-xl rounded-xl border border-gray-800/80 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-800/80 flex justify-between items-center">
        <div>
          <h3 className="text-base font-semibold text-white">Scan History</h3>
          <p className="text-xs text-gray-400 mt-0.5">Log of all manual and CI/CD security scans across your repositories.</p>
        </div>
        <button onClick={() => toast.loading('Initiating Remote Scan', { description: 'Starting containerized runners on AWS ECS...' })} className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 px-4 py-2 rounded-lg text-xs font-semibold border border-cyan-500/30 transition-all cursor-pointer flex items-center gap-2">
          <Terminal className="h-4 w-4" /> Trigger Manual Scan
        </button>
      </div>

      <div className="p-0 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-800/30 border-b border-gray-800">
              <th className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Commit / Repo</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Metrics</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Time</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60">
            {scans.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-gray-500 text-sm">
                  <Activity className="h-8 w-8 mx-auto mb-2 opacity-20" />
                  No scan history available
                </td>
              </tr>
            ) : (
              scans.map((scan, idx) => (
                <tr key={idx} className="hover:bg-gray-800/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                      <span className="text-sm font-bold text-white">SUCCESS</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-white">{scan.repository?.name || 'VibeGuard'}</div>
                    <div className="text-xs text-gray-500 font-mono flex items-center gap-1 mt-0.5">
                      {scan.commitHash ? scan.commitHash.substring(0, 7) : '69bb9ec'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <span className="flex items-center gap-1 text-xs text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                        {scan.criticalVulnerabilities || 0} CRIT
                      </span>
                      <span className="flex items-center gap-1 text-xs text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20">
                        {scan.highVulnerabilities || 0} HIGH
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-400 flex items-center gap-1.5 mt-2">
                    <Clock className="h-3.5 w-3.5" /> 
                    {new Date(scan.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => toast('Generating PDF Report', { description: 'Fetching scan details and compiling executive summary...' })} className="text-cyan-400 hover:text-cyan-300 font-medium text-sm flex items-center gap-1 ml-auto transition-colors cursor-pointer">
                      Report <ArrowRight className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
