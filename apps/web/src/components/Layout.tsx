import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderGit2, Activity, ShieldAlert, PackageSearch, KeyRound, Box, FileCode2, TestTube2, FileText, Settings } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Repositories', path: '/repositories', icon: FolderGit2 },
    { name: 'Scans', path: '/scans', icon: Activity },
    { name: 'Findings', path: '/findings', icon: ShieldAlert },
    { name: 'Dependencies', path: '/dependencies', icon: PackageSearch },
    { name: 'Secrets', path: '/secrets', icon: KeyRound },
    { name: 'Containers', path: '/containers', icon: Box },
    { name: 'IaC', path: '/iac', icon: FileCode2 },
    { name: 'Experiments', path: '/experiments', icon: TestTube2 },
    { name: 'Reports', path: '/reports', icon: FileText },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#07080C] text-white font-sans selection:bg-cyan-500 selection:text-black">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0B0D14] border-r border-gray-800/70 text-white flex flex-col hidden md:flex">
        <NavLink to="/" className="h-16 flex items-center px-6 font-bold text-xl tracking-wider border-b border-gray-800/70 hover:text-cyan-400 transition-colors">
          <span className="text-cyan-400 mr-2 text-xl">🛡️</span> VIBE<span className="text-cyan-400">GUARD</span>
        </NavLink>
        <nav className="flex-1 overflow-y-auto py-5">
          <ul className="space-y-1.5 px-3">
            {navItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-3.5 py-2.5 text-sm font-medium rounded-lg transition-all ${
                      isActive
                        ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)] font-semibold'
                        : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                    }`
                  }
                >
                  <item.icon className="mr-3 h-4.5 w-4.5" />
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#07080C]">
        {/* Topbar */}
        <header className="h-16 bg-[#0B0D14]/80 backdrop-blur-md border-b border-gray-800/70 flex items-center justify-between px-8">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-white tracking-wide">Security Dashboard</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Live Monitoring
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <NavLink to="/" className="text-xs text-gray-400 hover:text-white transition-colors">
              ← Landing Page
            </NavLink>
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-black font-bold text-xs shadow-[0_0_10px_rgba(6,182,212,0.3)]">
              VG
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8 bg-[#07080C]">
          {children}
        </main>
      </div>
    </div>
  );
}
