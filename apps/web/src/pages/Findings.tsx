import { fetchApi } from '../config';
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, ShieldAlert, Cpu, CheckCircle2, Code2 } from 'lucide-react';
import { toast } from 'sonner';

export function Findings() {
  const [findings, setFindings] = useState<any[]>([]);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  useEffect(() => {
    fetchApi('/api/findings')
      .then(res => res.json())
      .then(data => setFindings(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity?.toUpperCase()) {
      case 'CRITICAL':
        return <span className="px-2.5 py-1 inline-flex text-[10px] uppercase font-bold rounded bg-red-500/15 text-red-400 border border-red-500/30 tracking-wider shadow-[0_0_10px_rgba(239,68,68,0.2)]">CRITICAL</span>;
      case 'HIGH':
        return <span className="px-2.5 py-1 inline-flex text-[10px] uppercase font-bold rounded bg-orange-500/15 text-orange-400 border border-orange-500/30 tracking-wider">HIGH</span>;
      case 'MEDIUM':
        return <span className="px-2.5 py-1 inline-flex text-[10px] uppercase font-bold rounded bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 tracking-wider">MEDIUM</span>;
      default:
        return <span className="px-2.5 py-1 inline-flex text-[10px] uppercase font-bold rounded bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 tracking-wider">LOW</span>;
    }
  };

  return (
    <div className="bg-[#0D1017]/90 backdrop-blur-md shadow-2xl rounded-xl border border-gray-800/80 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-800/80 flex justify-between items-center bg-[#080A0F]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 rounded-lg">
            <ShieldAlert className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-wide">Security Audit Audit</h3>
            <p className="text-xs text-gray-400 mt-0.5">Comprehensive vulnerability analysis and remediation telemetry.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => toast('Filters coming soon', { description: 'Advanced filtering will be available in the next release.' })} className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer">
            Filter Scans
          </button>
          <button onClick={() => toast.success('VG-AI Auto-Remediation Triggered', { description: 'Batch creating pull requests for all open vulnerabilities...' })} className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black px-4 py-2 rounded-lg text-xs font-semibold shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all flex items-center gap-2 cursor-pointer">
            <CheckCircle2 className="h-4 w-4" /> Resolve All
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-800/80">
          <thead className="bg-[#050608]">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest w-10"></th>
              <th scope="col" className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">ID</th>
              <th scope="col" className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">Vulnerability</th>
              <th scope="col" className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">Severity</th>
              <th scope="col" className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">Scanner</th>
              <th scope="col" className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">Location</th>
              <th scope="col" className="px-6 py-4 text-right text-[10px] font-bold text-gray-500 uppercase tracking-widest">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/40 bg-[#0B0D14]/40">
            {findings.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500 text-sm">
                  <ShieldAlert className="h-8 w-8 mx-auto mb-3 opacity-20" />
                  No vulnerabilities found. Your code is secure!
                </td>
              </tr>
            ) : (
              findings.map((finding) => (
                <React.Fragment key={finding.id}>
                  <tr 
                    onClick={() => toggleRow(finding.id)}
                    className={`cursor-pointer transition-colors ${expandedRow === finding.id ? 'bg-cyan-900/10 border-l-2 border-l-cyan-500' : 'hover:bg-gray-800/30 border-l-2 border-l-transparent'}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {expandedRow === finding.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-gray-400">{finding.id.substring(0, 8)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-200">{finding.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{getSeverityBadge(finding.severity)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-400 flex items-center gap-1.5"><Code2 className="h-3.5 w-3.5" /> {finding.scanner}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 font-mono">
                      {finding.file}{finding.line ? `:${finding.line}` : ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className="text-[10px] uppercase font-bold text-red-400 flex items-center justify-end gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> Open
                      </span>
                    </td>
                  </tr>
                  
                  {expandedRow === finding.id && (
                    <tr className="bg-[#06080C]">
                      <td colSpan={7} className="px-0 py-0 border-b border-gray-800/80">
                        <div className="p-6 md:p-8 animate-in fade-in slide-in-from-top-2 duration-200">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            
                            {/* Left Col: Details & Code */}
                            <div>
                              <h4 className="text-sm font-bold text-white mb-2">Vulnerability Details</h4>
                              <p className="text-xs text-gray-400 leading-relaxed mb-6">
                                {finding.description || "Detailed description not provided by the scanner. Please review the highlighted code segment."}
                              </p>
                              
                              <h4 className="text-sm font-bold text-white mb-2">Vulnerable Code Context</h4>
                              <div className="bg-[#0A0D14] rounded-lg border border-red-900/30 overflow-hidden relative">
                                <div className="absolute top-0 left-0 w-1 h-full bg-red-500/50"></div>
                                <div className="px-4 py-2 bg-red-500/5 border-b border-red-900/20 text-[10px] font-mono text-red-300/70 flex justify-between">
                                  <span>{finding.file}</span>
                                  <span>Line {finding.line || '?'}</span>
                                </div>
                                <pre className="p-4 text-xs font-mono text-gray-300 overflow-x-auto">
                                  <code>{finding.codeSnippet || "// Code snippet unavailable"}</code>
                                </pre>
                              </div>
                            </div>
                            
                            {/* Right Col: AI Remediation */}
                            <div className="bg-gradient-to-b from-cyan-950/20 to-transparent p-6 rounded-xl border border-cyan-900/30 relative overflow-hidden">
                              <div className="absolute top-0 right-0 p-3 opacity-20">
                                <Cpu className="h-24 w-24 text-cyan-400" />
                              </div>
                              <h4 className="text-sm font-bold text-cyan-400 mb-2 flex items-center gap-2">
                                <Cpu className="h-4 w-4" /> VG-AI Auto-Remediation
                              </h4>
                              {finding.aiFix ? (
                                <>
                                  <p className="text-xs text-gray-400 leading-relaxed mb-6 relative z-10">
                                    VibeGuard AI has analyzed the context and suggested a fix.
                                  </p>
                                  <div className="bg-[#0A0D14] rounded-lg border border-emerald-900/30 overflow-hidden relative z-10 mb-4">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/50"></div>
                                    <div className="px-4 py-2 bg-emerald-500/5 border-b border-emerald-900/20 text-[10px] font-mono text-emerald-300/70">
                                      Suggested Fix
                                    </div>
                                    <pre className="p-4 text-xs font-mono text-gray-300 overflow-x-auto">
                                      <code className="text-emerald-400">
                                        {finding.aiFix}
                                      </code>
                                    </pre>
                                  </div>
                                </>
                              ) : (
                                <div className="text-xs text-gray-500 italic mb-6 relative z-10">
                                  No AI remediation available for this finding.
                                </div>
                              )}
                              
                              <div className="flex justify-end gap-3 relative z-10">
                                <button onClick={() => toast.info('Dismissed', { description: 'Finding marked as false positive.' })} className="px-4 py-2 rounded-lg text-xs font-semibold text-gray-400 hover:text-white transition-colors cursor-pointer">
                                  Dismiss
                                </button>
                                <button onClick={() => toast.info('Not Implemented', { description: 'Automated PR creation is planned for a future release.' })} className="bg-cyan-500 hover:bg-cyan-400 text-black px-4 py-2 rounded-lg text-xs font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all cursor-pointer">
                                  Create Pull Request
                                </button>
                              </div>
                            </div>
                            
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
