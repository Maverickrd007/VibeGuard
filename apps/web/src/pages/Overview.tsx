import { ShieldAlert, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', critical: 4, high: 10, medium: 15, low: 20 },
  { name: 'Tue', critical: 3, high: 8, medium: 12, low: 18 },
  { name: 'Wed', critical: 3, high: 12, medium: 14, low: 22 },
  { name: 'Thu', critical: 2, high: 7, medium: 10, low: 15 },
  { name: 'Fri', critical: 1, high: 5, medium: 8, low: 12 },
  { name: 'Sat', critical: 0, high: 4, medium: 7, low: 10 },
  { name: 'Sun', critical: 0, high: 2, medium: 5, low: 8 },
];

export function Overview() {
  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-100 p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dt className="text-sm font-medium text-gray-500 truncate">Security Score</dt>
              <dd className="text-2xl font-bold text-gray-900">A (92/100)</dd>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-100 p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-red-100 rounded-md p-3">
              <ShieldAlert className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dt className="text-sm font-medium text-gray-500 truncate">Critical / High</dt>
              <dd className="text-2xl font-bold text-gray-900">0 / 2</dd>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-100 p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dt className="text-sm font-medium text-gray-500 truncate">Medium / Low</dt>
              <dd className="text-2xl font-bold text-gray-900">5 / 8</dd>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-100 p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
              <Info className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dt className="text-sm font-medium text-gray-500 truncate">Recent Scans</dt>
              <dd className="text-2xl font-bold text-gray-900">14</dd>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white shadow rounded-lg border border-gray-100 p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Security Trend (7 Days)</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip />
              <Area type="monotone" dataKey="critical" stackId="1" stroke="#DC2626" fill="#FCA5A5" />
              <Area type="monotone" dataKey="high" stackId="1" stroke="#EA580C" fill="#FDBA74" />
              <Area type="monotone" dataKey="medium" stackId="1" stroke="#EAB308" fill="#FDE047" />
              <Area type="monotone" dataKey="low" stackId="1" stroke="#2563EB" fill="#93C5FD" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
