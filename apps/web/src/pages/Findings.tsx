export function Findings() {
  const mockFindings = [
    { id: 1, title: 'SQL Injection', severity: 'HIGH', scanner: 'Semgrep', file: 'src/api/users.ts' },
    { id: 2, title: 'Hardcoded JWT Secret', severity: 'CRITICAL', scanner: 'Gitleaks', file: '.env.test' },
    { id: 3, title: 'Vulnerable express package', severity: 'MEDIUM', scanner: 'npm audit', file: 'package.json' },
    { id: 4, title: 'Console log exposed', severity: 'LOW', scanner: 'Semgrep', file: 'src/utils/logger.ts' },
  ];

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Critical</span>;
      case 'HIGH': return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">High</span>;
      case 'MEDIUM': return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Medium</span>;
      default: return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Low</span>;
    }
  };

  return (
    <div className="bg-white shadow rounded-lg border border-gray-100">
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-medium text-gray-900">All Findings</h3>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors">
          Export Report
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vulnerability</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scanner</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">View</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockFindings.map((finding) => (
              <tr key={finding.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{finding.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{getSeverityBadge(finding.severity)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{finding.scanner}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{finding.file}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <a href="#" className="text-blue-600 hover:text-blue-900">View details</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
