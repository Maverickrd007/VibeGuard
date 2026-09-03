import { Settings as SettingsIcon, Key, Bell, Users, Database } from 'lucide-react';

export function Settings() {
  return (
    <div className="max-w-4xl">
      <div className="mb-8 border-b border-gray-800 pb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <SettingsIcon className="h-7 w-7 text-gray-400" />
          Workspace Settings
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-1 space-y-2">
          <button className="w-full text-left px-4 py-2.5 rounded-lg bg-gray-800/80 text-white text-sm font-medium flex items-center gap-3">
            <Key className="h-4 w-4" /> API Keys
          </button>
          <button className="w-full text-left px-4 py-2.5 rounded-lg text-gray-400 hover:bg-gray-800/40 text-sm font-medium flex items-center gap-3 transition-colors">
            <Users className="h-4 w-4" /> Team Access
          </button>
          <button className="w-full text-left px-4 py-2.5 rounded-lg text-gray-400 hover:bg-gray-800/40 text-sm font-medium flex items-center gap-3 transition-colors">
            <Bell className="h-4 w-4" /> Notifications
          </button>
          <button className="w-full text-left px-4 py-2.5 rounded-lg text-gray-400 hover:bg-gray-800/40 text-sm font-medium flex items-center gap-3 transition-colors">
            <Database className="h-4 w-4" /> Data Retention
          </button>
        </div>

        <div className="col-span-2">
          <div className="bg-[#0D1017] border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">API Authentication</h3>
            <p className="text-sm text-gray-400 mb-6">Use this API key to authenticate the VibeGuard CLI in your CI/CD pipelines (GitHub Actions, GitLab CI).</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">VIBEGUARD_API_KEY</label>
                <div className="flex gap-2">
                  <input 
                    type="password" 
                    value="vg_live_8f92j39f823j98f23j9f823j98" 
                    readOnly 
                    className="flex-1 bg-black border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 font-mono focus:outline-none"
                  />
                  <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-semibold transition-colors">
                    Copy
                  </button>
                </div>
              </div>
              
              <div className="pt-4 mt-4 border-t border-gray-800">
                <button className="text-sm text-red-400 hover:text-red-300 font-semibold">
                  Revoke & Generate New Key
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
