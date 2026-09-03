import { fetchApi } from '../config';
import { ShieldAlert, CheckCircle, AlertTriangle, Activity, Terminal, ExternalLink } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';

export function Overview() {
  const [scans, setScans] = useState<any[]>([]);
  const [stats, setStats] = useState({
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    totalScans: 0,
    grade: 'A',
    score: 100,
  });

  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    fetchApi('/api/scans')
      .then(res => res.json())
      .then(data => {
        setScans(data);
        setStats(prev => ({ ...prev, totalScans: data.length }));
        
        if (data.length > 0) {
          const latest = data[0];
          setStats(prev => ({
            ...prev,
            grade: latest.score || 'A',
            score: latest.numericScore || 100,
          }));
        }
      })
      .catch(console.error);

    fetchApi('/api/findings')
      .then(res => res.json())
      .then(data => {
        let c = 0, h = 0, m = 0, l = 0;
        data.forEach((f: any) => {
          const s = (f.severity || '').toUpperCase();
          if (s === 'CRITICAL') c++;
          else if (s === 'HIGH') h++;
          else if (s === 'MEDIUM') m++;
          else l++;
        });
        setStats(prev => ({ ...prev, critical: c, high: h, medium: m, low: l }));
        
        // Simple grouped data for the chart by date
        const grouped = data.reduce((acc: any, f: any) => {
          const date = new Date(f.createdAt).toLocaleDateString('en-US', { weekday: 'short' });
          if (!acc[date]) acc[date] = { name: date, critical: 0, high: 0, medium: 0, low: 0 };
          const s = (f.severity || '').toUpperCase();
          if (s === 'CRITICAL') acc[date].critical++;
          else if (s === 'HIGH') acc[date].high++;
          else if (s === 'MEDIUM') acc[date].medium++;
          else acc[date].low++;
          return acc;
        }, {});
        
        const cData = Object.values(grouped);
        // If empty, provide some dummy trends
        if (cData.length === 0) {
          setChartData([
            { name: 'Mon', critical: 0, high: 0, medium: 0, low: 0 },
            { name: 'Tue', critical: 0, high: 0, medium: 0, low: 0 },
          ]);
        } else {
          setChartData(cData);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Security Score */}
        <div className="bg-[#0D1017]/80 backdrop-blur-md rounded-xl border border-gray-800/80 p-5 shadow-lg relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
              <CheckCircle className="h-6 w-6 text-emerald-400" />
            </div>
            <div className="ml-4 w-0 flex-1">
              <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider">Security Score</dt>
              <dd className="text-2xl font-bold text-white mt-0.5">
                {stats.grade.replace(' RISK', '')} <span className="text-sm font-normal text-emerald-400">({stats.score}/100)</span>
              </dd>
            </div>
          </div>
        </div>

        {/* Critical / High */}
        <div className="bg-[#0D1017]/80 backdrop-blur-md rounded-xl border border-gray-800/80 p-5 shadow-lg relative overflow-hidden group hover:border-red-500/40 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <ShieldAlert className="h-6 w-6 text-red-400" />
            </div>
            <div className="ml-4 w-0 flex-1">
              <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider">Critical / High</dt>
              <dd className="text-2xl font-bold text-white mt-0.5">
                {stats.critical} <span className="text-sm font-normal text-gray-500">/ {stats.high}</span>
              </dd>
            </div>
          </div>
        </div>

        {/* Medium / Low */}
        <div className="bg-[#0D1017]/80 backdrop-blur-md rounded-xl border border-gray-800/80 p-5 shadow-lg relative overflow-hidden group hover:border-yellow-500/40 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
              <AlertTriangle className="h-6 w-6 text-yellow-400" />
            </div>
            <div className="ml-4 w-0 flex-1">
              <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider">Medium / Low</dt>
              <dd className="text-2xl font-bold text-white mt-0.5">
                {stats.medium} <span className="text-sm font-normal text-gray-500">/ {stats.low}</span>
              </dd>
            </div>
          </div>
        </div>

        {/* Recent Scans */}
        <div className="bg-[#0D1017]/80 backdrop-blur-md rounded-xl border border-gray-800/80 p-5 shadow-lg relative overflow-hidden group hover:border-cyan-500/40 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3">
              <Activity className="h-6 w-6 text-cyan-400" />
            </div>
            <div className="ml-4 w-0 flex-1">
              <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total Scans</dt>
              <dd className="text-2xl font-bold text-white mt-0.5">{stats.totalScans}</dd>
            </div>
          </div>
        </div>
      </div>

      {/* CLI Quick Trigger Callout */}
      <div className="bg-gradient-to-r from-[#0E131F] to-[#0A0D14] border border-cyan-500/20 rounded-xl p-5 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Terminal className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Trigger CLI Security Scan</h4>
            <p className="text-xs text-gray-400">Run local scan and stream telemetry directly to this dashboard.</p>
          </div>
        </div>
        <div className="bg-black/60 border border-gray-800 rounded-lg px-4 py-2 text-xs font-mono text-cyan-400 flex items-center gap-2">
          <span>npx @maverick006/vibeguard@latest scan .</span>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-[#0D1017]/80 backdrop-blur-md shadow-xl rounded-xl border border-gray-800/80 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-base font-semibold text-white">Security Vulnerability Trends</h3>
            <p className="text-xs text-gray-400 mt-0.5">7-day telemetry breakdown across all integrated deterministic scanners.</p>
          </div>
          <NavLink
            to="/findings"
            className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 transition-colors"
          >
            View All Findings <ExternalLink className="h-3.5 w-3.5" />
          </NavLink>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="criticalGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="highGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F97316" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="medGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="lowGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1F2937" />
              <XAxis dataKey="name" stroke="#6B7280" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <YAxis stroke="#6B7280" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0B0D14', borderColor: '#374151', borderRadius: '8px', color: '#fff' }}
              />
              <Area type="monotone" dataKey="critical" stackId="1" stroke="#EF4444" fill="url(#criticalGrad)" />
              <Area type="monotone" dataKey="high" stackId="1" stroke="#F97316" fill="url(#highGrad)" />
              <Area type="monotone" dataKey="medium" stackId="1" stroke="#F59E0B" fill="url(#medGrad)" />
              <Area type="monotone" dataKey="low" stackId="1" stroke="#06B6D4" fill="url(#lowGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
