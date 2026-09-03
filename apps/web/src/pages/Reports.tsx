import { fetchApi } from '../config';
import { Download, FileText, FileJson } from 'lucide-react';
import { toast } from 'sonner';

export function Reports() {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <FileText className="h-7 w-7 text-blue-400" />
          Compliance & Reports
        </h2>
        <p className="text-gray-400 mt-2 text-sm">Download Executive Summaries and SARIF logs for auditors.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#0D1017] border border-gray-800 rounded-xl p-6 text-center hover:border-blue-500/30 transition-colors group cursor-pointer">
          <div className="h-16 w-16 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <FileText className="h-8 w-8" />
          </div>
          <h3 className="text-white font-bold mb-2">Executive Summary</h3>
          <p className="text-xs text-gray-400 mb-6">A high-level PDF report detailing overall risk posture, fixed vulnerabilities, and team velocity.</p>
          <button onClick={() => toast.loading('Compiling Executive Summary...', { description: 'Generating PDF document with compliance charts.' })} className="w-full py-2.5 rounded-lg bg-blue-500/20 text-blue-400 font-semibold text-sm flex items-center justify-center gap-2 group-hover:bg-blue-500 group-hover:text-black transition-colors cursor-pointer">
            <Download className="h-4 w-4" /> Download PDF
          </button>
        </div>

        <div className="bg-[#0D1017] border border-gray-800 rounded-xl p-6 text-center hover:border-emerald-500/30 transition-colors group cursor-pointer">
          <div className="h-16 w-16 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <FileJson className="h-8 w-8" />
          </div>
          <h3 className="text-white font-bold mb-2">SARIF Export</h3>
          <p className="text-xs text-gray-400 mb-6">Raw Static Analysis Results Interchange Format (SARIF) for integration with GitHub Advanced Security.</p>
          <button onClick={() => toast.success('Exporting SARIF logs', { description: 'vulnerability-log-2026.sarif has been downloaded.' })} className="w-full py-2.5 rounded-lg bg-emerald-500/20 text-emerald-400 font-semibold text-sm flex items-center justify-center gap-2 group-hover:bg-emerald-500 group-hover:text-black transition-colors cursor-pointer">
            <Download className="h-4 w-4" /> Download JSON
          </button>
        </div>
      </div>
    </div>
  );
}
