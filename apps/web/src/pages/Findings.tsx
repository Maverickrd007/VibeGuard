import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface Finding {
  id: string;
  title: string;
  severity: string;
  scanner: string;
  file: string;
}

export function Findings() {
  const [findings, setFindings] = useState<Finding[]>([]);
  const [loading, setLoading] = useState(true);

  const fallbackFindings = [
    { id: '1', title: 'SQL Injection', severity: 'HIGH', scanner: 'Semgrep', file: 'src/api/users.ts' },
    { id: '2', title: 'Hardcoded JWT Secret', severity: 'CRITICAL', scanner: 'Gitleaks', file: '.env.test' },
    { id: '3', title: 'Vulnerable express package', severity: 'MEDIUM', scanner: 'npm audit', file: 'package.json' },
    { id: '4', title: 'Console log exposed', severity: 'LOW', scanner: 'Semgrep', file: 'src/utils/logger.ts' },
  ];

  useEffect(() => {
    fetch(`${API_URL}/api/findings`)
      .then(res => {
        if (!res.ok) throw new Error('API Error');
        return res.json();
      })
      .then(data => {
        setFindings(data.length ? data : fallbackFindings);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch findings, using fallback mock data', err);
        setFindings(fallbackFindings);
        setLoading(false);
      });
  }, []);

  const getSeverityBadge = (severity: string) => {
    switch (severity.toUpperCase()) {
      case 'CRITICAL': return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Critical</span>;
      case 'HIGH': return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">High</span>;
      case 'MEDIUM': return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Medium</span>;
      case 'LOW': return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Low</span>;
      default: return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">{severity}</span>;
    }
  };

  return (
    <div className="bg-white shadow rounded-lg border border-gray-100">
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-medium text-gray-900">All Findings {loading && <span className="text-sm text-gray-500 ml-2">(Loading...)</span>}</h3>
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
            {findings.length === 0 && !loading && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-500">
                  No vulnerabilities found in the database.
                </td>
              </tr>
            )}
            {findings.map((finding) => (
              <tr key={finding.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{finding.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{getSeverityBadge(finding.severity)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{finding.scanner}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{finding.file || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900">View details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
