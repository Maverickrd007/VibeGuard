export function Findings() {
  const mockFindings = [
    { id: 'VG-CRIT-001', title: 'Hardcoded AWS Secret Key', severity: 'CRITICAL', scanner: 'Gitleaks', file: 'config/aws.py:12' },
    { id: 'VG-CRIT-002', title: 'Exposed JWT Secret', severity: 'CRITICAL', scanner: 'Gitleaks', file: 'config/auth.py:8' },
    { id: 'VG-HIGH-003', title: 'SQL Injection Risk', severity: 'HIGH', scanner: 'Semgrep', file: 'api/users.py:45' },
    { id: 'VG-HIGH-004', title: 'Outdated Dependency (lodash)', severity: 'HIGH', scanner: 'npm-audit', file: 'package.json:23' },
    { id: 'VG-HIGH-005', title: 'Unsafe Deserialization', severity: 'HIGH', scanner: 'Semgrep', file: 'utils/parser.py:78' },
    { id: 'VG-MED-006', title: 'S3 Bucket Public Read', severity: 'MEDIUM', scanner: 'Checkov', file: 'iac/s3.tf:14' },
    { id: 'VG-MED-007', title: 'Missing Rate Limiting', severity: 'MEDIUM', scanner: 'Semgrep', file: 'api/auth.py:32' },
    { id: 'VG-MED-008', title: 'CORS Misconfiguration', severity: 'MEDIUM', scanner: 'Semgrep', file: 'web/middleware.py:19' },
    { id: 'VG-LOW-009', title: 'Unused Dependency', severity: 'LOW', scanner: 'npm-audit', file: 'package.json:102' },
    { id: 'VG-LOW-010', title: 'Missing Security Headers', severity: 'LOW', scanner: 'Zap', file: 'web/server.py:56' },
  ];

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return <span className="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-500/15 text-red-400 border border-red-500/30">CRITICAL</span>;
      case 'HIGH':
        return <span className="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-500/15 text-orange-400 border border-orange-500/30">HIGH</span>;
      case 'MEDIUM':
        return <span className="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-500/15 text-yellow-400 border border-yellow-500/30">MEDIUM</span>;
      default:
        return <span className="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">LOW</span>;
    }
  };

  return (
    <div className="bg-[#0D1017]/80 backdrop-blur-md shadow-xl rounded-xl border border-gray-800/80 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-800/80 flex justify-between items-center">
        <div>
          <h3 className="text-base font-semibold text-white">Security Vulnerability Findings</h3>
          <p className="text-xs text-gray-400 mt-0.5">Real-time normalized finding telemetry across active repositories.</p>
        </div>
        <button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black px-4 py-2 rounded-lg text-xs font-semibold shadow-lg shadow-cyan-500/10 cursor-pointer transition-all">
          Export SARIF Report
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-800/80">
          <thead className="bg-[#080A0F]">
            <tr>
              <th scope="col" className="px-6 py-3.5 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
              <th scope="col" className="px-6 py-3.5 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Vulnerability</th>
              <th scope="col" className="px-6 py-3.5 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Severity</th>
              <th scope="col" className="px-6 py-3.5 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Scanner</th>
              <th scope="col" className="px-6 py-3.5 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Location</th>
              <th scope="col" className="relative px-6 py-3.5"><span className="sr-only">Remediation</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60 bg-[#0B0D14]/60">
            {mockFindings.map((finding) => (
              <tr key={finding.id} className="hover:bg-gray-800/40 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-cyan-400">{finding.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{finding.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-xs">{getSeverityBadge(finding.severity)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-400">{finding.scanner}</td>
                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-400 font-mono">{finding.file}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium">
                  <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium">AI Fix →</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
