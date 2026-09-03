import { FlaskConical, Bot, Zap, Network } from 'lucide-react';

export function Experiments() {
  const experiments = [
    { id: 'ai-remediation', name: 'Auto-Remediation (VG-AI)', desc: 'Automatically generate pull requests with code fixes for SAST vulnerabilities.', icon: Bot, enabled: true },
    { id: 'real-time', name: 'Real-time IDE Sync', desc: 'Stream telemetry directly from developers VS Code extensions to this dashboard.', icon: Zap, enabled: true },
    { id: 'custom-rules', name: 'Custom Semgrep Rulesets', desc: 'Enforce organization-specific security rules using custom YAML definitions.', icon: Network, enabled: false },
  ];

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <FlaskConical className="h-7 w-7 text-fuchsia-400" />
          Experimental Features
        </h2>
        <p className="text-gray-400 mt-2 text-sm">Opt-in to beta features to supercharge your DevSecOps pipeline.</p>
      </div>

      <div className="space-y-4">
        {experiments.map(exp => (
          <div key={exp.id} className="bg-[#0D1017] border border-gray-800 rounded-xl p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl border ${exp.enabled ? 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20' : 'bg-gray-800/50 text-gray-500 border-gray-800'}`}>
                <exp.icon className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-1">{exp.name}</h4>
                <p className="text-xs text-gray-400">{exp.desc}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked={exp.enabled} />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-fuchsia-500"></div>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
